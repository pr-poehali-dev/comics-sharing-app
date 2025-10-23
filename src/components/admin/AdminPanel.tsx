import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { apiGet, apiPost, apiPut, API_ENDPOINTS } from '@/utils/api';



interface AdminPanelProps {
  onClose: () => void;
}

interface Settings {
  platform_owner_account: { value: string; description: string };
  platform_commission_percentage: { value: string; description: string };
  author_commission_percentage: { value: string; description: string };
  min_withdrawal_amount: { value: string; description: string };
}

interface CommissionReport {
  platform_earnings: number;
  authors_earnings: number;
  total_transactions: number;
  owner_account: string;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [report, setReport] = useState<CommissionReport | null>(null);
  const [ownerAccount, setOwnerAccount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadReport();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const result = await apiGet(API_ENDPOINTS.ADMIN);
    setLoading(false);
    
    if (result.error) {
      toast.error('Ошибка загрузки настроек: ' + result.error);
      return;
    }
    
    setSettings(result.data.settings);
    setOwnerAccount(result.data.settings.platform_owner_account?.value || '');
  };

  const loadReport = async () => {
    const result = await apiPost(API_ENDPOINTS.ADMIN, { action: 'get_commission_report' });
    
    if (result.error) {
      toast.error('Ошибка загрузки отчёта: ' + result.error);
      return;
    }
    
    setReport(result.data);
  };

  const updateOwnerAccount = async () => {
    setLoading(true);
    const result = await apiPut(API_ENDPOINTS.ADMIN, {
      key: 'platform_owner_account',
      value: ownerAccount
    });
    setLoading(false);
    
    if (result.error) {
      toast.error('Ошибка обновления: ' + result.error);
      return;
    }
    
    toast.success('Реквизиты обновлены');
    loadSettings();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Icon name="Settings" size={32} className="text-primary" />
            Панель администратора
          </h1>
          <p className="text-muted-foreground mt-1">Управление платформой и комиссиями</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <Icon name="X" size={20} className="mr-2" />
          Закрыть
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Wallet" size={24} className="text-primary" />
            Ваши реквизиты (20% комиссия)
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ownerAccount">Номер телефона / карты для СБП</Label>
              <Input
                id="ownerAccount"
                value={ownerAccount}
                onChange={(e) => setOwnerAccount(e.target.value)}
                placeholder="+79001234567"
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                На эти реквизиты будут автоматически переводиться 20% от всех платежей
              </p>
            </div>

            <Button 
              onClick={updateOwnerAccount} 
              disabled={loading || !ownerAccount}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Icon name="Save" size={16} className="mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить реквизиты'}
            </Button>
          </div>

          {settings && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-bold mb-3">Настройки комиссий</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Комиссия платформы:</span>
                  <Badge variant="outline">{settings.platform_commission_percentage?.value}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Выплата автору:</span>
                  <Badge variant="outline">{settings.author_commission_percentage?.value}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Минимум для вывода:</span>
                  <Badge variant="outline">{settings.min_withdrawal_amount?.value}₽</Badge>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={24} className="text-primary" />
            Статистика доходов
          </h2>

          {report && (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Ваш доход (20%)</div>
                <div className="text-3xl font-bold text-primary">
                  {report.platform_earnings.toFixed(2)}₽
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Доход авторов</div>
                  <div className="text-xl font-bold">
                    {report.authors_earnings.toFixed(2)}₽
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Транзакций</div>
                  <div className="text-xl font-bold">
                    {report.total_transactions}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Общий оборот:</span>
                  <span className="font-bold">
                    {(report.platform_earnings + report.authors_earnings).toFixed(2)}₽
                  </span>
                </div>
              </div>

              <Button 
                onClick={loadReport} 
                variant="outline" 
                className="w-full"
              >
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Обновить статистику
              </Button>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Icon name="Info" size={24} className="text-primary" />
          Как работает система комиссий
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="ShoppingCart" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">1. Покупка</h3>
              <p className="text-sm text-muted-foreground">
                Читатель покупает премиум-работу
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="PieChart" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">2. Распределение</h3>
              <p className="text-sm text-muted-foreground">
                80% автору, 20% вам на указанные реквизиты
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Icon name="Wallet" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">3. Автовывод</h3>
              <p className="text-sm text-muted-foreground">
                Средства сразу попадают на ваш счёт
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;