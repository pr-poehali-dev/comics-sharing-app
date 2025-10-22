import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ImprovedCanvasAreaProps {
  currentTool: string;
  brushSize: number;
  color: string;
  opacity: number;
  isDrawing: boolean;
  setIsDrawing: (value: boolean) => void;
  context: CanvasRenderingContext2D | null;
  setContext: (ctx: CanvasRenderingContext2D | null) => void;
  saveToHistory: (ctx: CanvasRenderingContext2D) => void;
  setColor: (color: string) => void;
  downloadImage: () => void;
  tools: Array<{ name: string; icon: string; cursor: string }>;
}

const ImprovedCanvasArea = ({
  currentTool,
  brushSize,
  color,
  opacity,
  isDrawing,
  setIsDrawing,
  context,
  setContext,
  saveToHistory,
  setColor,
  downloadImage,
  tools
}: ImprovedCanvasAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [tempCanvas, setTempCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
        saveToHistory(ctx);
      }

      const temp = document.createElement('canvas');
      temp.width = canvas.width;
      temp.height = canvas.height;
      setTempCanvas(temp);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      const tool = tools.find(t => t.name === currentTool);
      canvas.style.cursor = tool?.cursor || 'default';
    }
  }, [currentTool, context, tools]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;
    
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setStartPos(coords);
    setLastPos(coords);
    
    context.globalAlpha = opacity / 100;
    context.strokeStyle = currentTool === 'eraser' ? '#1A1A1A' : color;
    context.fillStyle = currentTool === 'eraser' ? '#1A1A1A' : color;
    context.lineWidth = brushSize;

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      context.beginPath();
      context.moveTo(coords.x, coords.y);
    } else if (currentTool === 'eyedropper') {
      const pixel = context.getImageData(coords.x, coords.y, 1, 1).data;
      const pickedColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setColor(pickedColor);
      setIsDrawing(false);
    } else if (currentTool === 'bucket') {
      floodFill(coords.x, coords.y);
      saveToHistory(context);
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current || !startPos) return;
    
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    if (currentTool === 'brush') {
      if (lastPos) {
        const distance = Math.sqrt(Math.pow(coords.x - lastPos.x, 2) + Math.pow(coords.y - lastPos.y, 2));
        const steps = Math.max(1, Math.floor(distance / 2));
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = lastPos.x + (coords.x - lastPos.x) * t;
          const y = lastPos.y + (coords.y - lastPos.y) * t;
          
          context.beginPath();
          context.arc(x, y, brushSize / 2, 0, Math.PI * 2);
          context.fill();
        }
      }
      setLastPos(coords);
    } else if (currentTool === 'pencil' || currentTool === 'eraser') {
      context.lineTo(coords.x, coords.y);
      context.stroke();
      setLastPos(coords);
    } else if (currentTool === 'line' || currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'triangle') {
      drawShapePreview(coords);
    }
  };

  const drawShapePreview = (endPos: { x: number; y: number }) => {
    if (!context || !startPos || !tempCanvas) return;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(context.canvas, 0, 0);

    tempCtx.strokeStyle = color;
    tempCtx.fillStyle = color;
    tempCtx.lineWidth = brushSize;
    tempCtx.globalAlpha = opacity / 100;
    tempCtx.lineCap = 'round';
    tempCtx.lineJoin = 'round';

    if (currentTool === 'line') {
      tempCtx.beginPath();
      tempCtx.moveTo(startPos.x, startPos.y);
      tempCtx.lineTo(endPos.x, endPos.y);
      tempCtx.stroke();
    } else if (currentTool === 'rectangle') {
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      tempCtx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
      );
      tempCtx.beginPath();
      tempCtx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      tempCtx.stroke();
    } else if (currentTool === 'triangle') {
      const width = endPos.x - startPos.x;
      const height = endPos.y - startPos.y;
      tempCtx.beginPath();
      tempCtx.moveTo(startPos.x + width / 2, startPos.y);
      tempCtx.lineTo(endPos.x, endPos.y);
      tempCtx.lineTo(startPos.x, endPos.y);
      tempCtx.closePath();
      tempCtx.stroke();
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.drawImage(tempCanvas, 0, 0);
  };

  const floodFill = (startX: number, startY: number) => {
    if (!context) return;
    
    const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
    const pixels = imageData.data;
    const targetColor = getPixelColor(pixels, startX, startY, imageData.width);
    const fillColorRgb = hexToRgb(color);
    
    if (!fillColorRgb || colorsMatch(targetColor, fillColorRgb)) return;
    
    const stack: Array<[number, number]> = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const pos = stack.pop();
      if (!pos) continue;
      
      const [x, y] = pos;
      const key = `${x},${y}`;
      
      if (visited.has(key) || x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
        continue;
      }
      
      visited.add(key);
      const currentColor = getPixelColor(pixels, x, y, imageData.width);
      
      if (colorsMatch(currentColor, targetColor)) {
        setPixelColor(pixels, x, y, imageData.width, fillColorRgb);
        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (Math.floor(y) * width + Math.floor(x)) * 4;
    return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
  };

  const setPixelColor = (pixels: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const index = (y * width + x) * 4;
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = 255;
  };

  const colorsMatch = (a: number[], b: number[]) => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  };

  const hexToRgb = (hex: string): number[] | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
      255
    ] : null;
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
        context.closePath();
      }
      if (currentTool !== 'eyedropper' && currentTool !== 'bucket') {
        saveToHistory(context);
      }
    }
    setIsDrawing(false);
    setStartPos(null);
    setLastPos(null);
  };

  const getToolName = () => {
    const names: Record<string, string> = {
      brush: 'Кисть',
      pencil: 'Карандаш',
      eraser: 'Ластик',
      bucket: 'Заливка',
      eyedropper: 'Пипетка',
      line: 'Линия',
      rectangle: 'Прямоугольник',
      circle: 'Круг',
      triangle: 'Треугольник',
      text: 'Текст'
    };
    return names[currentTool] || 'Инструмент';
  };

  return (
    <Card className="p-4 flex flex-col items-center justify-center bg-secondary/30">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          className="border-2 border-border rounded-lg shadow-2xl touch-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur">
          {getToolName()}
        </Badge>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={downloadImage} className="bg-primary hover:bg-primary/90">
          <Icon name="Download" size={16} className="mr-2" />
          Сохранить работу
        </Button>
        <Button variant="outline">
          <Icon name="Upload" size={16} className="mr-2" />
          Опубликовать
        </Button>
      </div>
    </Card>
  );
};

export default ImprovedCanvasArea;
