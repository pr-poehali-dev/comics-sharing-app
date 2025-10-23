import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { validateEmail, validatePassword, validateName, sanitizeInput } from '@/utils/validation';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error('Заполните все поля');
      return;
    }

    if (!validateEmail(loginEmail)) {
      toast.error('Некорректный email');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = {
      id: Math.floor(Math.random() * 2147483647),
      name: 'Пользователь',
      email: sanitizeInput(loginEmail),
      avatar: loginEmail.charAt(0).toUpperCase(),
      balance: 1500,
      role: 'author'
    };

    localStorage.setItem('comicverse_user', JSON.stringify(user));
    onLogin(user);
    toast.success('Добро пожаловать!');
    setLoading(false);
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      toast.error('Заполните все поля');
      return;
    }

    const nameValidation = validateName(registerName);
    if (!nameValidation.valid) {
      toast.error(nameValidation.error);
      return;
    }

    if (!validateEmail(registerEmail)) {
      toast.error('Некорректный email');
      return;
    }

    const passwordValidation = validatePassword(registerPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.error);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = {
      id: Math.floor(Math.random() * 2147483647),
      name: sanitizeInput(registerName),
      email: sanitizeInput(registerEmail),
      avatar: registerName.charAt(0).toUpperCase(),
      balance: 0,
      role: 'author'
    };

    localStorage.setItem('comicverse_user', JSON.stringify(user));
    onLogin(user);
    toast.success(`Добро пожаловать, ${sanitizeInput(registerName)}!`);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Добро пожаловать в ComicVerse
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Icon name="LogIn" size={16} className="mr-2" />
                )}
                {loading ? 'Вход...' : 'Войти'}
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-muted-foreground hover:text-primary">
                  Забыли пароль?
                </button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Или войти через</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Icon name="Mail" size={16} className="mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Icon name="Github" size={16} className="mr-2" />
                GitHub
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Имя</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Ваше имя"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Подтвердите пароль</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Icon name="UserPlus" size={16} className="mr-2" />
                )}
                {loading ? 'Создание...' : 'Создать аккаунт'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Регистрируясь, вы соглашаетесь с{' '}
                <a href="#" className="text-primary hover:underline">условиями использования</a>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;