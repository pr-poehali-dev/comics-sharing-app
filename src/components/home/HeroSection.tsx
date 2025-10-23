import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import MangaBackground from './MangaBackground';

interface HeroSectionProps {
  user: any;
  onShowEditor: () => void;
  onShowAuth: () => void;
}

const HeroSection = ({ user, onShowEditor, onShowAuth }: HeroSectionProps) => {
  const handleStartCreating = () => {
    if (user) {
      onShowEditor();
    } else {
      onShowAuth();
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <MangaBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <Badge className="bg-foreground/10 backdrop-blur text-foreground border-2 border-foreground/20 px-6 py-2 text-sm font-bold tracking-wide">
            漫画 ПЛАТФОРМА ДЛЯ ХУДОЖНИКОВ
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
            Твоя манга,<br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                твой успех
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Создавай манга и комиксы с профессиональным редактором. 
            <br className="hidden md:block" />
            Продавай работы напрямую читателям. 80% дохода — тебе.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={handleStartCreating}>
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
  );
};

export default HeroSection;