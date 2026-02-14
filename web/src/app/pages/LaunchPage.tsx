import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function LaunchPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Animated pixelated background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 bg-green-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Pixelated START button */}
      <motion.button
        onClick={() => navigate("/mode-selection")}
        className="relative z-10 group"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-gradient-to-br from-green-500 to-green-700 px-16 py-8 border-8 border-green-800 shadow-2xl relative overflow-hidden">
          {/* Pixelated effect overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-8 grid-rows-4 h-full">
              {[...Array(32)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-green-900"
                  animate={{
                    backgroundColor: [
                      "rgba(34, 197, 94, 0.2)",
                      "rgba(34, 197, 94, 0.5)",
                      "rgba(34, 197, 94, 0.2)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="relative z-10 text-6xl text-white tracking-wider pixel-text"
            animate={{
              textShadow: [
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.8)",
                "0 0 10px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            START
          </motion.div>

          {/* Glitch effect */}
          <motion.div
            className="absolute inset-0 bg-red-500 mix-blend-screen"
            animate={{
              opacity: [0, 0.3, 0],
              x: [-2, 2, -2],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        </div>

        {/* Floating pixels around button */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-green-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.button>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
