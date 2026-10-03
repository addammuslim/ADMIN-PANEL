/**
 * AuraMaster Authentication & System Error Pages
 * 1. Login
 * 2. Register
 * 3. Forgot Password
 * 4. Lock Screen
 * 5. 404 Not Found
 * 6. 403 Forbidden
 * 7. 500 Server Error
 * 8. Maintenance Mode
 */
import { store, ViewType } from '../utils/store';
import { showToast } from '../utils/toast';

export function renderAuthView(type: ViewType): string {
  const state = store.getState();
  const client = state.currentClient;

  // Navigation switcher pills to preview all auth pages easily
  const previewSwitcher = `
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-xl flex items-center gap-1.5 text-xs">
      <span class="text-slate-400 font-bold uppercase text-[10px] mr-1">Auth Demos:</span>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'auth-login' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="auth-login">Login</button>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'auth-register' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="auth-register">Register</button>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'auth-forgot' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="auth-forgot">Forgot</button>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'auth-lock' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="auth-lock">Lock Screen</button>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'error-404' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="error-404">404</button>
      <button class="nav-link-btn px-2 py-0.5 rounded-full ${type === 'maintenance' ? 'bg-primary text-white font-bold' : 'hover:bg-slate-800 text-slate-300'}" data-view="maintenance">Maintenance</button>
      <span class="text-slate-600">|</span>
      <button class="nav-link-btn px-2 py-0.5 rounded-full text-emerald-400 font-bold hover:bg-slate-800" data-view="dashboard">← Back to Dashboard</button>
    </div>
  `;

  if (type === 'auth-login') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
        <div class="w-full max-w-md bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div class="text-center space-y-2">
            <div class="w-12 h-12 rounded-xl bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto shadow-sm">
              A
            </div>
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">${client.name}</h1>
            <p class="text-xs text-slate-500">Sign in to your administrative dashboard</p>
          </div>

          <form id="auth-login-form" class="space-y-4 text-xs" onsubmit="event.preventDefault();">
            <div>
              <label class="form-label">Email Address</label>
              <input id="login-email" type="email" class="form-input" value="${client.adminEmail}" required />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="form-label mb-0">Password</label>
                <button type="button" class="nav-link-btn text-primary hover:underline text-[11px]" data-view="auth-forgot">Forgot Password?</button>
              </div>
              <div class="relative">
                <input id="login-password" type="password" class="form-input pr-10" value="secret12345" required />
                <button type="button" id="toggle-password-visibility" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4" />
                <span class="text-slate-600 dark:text-slate-400">Remember me for 30 days</span>
              </label>
            </div>

            <button type="submit" id="btn-submit-login" class="btn btn-primary w-full py-2.5 font-semibold text-sm">
              Sign In to Admin
            </button>
          </form>

          <div class="relative flex items-center justify-center">
            <div class="border-t border-slate-200 dark:border-slate-800 w-full"></div>
            <span class="bg-surface px-3 text-[11px] text-slate-400 uppercase font-semibold absolute">Or Connect</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button class="btn btn-secondary btn-sm py-2 justify-center text-xs">
              <span>Google Workspace</span>
            </button>
            <button class="btn btn-secondary btn-sm py-2 justify-center text-xs">
              <span>Single Sign-On (SSO)</span>
            </button>
          </div>

          <div class="text-center text-xs text-slate-500">
            Don't have an operator account?
            <button class="nav-link-btn text-primary hover:underline font-semibold" data-view="auth-register">Request Registration</button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'auth-register') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
        <div class="w-full max-w-md bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div class="text-center space-y-2">
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">Create Admin Account</h1>
            <p class="text-xs text-slate-500">Join the operational staff for ${client.name}</p>
          </div>

          <form id="auth-register-form" class="space-y-4 text-xs" onsubmit="event.preventDefault();">
            <div>
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" placeholder="e.g. Jessica Tanuwijaya" required />
            </div>

            <div>
              <label class="form-label">Work Email</label>
              <input type="email" class="form-input" placeholder="name@company.com" required />
            </div>

            <div>
              <label class="form-label">Password</label>
              <input type="password" class="form-input" placeholder="At least 8 characters" required />
            </div>

            <div>
              <label class="form-label">Confirm Password</label>
              <input type="password" class="form-input" placeholder="Re-enter password" required />
            </div>

            <label class="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded text-primary focus:ring-primary w-4 h-4 mt-0.5" required />
              <span class="text-slate-600 dark:text-slate-400">I agree to the Enterprise Master Terms & Privacy Guidelines.</span>
            </label>

            <button type="submit" id="btn-submit-register" class="btn btn-primary w-full py-2.5 font-semibold text-sm">
              Register Account
            </button>
          </form>

          <div class="text-center text-xs text-slate-500">
            Already have an account?
            <button class="nav-link-btn text-primary hover:underline font-semibold" data-view="auth-login">Sign In</button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'auth-lock') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-900 font-sans">
        <div class="w-full max-w-sm bg-surface border border-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center text-xs">
          <div class="space-y-3">
            <img src="/src/assets/images/admin_avatar_1791012221345.jpg" alt="${client.adminName}" class="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary shadow-lg" />
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">${client.adminName}</h2>
              <p class="text-slate-400 font-mono">${client.adminRole}</p>
            </div>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 text-[11px]">
            Your session was locked due to security timeout. Enter password to resume.
          </div>

          <form id="lock-screen-form" class="space-y-3" onsubmit="event.preventDefault();">
            <input id="lock-password-input" type="password" class="form-input text-center text-sm font-mono" placeholder="Enter password..." autofocus required />
            <button type="submit" id="btn-unlock-screen" class="btn btn-primary w-full py-2 font-semibold">
              Unlock Session
            </button>
          </form>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <button class="nav-link-btn text-slate-400 hover:text-slate-200" data-view="auth-login">Switch Account</button>
            <button class="nav-link-btn text-rose-400 hover:text-rose-300" data-view="auth-login">Log Out</button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'auth-forgot') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
        <div class="w-full max-w-md bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6 text-xs">
          <div class="text-center space-y-2">
            <h1 class="text-xl font-bold text-slate-900 dark:text-white">Reset Password</h1>
            <p class="text-slate-500">Enter your registered work email and we will send a password reset verification link.</p>
          </div>

          <form id="auth-forgot-form" class="space-y-4" onsubmit="event.preventDefault();">
            <div>
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" value="${client.adminEmail}" required />
            </div>

            <button type="submit" id="btn-submit-forgot" class="btn btn-primary w-full py-2.5 font-semibold text-sm">
              Send Reset Instructions
            </button>
          </form>

          <div class="text-center">
            <button class="nav-link-btn text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" data-view="auth-login">
              ← Return to Login
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'error-404') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans text-center">
        <div class="max-w-md space-y-4">
          <div class="text-7xl font-black font-mono text-primary">404</div>
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p class="text-xs text-slate-500">The route or resource you requested does not exist or may have been relocated.</p>
          <div class="pt-2">
            <button class="nav-link-btn btn btn-primary" data-view="dashboard">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'maintenance') {
    return `
      ${previewSwitcher}
      <div class="min-h-screen flex items-center justify-center p-4 bg-slate-900 font-sans text-center text-white">
        <div class="max-w-lg space-y-5 p-8 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-2xl">
          <div class="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <h1 class="text-2xl font-bold">Scheduled Maintenance in Progress</h1>
          <p class="text-xs text-slate-300 leading-relaxed">
            ${client.name} database and high-availability caching nodes are currently undergoing routine optimization. Service will resume shortly.
          </p>
          <div class="p-3 bg-slate-900/60 rounded-lg text-slate-400 text-xs font-mono">
            Estimated Completion: 03:00 WIB (October 3, 2026)
          </div>
          <button class="nav-link-btn btn btn-secondary btn-sm" data-view="dashboard">
            Admin Emergency Bypass →
          </button>
        </div>
      </div>
    `;
  }

  return `<div>Unknown view</div>`;
}

export function initAuthEventListeners() {
  const container = document.getElementById('app');
  if (!container) return;

  // Toggle password visibility
  container.querySelector('#toggle-password-visibility')?.addEventListener('click', () => {
    const input = container.querySelector('#login-password') as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  });

  // Login handler
  container.querySelector('#btn-submit-login')?.addEventListener('click', () => {
    showToast({ title: 'Welcome Back', message: 'Authentication verified. Loading dashboard...', type: 'success' });
    setTimeout(() => store.navigate('dashboard'), 500);
  });

  // Register handler
  container.querySelector('#btn-submit-register')?.addEventListener('click', () => {
    showToast({ title: 'Registration Received', message: 'Verification link sent to your inbox.', type: 'success' });
    setTimeout(() => store.navigate('auth-login'), 500);
  });

  // Forgot password handler
  container.querySelector('#btn-submit-forgot')?.addEventListener('click', () => {
    showToast({ title: 'Reset Link Sent', message: 'Check your email inbox for the reset link.', type: 'info' });
    setTimeout(() => store.navigate('auth-login'), 600);
  });

  // Unlock screen
  container.querySelector('#btn-unlock-screen')?.addEventListener('click', () => {
    showToast({ title: 'Screen Unlocked', message: 'Session restored.', type: 'success' });
    store.navigate('dashboard');
  });
}
