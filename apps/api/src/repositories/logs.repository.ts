import { db } from '../config/database';
import { ApiLog } from '../types';
import { LogsQueryParams } from '../dto/logs.dto';
import { PaginationMeta } from '../dto/pagination.dto';

export class LogsRepository {
  async findAll(params: LogsQueryParams & { page: number; limit: number }) {
    const { page, limit, service, statusCode, from, to, search } = params;

    let query = db('api_logs');

    if (service) {
      const serviceRecord = await db('services').where('slug', service).first();
      if (serviceRecord) {
        query = query.where('service_id', serviceRecord.id);
      }
    }

    if (statusCode) {
      query = query.where('status_code', statusCode);
    }

    if (from && to) {
      query = query.whereBetween('created_at', [from, to]);
    }

    if (search) {
      query = query.where('endpoint', 'like', `%${search}%`);
    }

    const total = await query.clone().count('* as count').first() as any;
    const offset = (page - 1) * limit;

    const logs = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    for (const log of logs) {
      const service = await db('services').where('id', log.service_id).first();
      (log as any).service_name = service?.name;
    }

    return {
      logs: logs as ApiLog[],
      meta: {
        page,
        limit,
        total: total.count,
        pages: Math.ceil(total.count / limit),
      } as PaginationMeta,
    };
  }

  async findById(id: string): Promise<ApiLog | null> {
    return await db('api_logs').where('id', id).first();
  }
}
