import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Supondo página de reset se o usuário tiver acesso. 
    // Em Produção você direcionaria para um ResetURL.
    const { error } = await supabase.auth.resetPasswordForEmail(email);

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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Recuperar Senha</h1>
          <p className="text-zinc-400 text-center">Vamos te ajudar a recuperar o acesso.</p>
        </div>

        <div className="bg-surface border border-zinc-800 p-8 shadow-[4px_4px_0px_rgba(59,130,246,0.2)] relative">
          
          <Link to="/login" className="absolute top-4 left-4 text-zinc-500 hover:text-zinc-300 transition-colors p-2">
            <ArrowLeft size={20} />
          </Link>

          <div className="mt-4">
            {success ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm">
                  Um e-mail de recuperação foi enviado. Siga as instruções para voltar à sua conta.
                </div>
                <div className="pt-4">
                  <Link to="/login" className="text-zinc-300 hover:text-white underline text-sm">Voltar ao Login</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-zinc-300">E-mail Cadastrado</label>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-green-950 font-semibold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar link de recuperação'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
