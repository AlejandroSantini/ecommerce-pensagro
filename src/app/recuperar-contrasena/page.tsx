'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const resetSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Formato de email inválido'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function RecuperarContrasenaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Aquí iría la llamada al API para solicitar el reset de la contraseña
      // Por ahora solo simulamos el envío exitoso
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (err) {
      setError('Error al enviar el email. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-pensagro-dark">Recuperar Contraseña</h1>
          <p className="text-sm text-gray-600">
            Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
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
                  Enviando...
                </>
              ) : (
                'Enviar instrucciones'
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href="/login" className="text-pensagro-primary hover:underline">
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-800">
                ¡Email enviado! Por favor revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              className="w-full border-pensagro-primary text-pensagro-primary hover:bg-pensagro-primary hover:text-white"
            >
              <Link href="/login">
                Volver a iniciar sesión
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}