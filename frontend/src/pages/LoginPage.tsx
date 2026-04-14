import { useState, useMemo } from "react";
import { z } from "zod";
import { Shield, Eye, EyeOff, LogIn, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { sanitizeInput } from "@/lib/security";

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(1, "Password obrigatória").max(128),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email: sanitizeInput(email), password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await login(result.data.email, result.data.password);
      toast.success("Sessão iniciada com sucesso");
      navigate("/dashboard");
    } catch {
      setAttempts((a) => a + 1);
      // Generic message to prevent user enumeration (OWASP T06)
      setErrors({ form: "Credenciais inválidas. Verifique o email e a password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <motion.div
          className="max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Shield className="h-16 w-16 text-primary-foreground/80 mb-8" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Acesso Seguro
          </h2>
          <p className="text-primary-foreground/60 leading-relaxed">
            A sua sessão é protegida com JWT, expiração automática de 15 minutos e monitorização contínua.
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">MedPortal</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Iniciar Sessão</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Introduza as suas credenciais para aceder ao portal.
          </p>

          {errors.form && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-clinical-red-light text-destructive text-sm mb-6">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {attempts >= 3 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-clinical-amber-light text-clinical-amber text-sm mb-6">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Múltiplas tentativas falhadas. A conta poderá ser bloqueada.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                className="clinical-input"
                placeholder="exemplo@hospital.pt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="clinical-input pr-10"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="animate-pulse">A verificar...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" /> Entrar
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Registar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
