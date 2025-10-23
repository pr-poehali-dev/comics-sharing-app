import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import GraphicEditor from '@/components/GraphicEditor';
import AuthModal from '@/components/auth/AuthModal';
import UserProfile from '@/components/profile/UserProfile';
import UploadWorkModal from '@/components/upload/UploadWorkModal';
import PurchaseModal from '@/components/monetization/PurchaseModal';
import AdminPanel from '@/components/admin/AdminPanel';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import FeaturedComics from '@/components/home/FeaturedComics';
import TopsSection from '@/components/home/TopsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';
import GalleryView from '@/components/home/GalleryView';
import Catalog from './Catalog';
import Authors from './Authors';
import Community from './Community';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const Index = () => {
  const { isOnline } = useNetworkStatus();
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'authors' | 'community'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'landing' | 'gallery'>('landing');
  const [showEditor, setShowEditor] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('comicverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'landing' ? 'gallery' : 'landing');
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('comicverse_user');
    setUser(null);
    setShowProfile(false);
  };

  const handlePurchase = (workId: number, price: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: user.balance - price
      };
      setUser(updatedUser);
      localStorage.setItem('comicverse_user', JSON.stringify(updatedUser));
    }
  };

  const handleUploadWork = (work: any) => {
    console.log('New work uploaded:', work);
  };

  const handleReadClick = (comic: any) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (comic.isPremium) {
      setSelectedWork(comic);
      setShowPurchaseModal(true);
    } else {
      console.log('Reading free comic:', comic.title);
    }
  };

  const featuredComics = [
    {
      id: 1,
      title: 'Тени Москвы',
      author: 'Анна Волкова',
      genre: 'Киберпанк',
      rating: 4.9,
      likes: 15420,
      views: 234500,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop'
    },
    {
      id: 2,
      title: 'Последний Богатырь',
      author: 'Дмитрий Соколов',
      genre: 'Фэнтези',
      rating: 4.8,
      likes: 12890,
      views: 198300,
      isPremium: true,
      price: 299,
      cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop'
    },
    {
      id: 3,
      title: 'Космические Странники',
      author: 'Елена Звездная',
      genre: 'Sci-Fi',
      rating: 4.7,
      likes: 10234,
      views: 156700,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=600&fit=crop'
    },
    {
      id: 4,
      title: 'Легенды Байкала',
      author: 'Иван Кедров',
      genre: 'Приключения',
      rating: 4.9,
      likes: 18750,
      views: 287900,
      isPremium: true,
      price: 199,
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop'
    },
    {
      id: 5,
      title: 'Неоновый Петербург',
      author: 'Мария Свет',
      genre: 'Детектив',
      rating: 4.6,
      likes: 9870,
      views: 145600,
      isPremium: false,
      price: 0,
      cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop'
    },
    {
      id: 6,
      title: 'Духи Сибири',
      author: 'Олег Тайга',
      genre: 'Мистика',
      rating: 4.8,
      likes: 14320,
      views: 213400,
      isPremium: true,
      price: 349,
      cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop'
    }
  ];

  const topAuthors = [
    { name: 'Анна Волкова', works: 24, followers: 45200, avatar: 'АВ' },
    { name: 'Дмитрий Соколов', works: 18, followers: 38900, avatar: 'ДС' },
    { name: 'Елена Звездная', works: 31, followers: 52100, avatar: 'ЕЗ' },
    { name: 'Иван Кедров', works: 15, followers: 41300, avatar: 'ИК' }
  ];

  if (showProfile && user) {
    return <UserProfile user={user} onClose={() => setShowProfile(false)} />;
  }

  if (showAdminPanel) {
    return <AdminPanel onClose={() => setShowAdminPanel(false)} />;
  }

  const commonProps = {
    theme,
    viewMode,
    user,
    onToggleTheme: toggleTheme,
    onToggleViewMode: toggleViewMode,
    onShowAuth: () => setShowAuthModal(true),
    onShowEditor: () => setShowEditor(true),
    onShowUpload: () => setShowUploadModal(true),
    onShowProfile: () => setShowProfile(true),
    onBack: () => setCurrentPage('home')
  };

  if (currentPage === 'catalog') {
    return <Catalog {...commonProps} />;
  }

  if (currentPage === 'authors') {
    return <Authors {...commonProps} />;
  }



  if (currentPage === 'community') {
    return <Community {...commonProps} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        theme={theme}
        viewMode={viewMode}
        user={user}
        onToggleTheme={toggleTheme}
        onToggleViewMode={toggleViewMode}
        onShowAuth={() => setShowAuthModal(true)}
        onShowEditor={() => setShowEditor(true)}
        onShowUpload={() => setShowUploadModal(true)}
        onShowProfile={() => setShowProfile(true)}
        onShowAdmin={() => setShowAdminPanel(true)}
        onNavigate={setCurrentPage}
      />

      {viewMode === 'landing' ? (
        <>
          <HeroSection
            user={user}
            onShowEditor={() => setShowEditor(true)}
            onShowAuth={() => setShowAuthModal(true)}
          />

          <FeaturedComics
            comics={featuredComics}
            onReadClick={handleReadClick}
          />

          <TopsSection
            topAuthors={topAuthors}
            featuredComics={featuredComics}
          />

          <FeaturesSection />

          <CTASection onShowAuth={() => setShowAuthModal(true)} />
        </>
      ) : (
        <GalleryView
          works={featuredComics}
          onReadClick={handleReadClick}
        />
      )}

      <Footer onNavigate={setCurrentPage} />

      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-[98vw] h-[95vh] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Paintbrush" size={24} className="text-primary" />
              Графический редактор ComicVerse
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 h-full overflow-hidden">
            <GraphicEditor />
          </div>
        </DialogContent>
      </Dialog>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />

      <UploadWorkModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadWork}
      />

      {selectedWork && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedWork(null);
          }}
          work={selectedWork}
          userBalance={user?.balance || 0}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default Index;