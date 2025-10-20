import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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
