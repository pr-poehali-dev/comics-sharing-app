import { useState, useEffect } from 'react';

const MangaBackground = () => {
  const [currentImage, setCurrentImage] = useState(0);
  
  const mangaBackgrounds = [
    'https://cdn.poehali.dev/projects/cb505cdb-dfe2-48fa-92be-5403d2dbf8d0/files/4c0a5118-0c0d-4d20-9f66-beb72deac9b9.jpg',
    'https://cdn.poehali.dev/projects/cb505cdb-dfe2-48fa-92be-5403d2dbf8d0/files/08471123-3a62-4128-b5ab-8afe9074ed1d.jpg',
    'https://cdn.poehali.dev/projects/cb505cdb-dfe2-48fa-92be-5403d2dbf8d0/files/16a84c58-37bc-423c-8f9f-f7a491b7debf.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % mangaBackgrounds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {mangaBackgrounds.map((bg, index) => (
        <div
          key={bg}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: currentImage === index ? 0.15 : 0,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>
  );
};

export default MangaBackground;
