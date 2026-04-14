import { useState, useMemo } from "react";
import { z } from "zod";
import { Shield, Eye, EyeOff, UserPlus, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { sanitizeInput } from "@/lib/security";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  password: z
    .string()
    .min(12, "Mínimo 12 caracteres")
    .max(128)
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[a-z]/, "Deve conter uma letra minúscula")
    .regex(/[0-9]/, "Deve conter um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter um símbolo"),
});

const passwordRules = [
  { label: "12+ caracteres", test: (p: string) => p.length >= 12 },
  { label: "Letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Letra minúscula", test: (p: string) => /[a-z]/.test(p) },
  { label: "Número", test: (p: string) => /[0-9]/.test(p) },
  { label: "Símbolo", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => {
    const passed = passwordRules.filter((r) => r.test(password)).length;
    return passed;
  }, [password]);

  const strengthColor =
    strength <= 1 ? "bg-destructive" : strength <= 3 ? "bg-clinical-amber" : "bg-clinical-green";
  const strengthLabel =
    strength <= 1 ? "Fraca" : strength <= 3 ? "Média" : strength === 4 ? "Forte" : "Muito Forte";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password,
    });
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
      await register(result.data.name, result.data.email, result.data.password);
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    } catch {
      setErrors({ form: "Erro ao criar conta. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <motion.div
          className="max-w-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Shield className="h-16 w-16 text-primary-foreground/80 mb-8" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Registo Seguro
          </h2>
          <p className="text-primary-foreground/60 leading-relaxed">
            A sua password é protegida com hashing bcrypt e nunca é armazenada em texto simples.
          </p>
        </motion.div>
      </div>

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

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Criar Conta</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Preencha os dados para se registar no portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nome Completo</label>
              <input
                type="text"
                className="clinical-input"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="name"
              />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

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
                  placeholder="Mínimo 12 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={128}
                  autoComplete="new-password"
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

              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                        style={{ width: `${(strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{strengthLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {passwordRules.map((rule) => {
                      const ok = rule.test(password);
                      return (
                        <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                          {ok ? (
                            <Check className="h-3 w-3 text-clinical-green" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={ok ? "text-clinical-green" : "text-muted-foreground"}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="animate-pulse">A criar conta...</span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" /> Registar
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Iniciar sessão
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
