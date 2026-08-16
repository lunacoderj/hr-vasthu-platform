import React from 'react';

export const HonorsBanner: React.FC = () => {
  return (
    <section className="w-full">
      <picture>
        <source srcSet="/hero.webp" type="image/webp" />
        <img
          src="/hero.png"
          alt="HR Vasthu - Dr. Kunchala Hanamanthu Rao"
          width={1400}
          height={500}
          loading="lazy"
          decoding="async"
          className="w-full h-auto block"
        />
      </picture>
    </section>
  );
};
