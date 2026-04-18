import { useState } from "react";
import { Shield, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pedido para o teu Django
      const response = await axios.post("http://localhost:8000/api/registar/", {
        name,
        email,
        password
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Conta criada com sucesso!");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Erro no registo:", error);
      toast.error(error.response?.data?.error || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <div className="flex justify-center mb-6">
             <UserPlus className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Criar conta
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                required
                className="mt-1 block w-full border rounded-md p-2"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full border rounded-md p-2"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full border rounded-md p-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "A carregar..." : "Registar"}
            </Button>
          </form>

          <div className="mt-6">
            <Link to="/login" className="flex items-center justify-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Já tem conta? Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}