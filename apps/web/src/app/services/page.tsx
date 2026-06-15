'use client';

import { useQuery } from '@tanstack/react-query';
import { ServiceTable } from '../../components/services/ServiceTable';
import { Spinner } from '../../components/ui/Spinner';
import { api } from '../../lib/api';

export default function ServicesPage() {
  const servicesQuery = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data.data || [];
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Services</h1>
      {servicesQuery.isLoading ? (
        <Spinner />
      ) : (
        <ServiceTable services={servicesQuery.data || []} isLoading={servicesQuery.isLoading} />
      )}
    </div>
  );
}
