import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, Users, Search, LogOut, User, ChevronRight, ShieldCheck, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { sanitizeInput } from "@/lib/security";

const mockPatients = [
  { id: "p001", name: "Maria Santos", email: "maria@email.pt", lastVisit: "2026-04-10", status: "Ativo" },
  { id: "p002", name: "João Ferreira", email: "joao@email.pt", lastVisit: "2026-04-08", status: "Ativo" },
  { id: "p003", name: "Ana Costa", email: "ana@email.pt", lastVisit: "2026-03-15", status: "Inativo" },
  { id: "p004", name: "Pedro Lopes", email: "pedro@email.pt", lastVisit: "2026-04-12", status: "Ativo" },
  { id: "p005", name: "Sofia Almeida", email: "sofia@email.pt", lastVisit: "2026-04-01", status: "Ativo" },
];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  if (!user || (user.role !== "doctor" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="clinical-card p-8 max-w-sm text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Não tem permissões para aceder a este painel. (Privilege Elevation Protection)
          </p>
          <Button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const sanitizedSearch = sanitizeInput(search).toLowerCase();
  const filtered = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(sanitizedSearch) ||
      p.email.toLowerCase().includes(sanitizedSearch)
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="section-container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold text-foreground">MedPortal</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="clinical-badge bg-clinical-blue-light text-primary text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {user.role === "admin" ? "Admin" : "Médico"}
            </div>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-1" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Painel {user.role === "admin" ? "Administrativo" : "Médico"}</h1>
              <p className="text-muted-foreground text-sm">Gestão de pacientes com controlo RBAC</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              <User className="h-4 w-4 mr-1" /> Meu Perfil
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              className="clinical-input pl-10"
              placeholder="Pesquisar paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Pacientes", value: mockPatients.length, icon: Users },
              { label: "Ativos", value: mockPatients.filter((p) => p.status === "Ativo").length, icon: ShieldCheck },
            ].map((s) => (
              <div key={s.label} className="clinical-card p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-clinical-blue-light flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Patient list */}
          <div className="clinical-card overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Lista de Pacientes
              </h2>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`clinical-badge ${
                        p.status === "Ativo"
                          ? "bg-clinical-green-light text-clinical-green"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">{p.lastVisit}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Nenhum paciente encontrado.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
