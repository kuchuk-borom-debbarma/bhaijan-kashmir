'use client';

import { useActionState } from 'react';
import { signUpAction } from '@/app/auth/actions';
import { ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

export default function SignUpForm() {
  const [state, action, isPending] = useActionState(signUpAction, {
    success: false,
  });

  if (state.success) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-walnut mb-2">Check your inbox</h3>
        <p className="text-stone-600 mb-6">
          We've sent a magic link to your email. Click it to complete your registration.
        </p>
        <p className="text-sm text-stone-500">
          (For this demo, check your server console)
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
      <h3 className="font-serif text-2xl font-bold text-walnut mb-2">Create Account</h3>
      <p className="text-stone-600 mb-6">Sign up to track orders and save your favorites.</p>
      
      {state.message && !state.success && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}

      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-walnut">First Name</label>
                <input 
                name="firstName"
                type="text" 
                id="firstName" 
                className={clsx(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                    state.errors?.firstName ? "border-red-500 bg-red-50" : "border-stone-200"
                )}
                placeholder="John" 
                />
                {state.errors?.firstName && <p className="text-xs text-red-600">{state.errors.firstName[0]}</p>}
            </div>
            <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-walnut">Last Name</label>
                <input 
                name="lastName"
                type="text" 
                id="lastName" 
                className={clsx(
                    "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                    state.errors?.lastName ? "border-red-500 bg-red-50" : "border-stone-200"
                )}
                placeholder="Doe" 
                />
                {state.errors?.lastName && <p className="text-xs text-red-600">{state.errors.lastName[0]}</p>}
            </div>
        </div>

        <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-walnut">Username</label>
            <input 
            name="username"
            type="text" 
            id="username" 
            className={clsx(
                "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                state.errors?.username ? "border-red-500 bg-red-50" : "border-stone-200"
            )}
            placeholder="johndoe123" 
            />
            {state.errors?.username && <p className="text-xs text-red-600">{state.errors.username[0]}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-walnut">Email Address</label>
          <input 
            name="email"
            type="email" 
            id="email" 
            className={clsx(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
              state.errors?.email ? "border-red-500 bg-red-50" : "border-stone-200"
            )}
            placeholder="john@example.com" 
          />
          {state.errors?.email && <p className="text-xs text-red-600">{state.errors.email[0]}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-kashmir-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? 'Sending Link...' : 'Sign Up'} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-sm text-stone-500 mt-4">
            Already have an account? <Link href="/auth/sign-in" className="text-kashmir-green font-medium hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
