import { db } from '../config/database';
import { Service } from '../types';

export class ServicesRepository {
  async findAll(): Promise<Service[]> {
    return await db('services').orderBy('created_at', 'desc');
  }

  async findBySlug(slug: string): Promise<Service | null> {
    return await db('services').where('slug', slug).first();
  }

  async getStats(serviceId: string): Promise<any> {
    const totalRequests = await db('api_logs')
      .where('service_id', serviceId)
      .count('*')
      .first() as any;

    const errorRequests = await db('api_logs')
      .where('service_id', serviceId)
      .whereRaw('status_code >= 400')
      .count('*')
      .first() as any;

    const avgLatency = await db('api_logs')
      .where('service_id', serviceId)
      .avg('latency_ms')
      .first() as any;

    return {
      request_count: totalRequests.count,
      error_count: errorRequests.count,
      error_rate: totalRequests.count > 0 
        ? Math.round((errorRequests.count / totalRequests.count) * 100)
        : 0,
      avg_latency: Math.round(avgLatency.avg || 0),
    };
  }
}
