import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Trophy, Volume2, VolumeX, RefreshCw, Loader2, Moon, Sun } from 'lucide-react';

// Eenvoudige geluidseffecten URLs
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Zachte klik
  applause: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Applaus
  cheering: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Groot applaus / juichen
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Feestelijk
};

// Vaste lijst met woorden voor Groep 3
// Inclusief korte/lange klinkers en tweeklanken (oe, au, etc.)
const WOORDEN_LIJST = [
  // Korte klinkers (a, e, i, o, u)
  "bal", "kam", "pan", "jas", "tas", "kat", "bad", "tak", "zak", "mat",
  "pen", "mes", "nek", "bel", "pet", "bed", "hek", "zes", "weg", "hem",
  "vis", "pil", "kin", "lip", "kip", "wit", "dik", "ik", "in", "is",
  "pop", "rok", "sok", "top", "bos", "mond", "wol", "pot", "hok", "vos",
  "bus", "hut", "kus", "mus", "put", "rug", "mug", "dun", "juf", "nul",
  
  // Lange klinkers (aa, ee, oo, uu)
  "maan", "raam", "kaas", "zaag", "haas", "baas", "taart", "kaart", "schaap",
  "been", "teen", "zeep", "mee", "zee", "veel", "neef", "feest", "geel",
  "boom", "roos", "oog", "boot", "noot", "rood", "groot", "hoofd", "zoon",
  "vuur", "muur", "uur", "huur", "duur", "stuur", "buur", "schuur",
  
  // Tweeklanken (oe, ie, eu, ui, ei, ij, ou, au)
  "boek", "koek", "doek", "zoet", "voet", "poes", "stoel", "schoen", "groen",
  "tien", "mier", "wiel", "knie", "fiets", "ziek", "kies", "riem", "niet",
  "neus", "reus", "deur", "jeuk", "leuk", "beuk", "geur", "kleur", "scheur",
  "huis", "muis", "tuin", "ui", "trui", "buit", "duim", "fluit", "kruis",
  "ei", "geit", "trein", "wei", "klei", "plein", "reis", "zeil", "dweil",
  "ijs", "tijd", "rij", "kijk", "bijl", "fijn", "pijl", "wijn", "lijn",
  "hout", "zout", "koud", "oud", "goud", "woud", "fout", "stout", "touw",
  "pauw", "saus", "blauw", "lauw", "rauw", "auto", "paus",
  
  // Eind -ng / -nk
  "bang", "lang", "wang", "zang", "gang", "ring", "ding", "jong", "tong",
  "bank", "dank", "pink", "vonk", "zink", "bonk", 
  
  // Sch- woorden
  "schaap", "school", "schip", "schat", "schep", "schuin", "schoon"
];

export default function ReadingApp() {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiType, setConfettiType] = useState<'small' | 'big'>('small');

  // Refs voor audio objecten
  const audioApplause = useRef<HTMLAudioElement | null>(null);
  const audioCheering = useRef<HTMLAudioElement | null>(null);
  const audioFanfare = useRef<HTMLAudioElement | null>(null);
  const audioClick = useRef<HTMLAudioElement | null>(null);

  // Data laden (nu lokaal, dus direct klaar)
  useEffect(() => {
    // We gebruiken nu de vaste lijst
    setWords(WOORDEN_LIJST);
    
    // Kies direct een willekeurig woord
    setCurrentWord(WOORDEN_LIJST[Math.floor(Math.random() * WOORDEN_LIJST.length)]);
    setLoading(false);

    // Audio initialiseren
    audioApplause.current = new Audio(SOUNDS.applause);
    audioCheering.current = new Audio(SOUNDS.cheering);
    audioFanfare.current = new Audio(SOUNDS.fanfare);
    audioClick.current = new Audio(SOUNDS.click);
    
    // Volume iets zachter zetten
    if(audioClick.current) audioClick.current.volume = 0.3;
  }, []);

  // Functie om audio af te spelen
  const playSound = (type: 'click' | 'applause' | 'cheering' | 'fanfare') => {
    if (!soundEnabled) return;

    try {
      if (type === 'click' && audioClick.current) {
        audioClick.current.currentTime = 0;
        audioClick.current.play().catch(() => {});
      } else if (type === 'applause' && audioApplause.current) {
        audioApplause.current.currentTime = 0;
        audioApplause.current.play().catch(() => {});
      } else if (type === 'cheering' && audioCheering.current) {
        audioCheering.current.currentTime = 0;
        audioCheering.current.play().catch(() => {});
      } else if (type === 'fanfare' && audioFanfare.current) {
        audioFanfare.current.currentTime = 0;
        audioFanfare.current.play().catch(() => {});
      }
    } catch (e) {
      console.error("Audio play error", e);
    }
  };

  // Logica voor het volgende woord
  const handleTap = useCallback(() => {
    if (words.length === 0) return;

    // Nieuw willekeurig woord kiezen
    // Tip: we kiezen echt willekeurig, dus soms kan een woord 2x komen. 
    // Dat is voor oefenen vaak juist goed (herhaling).
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);

    // Teller verhogen
    const newCount = count + 1;
    setCount(newCount);

    // Beloningslogica
    if (newCount % 100 === 0) {
      // Groot feest bij 100, 200, etc.
      playSound('fanfare');
      playSound('cheering');
      triggerConfetti('big');
    } else if (newCount % 10 === 0) {
      // Applaus bij 10, 20, 30, etc.
      playSound('applause');
      triggerConfetti('small');
    } else {
      // Gewone klik
      playSound('click');
    }
  }, [count, words, soundEnabled]);

  const triggerConfetti = (type: 'small' | 'big') => {
    setConfettiType(type);
    setShowConfetti(true);
    // Stop confetti na een tijdje
    setTimeout(() => setShowConfetti(false), type === 'big' ? 5000 : 3000);
  };

  // Reset functie
  const resetGame = (e: React.MouseEvent) => {
    e.stopPropagation(); // Voorkom dat dit als een 'woord-tap' telt
    if (confirm("Wil je de teller weer op 0 zetten?")) {
      setCount(0);
      setShowConfetti(false);
    }
  };

  // Startscherm om audio context te activeren
  if (!gameStarted) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 dark:bg-slate-900 font-sans p-4 text-center select-none transition-colors duration-300">
          <div className="absolute top-4 right-4">
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-500 dark:text-slate-300 hover:text-blue-500 transition-colors"
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-blue-200 dark:border-slate-700 transition-colors duration-300">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">Leren Lezen</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Klaar om te oefenen? <br/>
              Klik op Start!
            </p>
            
            {loading ? (
              <div className="flex items-center justify-center text-blue-500 dark:text-blue-400 gap-2">
                <Loader2 className="animate-spin w-8 h-8" />
                <span>Woorden laden...</span>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setGameStarted(true);
                  playSound('click'); 
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-3xl font-bold py-6 px-8 rounded-2xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
              >
                START
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hoofdscherm (het spel)
  return (
    <div className={darkMode ? "dark" : ""}>
      <div 
        onClick={handleTap}
        className="relative flex flex-col items-center justify-between min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer touch-manipulation select-none transition-colors duration-300"
      >
        {/* Achtergrond versiering (subtiel) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        {/* Header balk */}
        <div className="w-full p-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-500 dark:text-slate-300 hover:text-blue-500 transition-colors"
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setDarkMode(!darkMode); }}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-500 dark:text-slate-300 hover:text-blue-500 transition-colors"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-md border-2 border-yellow-100 dark:border-slate-700 transition-colors">
            <Star className="text-yellow-400 fill-yellow-400" size={24} />
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 font-mono">{count}</span>
          </div>

          <button 
            onClick={resetGame}
            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors"
          >
            <RefreshCw size={24} />
          </button>
        </div>

        {/* Het Woord */}
        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-16 w-full max-w-3xl flex items-center justify-center border-b-8 border-slate-200 dark:border-slate-700 active:border-b-0 active:translate-y-2 transition-all duration-75">
            <span 
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-slate-800 dark:text-slate-100 tracking-wide text-center break-words"
              style={{ fontFamily: 'Verdana, sans-serif' }} // Verdana is vaak goed leesbaar voor kinderen
            >
              {currentWord}
            </span>
          </div>
          <p className="mt-8 text-slate-400 dark:text-slate-500 text-lg animate-pulse">
            Tik op het scherm voor het volgende woord
          </p>
        </div>

        {/* Confetti effecten */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {confettiType === 'big' ? (
              // Big party effect (100 words)
              <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute animate-fall"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `-20px`,
                        animationDuration: `${Math.random() * 2 + 2}s`,
                        animationDelay: `${Math.random() * 0.5}s`,
                      }}
                    >
                      <Trophy size={Math.random() * 30 + 30} className="text-yellow-500 fill-yellow-300" />
                    </div>
                  ))}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-bounce">
                    <div className="text-6xl md:text-9xl font-black text-pink-500 drop-shadow-lg bg-white dark:bg-slate-800 bg-opacity-80 p-8 rounded-3xl border-4 border-pink-300">
                      {count}!
                    </div>
                  </div>
              </div>
            ) : (
              // Small applause effect (10 words)
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute animate-ping"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 60 + 20}%`,
                        animationDuration: `1s`,
                        animationDelay: `${Math.random() * 0.5}s`,
                      }}
                    >
                      <Star size={40} className="text-yellow-400 fill-yellow-200" />
                    </div>
                ))}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-green-500 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-lg border-2 border-green-200 animate-bounce">
                  Goed zo!
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Custom Styles for falling animation */}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation-name: fall;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
          }
        `}</style>
      </div>
    </div>
  );
}