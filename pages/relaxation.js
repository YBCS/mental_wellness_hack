import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import Sentiment from 'sentiment';

const exercises = [
  {
    id: 1,
    name: "4-7-8 Breathing",
    description: "A quick relaxation technique to calm your mind.",
    steps: [
      "Sit comfortably and close your eyes.",
      "Inhale through your nose for 4 seconds.",
      "Hold your breath for 7 seconds.",
      "Exhale completely through your mouth for 8 seconds.",
      "Repeat this cycle 4 times."
    ],
  },
  {
    id: 2,
    name: "Gratitude Reflection",
    description: "Focus on positive experiences to improve mood and mindset.",
    steps: [
      "Think about one positive thing that happened today, no matter how small.",
      "Write it down or say it out loud.",
      "Reflect on why this experience was positive for you.",
      "Consider how you can create more experiences like this in the future.",
      "Take a moment to feel grateful for this positive experience."
    ],
  },
  {
    id: 3,
    name: "5-4-3-2-1 Grounding Exercise",
    description: "A mindfulness technique to anchor yourself in the present moment.",
    steps: [
      "Identify 5 things you can see around you.",
      "Acknowledge 4 things you can touch or feel.",
      "Notice 3 things you can hear.",
      "Recognize 2 things you can smell.",
      "Be aware of 1 thing you can taste.",
      "Take a deep breath and feel more grounded in the present."
    ],
  },
  {
    id: 4,
    name: "Progressive Muscle Relaxation",
    description: "Reduce physical tension and promote relaxation.",
    steps: [
      "Start with your toes, tense the muscles for 5 seconds, then relax.",
      "Move to your calves, tense for 5 seconds, then relax.",
      "Continue this process moving upwards through your body.",
      "Include thighs, buttocks, abdomen, chest, arms, hands, neck, and face.",
      "Finally, tense your whole body for 5 seconds, then relax completely."
    ],
  },
  {
    id: 5,
    name: "Positive Affirmations",
    description: "Boost self-esteem and promote a positive mindset.",
    steps: [
      "Choose a positive statement about yourself (e.g., 'I am capable and strong').",
      "Stand in front of a mirror or find a quiet space.",
      "Repeat the affirmation out loud or in your mind 10 times.",
      "Focus on believing the statement as you say it.",
      "Notice how you feel after completing the exercise."
    ],
  },
  {
    id: 6,
    name: "Guided Meditation Video",
    description: "A calming guided meditation video to help you relax and focus.",
    videoId: "inpok4MKVLM" // This is a sample video ID, you can change it to any other meditation video
  }
];

const sentiment = new Sentiment();

const BreathingAnimation = ({ phase, duration }) => {
  return (
    <motion.div
      className="w-32 h-32 bg-blue-500 rounded-full mx-auto"
      animate={{
        scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
        opacity: phase === 'hold' ? 0.7 : 1,
      }}
      transition={{ duration: duration }}
    />
  );
};

const FancyPopup = ({ response, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.5, y: -100 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.5, y: -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-lg p-8 max-w-md m-4 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-4"
      >
        Feedback
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg mb-6"
      >
        {response}
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
);

const YoutubePopup = ({ videoId, onClose }) => {
  const getYoutubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={getYoutubeEmbedUrl(videoId)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Relaxation() {
  const router = useRouter();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let timer;
    if (selectedExercise && selectedExercise.id === 1 && breathingPhase) {
      timer = setTimeout(() => {
        setCountdown(prev => {
          if (prev === 1) {
            switch (breathingPhase) {
              case 'inhale':
                setBreathingPhase('hold');
                return 7;
              case 'hold':
                setBreathingPhase('exhale');
                return 8;
              case 'exhale':
                setBreathingPhase('inhale');
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [selectedExercise, breathingPhase, countdown]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcriptText = event.results[0][0].transcript;
        setTranscript(transcriptText);
        analyzeAndRespond(transcriptText);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      if (isListening) {
        recognition.start();
      }

      return () => {
        recognition.abort();
      };
    } else {
      console.log('Speech recognition not supported');
    }
  }, [isListening]);

  const analyzeAndRespond = (text) => {
    const result = sentiment.analyze(text);
    let response = '';

    if (result.score > 0) {
      response = "That's a wonderful positive affirmation! Your mindset is truly empowering. Keep nurturing these uplifting thoughts!";
    } else if (result.score < 0) {
      response = "I sense some negativity in your words. Remember, you're stronger than you think! Try rephrasing your affirmation in a more positive light.";
    } else {
      response = "That's an interesting thought. How about adding some more positive words to make your affirmation even more powerful?";
    }

    setResponse(response);
  };

  const startBreathingExercise = () => {
    setBreathingPhase('inhale');
    setCountdown(4);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const toggleExercise = (exercise) => {
    if (selectedExercise && selectedExercise.id === exercise.id) {
      setSelectedExercise(null);
    } else {
      setSelectedExercise(exercise);
      if (exercise.id === 1) {
        startBreathingExercise();
      }
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
  };

  const closePopup = () => {
    setResponse('');
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Relaxation Techniques | Easemind</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Relaxation Techniques</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <motion.div 
              key={exercise.id} 
              className="bg-white overflow-hidden shadow rounded-lg"
              layout
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{exercise.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{exercise.description}</p>
                <button
                  onClick={() => exercise.id === 6 ? toggleVideo() : toggleExercise(exercise)}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {exercise.id === 6 ? 'Watch Video' : (selectedExercise && selectedExercise.id === exercise.id ? 'Close Exercise' : 'Start Exercise')}
                </button>

                <AnimatePresence>
                  {selectedExercise && selectedExercise.id === exercise.id && exercise.id !== 6 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      {exercise.id !== 6 && (
                        <ol className="list-decimal list-inside mb-4">
                          {exercise.steps.map((step, index) => (
                            <li key={index} className="mb-2">{step}</li>
                          ))}
                        </ol>
                      )}
                      {exercise.id === 1 && (
                        <div className="mt-4">
                          <BreathingAnimation phase={breathingPhase} duration={breathingPhase === 'hold' ? 7 : breathingPhase === 'exhale' ? 8 : 4} />
                          <p className="text-center mt-4 text-2xl font-bold">{breathingPhase}: {countdown}</p>
                        </div>
                      )}
                      {exercise.id === 5 && (
                        <div className="mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={startListening}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            disabled={isListening}
                          >
                            {isListening ? 'Listening...' : 'Start Speaking'}
                          </motion.button>
                          {transcript && (
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4"
                            >
                              <h3 className="text-lg font-semibold">Your affirmation:</h3>
                              <p>{transcript}</p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {response && <FancyPopup response={response} onClose={closePopup} />}
        {showVideo && (
          <YoutubePopup
            videoId={exercises.find(e => e.id === 6).videoId}
            onClose={() => setShowVideo(false)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}