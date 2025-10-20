import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Footer = () => {
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
  );
};

export default Footer;
