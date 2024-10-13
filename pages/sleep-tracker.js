import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../utils/supabaseClient';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SleepTracker() {
  const router = useRouter();
  const [sleepHours, setSleepHours] = useState('');
  const [sleepData, setSleepData] = useState({
    labels: [],
    datasets: [{
      label: 'Sleep Hours',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  });
  const [timeline, setTimeline] = useState(7);
  const [user, setUser] = useState(null);

  const fetchSleepData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeline);

      const { data, error } = await supabase
        .from('sleep_logs')
        .select('hours, date')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
      const sleepHours = data.map(entry => entry.hours);

      setSleepData({
        labels,
        datasets: [{
          label: 'Sleep Hours',
          data: sleepHours,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    }
  }, [timeline]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchSleepData();
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router, fetchSleepData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('sleep_logs')
        .insert([
          { user_id: user.id, hours: parseFloat(sleepHours), date: new Date() }
        ]);

      if (error) throw error;
      setSleepHours('');
      fetchSleepData();
    } catch (error) {
      console.error('Error logging sleep hours:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-white p-4">
      <Head>
        <title>Sleep Tracker | Easemind</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Sleep Tracker</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Log Your Sleep</h2>
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <input
              type="number"
              step="0.1"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Hours of sleep"
              className="flex-grow p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Log Sleep
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Sleep History</h2>
            <select
              value={timeline}
              onChange={(e) => setTimeline(Number(e.target.value))}
              className="border rounded-md p-2"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <Line data={sleepData} />
        </div>
      </div>
    </div>
  );
}
