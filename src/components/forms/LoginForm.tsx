'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const t = useTranslations('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Llamar al endpoint de login usando userService
      const response = await userService.login({
        email: data.email,
        password: data.password,
      });

      // Guardar el token y los datos del usuario usando el contexto de autenticación
      authLogin(response.token, response.user);

      // Redirigir al usuario a la página de productos
      router.push('/productos');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to log in');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-pensagro-dark">{t('title')}</h1>
        <p className="text-sm text-gray-600">{t('description')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-pensagro-dark">{t('email')}</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={t('emailPlaceholder')} 
            {...register('email')} 
            className={errors.email ? 'border-red-500' : ''} 
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-pensagro-dark">{t('password')}</Label>
            <Link href="/recuperar-contrasena" className="text-xs text-pensagro-primary hover:underline">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder={t('passwordPlaceholder')} 
              {...register('password')}
              className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} 
              disabled={isLoading} 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" 
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          className="w-full"
          style={{ background: '#2c5f2d', color: '#fff', border: '2px solid #2c5f2d', opacity: 1, visibility: 'visible' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </form>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">{t('noAccount')}</span>
        </div>
      </div>
      
      <Button
        asChild
        variant="secondary"
        className="w-full mt-2 border-pensagro-primary text-pensagro-primary hover:bg-pensagro-primary hover:text-white"
      >
        <Link href="/registro">
          {t('createAccount')}
        </Link>
      </Button>
    </div>
  );
}