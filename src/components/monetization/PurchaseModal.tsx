import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: {
    id: number;
    title: string;
    author: string;
    price: number;
    cover: string;
  };
  userBalance: number;
  onPurchase: (workId: number, price: number) => void;
}

const PurchaseModal = ({ isOpen, onClose, work, userBalance, onPurchase }: PurchaseModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState('balance');

  const paymentMethods = [
    { id: 'balance', name: 'Баланс ComicVerse', icon: 'Wallet', available: true },
    { id: 'card', name: 'Банковская карта', icon: 'CreditCard', available: true },
    { id: 'yoomoney', name: 'ЮMoney', icon: 'CircleDollarSign', available: true },
    { id: 'sbp', name: 'СБП', icon: 'Smartphone', available: true }
  ];

  const handlePurchase = () => {
    if (paymentMethod === 'balance' && userBalance < work.price) {
      toast.error('Недостаточно средств на балансе');
      return;
    }

    const authorShare = work.price * 0.85;
    const platformFee = work.price * 0.15;

    toast.success(
      <div>
        <p className="font-bold">Покупка успешна!</p>
        <p className="text-sm">Автор получит {authorShare.toFixed(2)}₽</p>
      </div>
    );

    onPurchase(work.id, work.price);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Покупка работы</DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-secondary/30">
          <div className="flex gap-4">
            <img 
              src={work.cover} 
              alt={work.title}
              className="w-20 h-28 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{work.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">by {work.author}</p>
              <Badge className="bg-primary">
                <Icon name="Crown" size={14} className="mr-1" />
                Премиум контент
              </Badge>
            </div>
          </div>
        </Card>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between py-3 border-y border-border">
            <span className="text-muted-foreground">Цена работы:</span>
            <span className="text-2xl font-bold text-primary">{work.price}₽</span>
          </div>

          <div>
            <Label className="text-base font-bold mb-3 block">Способ оплаты</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Icon name={method.icon as any} size={20} />
                    <span className="flex-1 font-medium">{method.name}</span>
                    {method.id === 'balance' && (
                      <Badge variant="outline" className="ml-auto">
                        {userBalance}₽
                      </Badge>
                    )}
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'balance' && userBalance < work.price && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
              <Icon name="AlertCircle" size={18} className="text-destructive mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Недостаточно средств</p>
                <p className="text-muted-foreground">
                  Нужно еще {(work.price - userBalance).toFixed(2)}₽
                </p>
              </div>
            </div>
          )}

          <div className="bg-secondary/30 p-4 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Автору:</span>
              <span className="font-medium">{(work.price * 0.85).toFixed(2)}₽ (85%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Комиссия платформы:</span>
              <span className="font-medium">{(work.price * 0.15).toFixed(2)}₽ (15%)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={paymentMethod === 'balance' && userBalance < work.price}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Купить за {work.price}₽
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Нажимая "Купить", вы соглашаетесь с условиями покупки. 
          Возврат средств не предусмотрен.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
