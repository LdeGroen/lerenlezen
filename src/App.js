import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Trophy, Volume2, VolumeX, RefreshCw, Loader2, Moon, Sun, AlertCircle } from 'lucide-react';

// Eenvoudige geluidseffecten URLs
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Zachte klik
  applause: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Applaus
  cheering: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Groot applaus / juichen
  fanfare: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Feestelijk
};

// Vaste lijst met woorden voor Groep 3
const WOORDEN_LIJST = [
  // Korte klinkers (a, e, i, o, u)
  "bal", "kam", "pan", "jas", "tas", "kat", "bad", "tak", "zak", "mat",
  "bak", "lak", "pak", "dal", "knal", "smal", "dam", "ham", "ram", "man",
  "kan", "van", "kas", "pas", "was", "das", "nat", "rat", "vat", "lat",
  
  "pen", "mes", "nek", "bel", "pet", "bed", "hek", "zes", "weg", "hem",
  "fles", "bes", "les", "bek", "dek", "gek", "lek", "vlek", "stek", "vel",
  "spel", "stel", "snel", "red", "pret", "wet", "net", "zet", "elf", "kelk",

  "vis", "pil", "kin", "lip", "kip", "wit", "dik", "ik", "in", "is",
  "mis", "sis", "wis", "fris", "wip", "stip", "knip", "sik", "hik", "mik",
  "stik", "zin", "min", "pin", "spin", "bil", "bril", "wil", "gil", "stil", "kist", "mist",
  
  "pop", "rok", "sok", "top", "bos", "mond", "wol", "pot", "hok", "vos",
  "rot", "bot", "mot", "zot", "slot", "bok", "kok", "wolk", "brok", "klok",
  "mos", "ros", "kop", "mop", "sop", "drop", "klop", "kom", "dom", "bom", "stom", "romp",

  "bus", "hut", "kus", "mus", "put", "rug", "mug", "dun", "juf", "nul",
  "lus", "zus", "blus", "plus", "nut", "brug", "vlug", "kun", "gun", "pun",
  "krul", "smul", "knus", "kruk", "druk", "stuk", "geluk", "lucht", "kust", "rust",
  
  // Lange klinkers (aa, ee, oo, uu)
  "maan", "raam", "kaas", "zaag", "haas", "baas", "taart", "kaart", "schaap",
  "haan", "baan", "laan", "gaan", "staan", "waan", "kraan", "zwaan", "raap",
  "gaap", "slaap", "aap", "laat", "maat", "gaat", "zaad", "draad", "kwaad", "naast",
  
  "been", "teen", "zeep", "mee", "zee", "veel", "neef", "feest", "geel",
  "steen", "geen", "leen", "heen", "speen", "twee", "nee", "ree", "fee", "vee",
  "keel", "heel", "deel", "meel", "leef", "geef", "weef", "reef", "beek", "week",

  "boom", "roos", "oog", "boot", "noot", "rood", "groot", "hoofd", "zoon",
  "oom", "stoom", "droom", "room", "loop", "hoop", "doop", "knoop", "koop",
  "boos", "doos", "loos", "kroos", "boog", "hoog", "droog", "poog", "poot",
  "stoot", "goot", "vloot", "kroon", "loon", "woon", "boon", "toon", "oor",
  
  "vuur", "muur", "uur", "huur", "duur", "stuur", "buur", "schuur",
  "zuur", "puur", "guur", "kuur",
  
  // Tweeklanken
  "boek", "koek", "doek", "zoet", "voet", "poes", "stoel", "schoen", "groen",
  "hoek", "zoek", "broek", "vloek", "roep", "soep", "poep", "stoep", "groep",
  "snoep", "moet", "roet", "stoet", "groet", "hoes", "moes", "loes", "boel",
  "koel", "poel", "doel", "zoen", "toen", "oen",

  "tien", "mier", "wiel", "knie", "fiets", "ziek", "kies", "riem", "niet",
  "zien", "dien", "wien", "hier", "dier", "gier", "pier", "vier", "stier",
  "hiel", "viel", "ziel", "drie", "wie", "die", "niets", "iets", "wiek",
  "piek", "riek", "vies", "lies", "kiem", "biet", "riet", "giet", "piet",
  
  "neus", "reus", "deur", "jeuk", "leuk", "beuk", "geur", "kleur", "scheur",
  "keus", "kneus", "deus", "zeur", "sleur", "speur", "treur", "deuk", "kreuk", "breuk",
  
  "huis", "muis", "tuin", "ui", "trui", "buit", "duim", "fluit", "kruis",
  "luis", "buis", "kluis", "ruis", "pluis", "kuil", "huil", "vuil", "uil",
  "ruit", "spuit", "uit", "fruit", "buik", "ruik", "pruik", "luik", "bruid",

  "ei", "geit", "trein", "wei", "klei", "plein", "reis", "zeil", "dweil",
  "kei", "lei", "mei", "prei", "brei", "feit", "meid", "bereid", "paleis",
  
  "ijs", "tijd", "rij", "kijk", "bijl", "fijn", "pijl", "wijn", "lijn",
  "grijs", "prijs", "wijs", "lijst", "rijst", "nijd", "wijd", "glijd", "strijd",
  "kwijt", "spijt", "ontbijt", "krijt", "lijf", "wrijf", "stijf", "vijf",

  "hout", "zout", "koud", "oud", "goud", "woud", "fout", "stout", "touw",
  "stoud", "jou", "nou", "kouw", "mouw", "bouwen", "vrouw", "trouw",

  "pauw", "saus", "blauw", "lauw", "rauw", "auto", "paus",
  "nauw", "gauw", "klauw",
  
  // Eind -ng / -nk
  "bang", "lang", "wang", "zang", "gang", "ring", "ding", "jong", "tong",
  "hang", "vang", "tang", "slang", "stang", "kring", "spring", "zing", "wring",
  "eng", "meng", "kreng", "streng", "sprong", "long",

  "bank", "dank", "pink", "vonk", "zink", "bonk", 
  "jank", "mank", "plank", "stank", "klank", "ronk", "schonk", "pronk",
  "flink", "drink", "klink", "stink",
  
  // Sch- woorden
  "schaap", "school", "schip", "schat", "schep", "schuin", "schoon",
  "schaal", "schaar", "schaats", "schade", "scheef", "scheel", "scheen",
  "scherf", "scherp", "schiet", "schik", "schil", "schim", "schok", "schol",
  "schop", "schor", "schot", "schub", "schuif", "schuil", "schuim"
];

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center font-sans">
          <AlertCircle size={64} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oeps, er ging iets mis!</h2>
          <p className="text-gray-600 mb-6">De app kon niet goed laden.</p>
          <div className="bg-white p-4 rounded-lg shadow border border-red-100 text-left max-w-md w-full overflow-auto mb-6 text-xs text-red-600 font-mono">
            {this.state.error && this.state.error.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-full font-bold shadow hover:bg-red-700 transition"
          >
            Probeer opnieuw
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

function ReadingAppContent() {
  const [words, setWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]); // Nieuwe state voor de 'pot'
  const [currentWord, setCurrentWord] = useState('');
  
  // Veilige initialisatie van localStorage
  const [count, setCount] = useState(() => {
    try {
      const savedCount = localStorage.getItem('readingAppCount');
      return savedCount ? parseInt(savedCount, 10) : 0;
    } catch (e) {
      console.warn("Kon localStorage niet lezen:", e);
      return 0;
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState('small');

  const audioApplause = useRef(null);
  const audioCheering = useRef(null);
  const audioFanfare = useRef(null);
  const audioClick = useRef(null);

  // Veilig opslaan in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('readingAppCount', count.toString());
    } catch (e) {
      console.warn("Kon niet opslaan in localStorage:", e);
    }
  }, [count]);

  useEffect(() => {
    // Stel de masterlijst in
    setWords(WOORDEN_LIJST);
    
    // Kies een willekeurig startwoord
    const randomIndex = Math.floor(Math.random() * WOORDEN_LIJST.length);
    const startWord = WOORDEN_LIJST[randomIndex];
    setCurrentWord(startWord);

    // Initialiseer de pot (availableWords) met alles BEHALVE het startwoord
    // Zo voorkomen we directe herhaling bij de eerste klik
    const initialPool = [...WOORDEN_LIJST];
    initialPool.splice(randomIndex, 1);
    setAvailableWords(initialPool);

    setLoading(false);

    audioApplause.current = new Audio(SOUNDS.applause);
    audioCheering.current = new Audio(SOUNDS.cheering);
    audioFanfare.current = new Audio(SOUNDS.fanfare);
    audioClick.current = new Audio(SOUNDS.click);
    
    if(audioClick.current) audioClick.current.volume = 0.3;
  }, []);

  const playSound = useCallback((type) => {
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
  }, [soundEnabled]);

  const handleTap = useCallback(() => {
    // Veiligheid: wacht tot woorden geladen zijn
    if (words.length === 0) return;

    // We werken met een kopie van de huidige pot
    let pool = [...availableWords];

    // Als de pot leeg is, vullen we hem weer met ALLE woorden (nieuwe cyclus)
    if (pool.length === 0) {
      pool = [...words];
    }

    // Kies een willekeurig woord uit de pot
    const randomIndex = Math.floor(Math.random() * pool.length);
    const newWord = pool[randomIndex];

    // Zet het nieuwe woord op het scherm
    setCurrentWord(newWord);

    // Verwijder het gekozen woord uit de pot voor de volgende keer
    pool.splice(randomIndex, 1);
    setAvailableWords(pool);

    const newCount = count + 1;
    setCount(newCount);

    if (newCount % 100 === 0) {
      playSound('fanfare');
      playSound('cheering');
      triggerConfetti('big');
    } else if (newCount % 10 === 0) {
      playSound('applause');
      triggerConfetti('small');
    } else {
      playSound('click');
    }
  }, [availableWords, words, count, playSound]);

  const triggerConfetti = (type) => {
    setConfettiType(type);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), type === 'big' ? 5000 : 3000);
  };

  const resetGame = (e) => {
    e.stopPropagation();
    if (window.confirm("Wil je de teller weer op 0 zetten?")) {
      setCount(0);
      setShowConfetti(false);
      // Bij reset kunnen we optioneel ook de woordenpot resetten, 
      // maar het is leuker om door te gaan waar we waren.
    }
  };

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

  return (
    <div className={darkMode ? "dark" : ""}>
      <div 
        onClick={handleTap}
        className="relative flex flex-col items-center justify-between min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer touch-manipulation select-none transition-colors duration-300"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

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
            aria-label="Reset teller"
          >
            <RefreshCw size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-16 w-full max-w-3xl flex items-center justify-center border-b-8 border-slate-200 dark:border-slate-700 active:border-b-0 active:translate-y-2 transition-all duration-75">
            <span 
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-slate-800 dark:text-slate-100 tracking-wide text-center break-words"
              style={{ fontFamily: 'Verdana, sans-serif' }}
            >
              {currentWord}
            </span>
          </div>
          <p className="mt-8 text-slate-400 dark:text-slate-500 text-lg animate-pulse">
            Tik op het scherm voor het volgende woord
          </p>
        </div>

        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {confettiType === 'big' ? (
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

// Wrapper die de Error Boundary toepast
export default function ReadingApp() {
  return (
    <ErrorBoundary>
      <ReadingAppContent />
    </ErrorBoundary>
  );
}