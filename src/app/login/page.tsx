'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Store, Mail, Lock, ArrowRight, Sparkles, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al iniciar sesión');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    // Demo mode: set session item and redirect
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartly_demo_admin', 'true');
    }
    setTimeout(() => {
      router.push('/admin');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Logo & Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-lg glow-accent group-hover:scale-105 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">Cartly</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-200">Iniciar Sesión en tu Panel</h1>
          <p className="text-xs text-slate-400">Administra tu menú, comanderos y códigos QR en tiempo real</p>
        </div>

        {/* Login Glass Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-5 bg-slate-950/80">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chef@restaurante.com"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs transition-all shadow-lg glow-accent active:scale-98 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
            </button>
          </form>

          <div className="relative flex items-center justify-center border-t border-slate-800 pt-4">
            <span className="bg-slate-950 px-3 text-[11px] text-slate-500 uppercase tracking-widest absolute -top-2.5">
              O Accede Directo
            </span>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-bold text-xs transition-all hover:border-indigo-500/40"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Acceso Demo Directo (Modo Administrador)</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          ¿Aún no tienes un restaurante registrado?{' '}
          <Link href="/register" className="text-cyan-400 font-bold hover:underline">
            Regístrate Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
