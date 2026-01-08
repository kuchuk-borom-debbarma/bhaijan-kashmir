'use client';

import { useActionState } from 'react';
import { completeRegistrationAction } from '@/app/auth/actions';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function VerifyForm({ token }: { token: string }) {
  const [state, action, isPending] = useActionState(completeRegistrationAction, {
    success: false,
  });

  if (state.success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-walnut mb-2">Account Created!</h3>
        <p className="text-stone-600 mb-6">
          Your account has been successfully set up.
        </p>
        <Link 
            href="/auth/sign-in"
            className="inline-flex items-center justify-center px-6 py-3 bg-kashmir-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
        >
            Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
      <h3 className="font-serif text-2xl font-bold text-walnut mb-2">Complete Registration</h3>
      <p className="text-stone-600 mb-6">Set a password to secure your account.</p>
      
      {state.message && (
        <div className={clsx(
            "p-4 rounded-lg mb-6 flex items-start gap-3",
            state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          )}>
            {state.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{state.message}</p>
          </div>
      )}

      <form action={action} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-walnut">Password</label>
            <div className="relative">
                <input 
                name="password"
                type="password" 
                id="password" 
                className={clsx(
                    "w-full px-4 py-3 pl-10 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                    state.errors?.password ? "border-red-500 bg-red-50" : "border-stone-200"
                )}
                placeholder="••••••••" 
                />
                <Lock className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {state.errors?.password && <p className="text-xs text-red-600">{state.errors.password[0]}</p>}
        </div>

        <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-walnut">Confirm Password</label>
            <div className="relative">
                <input 
                name="confirmPassword"
                type="password" 
                id="confirmPassword" 
                className={clsx(
                    "w-full px-4 py-3 pl-10 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                    state.errors?.confirmPassword ? "border-red-500 bg-red-50" : "border-stone-200"
                )}
                placeholder="••••••••" 
                />
                <Lock className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {state.errors?.confirmPassword && <p className="text-xs text-red-600">{state.errors.confirmPassword[0]}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-kashmir-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? 'Creating Account...' : 'Finish Setup'}
        </button>
      </form>
    </div>
  );
}
