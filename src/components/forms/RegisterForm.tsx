'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { userService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'El nombre es demasiado largo'),
  lastname: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100, 'El apellido es demasiado largo'),
  email: z.string().min(1, 'El email es requerido').email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100, 'La contraseña es demasiado larga'),
  cuitDni: z.string().min(7, 'El CUIT/DNI debe tener al menos 7 caracteres').max(20, 'El CUIT/DNI es demasiado largo'),
  phone: z.string().min(1, 'El teléfono es requerido').refine((val) => /^[\d\s\-\+\(\)]+$/.test(val), 'Ingresa un teléfono válido'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      cuitDni: '',
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
        telefono: data.phone,
        rol: 'cliente',
      });
      
      // Guardar el token y los datos del usuario usando el contexto de autenticación
      authLogin(response.token, response.user);
      
      // Limpiar formulario
      reset();
      
      // Redirigir al usuario a la página de productos
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger(['email', 'password']);
    if (isValid) {
      setError(null);
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setCurrentStep(1);
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-pensagro-dark">{t('register.title')}</h1>
        <p className="text-sm text-gray-600">{t('register.description')}</p>
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className={`h-2 w-2 rounded-full ${currentStep === 1 ? 'bg-[#003c6f]' : 'bg-gray-300'}`} />
          <div className={`h-1 w-12 ${currentStep === 2 ? 'bg-[#003c6f]' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full ${currentStep === 2 ? 'bg-[#003c6f]' : 'bg-gray-300'}`} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-pensagro-dark">{t('register.email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder={t('register.emailPlaceholder')} 
                {...register('email')} 
                className={errors.email ? 'border-red-500' : ''} 
                disabled={isLoading}
                autoFocus
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-pensagro-dark">{t('register.password')}</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={t('register.passwordPlaceholder')} 
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

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-[#003c6f] text-white border-2 border-[#003c6f] hover:bg-[#002b50]"
              disabled={isLoading}
            >
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-pensagro-dark">{t('register.name')}</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder={t('register.namePlaceholder')} 
                {...register('name')} 
                className={errors.name ? 'border-red-500' : ''} 
                disabled={isLoading}
                autoFocus
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-pensagro-dark">{t('register.lastname')}</Label>
              <Input 
                id="lastname" 
                type="text" 
                placeholder={t('register.lastnamePlaceholder')} 
                {...register('lastname')} 
                className={errors.lastname ? 'border-red-500' : ''} 
                disabled={isLoading} 
              />
              {errors.lastname && <p className="text-sm text-red-600">{errors.lastname.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuitDni" className="text-pensagro-dark">CUIT/DNI</Label>
              <Input 
                id="cuitDni" 
                type="text" 
                placeholder="20-12345678-9 o 12345678" 
                {...register('cuitDni')} 
                className={errors.cuitDni ? 'border-red-500' : ''} 
                disabled={isLoading} 
              />
              {errors.cuitDni && <p className="text-sm text-red-600">{errors.cuitDni.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-pensagro-dark">{t('register.phone')}</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder={t('register.phonePlaceholder')} 
                {...register('phone')} 
                className={errors.phone ? 'border-red-500' : ''} 
                disabled={isLoading} 
              />
              {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
            </div>

            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handlePrevStep}
                variant="outline"
                className="flex-1 border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f]/10"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#003c6f] text-white border-2 border-[#003c6f] hover:bg-[#002b50]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('register.submitting')}
                  </>
                ) : (
                  t('register.submit')
                )}
              </Button>
            </div>
          </>
        )}
      </form>

      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-500">{t('register.alreadyAccount')}</span>
        </div>
      </div>
      <Button
        asChild
        variant="secondary"
        className="w-full mt-2 border border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f] hover:text-white"
      >
        <Link href="/login">
          {t('register.login')}
        </Link>
      </Button>
    </div>
  );
}
