import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Link from 'next/link';

export default function MoodSummary() {
  const [recentMood, setRecentMood] = useState(null);

  useEffect(() => {
    fetchRecentMood();
  }, []);

  const fetchRecentMood = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('moods')
        .select('mood, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setRecentMood(data);
    } catch (error) {
      console.error('Error fetching recent mood:', error);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Mood Summary</h3>
        {recentMood ? (
          <div className="mt-3">
            <p className="text-3xl font-semibold text-gray-900">{recentMood.mood}</p>
            <p className="mt-1 text-sm text-gray-500">
              Last recorded on {new Date(recentMood.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-500">No mood recorded yet</p>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <Link href="/mood-tracker" className="text-sm font-medium text-teal-600 hover:text-teal-500">
          View mood history
        </Link>
      </div>
    </div>
  );
}
