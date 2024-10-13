import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '../utils/supabaseClient';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTree, FaTint, FaHeart, FaUndo, FaPlay, FaStop } from 'react-icons/fa';

const treeStages = [
  '🌱', '🌿', '🌳', '🌳🍎', '🌳🍎🍎', '🌳🍎🍎🍎'
];

const motivationalMessages = {
  grow: [
    "Your efforts are paying off! Keep growing!",
    "Every day is a chance to grow. You're doing great!",
    "Growth is a journey, not a destination. Keep going!"
  ],
  water: [
    "Nurturing yourself is essential. Great job!",
    "Self-care is a priority, not a luxury. Well done!",
    "You're taking care of yourself, and it shows!"
  ],
  pamper: [
    "You deserve this moment of happiness. Enjoy!",
    "Treating yourself with kindness is a sign of strength.",
    "Your happiness matters. Keep nurturing your joy!"
  ],
  reset: [
    "Sometimes, a fresh start is just what we need.",
    "Resetting allows us to begin anew with renewed energy.",
    "Every ending is a new beginning. Let's start fresh!"
  ]
};

export default function MindGarden() {
  const [user, setUser] = useState(null);
  const [tree, setTree] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        router.push('/login');
      } else {
        await fetchTree(user.id);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const growTree = setInterval(() => {
      if (tree && tree.stage < treeStages.length - 1) {
        updateTree({ ...tree, stage: tree.stage + 1 });
      }
    }, 24 * 60 * 60 * 1000); // Grow tree every 24 hours

    return () => clearInterval(growTree);
  }, [tree]);

  useEffect(() => {
    if (audioRef.current) {
      console.log("Audio element found");
      console.log("Audio src:", audioRef.current.src);
      console.log("Audio readyState:", audioRef.current.readyState);
    } else {
      console.log("Audio element not found on mount");
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      console.log("Audio element properties:");
      console.log("- src:", audioRef.current.src);
      console.log("- readyState:", audioRef.current.readyState);
      console.log("- error:", audioRef.current.error);
      console.log("- networkState:", audioRef.current.networkState);
    }
  }, []);

  const fetchTree = async (userId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching tree:', error);
        await createTree(userId);
      } else if (data) {
        setTree(data);
      }
    } catch (error) {
      console.error('Error in fetchTree:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTree = async (userId) => {
    try {
      const newTree = { user_id: userId, stage: 0, health: 50, happiness: 50 };
      const { data, error } = await supabase
        .from('trees')
        .insert([newTree])
        .single();

      if (error) {
        console.error('Error creating tree:', error);
      } else if (data) {
        setTree(data);
      }
    } catch (error) {
      console.error('Error in createTree:', error);
    }
  };

  const updateTree = async (updatedTree) => {
    const { data, error } = await supabase
      .from('trees')
      .update(updatedTree)
      .eq('id', updatedTree.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tree:', error);
    } else if (data) {
      setTree(data);
    }
  };

  const performAction = (actionType) => {
    if (!tree) return;

    setAction(actionType);
    if (audioRef.current) {
      audioRef.current.load();  // Load the audio
      playSound();  // Then try to play it
    }
    setTimeout(() => {
      setAction(null);
    }, 3000);

    let updatedTree = { ...tree };
    switch (actionType) {
      case 'grow':
        updatedTree.stage = Math.min(tree.stage + 1, treeStages.length - 1);
        updatedTree.health = Math.max(tree.health - 5, 0);
        break;
      case 'water':
        updatedTree.health = Math.min(tree.health + 10, 100);
        updatedTree.happiness = Math.max(tree.happiness - 5, 0);
        break;
      case 'pamper':
        updatedTree.happiness = Math.min(tree.happiness + 10, 100);
        updatedTree.health = Math.max(tree.health - 5, 0);
        break;
      case 'reset':
        updatedTree = { ...updatedTree, stage: 0, health: 50, happiness: 50 };
        break;
    }
    updateTree(updatedTree);
  };

  const playSound = () => {
    if (audioRef.current) {
      console.log("Attempting to play sound...");
      audioRef.current.volume = 1; // Ensure volume is at maximum
      audioRef.current.play()
        .then(() => {
          console.log("Sound played successfully");
          console.log("Duration:", audioRef.current.duration);
          console.log("Current Time:", audioRef.current.currentTime);
          setIsPlaying(true);
        })
        .catch(e => {
          console.error("Error playing sound:", e);
          console.log("Audio src:", audioRef.current.src);
          console.log("Audio readyState:", audioRef.current.readyState);
          console.log("Audio error:", audioRef.current.error);
        });
    } else {
      console.error("Audio element not found");
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      console.log("Sound stopped");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Mind Garden</h1>
          <p>Loading your garden...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Mind Garden | Easemind</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Mind Garden</h1>
        {tree ? (
          <div className="bg-green-100 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center justify-center" style={{ height: '50vh' }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ fontSize: 'min(20vw, 20vh)' }}
              >
                {treeStages[tree.stage]}
              </motion.div>
              <div className="mt-4 text-center">
                <p>Health: {tree.health}%</p>
                <p>Happiness: {tree.happiness}%</p>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => performAction('grow')}
                className="bg-green-500 text-white px-4 py-2 rounded-full m-2"
              >
                <FaTree className="inline-block mr-2" /> Grow
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => performAction('water')}
                className="bg-blue-500 text-white px-4 py-2 rounded-full m-2"
              >
                <FaTint className="inline-block mr-2" /> Water
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => performAction('pamper')}
                className="bg-pink-500 text-white px-4 py-2 rounded-full m-2"
              >
                <FaHeart className="inline-block mr-2" /> Pamper
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => performAction('reset')}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full m-2"
              >
                <FaUndo className="inline-block mr-2" /> Reset
              </motion.button>
            </div>
          </div>
        ) : (
          <p>Error loading your garden. Please try refreshing the page.</p>
        )}
      </div>
      <AnimatePresence>
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
              <p className="text-2xl mb-4">
                {action === 'grow' ? '🌱' : 
                 action === 'water' ? '💧' : 
                 action === 'pamper' ? '❤️' : '🔄'}
              </p>
              <p className="text-xl font-semibold mb-2">
                {action === 'grow' ? 'Your tree is growing!' :
                 action === 'water' ? 'Your tree feels refreshed!' :
                 action === 'pamper' ? 'Your tree feels loved!' :
                 'Your tree has been reset!'}
              </p>
              <p className="text-md">
                {motivationalMessages[action][Math.floor(Math.random() * motivationalMessages[action].length)]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 flex justify-center space-x-4">
        <button 
          onClick={playSound}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          disabled={isPlaying}
        >
          <FaPlay className="mr-2" /> Play Sound
        </button>
        <button 
          onClick={stopSound}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          disabled={!isPlaying}
        >
          <FaStop className="mr-2" /> Stop Sound
        </button>
      </div>
      <audio 
        ref={audioRef} 
        src="/nature-sounds-240504.mp3"
        onError={(e) => console.error("Audio loading error:", e)}
        onEnded={() => setIsPlaying(false)}
      />
    </DashboardLayout>
  );
}
