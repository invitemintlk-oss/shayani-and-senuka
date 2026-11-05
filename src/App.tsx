import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, VolumeX, Heart } from 'lucide-react';
import { Toaster } from 'sonner';

import { EnvelopeOpening } from './components/EnvelopeOpening';
import { Hero } from './components/Hero';
import { CoupleDetails } from './components/CoupleDetails';
import { CeremonyDetails } from './components/CeremonyDetails';
import { Location } from './components/Location';
import { Timeline } from './components/Timeline';
import { Countdown } from './components/Countdown';
import { RSVPForm } from './components/RSVPForm';
import { WishesSection } from './components/WishesSection';
import { WEDDING } from './config';

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/paulyudin-wedding-485932.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMusicStart = () => {
    setIsMusicPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  if (!showInvitation) {
    return (
      <EnvelopeOpening
        onComplete={() => setShowInvitation(true)}
        onMusicStart={handleMusicStart}
      />
    );
  }

  // Set the wedding date for the countdown
  const weddingDate = new Date(WEDDING.dateISO);

  return (
    <div className="font-sans text-stone-800 bg-brand-ivory overflow-hidden selection:bg-brand-beige-deep/20">
      <Toaster position="top-center" />
      
      {/* Premium Floating Music Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 w-12 sm:w-14 h-12 sm:h-14 bg-brand-beige/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(71,112,90,0.3)] flex items-center justify-center border border-white/60 text-white hover:scale-105 transition-all duration-300"
      >
        {isMusicPlaying ? <Music className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />}
      </motion.button>

      <Hero />
      
      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-mist relative">
        <CoupleDetails />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-mist via-white to-brand-ivory relative">
        <CeremonyDetails />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-mist relative">
        <Location />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-mist via-brand-ivory to-brand-ivory relative">
        <Timeline />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-br from-brand-beige via-[#7FA388] to-brand-beige-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#FFFFFF_0%,transparent_45%),radial-gradient(circle_at_80%_80%,#EBB0B4_0%,transparent_40%)]" />
          <div className="max-w-6xl mx-auto px-6 mb-16 text-center relative">
            <span className="text-white uppercase tracking-[0.4em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
              The Wait Is Almost Over
            </span>
          </div>
          <Countdown targetDate={weddingDate} />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-ivory via-brand-mist to-brand-mist relative">
        <RSVPForm />
      </div>

      <div className="py-24 sm:py-32 bg-gradient-to-b from-brand-mist via-brand-ivory to-brand-ivory relative">
        <WishesSection />
      </div>

      {/* Elegant Footer Signature */}
      <footer className="py-14 bg-gradient-to-br from-brand-beige to-brand-beige-deep text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/15 blur-[80px] rounded-full pointer-events-none" />
        <Heart className="relative w-6 h-6 mx-auto mb-6 text-brand-gold-light fill-brand-gold-light/30" />
        <p className="relative font-display text-4xl sm:text-5xl text-white mb-2">{WEDDING.brideName} &&nbsp;{WEDDING.groomName}</p>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] font-sans text-brand-gold-light font-semibold block relative">
          {WEDDING.dateLong}
        </span>

      </footer>
    </div>
  );
}