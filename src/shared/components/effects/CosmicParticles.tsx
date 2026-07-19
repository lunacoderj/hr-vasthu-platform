import React from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export const CosmicParticles: React.FC = React.memo(() => {
  const particlesInit = async (engine: any) => {
    await loadSlim(engine);
  };

  return (
    <ParticlesProvider init={particlesInit}>
      <Particles
        id="tsparticles"
      className="absolute inset-0 -z-50 pointer-events-none"
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "bubble",
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              color: "#e68a1c"
            },
          },
        },
        particles: {
          color: {
            value: ["#d4720a", "#c85d2f", "#e68a1c", "#fef9f0"],
          },
          links: {
            color: "#d4720a",
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 60,
          },
          opacity: {
            value: { min: 0.1, max: 0.6 },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 4 },
          },
        },
        detectRetina: false,
      }}
    />
    </ParticlesProvider>
  );
});

export default CosmicParticles;
