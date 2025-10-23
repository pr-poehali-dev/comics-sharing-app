import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  theme: 'dark' | 'light';
  viewMode: 'landing' | 'gallery';
  user: any;
  onToggleTheme: () => void;
  onToggleViewMode: () => void;
  onShowAuth: () => void;
  onShowEditor: () => void;
  onShowUpload: () => void;
  onShowProfile: () => void;
  onShowAdmin?: () => void;
  onNavigate?: (page: 'home' | 'catalog' | 'authors' | 'community') => void;
}

const Header = ({
  theme,
  viewMode,
  user,
  onToggleTheme,
  onToggleViewMode,
  onShowAuth,
  onShowEditor,
  onShowUpload,
  onShowProfile,
  onShowAdmin,
  onNavigate
}: HeaderProps) => {
  const handleEditorClick = () => {
    if (!user) {
      onShowAuth();
    } else {
      onShowEditor();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate?.('home')} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 shadow-lg shadow-primary/20">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <img 
                src="https://cdn.poehali.dev/projects/cb505cdb-dfe2-48fa-92be-5403d2dbf8d0/files/7a1a0595-f8e5-43b7-a952-6899395a5b1e.jpg" 
                alt="G-Pen" 
                className="w-7 h-7 object-contain"
              />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
              MangaHub
            </span>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider">ARTISTS PARADISE</p>
          </div>
        </button>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => onNavigate?.('catalog')} className="text-sm font-medium hover:text-primary transition-colors">Каталог</button>
          <button onClick={() => onNavigate?.('community')} className="text-sm font-medium hover:text-primary transition-colors">Сообщество</button>
          <button onClick={() => onNavigate?.('authors')} className="text-sm font-medium hover:text-primary transition-colors">Авторы</button>
          <button onClick={handleEditorClick} className="text-sm font-medium hover:text-primary transition-colors">
            Редактор
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleViewMode}
            className="hover-scale"
            title={viewMode === 'landing' ? 'Переключить на галерею' : 'Переключить на лендинг'}
          >
            <Icon name={viewMode === 'landing' ? 'LayoutGrid' : 'Layout'} size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="hover-scale"
          >
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
          </Button>
          
          {user ? (
            <>
              <Button variant="outline" className="hidden md:flex" onClick={onShowUpload}>
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onShowProfile}
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
              {user.role === 'admin' && onShowAdmin && (
                <Button variant="outline" size="icon" onClick={onShowAdmin} title="Админ-панель">
                  <Icon name="Settings" size={20} />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex" onClick={onShowAuth}>
                Войти
              </Button>
              <Button onClick={onShowAuth} className="bg-primary hover:bg-primary/90">
                Создать
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;