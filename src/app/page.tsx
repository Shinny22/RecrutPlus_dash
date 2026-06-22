import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthCard title="Connexion Admin">
        <AuthForm />
      </AuthCard>
    </div>
  );
}
