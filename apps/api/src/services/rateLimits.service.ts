import { RateLimitsRepository } from '../repositories/rateLimits.repository';

const rateLimitsRepo = new RateLimitsRepository();

export class RateLimitsService {
  async getSummary(from?: string, to?: string) {
    return await rateLimitsRepo.getSummary(from, to);
  }

  async getViolations(from?: string, to?: string) {
    return await rateLimitsRepo.getViolations(from, to);
  }

  async getTopOffenders() {
    return await rateLimitsRepo.getTopOffenders();
  }
}
