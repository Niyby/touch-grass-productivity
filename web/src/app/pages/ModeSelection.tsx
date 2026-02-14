import { useNavigate } from "react-router";


const jakeImage="/assets/jake.png";
export default function ModeSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <h1 className="mb-12 text-gray-800">
          Which mode are you feeling today?
        </h1>

        <div className="flex gap-6 justify-center mb-8">
          <button
            onClick={() => navigate("/work-mode")}
            className="px-16 py-8 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
          >
            Get it Done
          </button>

          <button
            onClick={() => navigate("/destress-mode")}
            className="px-16 py-8 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-2xl hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
          >
            Take a chill pill
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => alert("Jcon activated! 🎉")}
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl hover:scale-110 transition-transform bg-yellow-400"
          >
            <img
              src={jakeImage}
              alt="Jake"
              className="w-full h-full object-cover"
            />
          </button>
          <p className="text-gray-700">
            Launch Jcon?
          </p>
        </div>
      </div>
    </div>
  );
}
