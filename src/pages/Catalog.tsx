import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface CatalogProps {
  theme: string;
  user: any;
  onToggleTheme: () => void;
  onShowAuth: () => void;
  onShowEditor: () => void;
  onShowUpload: () => void;
  onShowProfile: () => void;
  onBack: () => void;
}

const Catalog = ({ theme, user, onToggleTheme, onShowAuth, onShowEditor, onShowUpload, onShowProfile, onBack }: CatalogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');

  const genres = [
    'Все жанры', 'Киберпанк', 'Фэнтези', 'Sci-Fi', 'Детектив', 
    'Мистика', 'Романтика', 'Приключения', 'Драма', 'Комедия', 'Хоррор'
  ];

  const allComics = [
    {
      id: 1,
      title: 'Тени Москвы',
      author: 'Анна Волкова',
      genre: 'Киберпанк',
      rating: 4.9,
      chapters: 45,
      likes: 15420,
      views: 234500,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
      description: 'Киберпанк-детектив о хакере из Москвы 2077 года'
    },
    {
      id: 2,
      title: 'Последний Богатырь',
      author: 'Дмитрий Соколов',
      genre: 'Фэнтези',
      rating: 4.8,
      chapters: 32,
      likes: 12890,
      views: 198300,
      isPremium: true,
      price: 299,
      cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
      description: 'Последний защитник древней Руси против тёмных сил'
    },
    {
      id: 3,
      title: 'Космические Странники',
      author: 'Елена Звездная',
      genre: 'Sci-Fi',
      rating: 4.7,
      chapters: 28,
      likes: 10234,
      views: 156700,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop',
      description: 'Приключения экипажа межгалактического корабля'
    },
    {
      id: 4,
      title: 'Легенды Байкала',
      author: 'Иван Кедров',
      genre: 'Приключения',
      rating: 4.9,
      chapters: 51,
      likes: 18750,
      views: 287900,
      isPremium: true,
      price: 199,
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      description: 'Мистические истории о духах великого озера'
    },
    {
      id: 5,
      title: 'Неоновый Петербург',
      author: 'Мария Свет',
      genre: 'Детектив',
      rating: 4.6,
      chapters: 24,
      likes: 9870,
      views: 145600,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop',
      description: 'Детективное расследование в футуристическом Питере'
    },
    {
      id: 6,
      title: 'Духи Сибири',
      author: 'Олег Тайга',
      genre: 'Мистика',
      rating: 4.8,
      chapters: 38,
      likes: 14320,
      views: 213400,
      isPremium: true,
      price: 349,
      cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop',
      description: 'Шаманские тайны бескрайней тайги'
    },
    {
      id: 7,
      title: 'Академия Магов',
      author: 'Софья Луна',
      genre: 'Фэнтези',
      rating: 4.7,
      chapters: 42,
      likes: 16540,
      views: 203400,
      isPremium: true,
      price: 249,
      cover: 'https://images.unsplash.com/photo-1518051870910-a46e30d9db16?w=400&h=600&fit=crop',
      description: 'Обучение магии в секретной академии России'
    },
    {
      id: 8,
      title: 'Метро 2177',
      author: 'Виктор Глубин',
      genre: 'Sci-Fi',
      rating: 4.9,
      chapters: 55,
      likes: 22150,
      views: 345600,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=400&h=600&fit=crop',
      description: 'Жизнь в подземелье после апокалипсиса'
    }
  ];

  const filteredComics = allComics
    .filter(comic => {
      const matchesSearch = comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comic.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || comic.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'popular':
          return b.views - a.views;
        case 'rating':
          return b.rating - a.rating;
        case 'new':
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      <Header
        theme={theme}
        user={user}
        onToggleTheme={onToggleTheme}
        onShowAuth={onShowAuth}
        onShowEditor={onShowEditor}
        onShowUpload={onShowUpload}
        onShowProfile={onShowProfile}
      />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад на главную
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Каталог комиксов</h1>
          <p className="text-muted-foreground">Более 10,000 работ от талантливых авторов</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или автору..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Жанр" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все жанры</SelectItem>
              {genres.slice(1).map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger>
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Популярные</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
              <SelectItem value="new">Новинки</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredComics.map(comic => (
            <Card key={comic.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover-scale group">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {comic.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-accent">
                    <Icon name="Crown" size={14} className="mr-1" />
                    Premium
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm">{comic.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1 line-clamp-1">{comic.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{comic.author}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                    {comic.rating}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="Eye" size={14} />
                    {(comic.views / 1000).toFixed(0)}K
                  </span>
                  <Badge variant="outline">{comic.genre}</Badge>
                </div>
                <Button className="w-full" variant={comic.isPremium ? "default" : "outline"}>
                  {comic.isPremium ? `${comic.price} ₽` : 'Читать'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredComics.length === 0 && (
          <div className="text-center py-20">
            <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
