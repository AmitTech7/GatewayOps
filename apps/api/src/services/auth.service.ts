import { AuthRepository } from '../repositories/auth.repository';

const authRepo = new AuthRepository();

export class AuthService {
  async getStats(from?: string, to?: string) {
    return await authRepo.getStats(from, to);
  }

  async getEvents(page: number, limit: number) {
    return await authRepo.getEvents(page, limit);
  }
}
