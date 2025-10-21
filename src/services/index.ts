// Services Index - Exportación centralizada de todos los servicios

export { userService } from './userService';
export { clientService } from './clientService';
export { productService } from './productService';
export { categoryService } from './categoryService';
export { comboService } from './comboService';
export { saleService } from './saleService';
export { couponService } from './couponService';
export { configService } from './configService';

// Re-export API utilities
export { fetchApi, ApiError } from '@/lib/api';
