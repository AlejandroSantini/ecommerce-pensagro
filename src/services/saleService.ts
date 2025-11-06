import { api, axiosInstance } from '@/lib/api';
import type {
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  SaleFilters,
} from '@/types/sale';

export const saleService = {
  // GET /api/sales - Listar ventas con filtros
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
    return api.get<Sale[]>(`/api/sales${queryString ? `?${queryString}` : ''}`);
  },

  // GET /api/sales/:id - Obtener venta por ID
  getById: async (id: number): Promise<Sale> => {
    return api.get<Sale>(`/api/sales/${id}`);
  },

  // POST /api/sales - Crear nueva venta
  create: async (data: CreateSaleDto): Promise<Sale> => {
    return api.post<Sale>('/api/sales', data);
  },

  // PUT /api/sales/:id - Actualizar venta
  update: async (id: number, data: UpdateSaleDto): Promise<Sale> => {
    return api.put<Sale>(`/api/sales/${id}`, data);
  },

  // DELETE /api/sales/:id - Soft delete de venta
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/api/sales/${id}`);
  },

  // POST /api/sales/export - Exportar historial de ventas a CSV
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
    // Para obtener Blob, usamos axiosInstance directamente con responseType
    const response = await axiosInstance.post(`/api/sales/export${queryString ? `?${queryString}` : ''}`, {}, {
      responseType: 'blob'
    });

    return response.data as Blob;
  },
};
