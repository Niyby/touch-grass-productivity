import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Upload } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("workNotes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("workNotes", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newTitle.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        createdAt: new Date().toISOString(),
      };
      saveNotes([...notes, newNote]);
      setNewTitle("");
      setNewContent("");
      setShowAdd(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newNote: Note = {
          id: Date.now().toString(),
          title: file.name,
          content: content,
          createdAt: new Date().toISOString(),
        };
        saveNotes([...notes, newNote]);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-700" />
          <h3 className="text-gray-900">Notes Folder</h3>
        </div>
        <div className="flex gap-2">
          <label className="p-1 hover:bg-gray-100 rounded cursor-pointer">
            <Upload className="w-5 h-5 text-gray-700" />
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-3 space-y-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Note content..."
            className="w-full px-3 py-2 border border-gray-300 rounded h-20 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="flex justify-between items-start p-2 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="text-sm text-gray-900">{note.title}</p>
              <p className="text-xs text-gray-600 line-clamp-1">{note.content || "No content"}</p>
            </div>
            <button
              onClick={() => saveNotes(notes.filter((n) => n.id !== note.id))}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {notes.length === 0 && !showAdd && (
          <p className="text-sm text-gray-500 text-center py-4">No notes</p>
        )}
      </div>
    </div>
  );
}
