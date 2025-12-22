import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="We'll send you instructions to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
