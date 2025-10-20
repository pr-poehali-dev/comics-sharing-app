import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import GraphicEditor from '@/components/GraphicEditor';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/profile/UserProfile';
import UploadWorkModal from '@/components/upload/UploadWorkModal';
import PurchaseModal from '@/components/monetization/PurchaseModal';

const Index = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showEditor, setShowEditor] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('comicverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('comicverse_user');
    setUser(null);
    setShowProfile(false);
  };

  const handlePurchase = (workId: number, price: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: user.balance - price
      };
      setUser(updatedUser);
      localStorage.setItem('comicverse_user', JSON.stringify(updatedUser));
    }
  };

  const handleUploadWork = (work: any) => {
    console.log('New work uploaded:', work);
  };

  const handleReadClick = (comic: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (comic.isPremium) {
      setSelectedWork(comic);
      setShowPurchaseModal(true);
    } else {
      console.log('Reading free comic:', comic.title);
    }
  };

  const featuredComics = [
    {
      id: 1,
      title: 'Тени Москвы',
      author: 'Анна Волкова',
      genre: 'Киберпанк',
      rating: 4.9,
      likes: 15420,
      views: 234500,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Последний Богатырь',
      author: 'Дмитрий Соколов',
      genre: 'Фэнтези',
      rating: 4.8,
      likes: 12890,
      views: 198300,
      isPremium: true,
      price: 299,
      cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Космические Странники',
      author: 'Елена Звездная',
      genre: 'Sci-Fi',
      rating: 4.7,
      likes: 10234,
      views: 156700,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Легенды Байкала',
      author: 'Иван Кедров',
      genre: 'Приключения',
      rating: 4.9,
      likes: 18750,
      views: 287900,
      isPremium: true,
      price: 199,
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Неоновый Петербург',
      author: 'Мария Свет',
      genre: 'Детектив',
      rating: 4.6,
      likes: 9870,
      views: 145600,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Духи Сибири',
      author: 'Олег Тайга',
      genre: 'Мистика',
      rating: 4.8,
      likes: 14320,
      views: 213400,
      isPremium: true,
      price: 349,
      cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop'
    }
  ];

  const topAuthors = [
    { name: 'Анна Волкова', works: 24, followers: 45200, avatar: 'АВ' },
    { name: 'Дмитрий Соколов', works: 18, followers: 38900, avatar: 'ДС' },
    { name: 'Елена Звездная', works: 31, followers: 52100, avatar: 'ЕЗ' },
    { name: 'Иван Кедров', works: 15, followers: 41300, avatar: 'ИК' }
  ];

  if (showProfile && user) {
    return <UserProfile user={user} onClose={() => setShowProfile(false)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ComicVerse
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Каталог</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Топы</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Авторы</a>
            <button onClick={() => {
              if (!user) {
                setShowAuthModal(true);
              } else {
                setShowEditor(true);
              }
            }} className="text-sm font-medium hover:text-primary transition-colors">Редактор</button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-scale"
            >
              <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
            </Button>
            
            {user ? (
              <>
                <Button variant="outline" className="hidden md:flex" onClick={() => setShowUploadModal(true)}>
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузить
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowProfile(true)}
                  className="relative"
                >
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                </Button>
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">Баланс</span>
                  <span className="text-sm font-bold text-primary">{user.balance}₽</span>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" className="hidden md:flex" onClick={() => setShowAuthModal(true)}>
                  Войти
                </Button>
                <Button onClick={() => setShowAuthModal(true)} className="bg-primary hover:bg-primary/90">
                  Создать
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
              Платформа №1 для авторов комиксов в СНГ
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Создавай, публикуй,<br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                зарабатывай
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Первая платформа с полной защитой авторских прав, встроенным редактором и честной монетизацией для художников из России и СНГ
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={() => user ? setShowEditor(true) : setShowAuthModal(true)}>
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать создавать
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Icon name="Play" size={20} className="mr-2" />
                Смотреть демо
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">12K+</div>
                <div className="text-sm text-muted-foreground mt-1">Авторов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground mt-1">Работ</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">2M+</div>
                <div className="text-sm text-muted-foreground mt-1">Читателей</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-3">Популярное сейчас</h2>
              <p className="text-muted-foreground">Лучшие работы этой недели</p>
            </div>
            <Button variant="outline" className="hover-scale">
              Смотреть все
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredComics.map((comic, index) => (
              <Card 
                key={comic.id} 
                className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img 
                    src={comic.cover} 
                    alt={comic.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {comic.isPremium && (
                    <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur">
                      <Icon name="Crown" size={14} className="mr-1" />
                      {comic.price}₽
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {comic.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{comic.author}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">{comic.genre}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{comic.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Heart" size={16} className="text-primary" />
                      <span>{(comic.likes / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={16} />
                      <span>{(comic.views / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => handleReadClick(comic)}
                  >
                    <Icon name="BookOpen" size={16} className="mr-2" />
                    {comic.isPremium ? `Купить ${comic.price}₽` : 'Читать бесплатно'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="authors" className="w-full">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold">Топы недели</h2>
              <TabsList className="bg-secondary">
                <TabsTrigger value="authors">Авторы</TabsTrigger>
                <TabsTrigger value="genres">По жанрам</TabsTrigger>
                <TabsTrigger value="new">Новинки</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="authors" className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topAuthors.map((author, index) => (
                  <Card key={index} className="p-6 border-border/50 hover:border-primary/50 transition-all hover-scale">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-muted-foreground/30 w-8">
                        #{index + 1}
                      </div>
                      <Avatar className="w-16 h-16 border-2 border-primary">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{author.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Icon name="BookOpen" size={14} />
                            {author.works} работ
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Users" size={14} />
                            {(author.followers / 1000).toFixed(1)}K
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Подписаться
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="genres" className="animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Киберпанк', 'Фэнтези', 'Sci-Fi', 'Детектив', 'Мистика', 'Романтика', 'Приключения', 'Драма'].map((genre) => (
                  <Card key={genre} className="p-6 text-center hover:border-primary/50 transition-all hover-scale cursor-pointer">
                    <h3 className="font-bold text-lg mb-2">{genre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 500 + 100)} работ
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredComics.slice(0, 3).map((comic) => (
                  <Card key={comic.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover-scale">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{comic.title}</h3>
                      <p className="text-sm text-muted-foreground">{comic.author}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Почему ComicVerse?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Единственная платформа с полной защитой и справедливой монетизацией
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'Shield', title: 'Защита авторских прав', desc: 'Водяные знаки, защита от скриншотов и проверка на плагиат' },
              { icon: 'Paintbrush', title: 'Встроенный редактор', desc: 'Создавайте комиксы прямо в приложении с профессиональными инструментами' },
              { icon: 'Wallet', title: 'Честная монетизация', desc: 'Выводите деньги на карты РФ и СНГ, устанавливайте цены сами' },
              { icon: 'Wifi', title: 'Оффлайн режим', desc: 'Читайте и создавайте даже без интернета' }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 text-center border-border/50 hover:border-primary/50 transition-all hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature.icon as any} size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-primary/50">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
            <div className="relative z-10 p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Готов начать свою историю?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Присоединяйся к 12,000+ авторов, которые уже создают и зарабатывают на ComicVerse
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={() => setShowAuthModal(true)}>
                  <Icon name="Pencil" size={20} className="mr-2" />
                  Создать аккаунт
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Задать вопрос
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border/40 py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="BookOpen" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">ComicVerse</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Платформа для создания и монетизации комиксов и манги
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Платформа</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Каталог</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Редактор</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Авторы</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Цены</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Сообщество</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Социальные сети</h4>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="hover-scale">
                  <Icon name="Send" size={18} />
                </Button>
                <Button variant="outline" size="icon" className="hover-scale">
                  <Icon name="MessageCircle" size={18} />
                </Button>
                <Button variant="outline" size="icon" className="hover-scale">
                  <Icon name="Github" size={18} />
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2024 ComicVerse. Все права защищены. Платформа для СНГ с любовью ❤️</p>
          </div>
        </div>
      </footer>

      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-[98vw] h-[95vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Paintbrush" size={24} className="text-primary" />
              Графический редактор ComicVerse
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 h-full overflow-hidden">
            <GraphicEditor />
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <UploadWorkModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadWork}
      />

      {selectedWork && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedWork(null);
          }}
          work={selectedWork}
          userBalance={user?.balance || 0}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default Index;
