import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  title: string;
  source: string;
  url: string;
  rating: number;
  description: string;
  type: string;
  image?: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/2eb155ab-fdff-4cce-94a9-1446cd103581', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Music" size={40} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ReSound
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            ИИ-помощник для поиска музыкальных разборов
          </p>
        </header>

        <div className="mb-16 animate-scale-in">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Поиск разборов</CardTitle>
              <CardDescription>
                Введите название произведения или композиции
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    placeholder="Например: Metallica - Nothing Else Matters"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-12 px-8"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Ищу...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Найти
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {isSearching && (
          <div className="text-center mb-12 animate-pulse-glow">
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <Icon name="Brain" size={20} className="text-primary" />
              ИИ анализирует результаты поиска...
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-16 space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="ListMusic" size={28} className="text-primary" />
              Найденные разборы
            </h2>
            {results.map((result, index) => (
              <Card 
                key={result.id} 
                className="hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {result.image && (
                  <div className="w-full h-64 overflow-hidden bg-muted">
                    <img 
                      src={result.image} 
                      alt={result.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{result.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {result.type}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Icon name="Globe" size={14} />
                        {result.source}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Icon name="Star" size={18} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-semibold">{result.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Icon name="HelpCircle" size={28} className="text-secondary" />
            Помощь и FAQ
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border rounded-lg px-6 border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                Как работает поиск разборов?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Наш ИИ анализирует множество источников в интернете: YouTube, музыкальные образовательные сайты, 
                форумы музыкантов. Алгоритм оценивает качество разбора по множеству параметров и предлагает 
                самые полезные и понятные материалы.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                Что означает рейтинг разбора?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Рейтинг от 1 до 10 показывает общее качество разбора. Учитываются: полнота материала, 
                понятность объяснений, наличие табулатур/нот, качество видео, отзывы других музыкантов. 
                Чем выше рейтинг, тем лучше качество разбора.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                Можно ли искать разборы на разных инструментах?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Да! Просто укажите инструмент в запросе, например: "Nothing Else Matters на фортепиано" 
                или "Smoke on the Water на бас-гитаре". ИИ учтёт это и найдёт разборы именно для вашего инструмента.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                Разборы бесплатные или платные?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Мы показываем результаты из разных источников — как бесплатных, так и платных. 
                В описании каждого результата указано, требуется ли подписка или оплата. 
                Многие качественные разборы доступны абсолютно бесплатно.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                Не нашёл разбор нужной композиции. Что делать?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Попробуйте изменить формулировку запроса: укажите исполнителя, альтернативное название, 
                или добавьте слова "урок", "tutorial", "lesson". Также ИИ постоянно обучается и расширяет базу — 
                повторите поиск через некоторое время.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Index;