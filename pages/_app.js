import { AuthProvider } from '../src/contexts/AuthContext';
import AppLayout from '../src/layouts/AppLayout';
import '../src/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </AuthProvider>
  );
}
