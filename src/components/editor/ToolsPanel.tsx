import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Tool {
  name: string;
  icon: string;
  cursor: string;
}

interface ToolsPanelProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  color: string;
  setColor: (color: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ToolsPanel = ({
  currentTool,
  setCurrentTool,
  brushSize,
  setBrushSize,
  opacity,
  setOpacity,
  color,
  setColor,
  undo,
  redo,
  clearCanvas,
  canUndo,
  canRedo
}: ToolsPanelProps) => {
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
    { name: 'Тонкая', size: 2 },
    { name: 'Средняя', size: 5 },
    { name: 'Толстая', size: 10 },
    { name: 'Жирная', size: 20 },
    { name: 'Огромная', size: 40 }
  ];

  return (
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
        <Button onClick={undo} disabled={!canUndo} className="w-full" variant="outline">
          <Icon name="Undo" size={16} className="mr-2" />
          Отменить
        </Button>
        <Button onClick={redo} disabled={!canRedo} className="w-full" variant="outline">
          <Icon name="Redo" size={16} className="mr-2" />
          Вернуть
        </Button>
        <Button onClick={clearCanvas} className="w-full" variant="outline">
          <Icon name="Trash2" size={16} className="mr-2" />
          Очистить
        </Button>
      </div>
    </Card>
  );
};

export default ToolsPanel;
