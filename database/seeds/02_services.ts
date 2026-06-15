import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  const existingServices = await knex('services').count('*').first() as any;
  if (existingServices.count > 0) {
    return;
  }

  const services = [
    {
      id: uuidv4(),
      name: 'User Service',
      slug: 'user-service',
      description: 'Manages user accounts and profiles',
      status: 'healthy',
      base_url: 'https://users.api.example.com',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Order Service',
      slug: 'order-service',
      description: 'Handles order management',
      status: 'healthy',
      base_url: 'https://orders.api.example.com',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Payment Service',
      slug: 'payment-service',
      description: 'Processes payments and transactions',
      status: 'degraded',
      base_url: 'https://payments.api.example.com',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Notification Service',
      slug: 'notification-service',
      description: 'Sends notifications to users',
      status: 'healthy',
      base_url: 'https://notifications.api.example.com',
      created_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Analytics Service',
      slug: 'analytics-service',
      description: 'Tracks and analyzes user behavior',
      status: 'healthy',
      base_url: 'https://analytics.api.example.com',
      created_at: new Date(),
    },
  ];

  await knex('services').insert(services);
}
