import { useState, useEffect } from 'react';
import { provinceService } from '@/services/provinceService';
import type { Province } from '@/types/select';

export function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data = await provinceService.getAll();
        setProvinces(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Error al cargar las provincias');
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, loading, error };
}
