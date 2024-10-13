import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('moods')
        .select('mood, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivities(data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        <ul className="mt-3 divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <li key={index} className="py-3">
              <p className="text-sm font-medium text-gray-900">{activity.mood}</p>
              <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
