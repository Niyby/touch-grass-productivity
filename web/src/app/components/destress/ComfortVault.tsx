import { useState, useEffect } from "react";
import { FolderHeart, Plus, Trash2, X } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface ComfortItem {
  id: string;
  type: "image" | "text" | "quote";
  content: string;
  title?: string;
  createdAt: string;
}

export default function ComfortVault() {
  const [items, setItems] = useState<ComfortItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<"image" | "text" | "quote">("text");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedItem, setSelectedItem] = useState<ComfortItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("comfortVault");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const saveItems = (updated: ComfortItem[]) => {
    setItems(updated);
    localStorage.setItem("comfortVault", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newContent.trim()) {
      const item: ComfortItem = {
        id: Date.now().toString(),
        type: newType,
        content: newContent,
        title: newTitle || undefined,
        createdAt: new Date().toISOString(),
      };
      saveItems([...items, item]);
      setNewTitle("");
      setNewContent("");
      setShowAdd(false);
      
      // Award focus points
      const currentPoints = parseInt(localStorage.getItem("focusPoints") || "0");
      localStorage.setItem("focusPoints", (currentPoints + 5).toString());
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderHeart className="w-6 h-6 text-pink-600" />
          <h3 className="text-purple-900">Comfort Vault</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-pink-200 space-y-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
            className="w-full px-3 py-2 border border-pink-200 rounded"
          >
            <option value="text">Memory/Text</option>
            <option value="quote">Quote</option>
            <option value="image">Image URL</option>
          </select>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (optional)..."
            className="w-full px-3 py-2 border border-pink-200 rounded"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={newType === "image" ? "Image URL..." : "Your comforting thought..."}
            className="w-full px-3 py-2 border border-pink-200 rounded h-20 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm text-purple-900">{item.title || item.type}</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveItems(items.filter((i) => i.id !== item.id));
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {item.type === "image" ? (
              <div className="w-full h-20 bg-purple-100 rounded overflow-hidden">
                <ImageWithFallback
                  src={item.content}
                  alt={item.title || "Comfort"}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-purple-700 line-clamp-2">{item.content}</p>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !showAdd && (
        <p className="text-center text-purple-600 py-8">Add something comforting!</p>
      )}

      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-2xl w-full"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-purple-900">{selectedItem.title || selectedItem.type}</h2>
              <button onClick={() => setSelectedItem(null)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            {selectedItem.type === "image" ? (
              <ImageWithFallback src={selectedItem.content} alt="" className="w-full rounded" />
            ) : (
              <p className="text-purple-800 whitespace-pre-wrap">{selectedItem.content}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
