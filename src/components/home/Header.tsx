import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  theme: 'dark' | 'light';
  user: any;
  onToggleTheme: () => void;
  onShowAuth: () => void;
  onShowEditor: () => void;
  onShowUpload: () => void;
  onShowProfile: () => void;
}

const Header = ({
  theme,
  user,
  onToggleTheme,
  onShowAuth,
  onShowEditor,
  onShowUpload,
  onShowProfile
}: HeaderProps) => {
  const handleEditorClick = () => {
    if (!user) {
      onShowAuth();
    } else {
      onShowEditor();
    }
  };

  return (
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
          <button onClick={handleEditorClick} className="text-sm font-medium hover:text-primary transition-colors">
            Редактор
          </button>
        </nav>

        <div className="flex items-center gap-3">
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
