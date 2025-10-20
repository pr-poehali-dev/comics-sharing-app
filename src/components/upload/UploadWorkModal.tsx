import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface UploadWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (work: any) => void;
}

const UploadWorkModal = ({ isOpen, onClose, onUpload }: UploadWorkModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [pages, setPages] = useState<File[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');

  const genres = [
    'Киберпанк', 'Фэнтези', 'Sci-Fi', 'Детектив', 
    'Мистика', 'Романтика', 'Приключения', 'Драма',
    'Комедия', 'Хоррор', 'Боевик', 'Повседневность'
  ];

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB');
        return;
      }
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Файл ${file.name} слишком большой (макс. 10MB)`);
        return false;
      }
      return true;
    });

    setPages([...pages, ...validFiles]);
    toast.success(`Добавлено ${validFiles.length} страниц`);
  };

  const removePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !genre) {
      toast.error('Заполните обязательные поля');
      return;
    }

    if (!coverImage) {
      toast.error('Загрузите обложку');
      return;
    }

    if (pages.length === 0) {
      toast.error('Загрузите хотя бы одну страницу');
      return;
    }

    if (isPremium && (!price || parseFloat(price) < 1)) {
      toast.error('Укажите корректную цену');
      return;
    }

    const newWork = {
      id: Date.now(),
      title,
      description,
      genre,
      cover: coverPreview,
      pages: pages.length,
      isPremium,
      price: isPremium ? parseFloat(price) : 0,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    onUpload(newWork);
    toast.success('Работа успешно загружена!');
    
    setTitle('');
    setDescription('');
    setGenre('');
    setCoverImage(null);
    setCoverPreview('');
    setPages([]);
    setIsPremium(false);
    setPrice('');
    setTags('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-primary" />
            Загрузить новую работу
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название работы *</Label>
            <Input
              id="title"
              placeholder="Введите название вашего комикса"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              placeholder="Расскажите о вашей работе..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genre">Жанр *</Label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Теги (через запятую)</Label>
              <Input
                id="tags"
                placeholder="аниме, приключения, герои"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Обложка *</Label>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Рекомендуемый размер: 400x600px, макс. 5MB
                </p>
              </div>
              {coverPreview && (
                <img 
                  src={coverPreview} 
                  alt="Preview" 
                  className="w-20 h-28 object-cover rounded border-2 border-border"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pages">Страницы комикса *</Label>
            <Input
              id="pages"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePagesChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Загрузите страницы в правильном порядке. Макс. 10MB на файл
            </p>
            
            {pages.length > 0 && (
              <div className="mt-3 p-3 border border-border rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Загружено страниц: {pages.length}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {pages.map((page, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-[2/3] bg-secondary rounded flex items-center justify-center text-xs">
                        Стр. {index + 1}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePage(index)}
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg p-4 space-y-4 bg-secondary/30">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="premium" className="text-base">Премиум контент</Label>
                <p className="text-xs text-muted-foreground">
                  Установите цену для доступа к работе
                </p>
              </div>
              <Switch
                id="premium"
                checked={isPremium}
                onCheckedChange={setIsPremium}
              />
            </div>

            {isPremium && (
              <div className="space-y-2">
                <Label htmlFor="price">Цена в рублях</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  placeholder="99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  С каждой продажи платформа удерживает 15%
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              <Icon name="Upload" size={16} className="mr-2" />
              Опубликовать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadWorkModal;
