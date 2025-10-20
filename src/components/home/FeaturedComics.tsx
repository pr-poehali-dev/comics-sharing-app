import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Comic {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  likes: number;
  views: number;
  isPremium: boolean;
  price: number;
  cover: string;
}

interface FeaturedComicsProps {
  comics: Comic[];
  onReadClick: (comic: Comic) => void;
}

const FeaturedComics = ({ comics, onReadClick }: FeaturedComicsProps) => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-3">Популярное сейчас</h2>
            <p className="text-muted-foreground">Лучшие работы этой недели</p>
          </div>
          <Button variant="outline" className="hover-scale">
            Смотреть все
            <Icon name="ArrowRight" size={18} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comics.map((comic, index) => (
            <Card 
              key={comic.id} 
              className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover-scale animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                  src={comic.cover} 
                  alt={comic.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {comic.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur">
                    <Icon name="Crown" size={14} className="mr-1" />
                    {comic.price}₽
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                      {comic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{comic.author}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">{comic.genre}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{comic.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Heart" size={16} className="text-primary" />
                    <span>{(comic.likes / 1000).toFixed(1)}K</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Eye" size={16} />
                    <span>{(comic.views / 1000).toFixed(0)}K</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => onReadClick(comic)}
                >
                  <Icon name="BookOpen" size={16} className="mr-2" />
                  {comic.isPremium ? `Купить ${comic.price}₽` : 'Читать бесплатно'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedComics;
