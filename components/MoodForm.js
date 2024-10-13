import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { motion } from 'framer-motion';

const moodOptions = [
  { value: 'Happy', color: '#FFD700' },
  { value: 'Excited', color: '#FF4500' },
  { value: 'Calm', color: '#4169E1' },
  { value: 'Anxious', color: '#9932CC' },
  { value: 'Sad', color: '#4682B4' },
  { value: 'Angry', color: '#DC143C' }
];

export default function MoodForm() {
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    if (!mood) {
      setMessage('Please select a mood');
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('moods')
        .insert([
          { user_id: user.id, mood: mood, date: new Date() }
        ]);

      if (error) throw error;
      
      setMessage('Mood recorded successfully!');
      setMood('');
    } catch (error) {
      setMessage('Error recording mood: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling today?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {moodOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              className={`p-2 rounded-md text-white font-medium ${mood === option.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
              style={{ backgroundColor: option.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.value}
            </motion.button>
          ))}
        </div>
      </div>
      <motion.button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? 'Recording...' : 'Record Mood'}
      </motion.button>
      {message && (
        <motion.p 
          className={`mt-2 text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.p>
      )}
    </motion.form>
  );
}
