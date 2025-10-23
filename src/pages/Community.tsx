import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface CommunityProps {
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

const Community = ({ theme, user, onToggleTheme, onShowAuth, onShowEditor, onShowUpload, onShowProfile, onBack, viewMode, onToggleViewMode }: CommunityProps) => {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const discussions = [
    {
      id: 1,
      author: 'Анна Волкова',
      avatar: 'АВ',
      time: '2 часа назад',
      title: 'Как правильно монетизировать свой первый комикс?',
      content: 'Привет всем! Только что закончила свой первый комикс на 50 страниц. Подскажите, как лучше организовать продажу - всё сразу или по главам? И какую цену ставить?',
      likes: 24,
      comments: 18,
      category: 'Монетизация'
    },
    {
      id: 2,
      author: 'Дмитрий Соколов',
      avatar: 'ДС',
      time: '5 часов назад',
      title: 'Рекомендую программу для раскадровки',
      content: 'Ребят, нашёл отличную бесплатную прогу для планирования кадров. Называется Storyboarder. Очень помогает перед тем как садиться за финальный арт.',
      likes: 42,
      comments: 31,
      category: 'Инструменты'
    },
    {
      id: 3,
      author: 'Мария Свет',
      avatar: 'МС',
      time: '1 день назад',
      title: 'Где искать бета-ридеров для манги?',
      content: 'Закончила первую главу своей манги в стиле сёдзё. Хочу получить обратную связь перед публикацией. Есть ли в сообществе желающие стать бета-ридерами?',
      likes: 15,
      comments: 23,
      category: 'Помощь'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Конкурс "Киберпанк 2077"',
      date: '15-30 ноября',
      description: 'Создайте комикс в жанре киберпанк и выиграйте 50,000₽',
      participants: 127,
      prize: '50,000₽'
    },
    {
      id: 2,
      title: 'Вебинар: Монетизация комиксов',
      date: '22 ноября, 19:00',
      description: 'Эксперты индустрии поделятся секретами успешных продаж',
      participants: 234,
      prize: null
    },
    {
      id: 3,
      title: 'Челлендж "30 дней рисования"',
      date: '1-30 декабря',
      description: 'Ежедневные задания для прокачки навыков',
      participants: 456,
      prize: null
    }
  ];

  const tips = [
    {
      author: 'Олег Тайга',
      avatar: 'ОТ',
      tip: 'Всегда делайте эскизы на бумаге перед работой в редакторе. Это экономит массу времени!',
      likes: 89
    },
    {
      author: 'Софья Луна',
      avatar: 'СЛ',
      tip: 'Используйте правило третей для композиции кадров. Главные элементы на пересечении линий.',
      likes: 156
    },
    {
      author: 'Виктор Глубин',
      avatar: 'ВГ',
      tip: 'Не бойтесь экспериментировать с размером панелей - это создаёт динамику!',
      likes: 203
    }
  ];

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

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
          <h1 className="text-4xl font-bold mb-2">Сообщество</h1>
          <p className="text-muted-foreground">12,000+ авторов и читателей обмениваются опытом</p>
        </div>

        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="discussions">Обсуждения</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
            <TabsTrigger value="tips">Советы</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-6">
            {user && (
              <Card className="p-6 border-border/50">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Поделитесь своими мыслями с сообществом..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3"
                      rows={3}
                    />
                    <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
                      <Icon name="Send" size={16} className="mr-2" />
                      Опубликовать
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {discussions.map(post => (
              <Card key={post.id} className="p-6 border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{post.author}</span>
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground">{post.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-16 text-sm text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleLike(post.id)}
                    className={likedPosts.includes(post.id) ? 'text-primary' : ''}
                  >
                    <Icon 
                      name="Heart" 
                      size={16} 
                      className={`mr-2 ${likedPosts.includes(post.id) ? 'fill-primary' : ''}`} 
                    />
                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    {post.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="Share2" size={16} className="mr-2" />
                    Поделиться
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {events.map(event => (
              <Card key={event.id} className="p-6 border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      {event.prize && (
                        <Badge className="bg-accent">
                          <Icon name="Trophy" size={14} className="mr-1" />
                          {event.prize}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Users" size={16} />
                        {event.participants} участников
                      </span>
                    </div>
                  </div>
                  <Button>
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Участвовать
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            {tips.map((tip, index) => (
              <Card key={index} className="p-6 border-border/50 hover:border-primary/50 transition-all">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {tip.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold">{tip.author}</span>
                      <Badge variant="secondary">
                        <Icon name="Lightbulb" size={12} className="mr-1" />
                        Совет
                      </Badge>
                    </div>
                    <p className="text-lg mb-3">{tip.tip}</p>
                    <Button variant="ghost" size="sm">
                      <Icon name="Heart" size={16} className="mr-2" />
                      {tip.likes}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Community;