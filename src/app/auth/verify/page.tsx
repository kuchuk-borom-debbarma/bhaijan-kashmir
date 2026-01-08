import VerifyForm from "@/components/auth/VerifyForm";

export default async function VerifyPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-8 rounded-xl max-w-md w-full text-center">
            <h3 className="font-bold text-lg mb-2">Invalid Request</h3>
            <p>No verification token found. Please check your link or sign up again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-walnut mb-2">Secure Your Account</h1>
          <p className="text-stone-500">One last step to get started.</p>
        </div>
        <VerifyForm token={token} />
      </div>
    </div>
  );
}
