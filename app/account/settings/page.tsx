import { cookies } from 'next/headers';

export default async function SettingsPage() {
  const token = (await cookies()).get('customer_access_token')?.value;
  return (
    <div className="space-y-4">
      {!token ? (
        <p className="text-neutral-600 dark:text-neutral-300">Login to manage your settings.</p>
      ) : (
        <p className="text-neutral-600 dark:text-neutral-300">Your account settings will appear here.</p>
      )}
    </div>
  );
}


