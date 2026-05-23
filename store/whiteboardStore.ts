import { create } from 'zustand';

interface WhiteboardStore {
  tool: 'pen' | 'eraser' | 'text';
  color: string;
  brushSize: number;
  setTool: (tool: 'pen' | 'eraser' | 'text') => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  tool: 'pen',
  color: '#000000',
  brushSize: 5,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (brushSize) => set({ brushSize }),
}));