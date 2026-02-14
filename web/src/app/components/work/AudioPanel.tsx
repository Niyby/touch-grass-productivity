import { useState, useRef } from "react";
import { Volume2, VolumeX, Upload } from "lucide-react";

export default function AudioPanel() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioSrc(url);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Note: White noise would typically be a URL to an audio file
  const whiteNoiseUrl = ""; // Placeholder - in production, this would be an actual audio file

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-5 h-5 text-gray-700" />
        <h3 className="text-gray-900">Focus Audio</h3>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            setAudioSrc("white-noise");
            setIsPlaying(false);
          }}
          className="w-full px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm text-gray-900"
        >
          White Noise
        </button>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 cursor-pointer text-sm">
            <Upload className="w-4 h-4" />
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {audioSrc && (
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {isPlaying ? (
                  <VolumeX className="w-5 h-5 text-gray-700" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-700" />
                )}
              </button>
              <span className="text-sm text-gray-600">
                {isPlaying ? "Playing..." : "Paused"}
              </span>
            </div>
          )}
        </div>
      </div>

      {audioSrc && audioSrc !== "white-noise" && (
        <audio ref={audioRef} src={audioSrc} loop />
      )}
    </div>
  );
}
