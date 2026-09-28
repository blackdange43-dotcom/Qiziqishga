import confetti from 'canvas-confetti';

export function fireOrderConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#06b6d4', '#3b82f6', '#10b981']
  });

  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#ec4899', '#f59e0b']
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#10b981', '#06b6d4', '#6366f1']
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}
