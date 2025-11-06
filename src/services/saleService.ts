import { api, axiosInstance } from '@/lib/api';
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
    return api.get<Sale[]>(`/sales${queryString ? `?${queryString}` : ''}`);
  },

  // GET /sales/:id - Obtener venta por ID
  getById: async (id: number): Promise<Sale> => {
    return api.get<Sale>(`/sales/${id}`);
  },

  // POST /sales - Crear nueva venta
  create: async (data: CreateSaleDto): Promise<Sale> => {
    return api.post<Sale>('/sales', data);
  },

  // PUT /sales/:id - Actualizar venta
  update: async (id: number, data: UpdateSaleDto): Promise<Sale> => {
    return api.put<Sale>(`/sales/${id}`, data);
  },

  // DELETE /sales/:id - Soft delete de venta
  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/sales/${id}`);
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
    // Para obtener Blob, usamos axiosInstance directamente con responseType
    const response = await axiosInstance.post(`/sales/export${queryString ? `?${queryString}` : ''}`, {}, {
      responseType: 'blob'
    });

    return response.data as Blob;
  },
};
