// Client Types
export interface Client {
  id: number;
  userId: number;
  tipoCliente: 'minorista' | 'mayorista' | 'distribuidor';
  razonSocial?: string;
  cuit?: string;
  condicionFiscal?: 'responsable_inscripto' | 'monotributo' | 'exento' | 'consumidor_final';
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  descuentoPersonalizado?: number;
  estado: 'activo' | 'inactivo' | 'suspendido';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateClientDto {
  tipoCliente?: 'minorista' | 'mayorista' | 'distribuidor';
  razonSocial?: string;
  cuit?: string;
  condicionFiscal?: 'responsable_inscripto' | 'monotributo' | 'exento' | 'consumidor_final';
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  descuentoPersonalizado?: number;
  estado?: 'activo' | 'inactivo' | 'suspendido';
}
