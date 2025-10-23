import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Work {
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

interface GalleryViewProps {
  works: Work[];
  onReadClick: (work: Work) => void;
}

const GalleryView = ({ works, onReadClick }: GalleryViewProps) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Все работы авторов
          </h2>
          <p className="text-muted-foreground text-lg">
            Исследуй библиотеку комиксов и манги от российских авторов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {works.map((work) => (
            <Card key={work.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                  src={work.cover} 
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge className="bg-background/80 backdrop-blur text-foreground border-border/50">
                    {work.genre}
                  </Badge>
                  {work.isPremium && (
                    <Badge className="bg-primary/90 text-primary-foreground border-0">
                      <Icon name="Crown" size={12} className="mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    onClick={() => onReadClick(work)}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Icon name="BookOpen" size={16} className="mr-2" />
                    {work.isPremium ? `Купить за ${work.price}₽` : 'Читать'}
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {work.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {work.author.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{work.author}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      {work.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={14} />
                      {(work.likes / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    {(work.views / 1000).toFixed(0)}k
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryView;
