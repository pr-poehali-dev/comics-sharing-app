import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Author {
  name: string;
  works: number;
  followers: number;
  avatar: string;
}

interface Comic {
  id: number;
  title: string;
  author: string;
  cover: string;
}

interface TopsSectionProps {
  topAuthors: Author[];
  featuredComics: Comic[];
}

const TopsSection = ({ topAuthors, featuredComics }: TopsSectionProps) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="authors" className="w-full">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Топы недели</h2>
            <TabsList className="bg-secondary">
              <TabsTrigger value="authors">Авторы</TabsTrigger>
              <TabsTrigger value="genres">По жанрам</TabsTrigger>
              <TabsTrigger value="new">Новинки</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="authors" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topAuthors.map((author, index) => (
                <Card key={index} className="p-6 border-border/50 hover:border-primary/50 transition-all hover-scale">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-muted-foreground/30 w-8">
                      #{index + 1}
                    </div>
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{author.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Icon name="BookOpen" size={14} />
                          {author.works} работ
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Users" size={14} />
                          {(author.followers / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Подписаться
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="genres" className="animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Киберпанк', 'Фэнтези', 'Sci-Fi', 'Детектив', 'Мистика', 'Романтика', 'Приключения', 'Драма'].map((genre) => (
                <Card key={genre} className="p-6 text-center hover:border-primary/50 transition-all hover-scale cursor-pointer">
                  <h3 className="font-bold text-lg mb-2">{genre}</h3>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 500 + 100)} работ
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredComics.slice(0, 3).map((comic) => (
                <Card key={comic.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover-scale">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-1">{comic.title}</h3>
                    <p className="text-sm text-muted-foreground">{comic.author}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default TopsSection;
