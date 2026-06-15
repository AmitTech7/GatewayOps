import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex) {
  const existingLogs = await knex('api_logs').count('*').first() as any;
  if (existingLogs.count > 0) {
    return;
  }

  const services = await knex('services').select('id');
  const endpoints: { [key: string]: string[] } = {
    'user-service': ['/api/users', '/api/users/{id}', '/api/users/{id}/profile', '/api/users/search'],
    'order-service': ['/api/orders', '/api/orders/{id}', '/api/orders/create', '/api/orders/{id}/items'],
    'payment-service': ['/api/payments/charge', '/api/payments/{id}', '/api/payments/validate', '/api/refunds'],
    'notification-service': ['/api/notifications', '/api/notifications/{id}/read', '/api/notifications/send'],
    'analytics-service': ['/api/events', '/api/events/track', '/api/analytics/summary'],
  };

  const logs = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 10000; i++) {
    const randomService = services[Math.floor(Math.random() * services.length)];
    const slug = ['user-service', 'order-service', 'payment-service', 'notification-service', 'analytics-service'][
      services.indexOf(randomService)
    ];

    const statusRand = Math.random();
    let statusCode: number;
    if (statusRand < 0.75) {
      statusCode = 200 + Math.floor(Math.random() * 100);
    } else if (statusRand < 0.9) {
      statusCode = 400 + Math.floor(Math.random() * 100);
    } else {
      statusCode = 500 + Math.floor(Math.random() * 100);
    }

    const timestamp = new Date(
      thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
    );

    const hour = timestamp.getHours();
    const businessHours = hour >= 9 && hour <= 18;
    const latency = businessHours
      ? Math.floor(Math.random() * 3000 + 20)
      : Math.floor(Math.random() * 1000 + 20);

    logs.push({
      id: uuidv4(),
      service_id: randomService.id,
      user_id: Math.random() > 0.3 ? services[Math.floor(Math.random() * 100)].id : null,
      endpoint: endpoints[slug][Math.floor(Math.random() * endpoints[slug].length)],
      method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'][Math.floor(Math.random() * 5)],
      status_code: statusCode,
      latency_ms: latency,
      request_size: Math.floor(Math.random() * 5000),
      response_size: Math.floor(Math.random() * 50000),
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0 (compatible; monitoring/1.0)',
      error_message: statusCode >= 400 ? 'Request failed' : null,
      created_at: timestamp,
    });
  }

  await knex('api_logs').insert(logs);
}
