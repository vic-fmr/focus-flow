import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Mail, Lock } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <CheckCircle2 className="text-primary w-12 h-12 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-zinc-400 text-center">Entre no FocusFlow para continuar gerenciando suas tarefas.</p>
        </div>

        <div className="bg-surface border border-zinc-800 p-8 shadow-[4px_4px_0px_rgba(59,130,246,0.2)]">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-hover transition-colors">
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-green-950 font-semibold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar no sistema'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-zinc-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Crie uma agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
