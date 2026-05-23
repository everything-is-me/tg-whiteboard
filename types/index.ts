export interface Point {
  x: number;
  y: number;
}

export interface WhiteboardState {
  tool: 'pen' | 'eraser' | 'text';
  color: string;
  brushSize: number;
}

export interface DrawEvent {
  id: string;
  type: 'draw' | 'clear' | 'undo';
  data: any;
  timestamp: number;
}