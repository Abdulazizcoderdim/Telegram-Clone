import { authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { FaTelegram } from 'react-icons/fa';
import StateAuth from './_component/state';

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (session) return redirect('/');

  return (
    <div className="container max-w-md w-full h-screen flex justify-center items-center flex-col space-y-4">
      <FaTelegram size={120} className="text-blue-500" />
      <div>
        <h1 className="text-4xl font-bold">Telegram</h1>
      </div>
      <StateAuth />
    </div>
  );
};

export default Page;
