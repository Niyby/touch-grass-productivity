import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Flower2, TreePine, Sprout } from "lucide-react";

interface Plant {
  id: string;
  type: "flower" | "tree" | "sprout";
  x: number;
  y: number;
  size: number;
}

export default function ZenGarden() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [focusPoints, setFocusPoints] = useState(0);

  useEffect(() => {
    const savedPlants = localStorage.getItem("zenGardenPlants");
    const savedPoints = localStorage.getItem("focusPoints");
    if (savedPlants) setPlants(JSON.parse(savedPlants));
    if (savedPoints) setFocusPoints(parseInt(savedPoints));
  }, []);

  const addPlant = (e: React.MouseEvent<HTMLDivElement>) => {
    if (focusPoints < 10) {
      alert("You need at least 10 focus points to plant something!");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const plantTypes: ("flower" | "tree" | "sprout")[] = ["flower", "tree", "sprout"];
    const randomType = plantTypes[Math.floor(Math.random() * plantTypes.length)];

    const newPlant: Plant = {
      id: Date.now().toString(),
      type: randomType,
      x,
      y,
      size: 30 + Math.random() * 20,
    };

    const updatedPlants = [...plants, newPlant];
    setPlants(updatedPlants);
    localStorage.setItem("zenGardenPlants", JSON.stringify(updatedPlants));

    const newPoints = focusPoints - 10;
    setFocusPoints(newPoints);
    localStorage.setItem("focusPoints", newPoints.toString());
  };

  const getPlantIcon = (type: string) => {
    switch (type) {
      case "flower":
        return Flower2;
      case "tree":
        return TreePine;
      default:
        return Sprout;
    }
  };

  const getPlantColor = (type: string) => {
    switch (type) {
      case "flower":
        return "text-pink-500";
      case "tree":
        return "text-green-700";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/destress-mode")}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white">Zen Garden</h1>
        </div>
        <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full">
          <Sprout className="w-5 h-5" />
          <span>Focus Points: {focusPoints}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 mb-4 text-center">
          <p className="text-gray-700">
            Click anywhere in the garden to plant! Each plant costs 10 focus points.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Earn focus points by completing tasks and maintaining good habits in Work Mode and Destress Mode.
          </p>
        </div>

        {/* Garden Area */}
        <div
          onClick={addPlant}
          className="relative bg-gradient-to-b from-green-200 to-green-300 rounded-3xl h-[600px] overflow-hidden cursor-pointer border-4 border-green-400 shadow-2xl"
        >
          {/* Ground texture */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Plants */}
          {plants.map((plant) => {
            const Icon = getPlantIcon(plant.type);
            const color = getPlantColor(plant.type);
            return (
              <motion.div
                key={plant.id}
                className="absolute"
                style={{
                  left: `${plant.x}%`,
                  top: `${plant.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    className={color}
                    style={{ width: plant.size, height: plant.size }}
                  />
                </motion.div>
              </motion.div>
            );
          })}

          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                x: [-10, 10, -10],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
