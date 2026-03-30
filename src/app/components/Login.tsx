import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Mic, User, Shield, Users, LogIn, Database } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { VoiceInput } from '@/app/components/VoiceInput';
import { initializeDatabase, isDataInitialized } from '@/utils/initializeDatabase';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string, role: string, name: string) => void;
}

// Demo accounts matching the user management data
const demoAccounts = [
  {
    email: 'admin@salesmonitor.com',
    password: 'admin123',
    name: 'Admin Utama',
    role: 'Super Admin',
    icon: Shield,
    color: 'from-[#01544e] to-[#023d39]',
    description: 'Full system access'
  },
  {
    email: 'manager@salesmonitor.com',
    password: 'manager123',
    name: 'Budi Santoso',
    role: 'Sales Manager',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    description: 'Team management access'
  },
  {
    email: 'sales@salesmonitor.com',
    password: 'sales123',
    name: 'Siti Nurhaliza',
    role: 'Sales Representative',
    icon: User,
    color: 'from-green-500 to-teal-600',
    description: 'Sales operations access'
  },
  {
    email: 'rivelino.hasugian@gmail.com',
    password: 'Rivelin0',
    name: 'Rivelino Hasugian',
    role: 'Sales Manager',
    icon: Users,
    color: 'from-purple-500 to-indigo-600',
    description: 'Team management access'
  },
  {
    email: 'nikky@gmail.com',
    password: 'N1kky',
    name: 'Nikky',
    role: 'Sales Representative',
    icon: User,
    color: 'from-pink-500 to-rose-600',
    description: 'Sales operations access'
  },
  {
    email: 'bari@gmail.com',
    password: 'Bar1',
    name: 'Bari',
    role: 'Sales Executive',
    icon: User,
    color: 'from-amber-500 to-orange-600',
    description: 'Sales operations access'
  },
  {
    email: 'andiko@gmail.com',
    password: 'Andik0',
    name: 'Andiko',
    role: 'Sales Representative',
    icon: User,
    color: 'from-emerald-500 to-green-600',
    description: 'Sales operations access'
  },
  {
    email: 'pipi@gmail.com',
    password: 'estehmanis',
    name: 'Pipi',
    role: 'Sales Representative',
    icon: User,
    color: 'from-sky-500 to-blue-600',
    description: 'Sales operations access'
  }
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const account = demoAccounts.find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (account) {
        onLogin(account.email, account.role, account.name);
      } else {
        setError('Email atau password salah. Gunakan demo account yang tersedia.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setError('');
    
    // Simulate login
    setTimeout(() => {
      onLogin(account.email, account.role, account.name);
    }, 500);
  };

  const handleInitializeDatabase = async () => {
    if (isDataInitialized()) {
      toast.info('Database sudah diinisialisasi sebelumnya.');
      return;
    }
    
    setIsLoading(true);
    const result = await initializeDatabase();
    setIsLoading(false);
    
    if (result.success) {
      toast.success('✅ Database berhasil diinisialisasi!');
    } else {
      toast.error('❌ Gagal menginisialisasi database: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="space-y-4">
            <div className="inline-block p-3 bg-[#01544e] rounded-2xl shadow-xl">
              <BarChart className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-[#01544e]">
              Sales Monitoring Pro
            </h1>
            <p className="text-xl text-gray-600">
              Solusi monitoring penjualan terlengkap untuk meningkatkan performa tim sales Anda
            </p>
          </div>

          <div className="space-y-4 pt-8">
            {[
              { icon: '📊', text: 'Real-time Sales Dashboard' },
              { icon: '🎯', text: 'Lead Management System' },
              { icon: '📅', text: 'Demo Scheduler & Contract' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-block lg:hidden p-3 bg-[#01544e] rounded-2xl shadow-xl mb-4">
                <BarChart className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
              <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#01544e] focus:ring-2 focus:ring-[#e6f2f1] transition-all outline-none"
                    placeholder="nama@email.com"
                    required
                  />
                  <VoiceInput
                    onTranscript={(text) => setEmail(text)}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#01544e] focus:ring-2 focus:ring-[#e6f2f1] transition-all outline-none"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#01544e] hover:bg-[#023d39] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    <span>Masuk</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>© 2026 Sales Monitoring Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple BarChart icon component
function BarChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}