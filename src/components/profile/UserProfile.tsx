import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  role: string;
}

interface UserProfileProps {
  user: User;
  onClose: () => void;
}

const WALLET_URL = 'https://functions.poehali.dev/96f956be-cd72-474f-9b1e-937015b11dbc';
const PAYMENT_URL = 'https://functions.poehali.dev/bee1b44c-67c7-46cf-a0c5-f54c4771d51d';

const UserProfile = ({ user, onClose }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState('works');
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');

  const userWorks = [
    {
      id: 1,
      title: 'Мой первый комикс',
      cover: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=300&h=400&fit=crop',
      views: 1234,
      likes: 89,
      chapters: 5,
      revenue: 450,
      status: 'published'
    },
    {
      id: 2,
      title: 'Космическое приключение',
      cover: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=300&h=400&fit=crop',
      views: 567,
      likes: 43,
      chapters: 3,
      revenue: 120,
      status: 'draft'
    }
  ];

  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, []);

  const loadWallet = async () => {
    try {
      const response = await fetch(`${WALLET_URL}?user_id=${user.id}`);
      const data = await response.json();
      setWallet(data);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch(`${PAYMENT_URL}?user_id=${user.id}`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const stats = {
    totalViews: 1801,
    totalLikes: 132,
    totalWorks: 2,
    totalRevenue: 770,
    followers: 24
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount < 500) {
      toast.error('Минимальная сумма для вывода 500₽');
      return;
    }

    if (wallet && amount > wallet.balance) {
      toast.error('Недостаточно средств');
      return;
    }

    if (!cardNumber || cardNumber.length < 4) {
      toast.error('Введите номер карты');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(WALLET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'withdraw',
          user_id: user.id,
          amount: amount,
          payment_method: withdrawMethod,
          payment_details: { card_number: cardNumber }
        })
      });

      if (response.ok) {
        toast.success('Заявка на вывод создана');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setCardNumber('');
        loadWallet();
        loadTransactions();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Ошибка вывода');
      }
    } catch (error) {
      toast.error('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onClose} className="mb-6">
        <Icon name="ArrowLeft" size={18} className="mr-2" />
        Назад
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-24 h-24 border-4 border-primary">
                <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                  {user.avatar}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge className="mt-2 bg-primary/20 text-primary">
                  {user.role === 'author' ? 'Автор' : 'Читатель'}
                </Badge>
              </div>

              <div className="w-full pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Баланс</span>
                  <span className="text-2xl font-bold text-primary">
                    {wallet ? wallet.balance : user.balance}₽
                  </span>
                </div>
                <Button onClick={() => setShowWithdrawModal(true)} className="w-full bg-primary hover:bg-primary/90">
                  <Icon name="Wallet" size={16} className="mr-2" />
                  Вывести средства
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Icon name="BarChart3" size={20} className="text-primary" />
              Статистика
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Eye" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Просмотры</span>
                </div>
                <span className="font-bold">{stats.totalViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Heart" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Лайки</span>
                </div>
                <span className="font-bold">{stats.totalLikes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="BookOpen" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Работы</span>
                </div>
                <span className="font-bold">{stats.totalWorks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} className="text-muted-foreground" />
                  <span className="text-sm">Подписчики</span>
                </div>
                <span className="font-bold">{stats.followers}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                  <span className="text-sm font-medium">Доход</span>
                </div>
                <span className="font-bold text-primary">{stats.totalRevenue}₽</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Уровень автора</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Новичок</span>
                <Badge variant="outline">Ур. 3</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Еще 350 просмотров до следующего уровня
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="works">Мои работы</TabsTrigger>
              <TabsTrigger value="earnings">Доходы</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="works" className="space-y-4 mt-6">
              {userWorks.map((work) => (
                <Card key={work.id} className="p-6 hover:border-primary/50 transition-all">
                  <div className="flex gap-4">
                    <img 
                      src={work.cover} 
                      alt={work.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{work.title}</h3>
                          <Badge variant={work.status === 'published' ? 'default' : 'secondary'} className="mt-1">
                            {work.status === 'published' ? 'Опубликовано' : 'Черновик'}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Icon name="MoreVertical" size={18} />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Eye" size={14} />
                          {work.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Heart" size={14} />
                          {work.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="BookOpen" size={14} />
                          {work.chapters} глав
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Заработано</p>
                          <p className="font-bold text-primary">{work.revenue}₽</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Icon name="Edit" size={14} className="mr-1" />
                            Редактировать
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="BarChart" size={14} className="mr-1" />
                            Статистика
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Button className="w-full" variant="outline">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить новую работу
              </Button>
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4 mt-6">
              <Card className="p-6 bg-primary/10 border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Доступно к выводу</p>
                    <p className="text-3xl font-bold text-primary">{user.balance}₽</p>
                  </div>
                  <Button onClick={handleWithdraw} className="bg-primary hover:bg-primary/90">
                    Вывести
                  </Button>
                </div>
              </Card>

              <div className="space-y-3">
                <h3 className="font-bold text-lg">История транзакций</h3>
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earning' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <Icon 
                            name={transaction.type === 'earning' ? 'TrendingUp' : 'TrendingDown'} 
                            size={18} 
                            className={transaction.type === 'earning' ? 'text-green-500' : 'text-red-500'}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-lg ${
                        transaction.type === 'earning' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}₽
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Настройки профиля</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="User" size={16} className="mr-2" />
                    Редактировать профиль
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Lock" size={16} className="mr-2" />
                    Изменить пароль
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Bell" size={16} className="mr-2" />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Платежные данные
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Icon name="Shield" size={16} className="mr-2" />
                    Конфиденциальность
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти из аккаунта
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;