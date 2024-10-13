import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { supabase } from '../utils/supabaseClient';

ChartJS.register(ArcElement, Tooltip, Legend);

const moods = [
  { emoji: '😊', label: 'Happy', color: '#FFD700' },
  { emoji: '😐', label: 'Neutral', color: '#A9A9A9' },
  { emoji: '😢', label: 'Sad', color: '#4169E1' },
  { emoji: '😠', label: 'Angry', color: '#FF4500' },
  { emoji: '😴', label: 'Tired', color: '#8E44AD' },
];

export default function MoodTracker() {
  const router = useRouter();
  const [moodData, setMoodData] = useState({
    labels: moods.map(mood => mood.label),
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: moods.map(mood => mood.color),
    }]
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [timeline, setTimeline] = useState(7);

  useEffect(() => {
    fetchMoodData();
  }, [timeline]);

  const fetchMoodData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
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
  };

  const handleMoodSelection = async (mood) => {
    setSelectedMood(mood);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('moods')
        .insert([
          { user_id: user.id, mood: mood.label, date: new Date() }
        ]);

      if (error) throw error;
      fetchMoodData();
    } catch (error) {
      console.error('Error recording mood:', error);
    }
  };

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
            <h2 className="text-xl font-semibold">Your Mood Overview</h2>
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
          <div className="w-full max-w-xs mx-auto">
            <Pie data={moodData} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {moods.map((mood, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ${selectedMood === mood ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => handleMoodSelection(mood)}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
