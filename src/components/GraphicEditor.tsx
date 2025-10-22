import { useState } from 'react';
import { toast } from 'sonner';
import ToolsPanel from './editor/ToolsPanel';
import ImprovedCanvasArea from './editor/ImprovedCanvasArea';
import LayersPanel from './editor/LayersPanel';

interface Tool {
  name: string;
  icon: string;
  cursor: string;
}

const GraphicEditor = () => {
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
    { name: 'triangle', icon: 'Triangle', cursor: 'crosshair' },
    { name: 'text', icon: 'Type', cursor: 'text' },
    { name: 'eyedropper', icon: 'Pipette', cursor: 'crosshair' }
  ];

  const saveToHistory = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    if (!canvas) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0 && context) {
      const newStep = historyStep - 1;
      context.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1 && context) {
      const newStep = historyStep + 1;
      context.putImageData(history[newStep], 0, 0);
      setHistoryStep(newStep);
    }
  };

  const clearCanvas = () => {
    if (context) {
      context.fillStyle = '#1A1A1A';
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
      saveToHistory(context);
      toast.success('Холст очищен');
    }
  };

  const downloadImage = () => {
    if (context) {
      const link = document.createElement('a');
      link.download = `comic-${Date.now()}.png`;
      link.href = context.canvas.toDataURL();
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
      <ToolsPanel
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        opacity={opacity}
        setOpacity={setOpacity}
        color={color}
        setColor={setColor}
        undo={undo}
        redo={redo}
        clearCanvas={clearCanvas}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
      />

      <ImprovedCanvasArea
        currentTool={currentTool}
        brushSize={brushSize}
        color={color}
        opacity={opacity}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        context={context}
        setContext={setContext}
        saveToHistory={saveToHistory}
        setColor={setColor}
        downloadImage={downloadImage}
        tools={tools}
      />

      <LayersPanel
        layers={layers}
        setLayers={setLayers}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        addLayer={addLayer}
        deleteLayer={deleteLayer}
      />
    </div>
  );
};

export default GraphicEditor;