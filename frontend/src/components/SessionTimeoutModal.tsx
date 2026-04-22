import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isTokenExpiringSoon } from "@/lib/security";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SessionTimeoutModal() {
  const { tokenExpiry, logout } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!tokenExpiry) return;
    const interval = setInterval(() => {
      if (isTokenExpiringSoon(tokenExpiry)) {
        setShow(true);
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-2xl p-8 max-w-sm w-full animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-clinical-amber-light flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-clinical-amber" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">Sessão a Expirar</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          A sua sessão irá expirar em breve por razões de segurança. Deseja renovar ou terminar?
        </p>
        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => setShow(false)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Renovar
          </Button>
          <Button variant="outline" className="flex-1" onClick={logout}>
            Terminar
          </Button>
        </div>
      </div>
    </div>
  );
}