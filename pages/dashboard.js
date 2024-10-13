import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import MoodSummary from '../components/MoodSummary';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  if (!user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Easemind</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {user.email}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MoodSummary />
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
