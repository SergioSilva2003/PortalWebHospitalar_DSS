import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield, User, FileText, Clock, Edit, Save, LogOut, Activity,
  Monitor, Globe, ChevronRight, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { sanitizeInput } from "@/lib/security";

const mockHistory = [
  { date: "2026-04-10", type: "Consulta", doctor: "Dr. Costa", notes: "Check-up geral" },
  { date: "2026-03-22", type: "Análises", doctor: "Dra. Mendes", notes: "Hemograma completo" },
  { date: "2026-02-15", type: "Consulta", doctor: "Dr. Costa", notes: "Acompanhamento" },
];

const mockAuditLogs = [
  { date: "2026-04-13 09:22", ip: "192.168.1.45", device: "Chrome / Windows", action: "Login" },
  { date: "2026-04-12 14:10", ip: "192.168.1.45", device: "Chrome / Windows", action: "Edição de perfil" },
  { date: "2026-04-10 08:55", ip: "10.0.0.12", device: "Safari / iOS", action: "Login" },
];

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [tab, setTab] = useState<"profile" | "history" | "audit">("profile");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = () => {
    const sanitized = sanitizeInput(name);
    // PUT /api/patients/{user.id}/ with token
    toast.success("Perfil atualizado com sucesso");
    setEditing(false);
  };

  const tabs = [
    { id: "profile" as const, label: "Perfil", icon: User },
    { id: "history" as const, label: "Histórico", icon: FileText },
    { id: "audit" as const, label: "Acessos", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="section-container flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold text-foreground">MedPortal</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
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
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-clinical-blue-light flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Olá, {user.name}
              </h1>
              <p className="text-muted-foreground text-sm">Área do Paciente</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-muted rounded-lg p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile */}
          {tab === "profile" && (
            <div className="clinical-card p-8 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">Dados Pessoais</h2>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Guardar
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Nome</label>
                  {editing ? (
                    <input
                      className="clinical-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                    />
                  ) : (
                    <p className="text-foreground">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">ID</label>
                  <p className="text-muted-foreground text-sm font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {tab === "history" && (
            <div className="clinical-card overflow-hidden max-w-3xl">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-lg font-semibold text-foreground">Histórico Clínico</h2>
              </div>
              <div className="divide-y divide-border">
                {mockHistory.map((h, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-clinical-blue-light flex items-center justify-center">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{h.type}</p>
                        <p className="text-xs text-muted-foreground">{h.doctor} — {h.notes}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit logs */}
          {tab === "audit" && (
            <div className="clinical-card overflow-hidden max-w-3xl">
              <div className="p-6 border-b border-border">
                <h2 className="font-display text-lg font-semibold text-foreground">Histórico de Acessos</h2>
                <p className="text-muted-foreground text-xs mt-1">Registo para garantir não-repúdio</p>
              </div>
              <div className="divide-y divide-border">
                {mockAuditLogs.map((log, i) => (
                  <div key={i} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-clinical-green-light flex items-center justify-center">
                        {log.action === "Login" ? (
                          <Globe className="h-5 w-5 text-clinical-green" />
                        ) : (
                          <Monitor className="h-5 w-5 text-clinical-green" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.device}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{log.date}</p>
                      <p className="text-xs font-mono text-muted-foreground">{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
