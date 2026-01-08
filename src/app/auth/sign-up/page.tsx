import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-walnut mb-2">Join Bhaijan Kashmir</h1>
          <p className="text-stone-500">Experience the authentic taste of Kashmir.</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
