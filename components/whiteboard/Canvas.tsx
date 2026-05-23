'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWhiteboardStore } from '@/store/whiteboardStore';

interface Point {
  x: number;
  y: number;
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const { tool, color, brushSize } = useWhiteboardStore();
  
  // Use refs for history to avoid re-renders
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef(false);

  // Save current canvas state
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    // Don't save during undo/redo operations
    if (isUndoRedoRef.current) return;
    
    // Limit history size to 50
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    
    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => {
      canvas.width = window.innerWidth - 320;
      canvas.height = window.innerHeight - 80;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
        
        // Save initial state
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        historyRef.current = [initialState];
        historyIndexRef.current = 0;
      }
    };

    initCanvas();

    const handleResize = () => {
      const currentContent = ctxRef.current?.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = window.innerWidth - 320;
      canvas.height = window.innerHeight - 80;
      
      const ctx = canvas.getContext('2d');
      if (ctx && currentContent) {
        ctx.putImageData(currentContent, 0, 0);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctxRef.current = ctx;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get coordinates relative to canvas
  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  // Draw a line between two points
  const drawLine = useCallback((start: Point, end: Point) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    
    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else {
      ctx.strokeStyle = color;
    }
    
    ctx.lineWidth = brushSize;
    ctx.stroke();
  }, [tool, color, brushSize]);

  // Start drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const point = getCoordinates(e);
    lastPointRef.current = point;
    drawLine(point, point);
  }, [getCoordinates, drawLine]);

  // Draw while moving mouse
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    
    const currentPoint = getCoordinates(e);
    if (lastPointRef.current) {
      drawLine(lastPointRef.current, currentPoint);
    }
    lastPointRef.current = currentPoint;
  }, [getCoordinates, drawLine]);

  // Stop drawing and save state
  const stopDrawing = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      lastPointRef.current = null;
      saveState();
    }
  }, [saveState]);

  // Clear entire canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, [saveState]);

  // Undo last action
  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndexRef.current - 1;
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (ctx && canvas) {
        ctx.putImageData(historyRef.current[newIndex], 0, 0);
        historyIndexRef.current = newIndex;
      }
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 100);
    }
  }, []);

  // Redo last undone action
  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      const newIndex = historyIndexRef.current + 1;
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (ctx && canvas) {
        ctx.putImageData(historyRef.current[newIndex], 0, 0);
        historyIndexRef.current = newIndex;
      }
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 100);
    }
  }, []);

  // Export as PNG
  const exportAsPNG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  }, []);

  // Expose methods globally for toolbar access
  useEffect(() => {
    (window as any).whiteboard = {
      clear: clearCanvas,
      undo,
      redo,
      export: exportAsPNG,
    };
  }, [clearCanvas, undo, redo, exportAsPNG]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="cursor-crosshair shadow-2xl"
      style={{ 
        display: 'block', 
        backgroundColor: '#ffffff',
        width: '100%',
        height: 'calc(100vh - 0px)'
      }}
    />
  );
}