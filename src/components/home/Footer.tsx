import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface FooterProps {
  onNavigate?: (page: 'home' | 'catalog' | 'authors' | 'pricing' | 'community') => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  return (
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
              <li><button onClick={() => onNavigate?.('catalog')} className="hover:text-primary transition-colors">Каталог</button></li>
              <li><button onClick={() => onNavigate?.('home')} className="hover:text-primary transition-colors">Редактор</button></li>
              <li><button onClick={() => onNavigate?.('authors')} className="hover:text-primary transition-colors">Авторы</button></li>
              <li><button onClick={() => onNavigate?.('pricing')} className="hover:text-primary transition-colors">Цены</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button className="hover:text-primary transition-colors">FAQ</button></li>
              <li><button className="hover:text-primary transition-colors">Документация</button></li>
              <li><button className="hover:text-primary transition-colors">Контакты</button></li>
              <li><button onClick={() => onNavigate?.('community')} className="hover:text-primary transition-colors">Сообщество</button></li>
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
  );
};

export default Footer;