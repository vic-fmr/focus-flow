import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Mail, Lock } from 'lucide-react';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <CheckCircle2 className="text-primary w-12 h-12 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Criar conta</h1>
          <p className="text-zinc-400 text-center">Junte-se ao FocusFlow para aumentar sua produtividade.</p>
        </div>

        <div className="bg-surface border border-zinc-800 p-8 shadow-[4px_4px_0px_rgba(59,130,246,0.2)]">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium text-white">Verifique seu e-mail</h3>
              <p className="text-zinc-400 text-sm">
                Enviamos um link de confirmação para <span className="text-zinc-200">{email}</span>. 
                Por favor, acesse seu e-mail e clique no link para ativar sua conta.
              </p>
              <div className="pt-4">
                <Link to="/login" className="text-primary hover:underline">Voltar para o login</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
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
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-300">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-surface-hover text-zinc-100 rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-600"
                    placeholder="Repita sua senha"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-green-950 font-semibold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar minha conta'}
              </button>
            </form>
          )}
          
          {!success && (
            <div className="mt-6 text-center text-sm text-zinc-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                Faça login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
