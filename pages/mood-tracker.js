import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { supabase } from '../utils/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const moods = [
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😐', label: 'Neutral', color: '#A9A9A9' },
  { emoji: '😢', label: 'Sad', color: '#4169E1' },
  { emoji: '😠', label: 'Angry', color: '#FF4500' },
  { emoji: '😴', label: 'Tired', color: '#8E44AD' },
];

const Notification = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-md"
  >
    {message}
  </motion.div>
);

export default function MoodTracker() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [moodData, setMoodData] = useState({
    labels: moods.map(mood => mood.label),
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: moods.map(mood => mood.color),
    }]
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeline, setTimeline] = useState(7);
  const [notification, setNotification] = useState(null);

  const fetchMoodData = useCallback(async () => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeline);

      const { data, error } = await supabase
        .from('moods')
        .select('mood')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString());

      if (error) throw error;

      const moodCounts = moods.reduce((acc, mood) => {
        acc[mood.label] = 0;
        return acc;
      }, {});

      data.forEach(entry => {
        if (moodCounts.hasOwnProperty(entry.mood)) {
          moodCounts[entry.mood]++;
        }
      });

      setMoodData({
        labels: Object.keys(moodCounts),
        datasets: [{
          data: Object.values(moodCounts),
          backgroundColor: moods.map(mood => mood.color),
        }]
      });
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  }, [user, timeline]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchMoodData();
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router, fetchMoodData]);

  const handleMoodSelection = async (mood) => {
    setSelectedMood(mood);
    try {
      const { error } = await supabase
        .from('moods')
        .insert([
          { user_id: user.id, mood: mood.label, date: new Date() }
        ]);

      if (error) throw error;
      fetchMoodData();
      setNotification(`Mood "${mood.label}" recorded successfully!`);
      setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
    } catch (error) {
      console.error('Error recording mood:', error);
      setNotification('Error recording mood. Please try again.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-white p-4">
      <Head>
        <title>Mood Tracker | Easemind</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-6">Mood Tracker</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-500">Your Mood Overview</h2>
            <select
              value={timeline}
              onChange={(e) => setTimeline(Number(e.target.value))}
              className="border rounded-md p-2 bg-gray-400"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div className="w-full max-w-xs mx-auto">
            <Pie data={moodData} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 text-gray-500 ${selectedMood === mood ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => handleMoodSelection(mood)}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <Notification 
            message={notification} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
