import { motion } from 'framer-motion';

export default function GardenView({ garden }) {
  if (!garden) return <div>Loading garden...</div>;

  return (
    <div className="bg-green-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Your Garden</h2>
      <div className="grid grid-cols-3 gap-4">
        {garden.plants.map((plant, index) => (
          <motion.div
            key={index}
            className="bg-white p-2 rounded-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">{plant.emoji}</span>
            <p className="text-sm mt-1">{plant.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
