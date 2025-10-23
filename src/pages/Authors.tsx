import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface AuthorsProps {
  theme: string;
  user: any;
  onToggleTheme: () => void;
  onShowAuth: () => void;
  onShowEditor: () => void;
  onShowUpload: () => void;
  onShowProfile: () => void;
  onBack: () => void;
  viewMode: 'landing' | 'gallery';
  onToggleViewMode: () => void;
}

const Authors = ({ theme, user, onToggleTheme, onShowAuth, onShowEditor, onShowUpload, onShowProfile, onBack, viewMode, onToggleViewMode }: AuthorsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('followers');
  const [followedAuthors, setFollowedAuthors] = useState<number[]>([]);

  const authors = [
    {
      id: 1,
      name: 'Анна Волкова',
      avatar: 'АВ',
      bio: 'Создаю киберпанк-комиксы о будущем России. 10+ лет в индустрии.',
      works: 24,
      followers: 45200,
      totalViews: 2340000,
      genres: ['Киберпанк', 'Sci-Fi'],
      verified: true
    },
    {
      id: 2,
      name: 'Дмитрий Соколов',
      avatar: 'ДС',
      bio: 'Фэнтези на основе славянской мифологии и легенд.',
      works: 18,
      followers: 38900,
      totalViews: 1983000,
      genres: ['Фэнтези', 'Мистика'],
      verified: true
    },
    {
      id: 3,
      name: 'Елена Звездная',
      avatar: 'ЕЗ',
      bio: 'Космические приключения и межгалактические истории.',
      works: 31,
      followers: 52100,
      totalViews: 3120000,
      genres: ['Sci-Fi', 'Приключения'],
      verified: true
    },
    {
      id: 4,
      name: 'Иван Кедров',
      avatar: 'ИК',
      bio: 'Пишу о природе, приключениях и духовных поисках.',
      works: 15,
      followers: 41300,
      totalViews: 2879000,
      genres: ['Приключения', 'Мистика'],
      verified: false
    },
    {
      id: 5,
      name: 'Мария Свет',
      avatar: 'МС',
      bio: 'Детективы и триллеры с нотками футуризма.',
      works: 22,
      followers: 34500,
      totalViews: 1456000,
      genres: ['Детектив', 'Киберпанк'],
      verified: true
    },
    {
      id: 6,
      name: 'Олег Тайга',
      avatar: 'ОТ',
      bio: 'Шаманизм, мистика Сибири и древние легенды.',
      works: 19,
      followers: 29800,
      totalViews: 2134000,
      genres: ['Мистика', 'Фэнтези'],
      verified: false
    },
    {
      id: 7,
      name: 'Софья Луна',
      avatar: 'СЛ',
      bio: 'Магическое фэнтези для подростков и взрослых.',
      works: 27,
      followers: 48700,
      totalViews: 2678000,
      genres: ['Фэнтези', 'Романтика'],
      verified: true
    },
    {
      id: 8,
      name: 'Виктор Глубин',
      avatar: 'ВГ',
      bio: 'Постапокалипсис и выживание в экстремальных условиях.',
      works: 12,
      followers: 56200,
      totalViews: 3456000,
      genres: ['Sci-Fi', 'Хоррор'],
      verified: true
    }
  ];

  const toggleFollow = (authorId: number) => {
    setFollowedAuthors(prev => 
      prev.includes(authorId) 
        ? prev.filter(id => id !== authorId)
        : [...prev, authorId]
    );
  };

  const filteredAuthors = authors
    .filter(author => {
      const matchesSearch = author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          author.bio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'followers':
          return b.followers - a.followers;
        case 'works':
          return b.works - a.works;
        case 'views':
          return b.totalViews - a.totalViews;
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
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
      />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад на главную
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Авторы</h1>
          <p className="text-muted-foreground">Талантливые создатели из России и СНГ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск авторов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger>
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">По подписчикам</SelectItem>
              <SelectItem value="works">По работам</SelectItem>
              <SelectItem value="views">По просмотрам</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAuthors.map(author => (
            <Card key={author.id} className="p-6 border-border/50 hover:border-primary/50 transition-all hover-scale">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-20 h-20 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                    {author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-xl">{author.name}</h3>
                    {author.verified && (
                      <Badge variant="secondary" className="bg-primary/20">
                        <Icon name="CheckCircle" size={12} className="mr-1 text-primary" />
                        Проверен
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{author.bio}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {author.genres.map(genre => (
                  <Badge key={genre} variant="outline">{genre}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border/40">
                <div className="text-center">
                  <div className="text-2xl font-bold">{author.works}</div>
                  <div className="text-xs text-muted-foreground">работ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(author.followers / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted-foreground">подписчиков</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{(author.totalViews / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-muted-foreground">просмотров</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant={followedAuthors.includes(author.id) ? "secondary" : "default"}
                  onClick={() => toggleFollow(author.id)}
                >
                  <Icon name={followedAuthors.includes(author.id) ? "UserCheck" : "UserPlus"} size={16} className="mr-2" />
                  {followedAuthors.includes(author.id) ? 'Подписан' : 'Подписаться'}
                </Button>
                <Button variant="outline">
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  Написать
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-20">
            <Icon name="Users" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">Авторы не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Authors;