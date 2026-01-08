'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/auth/actions';
import { ArrowRight, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function SignInForm() {
  const [state, action, isPending] = useActionState(authenticate, {
    success: false,
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
      <h3 className="font-serif text-2xl font-bold text-walnut mb-2">Welcome Back</h3>
      <p className="text-stone-600 mb-6">Sign in to your account.</p>
      
      {state.message && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="space-y-2">
            <label htmlFor="usernameOrEmail" className="text-sm font-medium text-walnut">Username or Email</label>
            <input 
            name="usernameOrEmail"
            type="text" 
            id="usernameOrEmail" 
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all"
            placeholder="john@example.com" 
            />
        </div>

        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-walnut">Password</label>
            <input 
            name="password"
            type="password" 
            id="password" 
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all"
            placeholder="••••••••" 
            />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-kashmir-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-sm text-stone-500 mt-4">
            Don't have an account? <Link href="/auth/sign-up" className="text-kashmir-green font-medium hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
