'use client';

import { useActionState } from 'react';
import { submitContactForm } from '@/app/actions';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, {
    success: false,
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
      <h3 className="font-serif text-2xl font-bold text-walnut mb-6">Send a Message</h3>
      
      {state.message && (
        <div className={clsx(
          "p-4 rounded-lg mb-6 flex items-start gap-3",
          state.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        )}>
          {state.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}

      <form action={action} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-walnut">Full Name</label>
            <input 
              name="name"
              type="text" 
              id="name" 
              className={clsx(
                "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
                state.errors?.name ? "border-red-500 bg-red-50" : "border-stone-200"
              )}
              placeholder="John Doe" 
            />
            {state.errors?.name && <p className="text-xs text-red-600">{state.errors.name[0]}</p>}
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
        </div>
        
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-walnut">Subject</label>
          <input 
            name="subject"
            type="text" 
            id="subject" 
            className={clsx(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
              state.errors?.subject ? "border-red-500 bg-red-50" : "border-stone-200"
            )}
            placeholder="How can we help?" 
          />
          {state.errors?.subject && <p className="text-xs text-red-600">{state.errors.subject[0]}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-walnut">Message</label>
          <textarea 
            name="message"
            id="message" 
            rows={4} 
            className={clsx(
              "w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-kashmir-green focus:border-transparent outline-none transition-all",
              state.errors?.message ? "border-red-500 bg-red-50" : "border-stone-200"
            )}
            placeholder="Your message here..."
          ></textarea>
          {state.errors?.message && <p className="text-xs text-red-600">{state.errors.message[0]}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-kashmir-green text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
