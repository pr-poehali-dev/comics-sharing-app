import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Layer {
  id: number;
  name: string;
  visible: boolean;
  opacity: number;
}

interface LayersPanelProps {
  layers: Layer[];
  setLayers: (layers: Layer[]) => void;
  activeLayer: number;
  setActiveLayer: (id: number) => void;
  addLayer: () => void;
  deleteLayer: (id: number) => void;
}

const LayersPanel = ({
  layers,
  setLayers,
  activeLayer,
  setActiveLayer,
  addLayer,
  deleteLayer
}: LayersPanelProps) => {
  const toggleLayerVisibility = (layerId: number) => {
    const newLayers = layers.map(l =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    );
    setLayers(newLayers);
  };

  const updateLayerOpacity = (layerId: number, opacity: number) => {
    const newLayers = layers.map(l =>
      l.id === layerId ? { ...l, opacity } : l
    );
    setLayers(newLayers);
  };

  return (
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
                      toggleLayerVisibility(layer.id);
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
                onValueChange={(value) => updateLayerOpacity(layer.id, value[0])}
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
  );
};

export default LayersPanel;
