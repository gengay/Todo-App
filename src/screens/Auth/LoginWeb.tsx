import React, { useEffect, useState } from 'react';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  browserLocalPersistence,
  getRedirectResult,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { auth } from '../../config/firebase';

type Language = 'th' | 'en';

const translations = {
  th: {
    title: 'ยินดีต้อนรับ',
    subtitle: 'กรอกรายละเอียดเพื่อเข้าสู่ระบบ',
    email: 'อีเมล',
    emailPlaceholder: 'name@example.com',
    password: 'รหัสผ่าน',
    passwordPlaceholder: '••••••••',
    remember: 'จดจำฉัน',
    forgot: 'ลืมรหัสผ่าน?',
    login: 'เข้าสู่ระบบ',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    orContinue: 'หรือดำเนินการต่อด้วย',
    google: 'Google',
    github: 'GitHub',
    noAccount: 'ยังไม่มีบัญชี?',
    register: 'สมัครสมาชิก',
    error: 'กรุณากรอกอีเมลและรหัสผ่าน',
    loginFailed: 'เข้าสู่ระบบไม่สำเร็จ',
    emailRequired: 'กรุณากรอกอีเมล',
    passwordRequired: 'กรุณากรอกรหัสผ่าน',
  },
  en: {
    title: 'Welcome ',
    subtitle: 'Please enter your details to sign in',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    login: 'Login',
    loggingIn: 'Signing in...',
    orContinue: 'or continue with',
    google: 'Google',
    github: 'GitHub',
    noAccount: "Don't have an account?",
    register: 'Register',
    error: 'Please enter email and password',
    loginFailed: 'Login failed',
    emailRequired: 'Please enter your email',
    passwordRequired: 'Please enter your password',
  },
} as const;

export default function LoginWeb() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const detectedLanguage = navigator.language.toLowerCase().startsWith('th') ? 'th' : 'en';
    setLanguage(detectedLanguage);
  }, []);

  const locale = translations[language];

  const getFriendlyAuthErrorMessage = (error: any, providerName?: 'email' | 'google' | 'github') => {
    const code = error?.code || '';
    const message = error?.message || '';

    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request' || code === 'auth/redirect-cancelled-by-user') {
      return language === 'th' ? 'การเข้าสู่ระบบถูกยกเลิกแล้ว' : 'Login was cancelled';
    }

    if (code === 'auth/popup-blocked' || code === 'auth/redirect-operation-pending') {
      return language === 'th' ? 'การเข้าสู่ระบบถูกบล็อก กรุณาอนุญาตการเปิดหน้าต่างใหม่และลองอีกครั้ง' : 'Login was blocked. Please allow the browser popup and try again.';
    }

    if (code === 'auth/account-exists-with-different-credential') {
      return language === 'th' ? 'บัญชีนี้มีการเข้าสู่ระบบด้วยวิธีอื่นแล้ว กรุณาใช้วิธีเข้าระบบเดิม' : 'This account is already linked to a different sign-in method.';
    }

    if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return language === 'th' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : 'Incorrect email or password';
    }

    if (code === 'auth/invalid-email') {
      return language === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'The email address is invalid';
    }

    if (code === 'auth/too-many-requests') {
      return language === 'th' ? 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณาลองอีกครั้งในภายหลัง' : 'Too many attempts. Please try again later.';
    }

    if (code === 'auth/network-request-failed') {
      return language === 'th' ? 'เครือข่ายไม่เสถียร กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองอีกครั้ง' : 'Network error. Please check your connection and try again.';
    }

    if (providerName && message) {
      return message;
    }

    return language === 'th' ? 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' : 'Something went wrong while signing in';
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (!result) return;

        const providerId = result.providerId || 'provider';
        setNotice({
          type: 'success',
          message:
            language === 'th'
              ? `เข้าสู่ระบบสำเร็จด้วย ${providerId === 'google.com' ? 'Google' : providerId === 'github.com' ? 'GitHub' : 'บัญชี'} `
              : `Signed in successfully with ${providerId === 'google.com' ? 'Google' : providerId === 'github.com' ? 'GitHub' : 'provider'}`,
        });
      } catch (error: any) {
        setNotice({ type: 'error', message: getFriendlyAuthErrorMessage(error) });
      }
    };

    void handleRedirectResult();
  }, [language]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);

    if (!email.trim()) {
      setNotice({ type: 'error', message: locale.emailRequired });
      return;
    }

    if (!password.trim()) {
      setNotice({ type: 'error', message: locale.passwordRequired });
      return;
    }

    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setNotice({ type: 'success', message: language === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Signed in successfully' });
    } catch (error: any) {
      setNotice({ type: 'error', message: getFriendlyAuthErrorMessage(error, 'email') });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setLoading(true);
    setNotice(null);

    try {
      await setPersistence(auth, browserLocalPersistence);

      const provider =
        providerName === 'google'
          ? (() => {
              const googleProvider = new GoogleAuthProvider();
              googleProvider.setCustomParameters({ prompt: 'select_account' });
              return googleProvider;
            })()
          : (() => {
              const githubProvider = new GithubAuthProvider();
              githubProvider.addScope('read:user');
              githubProvider.addScope('user:email');
              return githubProvider;
            })();

      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setNotice({ type: 'error', message: getFriendlyAuthErrorMessage(error, providerName) });
      setLoading(false);
    }
  };

  const shellClass = isDarkMode
    ? 'min-h-screen flex items-center justify-center bg-slate-950 text-slate-100'
    : 'min-h-screen flex items-center justify-center bg-slate-50 text-slate-900';

  const panelClass = isDarkMode
    ? 'border-slate-800 bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.8)]'
    : 'border-slate-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.15)]';

  const inputClass = isDarkMode
    ? 'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200'
    : 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-200';

  return (
    <div className={`${shellClass} relative overflow-hidden px-3 py-5 transition-colors duration-300 sm:px-4 sm:py-10`}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_35%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center gap-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:rounded-[28px] lg:border lg:border-white/10 lg:bg-gradient-to-br lg:from-blue-600 lg:via-blue-500 lg:to-cyan-500 lg:p-10 lg:text-white lg:shadow-[0_20px_60px_rgba(37,99,235,0.35)]">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-50">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            TodoFlow
          </div>

          <h2 className="max-w-md text-4xl font-bold leading-tight">
            {language === 'th' ? 'จัดการงานของคุณให้คล่องขึ้นทุกวัน' : 'Organize your work smarter every day'}
          </h2>

          <p className="mt-4 max-w-md text-base text-blue-50/85">
            {language === 'th'
              ? 'ติดตามงาน ความก้าวหน้า และทีมของคุณได้ในที่เดียวด้วยประสบการณ์ที่ลื่นไหลและใช้งานง่าย'
              : 'Track tasks, progress, and your team in one place with a smooth and intuitive workflow.'}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: language === 'th' ? 'งาน' : 'Tasks', value: '1.2k+' },
              { label: language === 'th' ? 'ทีม' : 'Teams', value: '48' },
              { label: language === 'th' ? 'ประสิทธิภาพ' : 'Efficiency', value: '97%' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[420px] justify-self-center">
          <div
            className={`relative w-full rounded-[28px] border p-5 sm:p-8 backdrop-blur-xl transition-all duration-300 ${panelClass}`}
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <div className="absolute inset-0 rounded-[28px] opacity-80" style={{
              backgroundImage: isDarkMode
                ? 'linear-gradient(120deg, rgba(59,130,246,0.10), rgba(15,23,42,0.0), rgba(148,163,184,0.08))'
                : 'linear-gradient(120deg, rgba(59,130,246,0.05), rgba(255,255,255,0.0), rgba(59,130,246,0.04))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s linear infinite',
            }} />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                    T
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-[0.2em] text-blue-500">TodoFlow</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="sr-only">Language</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as Language)}
                    className={isDarkMode
                      ? 'rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs font-medium text-slate-100 outline-none ring-0 transition-colors hover:border-slate-600'
                      : 'rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none ring-0 transition-colors hover:border-slate-300'}
                  >
                    <option value="en">EN</option>
                    <option value="th">TH</option>
                  </select>

                  <button
                    type="button"
                    aria-label="Toggle theme"
                    onClick={() => setIsDarkMode((prev) => !prev)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                      isDarkMode ? 'border-slate-700 bg-slate-800 text-yellow-300' : 'border-slate-200 bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isDarkMode ? '☀️' : '🌙'}
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {locale.title}
                </h1>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {locale.subtitle}
                </p>
              </div>

              {notice && (
                <div
                  className={`mb-5 rounded-xl border px-3 py-2 text-sm ${
                    notice.type === 'error'
                      ? isDarkMode
                        ? 'border-red-500/40 bg-red-500/10 text-red-200'
                        : 'border-red-200 bg-red-50 text-red-700'
                      : isDarkMode
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {notice.message}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} htmlFor="login-email">
                    {locale.email}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={locale.emailPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={`mb-2 block text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`} htmlFor="login-password">
                    {locale.password}
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={locale.passwordPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRememberMe((previous) => !previous)}
                    className="inline-flex items-center gap-2 text-left"
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] font-bold transition-all ${
                        rememberMe
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : isDarkMode
                            ? 'border-slate-600 bg-slate-900 text-slate-400'
                            : 'border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {rememberMe ? '✓' : ''}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {locale.remember}
                    </span>
                  </button>

                  <button type="button" className="text-sm font-semibold text-blue-500 transition-colors hover:text-blue-400">
                    {locale.forgot}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? locale.loggingIn : locale.login}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <span>{locale.orContinue}</span>
                <div className={`h-px flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">G</span>
                  {locale.google}
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-600'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">◌</span>
                  {locale.github}
                </button>
              </div>

              <div className={`mt-6 flex items-center justify-center gap-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>{locale.noAccount}</span>
                <button type="button" className="font-semibold text-blue-500 transition-colors hover:text-blue-400">
                  {locale.register}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
