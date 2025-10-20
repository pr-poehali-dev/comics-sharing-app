import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CTASectionProps {
  onShowAuth: () => void;
}

const CTASection = ({ onShowAuth }: CTASectionProps) => {
  return (
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
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" onClick={onShowAuth}>
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
  );
};

export default CTASection;
