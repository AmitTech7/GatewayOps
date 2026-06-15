import { LogsRepository } from '../repositories/logs.repository';
import { LogsQueryParams } from '../dto/logs.dto';

const logsRepo = new LogsRepository();

export class LogsService {
  async getLogs(params: LogsQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;

    return await logsRepo.findAll({
      ...params,
      page,
      limit,
    });
  }

  async getLogById(id: string) {
    return await logsRepo.findById(id);
  }
}
