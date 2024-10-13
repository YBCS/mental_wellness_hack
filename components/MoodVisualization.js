import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const moodColors = {
  'Happy': '#FFD700',
  'Excited': '#FF4500',
  'Calm': '#4169E1',
  'Anxious': '#9932CC',
  'Sad': '#4682B4',
  'Angry': '#DC143C'
};

export default function MoodVisualization({ duration }) {
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]); // Add fetchMoodData to the dependency array

  const fetchMoodData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - duration);

      const { data, error } = await supabase
        .from('moods')
        .select('mood, date')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      setMoodData(data);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setError('Failed to fetch mood data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood',
        data: moodData.map(entry => moodToNumber(entry.mood)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: moodData.map(entry => moodColors[entry.mood]),
        tension: 0.1,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Mood Trend (Last ${duration} days)`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: ${moodData[context.dataIndex].mood}`;
            }
            return moodData[context.dataIndex].mood;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const moods = ['Angry', 'Sad', 'Anxious', 'Calm', 'Excited', 'Happy'];
            return moods[value];
          }
        }
      }
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading mood data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {moodData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="text-center text-gray-600">No mood data available for the selected period.</div>
      )}
    </motion.div>
  );
}

function moodToNumber(mood) {
  const moodScale = {
    'Happy': 5,
    'Excited': 4,
    'Calm': 3,
    'Anxious': 2,
    'Sad': 1,
    'Angry': 0
  };
  return moodScale[mood] || 3; // Default to neutral if mood is not recognized
}
