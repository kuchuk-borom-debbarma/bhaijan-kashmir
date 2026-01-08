import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
      redirect('/auth/sign-in');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-walnut mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-2xl font-serif text-walnut uppercase">
            {user.firstName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-walnut">{user.firstName} {user.lastName}</h2>
            <p className="text-stone-500">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
            <h3 className="text-lg font-bold text-walnut mb-4">Account Details</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <dt className="text-sm text-stone-500">Username</dt>
                    <dd className="text-walnut">{user.username}</dd>
                </div>
                <div>
                    <dt className="text-sm text-stone-500">Member Since</dt>
                    <dd className="text-walnut">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
            </dl>
        </div>
      </div>
    </main>
  );
}
