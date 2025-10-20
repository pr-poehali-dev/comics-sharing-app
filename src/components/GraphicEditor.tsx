import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Tool {
  name: string;
  icon: string;
  cursor: string;
}

const GraphicEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentTool, setCurrentTool] = useState<string>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(100);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [layers, setLayers] = useState([{ id: 1, name: 'Слой 1', visible: true, opacity: 100 }]);
  const [activeLayer, setActiveLayer] = useState(1);

  const tools: Tool[] = [
    { name: 'brush', icon: 'Paintbrush', cursor: 'crosshair' },
    { name: 'pencil', icon: 'Pencil', cursor: 'crosshair' },
    { name: 'eraser', icon: 'Eraser', cursor: 'crosshair' },
    { name: 'bucket', icon: 'PaintBucket', cursor: 'pointer' },
    { name: 'line', icon: 'Minus', cursor: 'crosshair' },
    { name: 'rectangle', icon: 'Square', cursor: 'crosshair' },
    { name: 'circle', icon: 'Circle', cursor: 'crosshair' },
    { name: 'text', icon: 'Type', cursor: 'text' },
    { name: 'eyedropper', icon: 'Pipette', cursor: 'crosshair' }
  ];

  const presetColors = [
    '#000000', '#FFFFFF', '#8B0000', '#FF0000', '#FF6B6B',
    '#FFA500', '#FFD700', '#00FF00', '#00CED1', '#0000FF',
    '#800080', '#FF69B4', '#8B4513', '#808080', '#C0C0C0'
  ];

  const brushPresets = [
    { name: 'Тонкая', size: 2, icon: 'Minus' },
    { name: 'Средняя', size: 5, icon: 'Minus' },
    { name: 'Толстая', size: 10, icon: 'Minus' },
    { name: 'Жирная', size: 20, icon: 'Minus' },
    { name: 'Огромная', size: 40, icon: 'Minus' }
  ];

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
  }, [currentTool]);

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0 && context && canvasRef.current) {
      const newStep = historyStep - 1;
      context.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1 && context && canvasRef.current) {
      const newStep = historyStep + 1;
      context.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

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
      toast.success(`Цвет выбран: ${pickedColor}`);
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

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.fillStyle = '#1A1A1A';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      saveToHistory(context);
      toast.success('Холст очищен');
    }
  };

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `comic-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
      toast.success('Работа сохранена!');
    }
  };

  const addLayer = () => {
    const newLayer = {
      id: layers.length + 1,
      name: `Слой ${layers.length + 1}`,
      visible: true,
      opacity: 100
    };
    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
    toast.success('Новый слой создан');
  };

  const deleteLayer = (id: number) => {
    if (layers.length === 1) {
      toast.error('Нельзя удалить последний слой');
      return;
    }
    setLayers(layers.filter(l => l.id !== id));
    if (activeLayer === id) {
      setActiveLayer(layers[0].id);
    }
    toast.success('Слой удалён');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 h-[calc(100vh-200px)]">
      <Card className="p-4 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Icon name="Hammer" size={20} className="text-primary" />
          Инструменты
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant={currentTool === tool.name ? 'default' : 'outline'}
              className={`h-12 ${currentTool === tool.name ? 'bg-primary' : ''}`}
              onClick={() => setCurrentTool(tool.name)}
              title={tool.name}
            >
              <Icon name={tool.icon as any} size={20} />
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Размер кисти: {brushSize}px</label>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              min={1}
              max={50}
              step={1}
              className="mb-2"
            />
            <div className="grid grid-cols-5 gap-1">
              {brushPresets.map((preset) => (
                <Button
                  key={preset.size}
                  variant="outline"
                  size="sm"
                  onClick={() => setBrushSize(preset.size)}
                  className="text-xs p-1"
                >
                  {preset.size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Прозрачность: {opacity}%</label>
            <Slider
              value={[opacity]}
              onValueChange={(value) => setOpacity(value[0])}
              min={1}
              max={100}
              step={1}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Цвет</label>
            <div className="flex gap-2 mb-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
              <Badge variant="outline" className="px-3">{color}</Badge>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => setColor(presetColor)}
                  className={`w-full h-8 rounded border-2 transition-all hover:scale-110 ${
                    color === presetColor ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <Button onClick={undo} disabled={historyStep <= 0} className="w-full" variant="outline">
            <Icon name="Undo" size={16} className="mr-2" />
            Отменить
          </Button>
          <Button onClick={redo} disabled={historyStep >= history.length - 1} className="w-full" variant="outline">
            <Icon name="Redo" size={16} className="mr-2" />
            Вернуть
          </Button>
          <Button onClick={clearCanvas} className="w-full" variant="outline">
            <Icon name="Trash2" size={16} className="mr-2" />
            Очистить
          </Button>
        </div>
      </Card>

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
            {currentTool === 'brush' && 'Кисть'}
            {currentTool === 'pencil' && 'Карандаш'}
            {currentTool === 'eraser' && 'Ластик'}
            {currentTool === 'bucket' && 'Заливка'}
            {currentTool === 'eyedropper' && 'Пипетка'}
            {currentTool === 'line' && 'Линия'}
            {currentTool === 'rectangle' && 'Прямоугольник'}
            {currentTool === 'circle' && 'Круг'}
            {currentTool === 'text' && 'Текст'}
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

      <Card className="p-4 overflow-y-auto">
        <Tabs defaultValue="layers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="layers">Слои</TabsTrigger>
            <TabsTrigger value="effects">Эффекты</TabsTrigger>
          </TabsList>

          <TabsContent value="layers" className="space-y-2">
            <Button onClick={addLayer} className="w-full mb-3" variant="outline">
              <Icon name="Plus" size={16} className="mr-2" />
              Новый слой
            </Button>

            {layers.map((layer) => (
              <Card
                key={layer.id}
                className={`p-3 cursor-pointer transition-all ${
                  activeLayer === layer.id ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => setActiveLayer(layer.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Layers" size={16} />
                    <span className="font-medium text-sm">{layer.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newLayers = layers.map(l =>
                          l.id === layer.id ? { ...l, visible: !l.visible } : l
                        );
                        setLayers(newLayers);
                      }}
                    >
                      <Icon name={layer.visible ? 'Eye' : 'EyeOff'} size={14} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[layer.opacity]}
                  onValueChange={(value) => {
                    const newLayers = layers.map(l =>
                      l.id === layer.id ? { ...l, opacity: value[0] } : l
                    );
                    setLayers(newLayers);
                  }}
                  min={0}
                  max={100}
                  step={1}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-xs text-muted-foreground">Прозрачность: {layer.opacity}%</span>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="effects" className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Размытие
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon name="Contrast" size={16} className="mr-2" />
              Контраст
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon name="Sun" size={16} className="mr-2" />
              Яркость
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon name="Droplet" size={16} className="mr-2" />
              Насыщенность
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Icon name="Palette" size={16} className="mr-2" />
              Фильтры
            </Button>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Размытие</label>
                <Slider defaultValue={[0]} min={0} max={100} step={1} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Яркость</label>
                <Slider defaultValue={[50]} min={0} max={100} step={1} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Контраст</label>
                <Slider defaultValue={[50]} min={0} max={100} step={1} />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Быстрые фильтры</p>
              <Button className="w-full justify-start" variant="outline" size="sm">
                🎨 Сепия
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                ⚫ Ч/Б
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                🌈 Инверсия
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                ✨ Виньетка
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="space-y-2">
          <p className="text-sm font-medium mb-2">Редкие кисти 💎</p>
          <Button className="w-full justify-start" variant="outline" disabled>
            <Icon name="Sparkles" size={16} className="mr-2" />
            Акварель <Badge className="ml-auto bg-primary">500 💰</Badge>
          </Button>
          <Button className="w-full justify-start" variant="outline" disabled>
            <Icon name="Sparkles" size={16} className="mr-2" />
            Аэрограф <Badge className="ml-auto bg-primary">750 💰</Badge>
          </Button>
          <Button className="w-full justify-start" variant="outline" disabled>
            <Icon name="Sparkles" size={16} className="mr-2" />
            Маркер <Badge className="ml-auto bg-primary">300 💰</Badge>
          </Button>
          <Button className="w-full justify-start" variant="outline" disabled>
            <Icon name="Sparkles" size={16} className="mr-2" />
            Масло <Badge className="ml-auto bg-primary">1000 💰</Badge>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Зарабатывайте коины за активность и покупайте редкие кисти!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GraphicEditor;
