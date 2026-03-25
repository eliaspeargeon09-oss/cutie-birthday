/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Flower, Flower2, Mail, Sparkles, Terminal, Cake, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

type Step = 'countdown' | 'letter' | 'surprise' | 'hacked' | 'prank' | 'question' | 'response' | 'cake' | 'sliced' | 'joke' | 'final';

const LoadingFallback = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-pink-50 z-[100]"
  >
    <motion.div
      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <Heart size={64} className="text-pink-500 fill-pink-500" />
    </motion.div>
  </motion.div>
);

export default function App() {
  return (
    <Suspense fallback={<AnimatePresence><LoadingFallback /></AnimatePresence>}>
      <MainContent />
    </Suspense>
  );
}

const JokeStep = ({ onComplete }: { onComplete: () => void }) => {
  const [jokeStage, setJokeStage] = useState(0);
  const jokeStages = [
    {
      text: "One day, a man saw an ant walking like it paid the rent and asked,\n“What’s special today?”",
      emoji: "🐜"
    },
    {
      text: "The ant smiled proudly, “It’s my birthday!”",
      emoji: "😊"
    },
    {
      text: "The man got emotional and started singing,\n“Happy birthday to you…” 🎶",
      emoji: "🥹"
    },
    {
      text: "Then he clapped loudly…\n\nCLAP!",
      emoji: "👏"
    },
    {
      text: "…The ant died.",
      emoji: "💀"
    },
    {
      text: "The man stared for a second and said,\n“Bro… I came to celebrate, not eliminate.” 💀😄",
      emoji: "😅"
    }
  ];

  const nextStage = () => {
    if (jokeStage < jokeStages.length - 1) {
      setJokeStage(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      key="joke"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-2xl border-4 border-pink-200 text-center z-10"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={jokeStage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[200px] flex flex-col items-center justify-center"
        >
          <div className="text-6xl mb-6">{jokeStages[jokeStage].emoji}</div>
          <p className="text-2xl font-cursive text-pink-800 leading-relaxed whitespace-pre-line">
            {jokeStages[jokeStage].text}
          </p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={nextStage}
        className="mt-10 bg-pink-500 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform"
      >
        {jokeStage === jokeStages.length - 1 ? "Continue to Letter 💌" : "Next... 😂"}
      </button>
    </motion.div>
  );
};

function MainContent() {
  const [step, setStep] = useState<Step>('countdown');
  const [countdownValue, setCountdownValue] = useState(3);
  const [userChoice, setUserChoice] = useState<'surprise' | 'know' | null>(null);
  const [cakeClicks, setCakeClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCakeClick = () => {
    setCakeClicks(prev => prev + 1);
    if (cakeClicks + 1 >= 5) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setCakeClicks(0);
      }, 3000);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (step === 'countdown') {
      const timer = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            setStep('letter');
            return 0;
          }
          return prev - 1;
        });
      }, 2000); // 2 seconds per stage for readability
      return () => clearInterval(timer);
    }

    if (step === 'hacked') {
      const timer = setTimeout(() => {
        setStep('prank');
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (step === 'prank') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f472b6', '#fbcfe8', '#ffffff']
      });
    }

    if (step === 'sliced') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [step]);

  const playSwish = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  };

  const playCelebration = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {}); // Ignore errors if browser blocks autoplay
  };

  const handleSlice = () => {
    playSwish();
    playCelebration();
    setStep('sliced');
  };

  const FlowerBackground = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            color: i % 2 === 0 ? '#ec4899' : '#f472b6',
          }}
        >
          {i % 2 === 0 ? <Flower size={Math.random() * 40 + 20} /> : <Flower2 size={Math.random() * 40 + 20} />}
        </motion.div>
      ))}
    </div>
  );

  const MagicParticles = () => {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: string; size: number; color: string }[]>([]);
    
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (Math.random() > 0.8) { // Only create particles occasionally for performance
          const newParticle = {
            id: Math.random(),
            x: e.clientX,
            y: e.clientY,
            type: Math.random() > 0.5 ? 'heart' : 'star',
            size: Math.random() * 15 + 10,
            color: Math.random() > 0.5 ? '#ec4899' : '#f472b6',
          };
          setParticles(prev => [...prev.slice(-10), newParticle]);
        }
      };

      const handleClick = (e: MouseEvent) => {
        const burst = Array.from({ length: 5 }).map(() => ({
          id: Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 50,
          y: e.clientY + (Math.random() - 0.5) * 50,
          type: Math.random() > 0.5 ? 'heart' : 'star',
          size: Math.random() * 20 + 15,
          color: '#f43f5e',
        }));
        setParticles(prev => [...prev.slice(-10), ...burst]);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
      };
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-[60]">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 1, x: p.x - p.size/2, y: p.y - p.size/2 }}
              animate={{ opacity: 0, scale: 0, y: p.y - 150, rotate: Math.random() * 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute"
              style={{ color: p.color }}
            >
              {p.type === 'heart' ? <Heart size={p.size} fill="currentColor" /> : <Sparkles size={p.size} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  const FrostingSplatter = () => {
    const [splats, setSplats] = useState<{ id: number; x: number; y: number; size: number; color: string; vx: number; vy: number }[]>([]);
    
    useEffect(() => {
      const newSplats = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: 0,
        y: 0,
        size: Math.random() * 20 + 10,
        color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fbcfe8' : '#f472b6',
        vx: (Math.random() - 0.5) * 800,
        vy: (Math.random() - 0.5) * 800,
      }));
      setSplats(newSplats);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-[70] flex items-center justify-center">
        {splats.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: [0, 1.5, 0.5], 
              x: s.vx, 
              y: s.vy,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full shadow-lg"
            style={{ 
              width: s.size, 
              height: s.size, 
              backgroundColor: s.color,
              filter: 'blur(2px)'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans"
    >
      <FlowerBackground />
      <MagicParticles />
      {step === 'sliced' && <FrostingSplatter />}

      <AnimatePresence mode="wait">
        {step === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="text-center z-50"
          >
            <motion.div
              key={countdownValue}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-9xl font-bold text-pink-600 drop-shadow-lg">
                {countdownValue === 0 ? "GO!" : countdownValue}
              </span>
              <span className="text-3xl font-cursive text-pink-400 mt-4 h-12">
                {countdownValue === 3 && "are you ready"}
                {countdownValue === 2 && "to see my first website"}
                {countdownValue === 1 && "only for my pedhakka"}
                {countdownValue === 0 && "Let's go! ✨"}
              </span>
            </motion.div>
          </motion.div>
        )}

        {step === 'letter' && (
          <motion.div
            key="letter"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative cursor-pointer group"
            onClick={() => setStep('surprise')}
          >
            <div className="bg-white p-8 rounded-lg shadow-2xl border-4 border-pink-200 relative z-10 animate-float">
              <Mail size={120} className="text-pink-500" />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg">
                <Heart fill="white" size={24} />
              </div>
            </div>
            <p className="mt-8 text-pink-600 font-cursive text-3xl text-center">
              A special letter for you...
            </p>
          </motion.div>
        )}

        {step === 'surprise' && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <motion.h1 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-7xl font-display text-pink-600 mb-4"
            >
              SURPRISE!
            </motion.h1>
            <button
              onClick={() => {
                handleFullscreen();
                setStep('hacked');
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-xl transition-all hover:scale-110 flex items-center gap-3 mx-auto"
            >
              <Sparkles /> Tap it!
            </button>
          </motion.div>
        )}

        {step === 'hacked' && (
          <motion.div
            key="hacked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono text-green-500 overflow-hidden p-6 animate-flicker"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            
            <Terminal size={80} className="mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-7xl font-bold hacker-text mb-8 text-center px-4">
              SYSTEM COMPROMISED
            </h2>
            
            <div className="w-full max-w-2xl space-y-2 text-left text-sm md:text-base">
              {[
                "> Initializing bypass protocol...",
                "> Accessing root directory...",
                "> [!] Security firewall disabled",
                "> Copying browser history...",
                "> Accessing WhatsApp database...",
                "> Extracting Instagram private media...",
                "> Downloading contacts list...",
                "> Cloning cloud storage...",
                "> Uploading to Elia's server...",
                "> 100% COMPLETE. SYSTEM HACKED BY ELIA."
              ].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className={i === 9 ? "text-red-500 font-bold mt-4" : ""}
                >
                  {text}
                </motion.div>
              ))}
            </div>

            <div className="mt-12 w-full max-w-md h-2 bg-gray-900 rounded-full overflow-hidden border border-green-900">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
              />
            </div>
            
            <div className="mt-4 text-xs opacity-50 animate-pulse">
              ENCRYPTION KEY: {Math.random().toString(36).substring(2, 15).toUpperCase()}
            </div>
          </motion.div>
        )}

        {step === 'prank' && (
          <motion.div
            key="prank"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center z-10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-9xl mb-8"
            >
              😂
            </motion.div>
            <h2 className="text-6xl font-display text-pink-600 mb-8 font-bold italic">
              IT'S A PRANK!
            </h2>
            <p className="text-2xl text-pink-800 mb-12 max-w-md mx-auto">
              Don't worry, your files are safe! Elia just wanted to tease you a bit. 😉
            </p>
            <button
              onClick={() => setStep('question')}
              className="bg-pink-500 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Phew! Continue 😂
            </button>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border-4 border-pink-300 max-w-lg w-full text-center z-10"
          >
            <h3 className="text-3xl font-bold text-pink-700 mb-8">
              Did you know this before or is it surprise?
            </h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setUserChoice('surprise');
                  setStep('response');
                }}
                className="bg-pink-500 text-white py-4 rounded-2xl text-xl font-bold hover:bg-pink-600 transition-colors shadow-lg"
              >
                1) Surprise! 🎁
              </button>
              <button
                onClick={() => {
                  setUserChoice('know');
                  setStep('response');
                }}
                className="bg-white border-2 border-pink-500 text-pink-500 py-4 rounded-2xl text-xl font-bold hover:bg-pink-50 transition-colors shadow-lg"
              >
                2) I know it 😎
              </button>
            </div>
          </motion.div>
        )}

        {step === 'response' && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10"
          >
            <div className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-pink-300 mb-8">
              <p className="text-3xl font-cursive text-pink-600">
                {userChoice === 'surprise' 
                  ? "It's my honor to surprise." 
                  : "Elia already guessed about you that you will know about his plan."}
              </p>
            </div>
            <button
              onClick={() => setStep('cake')}
              className="bg-pink-500 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Continue ✨
            </button>
          </motion.div>
        )}

        {step === 'cake' && (
          <motion.div
            key="cake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10 flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                rotate: showEasterEgg ? [0, -10, 10, -10, 10, 0] : [0, -2, 2, 0],
                scale: showEasterEgg ? [1, 1.5, 1] : [1, 1.05, 1]
              }}
              transition={{ 
                repeat: showEasterEgg ? 0 : Infinity, 
                duration: showEasterEgg ? 0.5 : 2 
              }}
              className="mb-8 cursor-pointer"
              onClick={handleCakeClick}
            >
              <Cake size={200} className="text-pink-500" />
            </motion.div>

            {showEasterEgg && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-yellow-100 text-yellow-800 p-4 rounded-2xl font-bold mb-4 shadow-lg border-2 border-yellow-400"
              >
                Hey! Don't eat the cake yet! Wait for the party! 😋🎂
              </motion.div>
            )}

            <h2 className="text-4xl font-bold text-pink-700 mb-12">
              Slice the screen to celebrate! 🎂
            </h2>
            <div 
              className="w-full h-64 border-4 border-dashed border-pink-300 rounded-3xl flex items-center justify-center cursor-crosshair relative overflow-hidden group"
              onMouseMove={(e) => {
                if (e.buttons === 1) handleSlice();
              }}
              onTouchMove={() => handleSlice()}
            >
              <p className="text-pink-400 font-bold group-hover:hidden">Swipe or drag across here!</p>
              
              {/* Visual Slice Effect */}
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                whileTap={{ width: '150%', opacity: 1 }}
                className="absolute h-2 bg-white shadow-[0_0_20px_white] rotate-[-45deg] pointer-events-none"
                style={{ top: '50%', left: '-25%' }}
              />
            </div>
          </motion.div>
        )}

        {step === 'sliced' && (
          <motion.div
            key="sliced"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              <h1 className="text-6xl md:text-8xl font-display text-pink-600 mb-6">
                Happy Birthday My dear Pedhakka! 💖
              </h1>
              <div className="flex justify-center gap-4 mb-12">
                <Sparkles size={48} className="text-yellow-400 animate-pulse" />
                <Heart size={48} className="text-red-500 animate-bounce" />
                <Sparkles size={48} className="text-yellow-400 animate-pulse" />
              </div>
            </motion.div>
            <button
              onClick={() => setStep('joke')}
              className="bg-pink-500 text-white px-10 py-4 rounded-full text-2xl font-bold shadow-xl hover:scale-105 transition-transform"
            >
              One last thing... 💌
            </button>
          </motion.div>
        )}

        {step === 'joke' && (
          <JokeStep onComplete={() => setStep('final')} />
        )}

        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full bg-white/90 backdrop-blur-lg p-12 rounded-[3rem] shadow-2xl border-8 border-pink-200 text-center z-10 relative"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-pink-500 p-6 rounded-full shadow-xl">
              <Gift size={48} className="text-white" />
            </div>
            
            <h2 className="text-4xl font-display text-pink-600 mb-8 mt-4">
              To My Dearest Sister
            </h2>
            
            <div className="space-y-6 text-xl text-pink-800 font-cursive leading-relaxed">
              <p>
                Dearest Pedhakka, you've always been more than just a sister to me. 
                You're my guide, my protector, and my best friend.
              </p>
              <p>
                Watching you grow and achieve so much makes me incredibly proud. 
                I hope this little surprise brought a smile to your face today!
              </p>
              <p>
                May your year be filled with as much joy, laughter, and love as you give to everyone around you. 
                Keep shining bright, and remember that I'm always here for you.
              </p>
              <p className="text-3xl font-bold pt-4">
                With all my love,<br/>
                Your brother, Elia
              </p>
            </div>

            <motion.div 
              className="mt-12 flex justify-center gap-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Heart className="text-pink-500 fill-pink-500" />
              <Flower className="text-pink-400" />
              <Heart className="text-pink-500 fill-pink-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkles for extra magic */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute text-yellow-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles size={16} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
