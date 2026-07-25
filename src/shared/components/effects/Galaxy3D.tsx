import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Galaxy3DProps {
  onArrival?: () => void;
}

export const Galaxy3D: React.FC<Galaxy3DProps> = ({ onArrival }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Setup Scene
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050508, 0.05);

      // Setup Camera
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      // Start camera far away
      camera.position.z = 15;
      camera.position.y = 2;
      camera.rotation.x = -0.2;

      // Setup Renderer
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create Galaxy Particles
      const particleCount = 20000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      const colorPalette = [
        new THREE.Color('#d4720a'), // Luxury Gold
        new THREE.Color('#fcd7ae'), // Light Gold
        new THREE.Color('#8a3a1f'), // Copper
        new THREE.Color('#ffffff')  // White stars
      ];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 20;
        const spinAngle = radius * 0.5;
        const branchAngle = ((i % 4) / 4) * Math.PI * 2 + spinAngle;

        // Randomness for organic feel
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

        positions[i3] = Math.cos(branchAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

        // Colors
        const mixedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)].clone();
        
        // Brighter in the center
        const centerDistance = radius / 20;
        mixedColor.lerp(new THREE.Color('#ffffff'), 1 - centerDistance);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random() * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      // Planets (Spheres)
      const planets: THREE.Mesh[] = [];
      const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
      const planetMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xd4720a, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15 
      });
      
      for(let i=0; i<5; i++) {
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          Math.random() * 10
        );
        const scale = 0.5 + Math.random() * 2;
        planet.scale.set(scale, scale, scale);
        scene.add(planet);
        planets.push(planet);
      }

      // Custom shader for glowing particles
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          uniform float uTime;
          attribute float scale;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;
            gl_PointSize = (30.0 * scale) * (1.0 / -viewPosition.z);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.1;
            gl_FragColor = vec4(vColor, strength);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Handle Resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Animation Loop
      const clock = new THREE.Clock();
      let hasArrived = false;
      let frameId: number;

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;

        // Rotate the entire galaxy slowly
        particles.rotation.y = elapsedTime * 0.05;

        // Rotate planets
        planets.forEach((p, i) => {
          p.rotation.x = elapsedTime * (0.1 + i * 0.02);
          p.rotation.y = elapsedTime * (0.2 + i * 0.01);
        });

        // 3D Universe Travel: Move camera rapidly towards center
        if (camera.position.z > 2) {
          // Fast travel
          camera.position.z -= 0.15;
          camera.position.y -= 0.02;
          camera.rotation.x += 0.002;
        } else if (!hasArrived) {
          hasArrived = true;
          if (onArrival) onArrival();
        } else {
          // Arrived: Subtle floating movement around the core
          camera.position.x = Math.sin(elapsedTime * 0.5) * 0.5;
          camera.position.y = Math.cos(elapsedTime * 0.3) * 0.5;
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(frameId);
        geometry.dispose();
        material.dispose();
        planetGeometry.dispose();
        planetMaterial.dispose();
        renderer.dispose();
      };
    } catch (e) {
      console.error(e);
      setHasError(true);
    }
  }, [onArrival]);

  if (hasError) return <div className="absolute inset-0 bg-[#050508]" />;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
