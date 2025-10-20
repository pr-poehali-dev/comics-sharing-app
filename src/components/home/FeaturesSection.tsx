import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const FeaturesSection = () => {
  const features = [
    { 
      icon: 'Shield', 
      title: 'Защита авторских прав', 
      desc: 'Водяные знаки, защита от скриншотов и проверка на плагиат' 
    },
    { 
      icon: 'Paintbrush', 
      title: 'Встроенный редактор', 
      desc: 'Создавайте комиксы прямо в приложении с профессиональными инструментами' 
    },
    { 
      icon: 'Wallet', 
      title: 'Честная монетизация', 
      desc: 'Выводите деньги на карты РФ и СНГ, устанавливайте цены сами' 
    },
    { 
      icon: 'Wifi', 
      title: 'Оффлайн режим', 
      desc: 'Читайте и создавайте даже без интернета' 
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Почему ComicVerse?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Единственная платформа с полной защитой и справедливой монетизацией
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
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
  );
};

export default FeaturesSection;
