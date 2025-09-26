import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const token = (await cookies()).get('customer_access_token')?.value;
  return (
    <div className="space-y-4">
      {!token ? (
        <p className="text-neutral-600 dark:text-neutral-300">You&apos;re not signed in.</p>
      ) : (
        <p className="text-neutral-600 dark:text-neutral-300">Your profile details will appear here.</p>
      )}
    </div>
  );
}


