import { ServicesRepository } from '../repositories/services.repository';

const servicesRepo = new ServicesRepository();

export class ServicesService {
  async getServices() {
    return await servicesRepo.findAll();
  }

  async getServiceStats(slug: string) {
    const service = await servicesRepo.findBySlug(slug);
    if (!service) {
      throw new Error('Service not found');
    }
    return await servicesRepo.getStats(service.id);
  }
}
