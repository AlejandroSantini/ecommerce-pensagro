import { fetchApi } from '@/lib/api';
import type {
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  SaleFilters,
} from '@/types/sale';

export const saleService = {
  // GET /sales - Listar ventas con filtros
  getAll: async (filters?: SaleFilters): Promise<Sale[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.clienteId) params.append('clienteId', String(filters.clienteId));
      if (filters.estadoPago) params.append('estadoPago', filters.estadoPago);
      if (filters.estadoVenta) params.append('estadoVenta', filters.estadoVenta);
      if (filters.tipoVenta) params.append('tipoVenta', filters.tipoVenta);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.metodoPago) params.append('metodoPago', filters.metodoPago);
    }

    const queryString = params.toString();
    return fetchApi(`/sales${queryString ? `?${queryString}` : ''}`);
  },

  // GET /sales/:id - Obtener venta por ID
  getById: async (id: number): Promise<Sale> => {
    return fetchApi(`/sales/${id}`);
  },

  // POST /sales - Crear nueva venta
  create: async (data: CreateSaleDto): Promise<Sale> => {
    return fetchApi('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /sales/:id - Actualizar venta
  update: async (id: number, data: UpdateSaleDto): Promise<Sale> => {
    return fetchApi(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /sales/:id - Soft delete de venta
  delete: async (id: number): Promise<void> => {
    return fetchApi(`/sales/${id}`, {
      method: 'DELETE',
    });
  },

  // POST /sales/export - Exportar historial de ventas a CSV
  export: async (filters?: SaleFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.clienteId) params.append('clienteId', String(filters.clienteId));
      if (filters.estadoPago) params.append('estadoPago', filters.estadoPago);
      if (filters.estadoVenta) params.append('estadoVenta', filters.estadoVenta);
      if (filters.tipoVenta) params.append('tipoVenta', filters.tipoVenta);
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      if (filters.metodoPago) params.append('metodoPago', filters.metodoPago);
    }

    const queryString = params.toString();
    const response = await fetch(`/sales/export${queryString ? `?${queryString}` : ''}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error al exportar ventas');
    }

    return response.blob();
  },
};
