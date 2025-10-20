import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CanvasAreaProps {
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

const CanvasArea = ({
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
}: CanvasAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setContext(ctx);
        saveToHistory(ctx);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && context) {
      const tool = tools.find(t => t.name === currentTool);
      canvas.style.cursor = tool?.cursor || 'default';
    }
  }, [currentTool, context, tools]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    
    context.globalAlpha = opacity / 100;
    context.strokeStyle = currentTool === 'eraser' ? '#1A1A1A' : color;
    context.fillStyle = currentTool === 'eraser' ? '#1A1A1A' : color;
    context.lineWidth = brushSize;

    if (currentTool === 'brush' || currentTool === 'pencil' || currentTool === 'eraser') {
      context.beginPath();
      context.moveTo(x, y);
    } else if (currentTool === 'eyedropper') {
      const pixel = context.getImageData(x, y, 1, 1).data;
      const pickedColor = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      setColor(pickedColor);
      setIsDrawing(false);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    } else if (currentTool === 'pencil') {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && context) {
      context.closePath();
      if (currentTool !== 'eyedropper') {
        saveToHistory(context);
      }
    }
    setIsDrawing(false);
  };

  const getToolName = () => {
    switch (currentTool) {
      case 'brush': return 'Кисть';
      case 'pencil': return 'Карандаш';
      case 'eraser': return 'Ластик';
      case 'bucket': return 'Заливка';
      case 'eyedropper': return 'Пипетка';
      case 'line': return 'Линия';
      case 'rectangle': return 'Прямоугольник';
      case 'circle': return 'Круг';
      case 'text': return 'Текст';
      default: return 'Инструмент';
    }
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
          className="border-2 border-border rounded-lg shadow-2xl"
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

export default CanvasArea;
