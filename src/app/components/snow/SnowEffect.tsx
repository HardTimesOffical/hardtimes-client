"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 

export default function SnowEffect() {
  const [init, setInit] = useState(false);

  // Инициализация движка частиц
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        // Настройки позиционирования поверх всего сайта
        fullScreen: {
          enable: true,
          zIndex: 9999, // Слой выше картинок и блоков
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            // Снежинки будут разлетаться при наведении мышки
            onHover: {
              enable: true,
              mode: "bubble",
            },
          },
          modes: {
            bubble: {
              distance: 200,
              duration: 2,
              size: 0,
              opacity: 0,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          move: {
            direction: "bottom", // Движение вниз
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: { min: 0.5, max: 2 }, // Скорость падения
            straight: false,
          },
            number: {
            density: {
                enable: true,
                // area: 800, // ЭТО вызывало ошибку
                width: 1920,   // Используйте width и height вместо area
                height: 1080,
            },
            value: 120, 
            },
          opacity: {
            value: { min: 0.3, max: 0.7 },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
          // Эффект покачивания (зигзаг) при падении
          wobble: {
            enable: true,
            distance: 10,
            speed: 10,
          },
        },
        detectRetina: true,
        // Чтобы снег не перекрывал возможность кликать на ссылки/кнопки
        style: {
          pointerEvents: "none",
        },
      }}
    />
  );
}