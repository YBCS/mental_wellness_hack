export default function HabitLogger({ onLogHabit }) {
  const habits = [
    { type: 'mood', name: 'Log Mood', emoji: '😊' },
    { type: 'breathing', name: 'Practice Breathing', emoji: '🌬️' },
    { type: 'gratitude', name: 'Gratitude Journal', emoji: '🙏' },
  ];

  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Log a Habit</h2>
      <div className="space-y-2">
        {habits.map((habit) => (
          <button
            key={habit.type}
            onClick={() => onLogHabit(habit.type)}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow"
          >
            {habit.emoji} {habit.name}
          </button>
        ))}
      </div>
    </div>
  );
}
