// Types Index - Exportación centralizada de todos los tipos

// User types
export type {
  User,
  AuthResponse,
  RegisterUserDto,
  LoginDto,
  LoginResponse,
  UpdateUserDto,
} from './user';

// Client types
export type {
  Client,
  UpdateClientDto,
} from './client';

// Product types
export type {
  Product,
  ApiProduct,
  ApiProductsResponse,
  ProductVariant,
  ProductCategory,
  RelatedProduct,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
} from './product';

// Category types
export type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  LinkProductCategoryDto,
  UnlinkProductCategoryDto,
} from './category';

// Combo types
export type {
  Combo,
  ComboItem,
  CreateComboDto,
  UpdateComboDto,
} from './combo';

// Sale types
export type {
  Sale,
  SaleItem,
  CreateSaleDto,
  UpdateSaleDto,
  SaleFilters,
} from './sale';

// Coupon types
export type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  ValidateCouponResponse,
} from './coupon';

// Config types
export type {
  BusinessConfig,
  UpdateConfigDto,
  TaxRate,
  UpdateTaxDto,
} from './config';

// Popup types
export type {
  Popup,
  ApiPopup,
  ApiPopupsResponse,
} from './popup';
