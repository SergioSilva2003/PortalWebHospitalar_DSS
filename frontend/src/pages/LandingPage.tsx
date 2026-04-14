import { Shield, Heart, Users, ArrowRight, Lock, Activity, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Lock,
    title: "Segurança OWASP 2025",
    description: "Proteção contra as 10 principais vulnerabilidades, com JWT e sanitização rigorosa.",
  },
  {
    icon: Activity,
    title: "Monitorização em Tempo Real",
    description: "Acompanhe o estado de saúde e histórico clínico de forma segura e privada.",
  },
  {
    icon: ClipboardCheck,
    title: "Auditoria Completa",
    description: "Logs de acesso detalhados garantem transparência e não-repúdio.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              MedPortal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button size="sm" onClick={() => navigate("/register")}>
              Registar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero min-h-[85vh] flex items-center pt-16">
        <div className="section-container w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="clinical-badge bg-primary-foreground/15 text-primary-foreground mb-6">
                <Lock className="h-3 w-3 mr-1.5" />
                Portal Seguro OWASP 2025
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
                O seu portal hospitalar{" "}
                <span className="opacity-80">seguro e fiável</span>
              </h1>
              <p className="text-primary-foreground/70 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
                Aceda aos seus dados clínicos, consulte históricos e comunique com a sua equipa médica num ambiente protegido.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                size="lg"
                variant="hero"
                className="text-base px-8 py-6"
                onClick={() => navigate("/login")}
              >
                <Heart className="h-5 w-5 mr-2" />
                Área do Paciente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="hero-outline"
                className="text-base px-8 py-6"
                onClick={() => navigate("/login")}
              >
                <Users className="h-5 w-5 mr-2" />
                Acesso Médico
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="section-container">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Segurança de Nível Hospitalar
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Construído segundo as melhores práticas de segurança para proteger os seus dados.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="clinical-card p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="h-12 w-12 rounded-xl bg-clinical-blue-light flex items-center justify-center mb-5">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Shield className="h-4 w-4" />
            <span>© 2026 MedPortal</span>
          </div>
          <p className="text-muted-foreground text-xs">Projeto de DSS desenvolvido pelo grupo FLST</p>
        </div>
      </footer>
    </div>
  );
}
