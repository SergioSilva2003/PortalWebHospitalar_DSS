import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Shield, User, FileText, Clock, Edit, Save, LogOut, Activity, Heart, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [tab, setTab] = useState<"profile" | "history" | "audit">("profile");
  
  // Estados para dados reais do Django
  const [historicoReal, setHistoricoReal] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ligar ao Django para buscar histórico
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8000/api/historico/?paciente=${user.id}`)
        .then(res => {
          setHistoricoReal(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Erro ao carregar histórico do Django");
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  } [user, navigate];

  // Função de Guardar VULNERÁVEL
  const handleSave = async () => {
    try {
      // Enviamos o 'name' SEM sanitização para o Django
     await axios.put(`http://localhost:8000/api/pacientes/${user.id}/`, {
  name: name
});
      
      toast.success("Comando enviado ao servidor!");
      setEditing(false);
    } catch (error) {
      toast.error("Erro na comunicação com o backend");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border sticky top-0 z-40 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary">
            <Shield size={20} /> MedPortal
          </Link>
          <Button variant="ghost" onClick={logout}>Sair</Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Olá, {name}</h1>

        <div className="flex gap-4 mb-8">
          <Button onClick={() => setTab("profile")} variant={tab === "profile" ? "default" : "outline"}>Perfil</Button>
          <Button onClick={() => setTab("history")} variant={tab === "history" ? "default" : "outline"}>Histórico</Button>
        </div>

        {tab === "profile" && (
          <div className="bg-card p-6 rounded-xl border border-border max-w-md shadow-sm">
            <div className="flex justify-between mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span>Dados Pessoais</span>
              <button onClick={() => editing ? handleSave() : setEditing(true)} className="text-primary underline">
                {editing ? "Guardar" : "Editar"}
              </button>
            </div>
            {editing ? (
              <input 
                className="w-full p-2 bg-muted rounded border border-border" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            ) : (
              <p className="text-lg">{name}</p>
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="p-4 bg-muted/50 font-bold border-b border-border">Registos Médicos (Django)</div>
            {loading ? <p className="p-4 italic">A ligar ao backend...</p> : (
              <div className="divide-y divide-border">
                {historicoReal.map((h: any, i) => (
                  <div key={i} className="p-4 flex justify-between hover:bg-muted/30 transition">
                    <div>
                      <p className="font-bold">{h.type}</p>
                      <p className="text-sm text-muted-foreground">{h.doctor} - {h.notes}</p>
                    </div>
                    <span className="text-xs font-mono">{h.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}