import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-walnut mb-2">Bhaijan Kashmir</h1>
          <p className="text-stone-500">Authentic Saffron & Dry Fruits</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
