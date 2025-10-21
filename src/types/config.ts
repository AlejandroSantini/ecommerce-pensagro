// Config Types
export interface BusinessConfig {
  id: number;
  nombreNegocio: string;
  razonSocial?: string;
  cuit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
  tipoCambioDolar?: number;
  tipoCambioEuro?: number;
  aliasMercadoPago?: string;
  cbuCuenta?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateConfigDto {
  nombreNegocio?: string;
  razonSocial?: string;
  cuit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
  tipoCambioDolar?: number;
  tipoCambioEuro?: number;
  aliasMercadoPago?: string;
  cbuCuenta?: string;
}

export interface TaxRate {
  id: number;
  nombre: string;
  porcentaje: number;
  activo: boolean;
}

export interface UpdateTaxDto {
  tasas: {
    id?: number;
    nombre: string;
    porcentaje: number;
    activo: boolean;
  }[];
}
