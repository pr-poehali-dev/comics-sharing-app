import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface PricingProps {
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

const Pricing = ({ theme, user, onToggleTheme, onShowAuth, onShowEditor, onShowUpload, onShowProfile, onBack, viewMode, onToggleViewMode }: PricingProps) => {
  const plans = [
    {
      name: 'Читатель',
      price: 0,
      period: 'бесплатно',
      description: 'Для любителей комиксов',
      features: [
        { text: 'Доступ ко всем бесплатным комиксам', included: true },
        { text: 'Покупка премиум-глав', included: true },
        { text: 'Комментарии и лайки', included: true },
        { text: 'Оффлайн-режим (5 работ)', included: true },
        { text: 'Без рекламы', included: false },
        { text: 'Ранний доступ к новинкам', included: false }
      ],
      buttonText: 'Начать читать',
      variant: 'outline' as const,
      popular: false
    },
    {
      name: 'Автор',
      price: 490,
      period: 'в месяц',
      description: 'Для создателей контента',
      features: [
        { text: 'Все возможности читателя', included: true },
        { text: 'Публикация неограниченно', included: true },
        { text: 'Встроенный редактор комиксов', included: true },
        { text: 'Статистика и аналитика', included: true },
        { text: 'Защита от пиратства', included: true },
        { text: 'Прямые выплаты на карту', included: true },
        { text: 'Приоритетная поддержка', included: true }
      ],
      buttonText: 'Стать автором',
      variant: 'default' as const,
      popular: true
    },
    {
      name: 'Студия',
      price: 2990,
      period: 'в месяц',
      description: 'Для профессиональных команд',
      features: [
        { text: 'Все возможности автора', included: true },
        { text: 'До 10 участников команды', included: true },
        { text: 'Корпоративный брендинг', included: true },
        { text: 'API для интеграций', included: true },
        { text: 'Персональный менеджер', included: true },
        { text: 'Расширенная аналитика', included: true },
        { text: 'Приоритетное размещение', included: true }
      ],
      buttonText: 'Связаться с нами',
      variant: 'outline' as const,
      popular: false
    }
  ];

  const features = [
    {
      icon: 'Shield',
      title: 'Защита контента',
      description: 'Водяные знаки, блокировка скриншотов и проверка на плагиат'
    },
    {
      icon: 'CreditCard',
      title: 'Удобные выплаты',
      description: 'Вывод на карты РФ и СНГ, криптовалюту, электронные кошельки'
    },
    {
      icon: 'TrendingUp',
      title: 'Аналитика',
      description: 'Подробная статистика просмотров, доходов и аудитории'
    },
    {
      icon: 'Users',
      title: 'Сообщество',
      description: 'Активное комьюнити авторов и читателей из России и СНГ'
    }
  ];

  const faqs = [
    {
      question: 'Можно ли начать бесплатно?',
      answer: 'Да! Вы можете создать аккаунт бесплатно и публиковать до 3 работ. Для неограниченных публикаций нужна подписка Автор.'
    },
    {
      question: 'Как происходят выплаты?',
      answer: 'Мы поддерживаем вывод на карты российских и СНГ банков, ЮMoney, QIWI, криптовалюту. Минимальная сумма вывода — 500₽.'
    },
    {
      question: 'Какую комиссию берёт платформа?',
      answer: 'Мы берём 20% от продаж премиум-контента. Это одна из самых низких комиссий на рынке.'
    },
    {
      question: 'Можно ли отменить подписку?',
      answer: 'Да, вы можете отменить подписку в любой момент. Доступ сохранится до конца оплаченного периода.'
    }
  ];

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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Тарифы</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите план, который подходит именно вам
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 border-2 relative ${plan.popular ? 'border-primary' : 'border-border/50'} hover:border-primary/50 transition-all hover-scale`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Популярный
                </Badge>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}₽</span>
                </div>
                <p className="text-muted-foreground">{plan.period}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon 
                      name={feature.included ? "Check" : "X"} 
                      size={20} 
                      className={feature.included ? "text-green-500 flex-shrink-0 mt-0.5" : "text-muted-foreground flex-shrink-0 mt-0.5"} 
                    />
                    <span className={feature.included ? "" : "text-muted-foreground"}>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.variant} 
                className="w-full"
                size="lg"
                onClick={onShowAuth}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Преимущества платформы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center border-border/50">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature.icon as any} size={28} className="text-primary" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Частые вопросы</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 border-border/50">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <Card className="p-12 text-center border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10">
            <h2 className="text-3xl font-bold mb-4">Остались вопросы?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Наша команда поддержки готова помочь вам 24/7
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <Icon name="MessageCircle" size={20} className="mr-2" />
                Написать в поддержку
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="Phone" size={20} className="mr-2" />
                Заказать звонок
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;