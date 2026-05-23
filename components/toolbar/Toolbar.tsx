'use client';

import { useWhiteboardStore } from '@/store/whiteboardStore';
import { HexColorPicker } from 'react-colorful';
import { 
  Pencil, 
  Eraser, 
  Undo2, 
  Redo2, 
  Trash2,
  Download,
  Type,
  Moon,
  Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Toolbar() {
  const { tool, color, brushSize, setTool, setColor, setBrushSize } = useWhiteboardStore();
  const [isDark, setIsDark] = useState(false);

  const handleUndo = () => (window as any).whiteboard?.undo();
  const handleRedo = () => (window as any).whiteboard?.redo();
  const handleClear = () => {
    if (confirm('Clear everything from whiteboard?')) {
      (window as any).whiteboard?.clear();
    }
  };
  const handleExport = () => (window as any).whiteboard?.export();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('bg-gray-900');
  };

  const tools = [
    { id: 'pen', icon: Pencil, label: 'Pen', color: 'bg-blue-600' },
    { id: 'eraser', icon: Eraser, label: 'Eraser', color: 'bg-orange-600' },
    { id: 'text', icon: Type, label: 'Text', color: 'bg-purple-600' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-6 shadow-xl z-50 transition-colors overflow-y-auto">
      {/* Header */}
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Pencil className="text-white" size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">TeachBoard</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Interactive Whiteboard</p>
      </div>

      {/* Tools */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">
          Drawing Tools
        </label>
        <div className="grid grid-cols-3 gap-2">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as any)}
              className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                tool === t.id 
                  ? `${t.color} text-white shadow-lg scale-95` 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <t.icon size={20} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">
          Color
        </label>
        <div className="flex justify-center">
          <HexColorPicker 
            color={color} 
            onChange={setColor} 
            style={{ width: '100%', height: '200px' }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
          <div 
            className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{color}</span>
        </div>
      </div>

      {/* Brush Size */}
      <div>
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">
          Brush Size: {brushSize}px
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Fine</span>
          <span>Medium</span>
          <span>Thick</span>
        </div>
        {/* Preview */}
        <div className="mt-4 flex justify-center">
          <div 
            className="rounded-full bg-current"
            style={{ 
              width: `${brushSize * 2}px`, 
              height: `${brushSize * 2}px`,
              backgroundColor: tool === 'eraser' ? '#gray' : color,
              border: '1px solid #ccc'
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">
          Actions
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleUndo}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-all text-gray-700 dark:text-gray-300"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button 
            onClick={handleRedo}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-all text-gray-700 dark:text-gray-300"
          >
            <Redo2 size={18} /> Redo
          </button>
          <button 
            onClick={handleClear}
            className="p-2.5 bg-red-500 hover:bg-red-600 rounded-xl flex items-center justify-center gap-2 transition-all text-white col-span-1"
          >
            <Trash2 size={18} /> Clear
          </button>
          <button 
            onClick={handleExport}
            className="p-2.5 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center gap-2 transition-all text-white col-span-1"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2 transition-all text-gray-700 dark:text-gray-300"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Status */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        Ready to teach ✨
        <div className="mt-1">
          Drawing: {tool === 'pen' ? '✏️ Pen' : tool === 'eraser' ? '🧽 Eraser' : '📝 Text'}
        </div>
      </div>
    </div>
  );
}