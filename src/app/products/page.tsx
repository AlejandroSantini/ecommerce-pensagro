import { redirect } from 'next/navigation';

export default function ProductsPage() {
  // Redirect to the default locale (es)
  redirect('/es/products');
  
  // This part will never be reached due to the redirect
  return null;
}
