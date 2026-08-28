import React from 'react';

export const HonorsBanner: React.FC = () => {
  return (
    <section className="w-full overflow-hidden">
      <picture>
        <source srcSet="/hero.webp" type="image/webp" />
        <img
          src="/hero.webp"
          alt="HR Vasthu - Dr. Kunchala Hanumantha Rao"
          width={1400}
          height={500}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          style={{ aspectRatio: '1400 / 500' }}
          className="w-full h-auto block object-cover max-w-full"
        />
      </picture>
    </section>
  );
};
