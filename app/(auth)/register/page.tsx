import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Join DocChain and secure your documents with blockchain"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
