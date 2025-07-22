
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel';
import { 
  BookOpen, 
  Calculator, 
  Atom, 
  Code, 
  Globe, 
  Palette,
  Music,
  Heart,
  Microscope
} from 'lucide-react';

const SubjectCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });

    // Auto-scroll every 4 seconds
    const timer = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [api]);

  const subjects = [
    {
      title: "Mathematics",
      description: "Master calculus, algebra, geometry, and advanced mathematical concepts with interactive problem-solving",
      icon: <Calculator className="h-8 w-8" />,
      features: ["2,450+ flashcards", "Step-by-step solutions", "Practice tests", "Progress tracking"],
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Computer Science",
      description: "Learn programming, algorithms, data structures, and software development fundamentals",
      icon: <Code className="h-8 w-8" />,
      features: ["3,200+ flashcards", "Code examples", "Algorithm visualization", "Project templates"],
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Physics",
      description: "Explore quantum mechanics, thermodynamics, electromagnetism, and classical physics",
      icon: <Atom className="h-8 w-8" />,
      features: ["1,800+ flashcards", "Interactive simulations", "Formula reference", "Lab experiments"],
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Chemistry",
      description: "Understand molecular structures, chemical reactions, and periodic table mastery",
      icon: <Microscope className="h-8 w-8" />,
      features: ["2,100+ flashcards", "3D molecular models", "Reaction simulator", "Lab safety guide"],
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Biology",
      description: "Study cellular biology, genetics, anatomy, and ecosystem relationships",
      icon: <Heart className="h-8 w-8" />,
      features: ["2,800+ flashcards", "Anatomical diagrams", "Evolution timeline", "Ecosystem maps"],
      color: "from-emerald-500 to-green-600"
    },
    {
      title: "History",
      description: "Journey through world history, civilizations, and significant historical events",
      icon: <Globe className="h-8 w-8" />,
      features: ["3,500+ flashcards", "Interactive timelines", "Historical maps", "Primary sources"],
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Literature",
      description: "Analyze classic and modern literature, poetry, and literary techniques",
      icon: <BookOpen className="h-8 w-8" />,
      features: ["2,600+ flashcards", "Text analysis tools", "Character guides", "Writing prompts"],
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Art & Design",
      description: "Master artistic techniques, design principles, and art history fundamentals",
      icon: <Palette className="h-8 w-8" />,
      features: ["1,900+ flashcards", "Color theory guide", "Technique tutorials", "Artist profiles"],
      color: "from-fuchsia-500 to-pink-600"
    },
    {
      title: "Music Theory",
      description: "Learn scales, chords, composition, and musical analysis techniques",
      icon: <Music className="h-8 w-8" />,
      features: ["1,400+ flashcards", "Audio examples", "Scale reference", "Chord progressions"],
      color: "from-cyan-500 to-blue-600"
    }
  ];

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <section id="subjects" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Choose a Subject
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Select from our comprehensive library of subjects and start your learning journey today.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {subjects.map((subject, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="group h-full hover:scale-105 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r ${subject.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                      {subject.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{subject.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6 text-sm">
                      {subject.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-foreground/70">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground animate-pulse-glow">
                      Enrol Now
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Navigation Dots */}
        <div className="carousel-dots">
          {Array.from({ length: Math.ceil(subjects.length / 3) }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${Math.floor((current - 1) / 3) === index ? 'active' : ''}`}
              onClick={() => goToSlide(index * 3)}
              aria-label={`Go to slide group ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="text-sm text-foreground/60 bg-card/50 px-4 py-2 rounded-full backdrop-blur-sm">
            Auto-scrolling • {subjects.length} subjects available
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectCarousel;
