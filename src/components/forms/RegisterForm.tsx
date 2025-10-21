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
import { useTranslations } from 'next-intl';
import { userService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
    lastname: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100, 'El apellido es demasiado largo'),
    email: z.string().min(1, 'El email es requerido').email('Ingresa un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100, 'La contraseña es demasiado larga'),
    confirmPassword: z.string().min(1, 'Por favor confirma tu contraseña'),
    phone: z.string().optional().refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), 'Ingresa un teléfono válido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations('register');
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Llamar al endpoint de registro usando userService
      const response = await userService.register({
        nombre: data.name,
        apellido: data.lastname,
        email: data.email,
        password: data.password,
        telefono: data.phone || undefined,
        rol: 'cliente', // Por defecto, los usuarios son clientes
      });
      
      // Guardar el token y los datos del usuario usando el contexto de autenticación
      authLogin(response.token, response.user);
      
      // Limpiar formulario
      reset();
      
      // Redirigir al usuario a la página de productos
      router.push('/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta.');
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
          <Label htmlFor="name" className="text-pensagro-dark">{t('name')}</Label>
          <Input id="name" type="text" placeholder={t('namePlaceholder')} {...register('name')} className={errors.name ? 'border-red-500' : ''} disabled={isLoading} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname" className="text-pensagro-dark">{t('lastname')}</Label>
          <Input id="lastname" type="text" placeholder={t('lastnamePlaceholder')} {...register('lastname')} className={errors.lastname ? 'border-red-500' : ''} disabled={isLoading} />
          {errors.lastname && <p className="text-sm text-red-600">{errors.lastname.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-pensagro-dark">{t('email')}</Label>
          <Input id="email" type="email" placeholder={t('emailPlaceholder')} {...register('email')} className={errors.email ? 'border-red-500' : ''} disabled={isLoading} />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-pensagro-dark">{t('phone')} <span className="text-gray-500">({t('phoneOptional')})</span></Label>
          <Input id="phone" type="tel" placeholder={t('phonePlaceholder')} {...register('phone')} className={errors.phone ? 'border-red-500' : ''} disabled={isLoading} />
          {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-pensagro-dark">{t('password')}</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} {...register('password')} className={errors.password ? 'border-red-500 pr-10' : 'pr-10'} disabled={isLoading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-pensagro-dark">{t('confirmPassword')}</Label>
          <div className="relative">
            <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder={t('confirmPasswordPlaceholder')} {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'} disabled={isLoading} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <Button
          type="submit"
          variant="default"
          className="w-full"
          style={{ background: '#2c5f2d', color: '#fff', border: '2px solid #2c5f2d', opacity: 1, visibility: 'visible' }}
          disabled={isLoading}
        >
          {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('submitting')}</>) : (t('submit'))}
        </Button>
      </form>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">{t('alreadyAccount')}</span>
        </div>
      </div>
      <Button
        asChild
        variant="secondary"
        className="w-full mt-2 border-pensagro-primary text-pensagro-primary hover:bg-pensagro-primary hover:text-white"
      >
        <Link href="/login">
          {t('signin')}
        </Link>
      </Button>
    </div>
  );
}
