'use client';

import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegistroPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <RegisterForm />
    </div>
  );
}