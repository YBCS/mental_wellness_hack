import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function SleepSummary() {
  const [recentSleep, setRecentSleep] = useState(null);

  useEffect(() => {
    fetchRecentSleep();
  }, []);

  const fetchRecentSleep = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('hours, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setRecentSleep(data);
    } catch (error) {
      console.error('Error fetching recent sleep:', error);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Sleep Summary</h3>
        {recentSleep ? (
          <div className="mt-3">
            <p className="text-3xl font-semibold text-gray-900">{recentSleep.hours} hours</p>
            <p className="mt-1 text-sm text-gray-500">
              Last recorded on {new Date(recentSleep.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-500">No sleep data recorded yet</p>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <Link href="/sleep-tracker" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View sleep history
        </Link>
      </div>
    </div>
  );
}
