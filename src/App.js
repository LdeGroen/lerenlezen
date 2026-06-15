import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Trophy, Volume2, VolumeX, RefreshCw, Loader2, Moon, Sun, AlertCircle, BookOpen, Type, Play, Undo, Library, ArrowRight, Sparkles, List, X } from 'lucide-react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

// Eenvoudige geluidseffecten URLs
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Zachte klik
  applause: 'https://github.com/LdeGroen/lerenlezen/raw/refs/heads/main/Goed%20gedaan%20Luc.mp3', // Applaus (Jouw bestand)
  cheering: 'https://github.com/LdeGroen/lerenlezen/raw/refs/heads/main/Groot%20applaus.mp3', // Groot applaus (Jouw bestand)
  fanfare: 'https://github.com/LdeGroen/lerenlezen/raw/refs/heads/main/Melanie.m4a', // Feestelijk (Jouw bestand)
  pageFlip: 'https://github.com/LdeGroen/lerenlezen/raw/refs/heads/main/Melanie.m4a', // Bladzijde omslaan
};

// --- DATA: WOORDEN & ZINNEN ---
const WOORDEN_LIJST = [
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
  "boek", "koek", "doek", "zoet", "voet", "poes", "stoel", "schoen", "groen",
  "hoek", "zoek", "broek", "vloek", "roep", "soep", "stoep", "groep",
  "snoep", "moet", "roet", "stoet", "groet", "hoes", "moes", "loes", "boel",
  "koel", "poel", "doel", "zoen", "toen",
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
  "bang", "lang", "wang", "zang", "gang", "ring", "ding", "jong", "tong",
  "hang", "vang", "tang", "slang", "stang", "kring", "spring", "zing", "wring",
  "eng", "meng", "kreng", "streng", "sprong", "long",
  "bank", "dank", "pink", "vonk", "zink", "bonk", 
  "jank", "mank", "plank", "stank", "klank", "ronk", "schonk", "pronk",
  "flink", "drink", "klink", "stink",
  "schaap", "school", "schip", "schat", "schep", "schuin", "schoon",
  "schaal", "schaar", "schaats", "schade", "scheef", "scheel", "scheen",
  "scherf", "scherp", "schiet", "schik", "schil", "schim", "schok", "schol",
  "schop", "schor", "schot", "schub", "schuif", "schuil", "schuim"
];

const ZINNEN_LIJST = [
  "ik ben tom", "kijk naar de maan", "de kat is lief", "ik eet een ijsje",
  "de zon is geel", "waar is mijn jas", "pap is in de tuin", "ik ga naar school",
  "de bal is rond", "ik zie een vis", "tom eet een noot", "de mus zit op het dak",
  "ik speel met de bal", "de boom is hoog", "het is koud", "de soep is heet",
  "ik lees een boek", "mam zit op de bank", "de hond blaft", "ik heb een tas",
  "de lucht is blauw", "kijk naar die wolk", "ik wil een koek", "de deur is dicht",
  "de bloem is rood", "ik ren heel hard", "de vis zwemt", "ik zie een koe",
  "de bel gaat", "ik ben zes jaar", "de pen is op", "ik zit in de klas",
  "het ijs is koud", "de poes slaapt", "ik fiets naar huis", "de wind waait",
  "ik maak een tekening", "de auto is groen", "kijk uit voor de hond", "ik ben blij",
  "de maan is wit", "ik hoor een duif", "de zaak is dicht", "ik lust geen vis",
  "waar is de poes", "ik pak mijn jas", "de weg is lang", "ik sta op de stoep",
  "de hond is nat", "ik zie een geit", "de koe zegt boe", "het paard rent snel",
  "ik lig in bed", "de klok tikt", "ik pak mijn tas", "mam zet thee",
  "de zon is warm", "het gras is groen", "de zee is diep", "kijk naar die vogel",
  "ik ren naar huis", "tom pakt de bal", "kim lacht hard", "ik ben niet boos",
  "het is heel stil", "ik ben best moe", "de juf is lief", "ik schrijf mijn naam",
  "de lamp is aan", "ik zit op de stoel", "de vloer is schoon", "ik eet een peer",
  "de muis is snel", "waar is de kaas", "ik drink een glas melk", "de boot vaart weg",
  "ik hoor een lied", "de trein komt eraan", "ik speel op straat", "de bak is vol",
  "ik zoek mijn sok", "de ring is van goud", "ik help mijn vriend", "het vuur is heet",
  "de lucht is grijs", "ik draag een muts", "het is tijd", "ik ga naar bed",
  "de kip legt een ei", "ik zie een ster", "de maan schijnt", "ik ben niet bang",
  "de weg is nat", "ik stap op de fiets", "de band is lek", "ik loop naar school"
];

// --- DATA: HET VERHAAL (Roan en Puck) ---
const VERHALEN = [
  {
    titel: "de vreemde steen",
    zinnen: [
      "roan loopt in het bos.", "het is heel stil.", "ze ziet iets glimmen.", 
      "het is een steen.", "de steen is blauw.", "hij geeft licht.", 
      "roan pakt de steen.", "hij voelt warm aan.", "kijk puck!", "puck komt kijken.", 
      "wat is dat?", "een toversteen.", "roan voelt een tinteling.", 
      "haar hand trilt een beetje.", "ik voel magie.", "puck lacht hard.", 
      "mag ik ook?", "hij pakt de steen.", "de steen wordt rood.", "wat gek!",
      "puck voelt niets.", "alleen maar warmte.", "roan pakt hem terug.",
      "de steen wordt weer blauw.", "dit is bijzonder.", "we nemen hem mee.",
      "in de tas ermee.", "snel naar huis."
    ],
    vraag: "wat gebeurde er met de steen toen puck hem pakte?"
  },
  {
    titel: "puck kan vliegen",
    zinnen: [
      "ze zijn weer thuis.", "puck zit op de bank.", "roan pakt de steen.",
      "ze knijpt erin.", "opeens gebeurt er iets.", "puck gaat omhoog!",
      "zijn voeten zijn los.", "hij zweeft in de lucht.", "kijk roan!",
      "ik kan vliegen!", "puck lacht en juicht.", "hij tikt het plafond aan.",
      "roan schrikt er van.", "kom naar beneden!", "maar puck luistert niet.",
      "hij vliegt rondjes.", "als een vogel.", "of als een bij.",
      "pas op voor de lamp!", "boem!", "puck stoot zijn hoofd.", "au roept puck.",
      "dan zakt hij weer.", "hij landt op de bank.", "dat was gaaf!",
      "jij hebt krachten roan.", "jij deed dat.", "met de steen."
    ],
    vraag: "waardoor kon puck ineens vliegen?"
  },
  {
    titel: "de kat in de boom",
    zinnen: [
      "roan kijkt naar buiten.", "de kat van de buren.", "hij heet pluis.",
      "pluis zit in de boom.", "hij durft niet terug.", "pluis miauwt hard.",
      "de buurvrouw kijkt.", "ze is heel bang.", "mijn arme kat!", "roan ziet het.",
      "ze pakt de steen.", "puck ziet het ook.", "doe iets roan!",
      "roan wijst naar pluis.", "de steen licht op.", "een blauwe straal.",
      "de tak buigt omlaag.", "heel zachtjes.", "net een lift.",
      "pluis stapt eraf.", "hij is op de grond.", "de buurvrouw is blij.",
      "dank je wel!", "hoe deed je dat?", "gewoon geluk.", "zegt roan snel.",
      "puck moet giechelen.", "het is ons geheim."
    ],
    vraag: "hoe kwam de kat uit de boom?"
  },
  {
    titel: "de koude soep",
    zinnen: [
      "het is tijd voor eten.", "mama schept soep op.", "tomaten soep.",
      "puck heeft honger.", "hij neemt een hap.", "bah zegt puck.",
      "de soep is koud.", "mama is vergeten.", "het vuur stond laag.",
      "ik warm het op.", "zegt mama lief.", "nee wacht maar.", "zegt puck zacht.",
      "roan knijpt de steen.", "ze kijkt naar de soep.", "de soep gaat dampen.",
      "er komen belletjes.", "nu is hij heet.", "puck neemt een hap.",
      "heerlijk warm!", "mama snapt er niks van.", "net was hij koud.",
      "nu is hij heet.", "wat een wonder.", "roan en puck lachen.",
      "eet smakelijk allemaal.", "de soep is op.", "de buik is vol."
    ],
    vraag: "wie zorgde ervoor dat de soep warm werd?"
  },
  {
    titel: "geen licht meer",
    zinnen: [
      "het is avond.", "buiten is het donker.", "de tv staat aan.",
      "ineens is het stil.", "de tv gaat uit.", "de lamp gaat uit.",
      "het is pikdonker.", "stroomstoring zegt pap.", "waar zijn de kaarsen?",
      "puck vindt het eng.", "ik zie niks.", "roan pakt zijn hand.",
      "wees niet bang.", "ik ben bij je.", "roan pakt de steen.",
      "licht zegt roan.", "de steen gaat aan.", "als een zaklamp.",
      "de kamer is blauw.", "wauw zegt pap.", "wat is dat?",
      "een speelgoed lamp.", "liegt roan snel.", "het geeft goed licht.",
      "we spelen een spel.", "in het blauwe licht.", "tot de stroom komt.",
      "puck is niet meer bang."
    ],
    vraag: "wat gebruikte roan om licht te maken?"
  },
  {
    titel: "de vis wil zwemmen",
    zinnen: [
      "roan heeft een vis.", "hij heet blub.", "blub zit in de kom.",
      "hij zwemt rondjes.", "dat is saai.", "vindt puck ook.",
      "blub wil meer.", "blub wil vliegen.", "net als puck.",
      "roan schudt nee.", "vissen moeten zwemmen.", "maar misschien groter.",
      "roan wijst met de steen.", "het water groeit.", "het water komt omhoog.",
      "uit de kom.", "het is een bal.", "een bal van water.",
      "blub zwemt erin.", "de bal zweeft rond.", "door de kamer.",
      "blub kijkt blij.", "hij ziet de kast.", "hij ziet de bank.",
      "terug in de kom.", "zegt roan streng.", "plons!",
      "blub is weer thuis.", "dat was een reis."
    ],
    vraag: "wat gebeurde er met het water uit de vissenkom?"
  },
  {
    titel: "een grapje van puck",
    zinnen: [
      "puck wil ook toveren.", "mag ik de steen?", "even maar vraagt hij.",
      "roan geeft hem.", "doe voorzichtig.", "puck wijst naar roan.",
      "hij roept bloem!", "er gebeurt niks.", "hij roept het harder.",
      "bloem bloem bloem!", "opeens een plof.", "op het hoofd van roan.",
      "er groeit een bloem.", "uit haar haar.", "een grote rode roos.",
      "puck rolt van de lach.", "je bent een vaas!", "roan pakt de spiegel.",
      "ze moet ook lachen.", "het staat best mooi.", "haal weg zegt ze.",
      "puck probeert het.", "maar het lukt niet.", "roan doet het zelf.",
      "weg is de bloem.", "geen toveren voor puck.", "hij is te speels."
    ],
    vraag: "wat groeide er op het hoofd van roan?"
  },
  {
    titel: "de bal is weg",
    zinnen: [
      "ze spelen in de tuin.", "met een grote bal.", "puck schopt hard.",
      "te hard.", "de bal vliegt weg.", "over de schutting.",
      "in de tuin van buurman.", "die is vaak boos.", "niet weer he.",
      "zegt de buurman.", "ik pak hem niet.", "puck kijkt sip.",
      "mijn mooie bal.", "roan kijkt door het gat.", "ze ziet de bal.",
      "hij ligt ver weg.", "kom bal zegt ze.", "de steen in haar zak.",
      "de bal rolt.", "uit zichzelf.", "hij rolt naar het hek.",
      "onder het hek door.", "terug bij puck.", "puck is zo blij.",
      "dank je toversteen.", "de buurman zag niks.", "snel naar binnen.",
      "genoeg gespeeld."
    ],
    vraag: "hoe kwam de bal terug bij puck?"
  },
  {
    titel: "naar bed",
    zinnen: [
      "tanden poetsen.", "pyjama aan.", "het is bedtijd.", "puck is moe.",
      "hij ligt in bed.", "dekens zijn warm.", "roan komt ook.",
      "nog een verhaaltje?", "vraagt mama lief.", "ja over ridders.",
      "mama leest voor.", "roan luistert goed.", "puck slaapt al bijna.",
      "mama geeft een kus.", "slaap lekker schat.", "ze doet het licht uit.",
      "roan pakt de steen.", "onder haar kussen.", "welterusten steen.",
      "de steen knippert.", "alsof hij praat.", "morgen weer een dag.",
      "vol met magie.", "roan doet ogen dicht.", "droom zacht."
    ],
    vraag: "waar bewaart roan de steen als ze gaat slapen?"
  },
  {
    titel: "een mooie droom",
    zinnen: [
      "roan droomt fijn.", "ze is een prinses.", "puck is een ridder.",
      "ze wonen in een kasteel.", "de steen is de schat.", "iedereen wil hem.",
      "maar roan is snel.", "ze tovert een muur.", "niemand kan erbij.",
      "puck vliegt rond.", "op een draak.", "de draak is lief.",
      "hij spuugt geen vuur.", "hij spuugt snoepjes.", "het regent spekjes.",
      "roan vangt ze op.", "wat een feest.", "dan wordt ze wakker.",
      "de zon schijnt.", "het was maar een droom.", "of toch niet?",
      "er ligt een spekje.", "op haar kussen.", "roan lacht zachtjes.",
      "magie is overal."
    ],
    vraag: "wat spuugde de draak in de droom van roan?"
  },
  {
    titel: "verstoppertje spelen",
    zinnen: [
      "roan telt tot tien.", "één twee drie.", "puck rent weg.", 
      "hij zoekt een plek.", "vier vijf zes.", "achter de bank?", "nee te makkelijk.",
      "zeven acht negen.", "puck kruipt in de kast.", "tien ik kom!", 
      "roan kijkt rond.", "waar is puck?", "ze kijkt onder de tafel.",
      "ze kijkt achter het gordijn.", "niemand te zien.", "puck is stil.",
      "hij houdt zijn adem in.", "roan pakt de steen.", "waar is hij steen?",
      "de steen geeft licht.", "hij wijst naar de kast.", "roan loopt erheen.",
      "boeh roept puck.", "roan schrikt zich rot.", "gevonden!",
      "jij speelde vals.", "met je toversteen.", "puck moet lachen."
    ],
    vraag: "waar had puck zich verstopt?"
  },
  {
    titel: "de auto is stuk",
    zinnen: [
      "puck speelt op de vloer.", "met zijn rode auto.", "vroem vroem.",
      "oeps hij botst.", "tegen de muur.", "het wiel breekt af.",
      "puck kijkt sip.", "zijn lip trilt.", "mijn mooie auto.",
      "huil maar niet.", "zegt roan lief.", "we maken hem wel.",
      "met lijm vraagt puck?", "nee met magie.", "roan pakt de auto.",
      "ze houdt de steen erbij.", "steen maak hem heel.", "er komt een vonk.",
      "het wiel draait weer.", "hij zit weer vast.", "puck is zo blij.",
      "dank je wel roan.", "nu kan ik weer racen.", "maar wel voorzichtig.",
      "niet meer botsen hoor."
    ],
    vraag: "wat was er kapot aan de speelgoedauto?"
  },
  {
    titel: "regen en zon",
    zinnen: [
      "het regent heel hard.", "tik tik op het raam.", "puck wil naar buiten.",
      "ik wil voetballen.", "dat kan nu niet.", "je wordt kletsnat.",
      "puck kijkt boos.", "stomme regen.", "roan kijkt naar de lucht.",
      "grijze wolken.", "mag ik proberen?", "vraagt roan zacht.",
      "ze pakt de steen.", "ga weg wolk.", "kom terug zon.",
      "de steen wordt geel.", "heel fel geel.", "de wolken breken.",
      "er komt een gat.", "de zon schijnt erdoor.", "precies in de tuin.",
      "het stopt met regenen.", "puck pakt de bal.", "jij bent de beste.",
      "roan lacht trots.", "fijne wedstrijd."
    ],
    vraag: "wat toverde roan weg met de steen?"
  },
  {
    titel: "mieren in de rij",
    zinnen: [
      "roan en puck zitten.", "op de stoep.", "kijk die mieren.",
      "ze lopen achter elkaar.", "een lange rij.", "ze dragen een blad.",
      "dat is zwaar.", "voor zo'n klein beest.", "puck pakt een stok.",
      "ik ga ze helpen.", "hij duwt een mier.", "nee puck stop.",
      "dat vinden ze eng.", "ze zijn heel sterk.", "kijk maar goed.",
      "roan schijnt met de steen.", "als een vergrootglas.", "nu zijn ze groot.",
      "je ziet hun pootjes.", "ze lopen heel snel.", "naar hun nest.",
      "laat ze maar werken.", "wij kijken alleen.", "dat is ook leuk."
    ],
    vraag: "wat droegen de mieren op hun rug?"
  },
  {
    titel: "de sleutel is zoek",
    zinnen: [
      "mama zoekt iets.", "ze kijkt in haar tas.", "ze kijkt op tafel.",
      "waar is die sleutel?", "de sleutel van de fiets.", "ik ben al laat.",
      "mama zucht diep.", "heb jij hem gezien?", "vraagt ze aan puck.",
      "puck schudt nee.", "roan wil helpen.", "ze pakt de steen.",
      "zoek de sleutel.", "fluistert ze zacht.", "de steen trilt.",
      "hij trekt naar de bank.", "roan bukt diep.", "onder de bank.",
      "daar ligt hij.", "kijk eens mam.", "gevonden!",
      "wat goed van jou.", "dank je wel schat.", "mama geeft een kus.",
      "nu snel naar school.", "roan knipoogt naar puck."
    ],
    vraag: "waar lag de fietssleutel van mama?"
  },
  {
    titel: "gekke kleuren",
    zinnen: [
      "puck maakt een tekening.", "een huis en een boom.", "hij kleurt de boom.",
      "met groen stift.", "dat is saai.", "zegt puck geeuwend.",
      "alles is altijd groen.", "bomen en gras.", "roan heeft een idee.",
      "zullen we toveren?", "ze tikt op het papier.", "met de blauwe steen.",
      "opeens verandert het.", "de boom wordt paars.", "het gras wordt roze.",
      "de lucht wordt groen.", "en de zon blauw.", "puck lacht hard.",
      "wat een gekke wereld.", "paarse bomen.", "dat is pas leuk.",
      "ik wil er wonen.", "zegt puck blij.", "in het gekke land."
    ],
    vraag: "welke kleur kreeg de boom door de toversteen?"
  },
  {
    titel: "snel opruimen",
    zinnen: [
      "wat een troep.", "overal ligt speelgoed.", "blokken en autos.",
      "en alle boeken.", "mama roept uit de gang.", "opruimen jongens!",
      "we gaan zo eten.", "puck heeft geen zin.", "ik ben zo moe.",
      "mijn armen zijn slap.", "roan helpt wel.", "ze pakt de steen.",
      "opruimen maar.", "ze zwaait in het rond.", "de blokken vliegen.",
      "zo in de kist.", "de autos rijden zelf.", "terug in de bak.",
      "de boeken op de plank.", "binnen een minuut.", "klaar roept roan.",
      "mama komt kijken.", "dat is snel.", "wat zijn jullie flink.",
      "als ze eens wist."
    ],
    vraag: "hoe kwam het speelgoed zo snel in de kist?"
  },
  {
    titel: "de zieke vogel",
    zinnen: [
      "er ligt een vogel.", "in het gras.", "hij piept zachtjes.",
      "zijn vleugel hangt scheef.", "hij kan niet vliegen.", "puck aait hem.",
      "hij is zielig.", "kun je hem helpen?", "vraagt puck aan roan.",
      "roan knikt traag.", "ze is heel stil.", "ze legt de steen.",
      "tegen de vleugel.", "de steen wordt warm.", "een zacht geel licht.",
      "de vogel kijkt op.", "hij fladdert wat.", "dan staat hij op.",
      "hij spreidt zijn vleugels.", "en hij vliegt weg.", "hoog in de boom.",
      "hij fluit een lied.", "dat is bedankt.", "zegt roan blij."
    ],
    vraag: "wat was er mis met de vogel?"
  },
  {
    titel: "ijs smelt niet",
    zinnen: [
      "het is heel warm.", "de zon brandt.", "tijd voor ijs.",
      "mama deelt uit.", "lekker waterijs.", "puck eet traag.",
      "hij kijkt naar een bij.", "zijn ijsje smelt.", "het drupt op zijn hand.",
      "en op zijn shirt.", "bah dat plakt.", "roan ziet het.",
      "ze blaast zachtjes.", "over de steen.", "er komt koude lucht.",
      "net als de vriezer.", "puck zijn ijsje stopt.", "het drupt niet meer.",
      "het is weer hard.", "snel opeten nu.", "zegt roan streng.",
      "voor het weer smelt.", "puck neemt een hap.", "mmm lekker koud."
    ],
    vraag: "waarom smolt het ijsje van puck niet meer?"
  },
  {
    titel: "sterren kijken",
    zinnen: [
      "het is laat.", "roan ligt in bed.", "zij kan niet slapen.",
      "ze draait zich om.", "puck is ook wakker.", "hij zit op de rand.",
      "van zijn bed.", "ze kijken naar buiten.", "door het raam.",
      "de lucht is zwart.", "het is heel donker.", "ik zie geen ster.",
      "zegt puck zacht.", "het is niet helder.", "ik zie dikke wolken.",
      "jammer zegt roan.", "ik wil de maan zien.", "ze pakt de steen.",
      "de steen is blauw.", "ze wijst naar boven.", "naar het raam.",
      "de wolken drijven weg.", "de lucht is nu helder.", "er komt een gaatje.",
      "en nog een gat.", "ik zie een ster!", "roept puck blij.",
      "het zijn er veel.", "wel duizend sterren.", "en een halve maan.",
      "wat is het mooi.", "nu kunnen we slapen.", "onder de sterren.",
      "welterusten puck.", "welterusten roan."
    ],
    vraag: "wat toverde roan weg om de sterren te zien?"
  },
  {
    titel: "het zwevende bed",
    zinnen: [
      "roan ligt in bed.", "puck zit er naast.", "hij leest een boek.",
      "roan pakt de steen.", "ze wrijft er over.", "het bed trilt een beetje.",
      "wat doe je?", "vraagt puck aan roan.", "kijk maar zegt ze.",
      "dan gaat het bed omhoog.", "het komt los van de vloer.", "het bed zweeft.",
      "puck gooit zijn boek weg.", "hij springt er bij.", "ze vliegen door de kamer.",
      "hoog in de lucht.", "ze vliegen een rondje.", "over de stoel heen.",
      "en over de kast.", "pas op voor de lamp!", "roept roan luid.",
      "ze bukken snel.", "dat was heel krap.", "ze vliegen nog een keer.",
      "rond en rond.", "ik word er dol van.", "zegt puck met een lach.",
      "roan stopt de steen weg.", "het bed zakt weer.", "plof doet het bed.",
      "ze zijn weer op de grond.", "dat was leuk.", "doen we dat nog een keer?"
    ],
    vraag: "waar vlogen ze heen met het bed?"
  },
  {
    titel: "de pratende hond",
    zinnen: [
      "ze lopen op straat.", "het is mooi weer.", "de zon schijnt warm.",
      "daar loopt een hond.", "de hond is groot.", "hij heeft een bruine vacht.",
      "de hond stopt.", "hij kijkt naar puck.", "de hond blaft luid.",
      "roan pakt de blauwe steen.", "ze wijst er mee.", "naar de grote hond.",
      "hallo zegt de hond.", "puck schrikt zich rot.", "hij doet een stap terug.",
      "de hond praat!", "roan lacht om puck.", "ja ik kan praten.",
      "zegt de hond weer.", "ik heet bo.", "heb jij een bot voor mij?",
      "vraagt bo de hond.", "puck zoekt in zijn tas.", "ik heb geen bot.",
      "ik heb wel een koek.", "puck geeft de koek.", "de hond eet hem op.",
      "hap slik weg.", "dat was heel lekker.", "dank je wel zegt bo.",
      "dan loopt hij weer weg.", "dag bo roept roan."
    ],
    vraag: "wat gaf puck aan de hond?"
  },
  {
    titel: "een boom vol snoep",
    zinnen: [
      "in de tuin staat een boom.", "hij is heel groot.", "maar hij is kaal.",
      "er is geen blad aan.", "het is een saaie boom.", "roan loopt er naar toe.",
      "ze pakt de steen.", "ze tikt op de stam.", "met de toversteen.",
      "er gebeurt iets geks.", "er groeit iets aan een tak.", "het is geen groen blad.",
      "het is roze.", "het is een spekje!", "puck komt er snel bij.",
      "wat is dat voor boom?", "de hele boom hangt vol.", "kijk daar hangt drop.",
      "en daar hangen lollys.", "het is een snoep boom.", "puck plukt een lolly.",
      "hij stopt hem in zijn mond.", "mmm wat is dat lekker.", "roan pakt een dropje.",
      "dat lust zij heel graag.", "de boom is nu heel mooi.", "vol met zoet snoep.",
      "we eten er elke dag van.", "zegt puck heel blij.", "we hebben heel veel geluk."
    ],
    vraag: "wat groeide er aan de boom?"
  },
  {
    titel: "puck is weg",
    zinnen: [
      "puck heeft de steen.", "hij wil een grapje doen.", "hij knijpt er hard in.",
      "plop puck is weg.", "hij is zomaar opgelost.", "roan kijkt overal rond.",
      "waar ben je puck?", "ze kijkt achter de bank.", "ze kijkt onder de stoel.",
      "maar ze ziet hem niet.", "ik ben gewoon hier!", "roept puck heel hard.",
      "roan hoort hem wel.", "maar ze ziet hem niet.", "puck is van lucht.",
      "hij is van glas geworden.", "je kan door hem heen kijken.", "dat is best wel raar.",
      "ik ga je tikken!", "roept puck lachend.", "hij tikt roan op haar arm.",
      "roan schrikt er van.", "hou op met die grap.", "laat de steen los puck.",
      "roept roan een beetje boos.", "puck doet zijn hand open.", "plop daar is hij weer.",
      "hij staat naast de tafel.", "dat was een goede grap.", "vindt puck zelf."
    ],
    vraag: "waarom kon roan puck niet zien?"
  },
  {
    titel: "een klein draakje",
    zinnen: [
      "roan heeft de steen vast.", "de steen wordt heel warm.", "hij gloeit in haar hand.",
      "er komt een beetje rook af.", "roan legt hem snel neer.", "op de grond in de kamer.",
      "puck komt er bij staan.", "uit de rook komt een beest.", "het is groen.",
      "het is een draak!", "maar hij is niet groot.", "hij is heel erg klein.",
      "zo groot als een muis.", "het draakje kijkt rond.", "hij ziet puck staan.",
      "hij doet zijn bek open.", "hij spuugt een vonk.", "pas op! roept roan.",
      "puck trekt zijn voet weg.", "het draakje maakt een geluid.", "hij klinkt alsof hij lacht.",
      "hij heeft heel veel pret.", "dan slaat hij met zijn vleugels.", "hij vliegt een rondje.",
      "om het hoofd van roan.", "dan vliegt hij naar de steen.", "hij kruipt er weer in.",
      "weg is de kleine draak.", "roan pakt de steen weer op.", "hij is nu weer koud."
    ],
    vraag: "hoe groot was de draak?"
  },
  {
    titel: "zwemmen in de lucht",
    zinnen: [
      "het regent heel hard.", "het water valt met bakken.", "puck is heel erg boos.",
      "ik wil zo graag zwemmen.", "we kunnen niet naar het bad.", "roan lacht om hem.",
      "dat kan hier binnen ook.", "hoe dan vraagt puck.", "roan pakt de toversteen.",
      "de kamer wordt langzaam blauw.", "het licht is heel zacht.", "ze voelen zich licht.",
      "puck doet zijn armen wijd.", "hij maakt een grote slag.", "zijn voeten komen van de vloer.",
      "hij zwemt!", "gewoon in de lucht.", "hij zwemt naar de gang.",
      "en hij zwemt weer terug.", "roan doet nu ook mee.", "ze zwemt naar het raam.",
      "ze kijkt naar de regen.", "wij zijn net als vissen.", "zegt roan met een lach.",
      "ze doen een wedstrijd.", "wie is het snelst bij de deur?", "puck wint heel nipt.",
      "droog zwemmen is heel cool.", "beter dan in het water.", "dat vinden ze allebei."
    ],
    vraag: "waar zwom puck heen?"
  },
  {
    titel: "sneeuw in de zomer",
    zinnen: [
      "het is vandaag heel heet.", "de zon brandt in de lucht.", "puck heeft zweet op zijn neus.",
      "ik wil dat het koud is.", "klaagt hij in de stoel.", "roan pakt de blauwe steen.",
      "ze wijst naar de lucht.", "er komt een witte wolk.", "dan valt er iets wits.",
      "het voelt ineens heel koud.", "sneeuw! roept puck blij.", "een vlok valt op zijn been.",
      "nog een vlok valt op zijn neus.", "het sneeuwt in de tuin.", "de stoep wordt helemaal wit.",
      "het gras ligt onder een deken.", "roan rent naar buiten toe.", "ze pakt een schep sneeuw.",
      "ze maakt een mooie ronde bal.", "ze gooit hem heel hard.", "pats! de bal komt op de buik van puck.",
      "lekker fris zegt puck.", "hij maakt ook een sneeuwbal.", "ze doen een sneeuw gevecht.",
      "in de hete zomer.", "dat kan alleen met magie.", "na een uur is alles weer weg.",
      "gesmolten door de warme zon.", "wat was dat een leuk feest.", "nu hebben ze het weer warm."
    ],
    vraag: "wat viel er uit de lucht?"
  },
  {
    titel: "de deur in de kast",
    zinnen: [
      "roan doet de grote kast open.", "er hangen heel veel jassen.", "en een paar oude tassen.",
      "ze pakt de steen uit haar zak.", "de jassen verdwijnen ineens.", "de tassen zijn ook weg.",
      "er is nu een donker pad te zien.", "het pad is vol met kleine sterren.", "het ziet er heel mooi uit.",
      "puck kijkt met grote ogen.", "hij stapt er rustig in.", "roan gaat hem achterna.",
      "ze voelen de vloer niet meer.", "ze zweven op het sterren pad.", "we zijn in de donkere ruimte!",
      "zegt roan met open mond.", "kijk daar is de grote maan.", "hij is zo mooi en rond.",
      "en daar zweeft een steen.", "een heel groot rotsblok.", "puck wijst naar een felle ster.",
      "die geeft heel veel licht.", "het is hier wel koud.", "zegt puck na een tijdje.",
      "we moeten maar weer terug.", "snel weer naar onze kamer.", "ze zweven terug naar de deur.",
      "ze stappen weer in de kast.", "roan doet de deur snel dicht.", "wat een magisch avontuur."
    ],
    vraag: "wat zagen ze in de kast?"
  },
  {
    titel: "de tekening leeft",
    zinnen: [
      "puck zit aan de grote tafel.", "hij tekent met een groene stift.", "hij tekent een dikke kikker.",
      "de kikker heeft bolle ogen.", "roan komt er bij staan.", "ze legt de steen op het papier.",
      "het papier begint te ritselen.", "de lijnen van de stift bewegen.", "de kikker kijkt ineens op.",
      "hij knippert met zijn ogen.", "dan springt hij met een boog op!", "hij is echt geworden.",
      "hij voelt koud en nat aan.", "hij hopt zomaar door de kamer.", "kwaak zegt hij heel erg luid.",
      "puck rent er hard achteraan.", "kom hier kleine kikker.", "maar de kikker is heel snel.",
      "hij springt op de bank.", "roan pakt de steen weer op.", "ze wijst naar de groene kikker.",
      "de kikker springt weer naar de tafel.", "hij landt precies op het papier.", "hij is weer plat.",
      "een gewone tekening met stift.", "puck kijkt er naar.", "hij is wel mooi geworden.",
      "maar ik teken geen leeuw.", "dat is mij iets te eng.", "roan is het daar mee eens."
    ],
    vraag: "welk dier had puck getekend?"
  },
  {
    titel: "heel klein",
    zinnen: [
      "roan wil haar rode bal pakken.", "de bal is zomaar weg gerold.", "hij ligt helemaal onder de kast.",
      "haar arm is echt te dik.", "ze kan er net niet bij.", "ze pakt de blauwe steen.",
      "maak mij heel erg klein.", "roept ze tegen de steen.", "krimp krimp krimp!",
      "roan wordt in een flits heel mini.", "ze is nu zo groot als een mier.", "puck kijkt met grote ogen naar beneden.",
      "kijk uit dat ik niet op je sta.", "zegt puck met een zware stem.", "roan loopt snel onder de kast.",
      "het is daar heel erg donker.", "maar daar ligt haar rode bal.", "die is nu zo groot als een huis.",
      "ze duwt met al haar kracht.", "ze rolt hem zo naar puck toe.", "puck vangt de grote bal op.",
      "roan komt weer onder de kast uit.", "maak mij snel weer groot!", "roept ze naar de steen.",
      "en poef daar is roan weer.", "weer in haar normale maat.", "dat was heel erg handig.",
      "nu kunnen we weer leuk spelen.", "met de rode bal.", "gooi hem maar naar mij."
    ],
    vraag: "waarom wilde roan klein zijn?"
  },
  {
    titel: "rennen als de wind",
    zinnen: [
      "puck kijkt uit het raam.", "hij wil heel hard rennen.", "hij houdt de steen stevig vast.",
      "hij doet een stap naar buiten.", "zjoef zo klinkt het.", "hij is in een keer aan de overkant.",
      "van de lange straat.", "dat gaat wel heel erg snel.", "hij rent een rondje om het huis.",
      "dat doet hij in maar een tel.", "hij is gewoon een waas.", "je ziet hem haast niet meer.",
      "hij rent naar het park.", "en hij rent weer snel terug.", "zijn voeten raken de grond niet.",
      "hij voelt de wind in zijn haar.", "stop nu maar weer puck.", "roept roan vanaf de voordeur.",
      "je wordt er nog dol van.", "puck stopt ineens stil.", "hij tolt op zijn benen.",
      "hij is dol in zijn hoofd.", "hij valt zomaar om in het gras.", "roan moet heel erg hard lachen.",
      "snel zijn is leuk zegt puck.", "maar stilstaan is toch beter.", "roan helpt hem weer op.",
      "geef de steen maar hier.", "we gaan even rustig zitten.", "binnen op de zachte bank."
    ],
    vraag: "wat wilde puck doen?"
  },
  {
    titel: "roze regen",
    zinnen: [
      "het regent weer een keertje.", "het water tikt op het raam.", "maar wacht eens even.",
      "puck kijkt heel erg goed.", "de grote druppels zijn roze.", "en daar valt ineens een groene.",
      "en daar valt een gele.", "het is net een regenboog.", "maar dan van dikke druppels.",
      "roan rent naar de achtertuin.", "ze steekt haar tong ver uit.", "een roze druppel valt in haar mond.",
      "mmm het smaakt heel erg zoet.", "het smaakt precies als roze koek.", "puck vangt een gele druppel.",
      "deze smaakt naar zoete banaan.", "puck danst en springt in de regen.", "zijn trui wordt helemaal vol vlekken.",
      "het zijn heel mooie zoete vlekken.", "roan springt in een roze plas.", "het spettert heel hoog op.",
      "wat een geweldig groot feest.", "dit is de leukste regen ooit.", "de poes smult er ook van.",
      "hij likt een druppel van zijn poot.", "het hele huis plakt er van.", "maar dat geeft helemaal niks.",
      "we wassen alles wel weer schoon.", "met de slang in de tuin.", "tot die tijd snoepen we door."
    ],
    vraag: "naar wat smaakte de regen?"
  },
  {
    titel: "het vliegende matje",
    zinnen: [
      "op de vloer ligt een mat.", "het is een mat met een leuk patroon.", "puck zit er op met zijn knuffel.",
      "roan pakt de blauwe toversteen.", "vlieg mat vlieg!", "roept roan met luide stem.",
      "de mat stijgt zachtjes op.", "puck gilt even van schrik.", "maar dan is hij weer heel stil.",
      "het is net of hij in een boot zit.", "ze varen heel zacht door de kamer.", "de mat zweeft over de bank heen.",
      "en hij vaart langs de hoge kast.", "roan stapt er snel bij op.", "het matje wiebelt een heel klein beetje.",
      "ze vliegen naar de keuken toe.", "over de tafel en over de stoelen.", "dit is beter dan de auto.",
      "zegt puck met een brede lach.", "ze kijken uit het grote raam.", "de mat zweeft hoog in de lucht.",
      "we kunnen naar buiten kijken.", "parkeer de mat nu maar weer.", "zegt puck na een tijdje.",
      "ik word nu toch wel wat dol.", "de mat landt zacht op de vloer.", "precies op zijn oude plek.",
      "dat was een heel mooie vlucht.", "morgen vliegen we nog een keer.", "dan gaan we naar de gang."
    ],
    vraag: "waarop vlogen roan en puck?"
  },
  {
    titel: "lange oren",
    zinnen: [
      "puck wil een klein grapje maken.", "met de blauwe toversteen.", "hij houdt hem voor zijn buik.",
      "hij roept heel hard haas!", "opeens jeukt zijn hoofd heel erg.", "er groeien oren op zijn hoofd.",
      "ze zijn heel erg lang.", "ze voelen als zachte haren.", "puck heeft echte grote hazen oren.",
      "roan wijst en moet heel hard lachen.", "puck wappert blij met zijn nieuwe oren.", "het voelt wel heel erg gek.",
      "hij merkt dat hij heel goed hoort.", "ik hoor de klok heel luid tikken.", "ik hoor een muis lopen in de muur.",
      "zegt hij met een grote lach.", "hij hoort de wind buiten blazen.", "hij hoort een auto heel ver weg.",
      "het is wel een beetje druk.", "al dat geluid in zijn grote oren.", "roan tover ze weer weg.",
      "het is veel te veel lawaai.", "roan tikt hem aan met de steen.", "de oren krimpen weer in elkaar.",
      "ze verdwijnen in zijn bruine haar.", "ik heb liever mijn eigen oren.", "die horen precies genoeg.",
      "roan is het daar mee eens.", "grapjes maken is best heel leuk.", "maar gewoon zijn is toch beter."
    ],
    vraag: "wat kreeg puck op zijn hoofd?"
  },
  {
    titel: "alles staat stil",
    zinnen: [
      "mama loopt snel in de gang.", "ze heeft een mooie vaas vast.", "ze botst ineens tegen de deur.",
      "oeps de mooie vaas valt uit haar hand.", "hij valt heel snel naar de vloer.", "roan pakt als een speer de steen.",
      "ze roept heel hard stop!", "de vaas hangt stil in de lucht.", "hij valt niet meer verder naar beneden.",
      "mama staat ook helemaal stil.", "met haar mond een beetje open.", "ze is bevroren in de tijd.",
      "roan pakt de vaas uit de lucht.", "ze zet hem veilig op de tafel neer.", "dan aait ze zacht over de steen.",
      "mama beweegt ineens weer door.", "ze kijkt heel erg gek naar haar hand.", "huh waar is de vaas nou gebleven?",
      "zegt mama met grote ogen.", "ze snapt er helemaal niks van.", "ze was hem toch net kwijt?",
      "roan en puck kijken heel lief.", "hij staat al op de tafel hoor.", "zegt roan met een strak gezicht.",
      "mama schudt haar hoofd heen en weer.", "ik zal wel in de war zijn vandaag.", "ze loopt weer verder door de gang.",
      "de vaas is gelukkig helemaal heel.", "dat was heel erg nipt.", "de steen heeft ons echt gered."
    ],
    vraag: "wat viel er uit de handen van mama?"
  },
  {
    titel: "het lachende huis",
    zinnen: [
      "roan heeft even helemaal niks te doen.", "ze verveelt zich een beetje vandaag.", "ze tikt met de steen op de tafel.",
      "de tafel gaat opeens op en neer.", "hij maakt een schuddend geluid.", "de tafel lacht heel erg hard!",
      "puck snapt er in het begin niks van.", "dan begint de rode stoel ook.", "en de bank roept hard ha ha ha!",
      "het is heel erg leuk.", "het hele huis ligt in een deuk.", "de kast lacht in de hoek.",
      "de deuren klapperen van de pret.", "puck en roan doen vrolijk mee.", "ze liggen op de grond van de lach.",
      "hun buik doet er gewoon pijn van.", "het is een heel groot kabaal.", "het klinkt als een groot feest.",
      "maar het is nu wel genoeg geweest.", "we moeten er echt mee stoppen.", "stop steen stop er nu mee.",
      "roept roan buiten adem.", "de steen gloeit en dooft dan uit.", "het huis wordt langzaam weer stil.",
      "de tafel staat weer heel stevig.", "de bank doet weer heel gewoon.", "dat was de beste lachbui ooit.",
      "ze vegen allebei een traan weg.", "van al dat heel harde lachen.", "straks doen we het gewoon nog eens."
    ],
    vraag: "wat deed de stoel?"
  },
  {
    titel: "alles van goud",
    zinnen: [
      "puck pakt een pen van het bureau.", "het is een heel gewone blauwe pen.", "roan tikt er zachtjes tegen aan.",
      "met de blauwe toversteen.", "de pen wordt ineens heel erg zwaar.", "hij kleurt heel erg mooi geel.",
      "hij glimt in het felle zonlicht.", "de pen is veranderd in echt goud!", "wauw zegt puck met een open mond.",
      "tik mijn oude schoen ook eens aan.", "roan tikt de linker schoen zachtjes aan.", "klonk doet de schoen op de vloer.",
      "het is nu een zware gouden schoen.", "puck doet hem aan zijn blote voet.", "maar hij loopt heel erg zwaar.",
      "hij kan zijn voet niet goed optillen.", "hij sleept ermee over de gladde vloer.", "dit is helemaal niet zo handig.",
      "ik kan zo echt niet hard rennen.", "zegt puck met een heel diepe zucht.", "maak hem maar weer van zachte stof.",
      "goud is wel mooi om naar te kijken.", "maar het is veel te zwaar om te dragen.", "roan tikt de schoen weer aan.",
      "hij is weer zacht en licht.", "de pen laten ze wel van goud.", "die staat heel erg mooi op de kast.",
      "als een glimmende kleine schat.", "het is ons grote geheim.", "we vertellen het helemaal aan niemand."
    ],
    vraag: "waarvan was de schoen gemaakt?"
  },
  {
    titel: "een reis in een bel",
    zinnen: [
      "puck staat in de tuin en blaast bellen.", "met een potje sop en een ring.", "er vliegen bellen door de lucht.",
      "roan wijst met de steen naar een bel.", "de bel klapt helemaal niet stuk.", "hij groeit en wordt groter en groter.",
      "hij is nu zo groot als een tent.", "het is een glimmende ronde bol.", "roan en puck stappen er rustig in.",
      "de wand voelt nat maar heel stevig.", "de bel stijgt langzaam op van het gras.", "ze zweven zachtjes de tuin uit.",
      "ze zweven helemaal over het hek.", "hoog in de lucht boven de bomen.", "de wereld is van boven heel mooi.",
      "alle huizen zijn nu net speelgoed.", "de mensen lijken wel kleine mieren.", "ze vliegen een stukje met de wind mee.",
      "het is heel stil daarboven in de bel.", "puck kijkt naar de vogel die langs vliegt.", "de vogel kijkt heel raar naar de bel.",
      "we moeten nu wel weer naar huis.", "straks zijn we echt veel te ver weg.", "de bel zakt weer langzaam naar beneden.",
      "hij landt heel erg zacht in de tuin.", "roan en puck stappen er weer uit.", "poef de bel spat in drupjes uit elkaar.",
      "het avontuur in de bel is klaar.", "het kleine potje sop is nu ook op.", "we gaan maar weer snel naar binnen toe."
    ],
    vraag: "waarin vlogen ze hoog in de lucht?"
  },
  {
    titel: "haren in de war",
    zinnen: [
      "puck staat voor de spiegel en kamt zijn haar.", "hij maakt het heel erg mooi plat.", "roan sluipt erheen en wil hem plagen.",
      "ze richt de blauwe steen op zijn hoofd.", "puck zijn haar staat ineens strak recht op.", "het ziet er uit als een harde borstel.",
      "dan wordt de kleur ineens fel groen.", "en daarna verandert het in knal rood!", "het lijkt wel een klein vuurtje.",
      "puck kijkt met grote ogen in de spiegel.", "ik ben net een gekke clown.", "hij pakt de kam en trekt er aan.",
      "maar het haar is helemaal stijf.", "de kam komt er echt niet meer door.", "hij wil het plat duwen met zijn hand.",
      "maar het veert net zo hard weer omhoog.", "roan lacht zich helemaal slap op de grond.", "ze komt niet meer bij van het lachen.",
      "puck kijkt nu toch wel een beetje boos.", "ik wil niet met rood haar naar buiten!", "oke oke ik tover het wel weer weg.",
      "zegt roan en ze veegt een traan weg.", "ze tikt met de steen op de kam.", "puck zijn haar valt weer netjes plat.",
      "het is weer gewoon bruin en zacht.", "gelukkig maar zucht puck heel erg diep.", "geen gekke streken meer met mijn haar.",
      "roan belooft dat ze lief zal zijn.", "maar ze lacht nog steeds heel zachtjes.", "in haar eigen kleine vuistje."
    ],
    vraag: "welke kleur werd het haar van puck?"
  },
  {
    titel: "in de steen",
    zinnen: [
      "roan zit op de bank en kijkt naar de steen.", "de steen begint zomaar heel erg te groeien.", "hij is nu al zo groot als een bal.",
      "er komt ineens een kier in de zijkant.", "kijk puck het is een soort kleine deur!", "de kleine deur zwaait heel langzaam open.",
      "roan en puck kijken heel blij naar binnen.", "binnen in de steen zien ze een groot bos.", "het is een bos vol met zacht blauw licht.",
      "de bomen hebben mooie kleine blaadjes.", "daar loopt een mooi wit pad de diepte in.", "gaan we er in om even te kijken?",
      "vraagt puck met een zachte stem.", "roan knikt heel stoer en pakt zijn hand.", "ze stappen samen door de kleine ronde deur.",
      "zodra ze binnen zijn is alles heel groot.", "ze horen een zacht en zingend geluid.", "het komt van de blaadjes aan de bomen.",
      "dit is de echte wereld van de steen.", "hier komt alle magie en toverkracht vandaan.", "ze lopen een eindje verder over het pad.",
      "ze zien een vogel die vuur kan spugen.", "en een bloem die een liedje voor ze zingt.", "we moeten de weg niet kwijt raken hier.",
      "zegt roan terwijl ze stiekem achterom kijkt.", "de deur staat gelukkig nog op een kier.", "we gaan snel weer terug naar de kamer.",
      "ze stappen de drempel weer zachtjes over.", "de deur gaat dicht en de steen krimpt.", "een heel nieuw avontuur wacht voor de volgende keer."
    ],
    vraag: "wat zat er in de toversteen?"
  }
];

// --- DATA: INTERACTIEVE AVONTUREN (Roan en Puck) ---
// Elk avontuur is een graaf van 'nodes'. Een node toont een paar zinnen (tik om door te lezen)
// en eindigt met 'keuzes' (knoppen die naar een andere node springen) of met 'einde: true'.
// Alle woorden zijn klankzuiver (einde groep 3); alleen de namen Roan en Puck zijn uitgezonderd.
const AVONTUREN = [
  {
    titel: "het pad in het bos",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck gaan naar het bos.",
          "de zon schijnt fel.",
          "het pad gaat twee kanten op.",
          "welke kant kiest roan?"
        ],
        keuzes: [
          { tekst: "loop naar links", naar: "meer" },
          { tekst: "loop naar rechts", naar: "grot" }
        ]
      },
      meer: {
        zinnen: [
          "roan loopt naar links.",
          "daar ligt een groot meer.",
          "het water is heel diep.",
          "puck ziet een boot van hout.",
          "wat doen ze nu?"
        ],
        keuzes: [
          { tekst: "stap in de boot", naar: "boot" },
          { tekst: "duik in het meer", naar: "duik" }
        ]
      },
      boot: {
        zinnen: [
          "ze stappen in de boot.",
          "roan pakt de steen vast.",
          "de boot vaart vanzelf.",
          "hij gaat heel snel.",
          "ze varen naar de kant.",
          "daar ligt een kist in het zand.",
          "roan maakt de kist open.",
          "de kist zit vol met goud!",
          "wat een mooie schat."
        ],
        einde: true
      },
      duik: {
        zinnen: [
          "puck duikt in het meer.",
          "plons!",
          "het water is veel te koud.",
          "roan pakt snel de steen.",
          "ze maakt het water warm.",
          "nu is het net een warm bad.",
          "puck zwemt als een vis.",
          "roan springt er ook in.",
          "wat een pret in het meer."
        ],
        einde: true
      },
      grot: {
        zinnen: [
          "roan loopt naar rechts.",
          "daar is een grot.",
          "het is er heel donker.",
          "puck is een beetje bang.",
          "hij ziet bijna niks.",
          "wat doet roan?"
        ],
        keuzes: [
          { tekst: "pak de steen", naar: "licht" },
          { tekst: "ren snel weg", naar: "weg" }
        ]
      },
      licht: {
        zinnen: [
          "roan pakt de blauwe steen.",
          "de steen geeft fel licht.",
          "nu zien ze de hele grot.",
          "de muur is vol met steen die glimt.",
          "het lijkt wel of er sterren zijn.",
          "in de hoek slaapt een vleermuis.",
          "stil zegt roan zacht.",
          "ze sluipen heel rustig weg.",
          "wat een mooie grot was dat."
        ],
        einde: true
      },
      weg: {
        zinnen: [
          "kom mee roept puck.",
          "ze rennen de grot uit.",
          "buiten schijnt de zon weer.",
          "puck is heel moe.",
          "dat was wel eng zeg.",
          "roan lacht naar puck.",
          "een ander keer gaan we terug.",
          "met de steen voor licht.",
          "nu eerst snel naar huis."
        ],
        einde: true
      }
    }
  },
  {
    titel: "een dag aan zee",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck zijn aan zee.",
          "de zon is warm.",
          "het zand is heel zacht.",
          "puck wil graag spelen.",
          "wat doen ze eerst?"
        ],
        keuzes: [
          { tekst: "graaf in het zand", naar: "graaf" },
          { tekst: "ren naar het water", naar: "water" }
        ]
      },
      graaf: {
        zinnen: [
          "puck graaft in het zand.",
          "hij maakt een diep gat.",
          "wat is dat daar?",
          "een oude fles!",
          "roan pakt de fles op.",
          "er zit een brief in.",
          "roan pakt de steen.",
          "de fles gaat open.",
          "op de brief staat een schatkaart!",
          "wat doen ze nu?"
        ],
        keuzes: [
          { tekst: "zoek de schat", naar: "schat" },
          { tekst: "loop naar huis", naar: "huis" }
        ]
      },
      schat: {
        zinnen: [
          "ze lopen langs de kaart.",
          "tien stap naar links.",
          "drie stap naar rechts.",
          "hier moet het zijn.",
          "puck graaft heel snel.",
          "daar is een kist!",
          "de kist zit vol met goud.",
          "en met mooi groen glas.",
          "wat een rijke dag."
        ],
        einde: true
      },
      huis: {
        zinnen: [
          "het is al laat.",
          "we gaan naar huis zegt roan.",
          "de kaart nemen we mee.",
          "puck stopt hem in zijn zak.",
          "een ander keer zoeken we de schat.",
          "dat wordt vast heel leuk."
        ],
        einde: true
      },
      water: {
        zinnen: [
          "puck rent naar het water.",
          "de golf is heel hoog.",
          "hij spat op zijn buik.",
          "bah dat is koud.",
          "roan ziet een krab.",
          "de krab loopt scheef.",
          "hij heeft een grote schaar.",
          "wat doet roan?"
        ],
        keuzes: [
          { tekst: "pak de krab", naar: "krab" },
          { tekst: "laat hem gaan", naar: "schelp" }
        ]
      },
      krab: {
        zinnen: [
          "roan pakt de steen.",
          "ze wijst naar de krab.",
          "de krab wordt heel groot.",
          "zo groot als een hond!",
          "puck schrikt zich rot.",
          "maar de krab is lief.",
          "hij geeft puck een poot.",
          "ze spelen op het strand.",
          "de grote krab rent mee.",
          "wat een gekke dag."
        ],
        einde: true
      },
      schelp: {
        zinnen: [
          "laat hem maar gaan zegt roan.",
          "de krab loopt weg.",
          "terug naar de zee.",
          "dag krab roept puck.",
          "ze zoeken nog een mooie schelp.",
          "puck vindt er heel veel.",
          "roan maakt er een rij van.",
          "wat een fijne dag aan zee."
        ],
        einde: true
      }
    }
  },
  {
    titel: "de grote storm",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "het waait heel hard.",
          "de wind giert om het huis.",
          "puck kijkt uit het raam.",
          "de lucht is heel grijs.",
          "een tak valt op de stoep.",
          "puck vindt het eng.",
          "wat doet roan?"
        ],
        keuzes: [
          { tekst: "pak de steen", naar: "steen" },
          { tekst: "kruip op de bank", naar: "bank" }
        ]
      },
      steen: {
        zinnen: [
          "roan pakt de blauwe steen.",
          "ze loopt naar het raam.",
          "stop wind roept ze hard.",
          "de steen wordt fel geel.",
          "buiten wordt het stil.",
          "de wind is weg.",
          "de zon komt er door.",
          "wat doen ze nu?"
        ],
        keuzes: [
          { tekst: "loop naar buiten", naar: "buiten" },
          { tekst: "blijf nog binnen", naar: "binnen" }
        ]
      },
      buiten: {
        zinnen: [
          "ze lopen naar buiten.",
          "de stoep is nog heel nat.",
          "er ligt een grote plas.",
          "puck springt er in.",
          "het water spat hoog op.",
          "roan pakt de steen.",
          "de plas wordt heel groot.",
          "het is net een meer!",
          "ze spelen in het water.",
          "wat een nat en fijn feest."
        ],
        einde: true
      },
      binnen: {
        zinnen: [
          "we blijven lekker binnen.",
          "roan zet thee.",
          "puck pakt een boek.",
          "ze zitten warm op de bank.",
          "buiten is het weer rustig.",
          "wat een fijne dag."
        ],
        einde: true
      },
      bank: {
        zinnen: [
          "puck kruipt op de bank.",
          "hij pakt een warm kleed.",
          "roan komt er bij zitten.",
          "wees maar niet bang zegt ze.",
          "ik ben bij je.",
          "de storm gaat zo weer weg.",
          "puck voelt zich veilig.",
          "nu is puck niet bang meer."
        ],
        einde: true
      }
    }
  },
  {
    titel: "de draak in de grot",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck zien een berg.",
          "in de berg is een grot.",
          "uit de grot komt rook.",
          "daar woont een draak!",
          "de draak brult heel hard.",
          "wat doet roan?"
        ],
        keuzes: [
          { tekst: "loop naar de draak", naar: "praat" },
          { tekst: "pak de steen", naar: "vecht" }
        ]
      },
      praat: {
        zinnen: [
          "roan loopt naar de grot.",
          "puck blijft staan.",
          "wees maar niet boos!",
          "roept roan naar de draak.",
          "de draak kijkt verbaasd.",
          "niemand praat met hem.",
          "wat wil de draak?"
        ],
        keuzes: [
          { tekst: "geef hem eten", naar: "vriend" },
          { tekst: "vraag wat er is", naar: "traan" }
        ]
      },
      vecht: {
        zinnen: [
          "roan pakt de steen.",
          "de steen wordt fel rood.",
          "ze schiet een straal.",
          "de draak schrikt heel erg.",
          "hij blaast vuur terug.",
          "puck springt opzij.",
          "dit gaat niet goed.",
          "wat nu?"
        ],
        keuzes: [
          { tekst: "schiet nog een keer", naar: "win" },
          { tekst: "stop met vechten", naar: "spijt" }
        ]
      },
      vriend: {
        zinnen: [
          "puck heeft nog een koek.",
          "roan geeft hem aan de draak.",
          "de draak ruikt eraan.",
          "hap! de koek is op.",
          "de draak is heel blij.",
          "hij is nu hun vriend.",
          "ze mogen op zijn rug.",
          "ze vliegen heel hoog.",
          "wat een stoere draak."
        ],
        einde: true
      },
      traan: {
        zinnen: [
          "wat is er draak?",
          "vraagt roan heel zacht.",
          "de draak laat een traan.",
          "ik ben heel erg ziek.",
          "roan pakt de steen.",
          "ze legt hem op zijn kop.",
          "de steen gloeit warm.",
          "de draak voelt zich beter.",
          "dank je wel zegt hij.",
          "nu is hij hun vriend."
        ],
        einde: true
      },
      win: {
        zinnen: [
          "roan schiet weer een straal.",
          "de straal is heel sterk.",
          "de draak gaat naar achter.",
          "hij is nu bang voor roan.",
          "hij vlucht diep de grot in.",
          "de grot is nu veilig.",
          "puck juicht heel hard.",
          "jij bent heel stoer roan."
        ],
        einde: true
      },
      spijt: {
        zinnen: [
          "roan stopt met vechten.",
          "dit is niet lief.",
          "zegt ze tegen puck.",
          "ze legt de steen weg.",
          "de draak stopt ook.",
          "sorry zegt roan zacht.",
          "de draak knikt langzaam.",
          "ze gaan weer naar huis.",
          "vechten is niks voor roan."
        ],
        einde: true
      }
    }
  },
  {
    titel: "de stad in de wolk",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan kijkt naar de lucht.",
          "daar hangt een grote wolk.",
          "de wolk heeft een deur!",
          "is daar een stad?",
          "roan pakt de steen.",
          "ze maakt een trap van licht.",
          "gaan ze omhoog?"
        ],
        keuzes: [
          { tekst: "klim naar de wolk", naar: "stad" },
          { tekst: "blijf op de grond", naar: "grond" }
        ]
      },
      stad: {
        zinnen: [
          "ze klimmen heel hoog.",
          "daar is de stad!",
          "de huizen zijn van wolk.",
          "alles is heel zacht.",
          "het is er heel stil.",
          "wat gaan ze doen?"
        ],
        keuzes: [
          { tekst: "zoek in de stad", naar: "zoek" },
          { tekst: "roep heel hard", naar: "volk" }
        ]
      },
      grond: {
        zinnen: [
          "puck durft niet zo hoog.",
          "we blijven hier zegt hij.",
          "de trap van licht zakt weg.",
          "maar er valt iets uit de wolk.",
          "het is een kleine sleutel.",
          "van wie is die?"
        ],
        keuzes: [
          { tekst: "pak de sleutel", naar: "luik" },
          { tekst: "laat hem liggen", naar: "thuis" }
        ]
      },
      zoek: {
        zinnen: [
          "ze zoeken in een huis.",
          "daar staat een kist.",
          "de kist is van zilver.",
          "roan maakt hem open.",
          "er zit een kroon in!",
          "een kroon van goud.",
          "roan zet hem op.",
          "nu is zij de baas van de stad."
        ],
        einde: true
      },
      volk: {
        zinnen: [
          "roan roept heel hard.",
          "is hier iemand?",
          "dan komen er mensen.",
          "het zijn wolk mensen!",
          "ze zijn heel klein en wit.",
          "een reus joeg ons weg.",
          "roan pakt de steen.",
          "ze jaagt de reus weg.",
          "de mensen zijn heel blij.",
          "roan is hun held."
        ],
        einde: true
      },
      luik: {
        zinnen: [
          "roan pakt de sleutel op.",
          "waar past die op?",
          "puck ziet een klein luik.",
          "in de grond bij de boom.",
          "de sleutel past precies!",
          "het luik gaat open.",
          "een trap gaat naar onder.",
          "naar een stad onder de grond!",
          "wat een geheim."
        ],
        einde: true
      },
      thuis: {
        zinnen: [
          "laat maar liggen zegt puck.",
          "ik wil naar huis.",
          "ze lopen terug.",
          "maar roan kijkt om.",
          "de wolk met de deur.",
          "die komt vast nog terug.",
          "een ander keer klimmen we.",
          "naar de stad in de wolk."
        ],
        einde: true
      }
    }
  },
  {
    titel: "puck zakt door het ijs",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "het is winter.",
          "op de plas ligt ijs.",
          "puck loopt op het ijs.",
          "wees voorzichtig roept roan.",
          "krak! zegt het ijs.",
          "puck zakt door het ijs!",
          "help roept puck.",
          "wat doet roan snel?"
        ],
        keuzes: [
          { tekst: "pak de steen", naar: "tiltop" },
          { tekst: "ren naar puck", naar: "ren" }
        ]
      },
      tiltop: {
        zinnen: [
          "roan pakt de steen.",
          "ze wijst naar het water.",
          "het water tilt puck op.",
          "hij komt weer omhoog.",
          "puck ligt op het harde ijs.",
          "wat nu?"
        ],
        keuzes: [
          { tekst: "trek hem naar de kant", naar: "redt" },
          { tekst: "maak een warm vuur", naar: "warm" }
        ]
      },
      ren: {
        zinnen: [
          "roan rent naar puck.",
          "maar het ijs kraakt.",
          "ook bij roan!",
          "dit is heel eng.",
          "ze geeft puck haar hand.",
          "hou vast roept ze.",
          "wat doet ze dan?"
        ],
        keuzes: [
          { tekst: "trek heel hard", naar: "trek" },
          { tekst: "pak de steen", naar: "dik" }
        ]
      },
      redt: {
        zinnen: [
          "roan trekt puck mee.",
          "naar de droge kant.",
          "puck rilt heel erg.",
          "zijn lip is helemaal blauw.",
          "roan slaat haar jas om hem.",
          "kom we gaan naar huis.",
          "bij het warme vuur.",
          "puck is weer veilig.",
          "dank je wel zus."
        ],
        einde: true
      },
      warm: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt een warm vuur.",
          "het vuur is fel en warm.",
          "puck kruipt er dicht bij.",
          "zijn kou gaat snel weg.",
          "wat ben jij slim roan.",
          "jij hebt mij gered.",
          "puck geeft haar een knuffel."
        ],
        einde: true
      },
      trek: {
        zinnen: [
          "roan trekt heel hard.",
          "puck komt omhoog.",
          "ze vallen allebei om.",
          "op het droge gras.",
          "ze zijn allebei nat.",
          "maar puck is veilig!",
          "dat was heel eng zeg.",
          "nooit meer op dun ijs."
        ],
        einde: true
      },
      dik: {
        zinnen: [
          "roan pakt snel de steen.",
          "ze maakt het ijs heel dik.",
          "het ijs draagt hen weer.",
          "ze kruipen naar de kant.",
          "heel rustig en zacht.",
          "puff dat was eng.",
          "puck rilt van de kou.",
          "snel naar huis en warm."
        ],
        einde: true
      }
    }
  },
  {
    titel: "het monster in het meer",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck zijn bij het meer.",
          "het water borrelt heel raar.",
          "er komt iets uit het meer.",
          "een groot groen monster!",
          "het heeft heel veel tanden.",
          "puck wil hard weg rennen.",
          "wat doet roan?"
        ],
        keuzes: [
          { tekst: "ren met puck mee", naar: "ren" },
          { tekst: "blijf staan en kijk", naar: "kijk" }
        ]
      },
      ren: {
        zinnen: [
          "ze rennen heel hard weg.",
          "het monster komt er aan!",
          "het is heel erg snel.",
          "ze zien een hoge boom.",
          "wat doen ze nu?"
        ],
        keuzes: [
          { tekst: "klim in de boom", naar: "boom" },
          { tekst: "pak de steen", naar: "golf" }
        ]
      },
      kijk: {
        zinnen: [
          "roan blijft heel stil staan.",
          "ze kijkt het monster aan.",
          "het monster stopt ook.",
          "het kijkt heel verdrietig.",
          "ben jij wel boos?",
          "vraagt roan zacht.",
          "nee zegt het monster.",
          "ik ben heel erg alleen."
        ],
        keuzes: [
          { tekst: "wees zijn vriend", naar: "vriend" },
          { tekst: "maak hem klein", naar: "klein" }
        ]
      },
      boom: {
        zinnen: [
          "ze klimmen in de boom.",
          "heel hoog tussen de tak.",
          "het monster kan er niet bij.",
          "het is veel te groot.",
          "het brult nog een keer.",
          "dan zakt het terug in het meer.",
          "pff dat was heel eng.",
          "ze klimmen snel weer omlaag."
        ],
        einde: true
      },
      golf: {
        zinnen: [
          "roan pakt de steen.",
          "ze wijst naar het meer.",
          "het water wordt heel hoog.",
          "een golf duwt het monster terug.",
          "het spoelt het meer weer in.",
          "het monster is weg.",
          "puck valt roan om de hals.",
          "jij bent niet bang he."
        ],
        einde: true
      },
      vriend: {
        zinnen: [
          "roan aait het monster.",
          "het voelt nat en glad.",
          "wil je met ons spelen?",
          "ja roept het monster blij.",
          "het maakt een grote sprong.",
          "het spettert het meer rond.",
          "ze spelen de hele dag.",
          "het monster is hun vriend."
        ],
        einde: true
      },
      klein: {
        zinnen: [
          "roan pakt de steen.",
          "word eens klein zegt ze.",
          "het monster krimpt heel snel.",
          "nu is het zo klein als een vis.",
          "wat een schattig beest.",
          "puck pakt het heel zacht.",
          "ze nemen het mee naar huis.",
          "in een kom met water."
        ],
        einde: true
      }
    }
  },
  {
    titel: "de berg van vuur",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck zien een berg.",
          "de berg spuugt vuur!",
          "er rolt warme steen omlaag.",
          "een dorp is in gevaar!",
          "de mensen zijn heel bang.",
          "kan roan hen helpen?"
        ],
        keuzes: [
          { tekst: "stop het vuur", naar: "stop" },
          { tekst: "red de mensen", naar: "red" }
        ]
      },
      stop: {
        zinnen: [
          "roan loopt naar de berg.",
          "ze pakt de blauwe steen.",
          "de steen wordt heel koud.",
          "ze blaast koude lucht.",
          "het vuur wordt minder.",
          "wat doet ze nog meer?"
        ],
        keuzes: [
          { tekst: "maak er sneeuw van", naar: "sneeuw" },
          { tekst: "duw het vuur weg", naar: "duw" }
        ]
      },
      red: {
        zinnen: [
          "roan rent naar het dorp.",
          "snel weg hier roept ze.",
          "ze pakt de steen.",
          "ze maakt een muur van licht.",
          "de warme steen stopt er op.",
          "maar er mist nog iemand.",
          "een klein kind in een huis!"
        ],
        keuzes: [
          { tekst: "ren naar het kind", naar: "kind" },
          { tekst: "vlieg met de steen", naar: "vlieg" }
        ]
      },
      sneeuw: {
        zinnen: [
          "roan maakt er sneeuw van.",
          "het sneeuwt op de berg.",
          "het vuur gaat helemaal uit.",
          "de berg wordt weer rustig.",
          "het dorp is gered!",
          "de mensen juichen heel hard.",
          "roan heeft het gedaan.",
          "met haar koude steen."
        ],
        einde: true
      },
      duw: {
        zinnen: [
          "roan duwt met de steen.",
          "het rode vuur draait om.",
          "het gaat een andere kant op.",
          "weg van het dorp.",
          "in een leeg dal.",
          "daar kan het geen kwaad.",
          "het dorp is helemaal veilig.",
          "roan veegt het zweet weg."
        ],
        einde: true
      },
      kind: {
        zinnen: [
          "roan rent naar het huis.",
          "het kind huilt heel hard.",
          "kom maar zegt roan lief.",
          "ze pakt het kind op.",
          "ze rent heel snel weg.",
          "net op tijd!",
          "het kind is veilig.",
          "de mama geeft een dikke kus."
        ],
        einde: true
      },
      vlieg: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt zich heel licht.",
          "ze vliegt naar het huis.",
          "door het raam naar binnen.",
          "ze grijpt het kind vast.",
          "en vliegt snel weer weg.",
          "iedereen is heel blij.",
          "roan is een echte held."
        ],
        einde: true
      }
    }
  },
  {
    titel: "het slot van de reus",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "op een berg staat een slot.",
          "in het slot woont een reus.",
          "de reus heeft een hond gepakt.",
          "de hond zit vast in het slot.",
          "hij jankt heel zielig.",
          "roan wil de hond redden.",
          "hoe komt ze in het slot?"
        ],
        keuzes: [
          { tekst: "klim over de muur", naar: "muur" },
          { tekst: "klop op de poort", naar: "poort" }
        ]
      },
      muur: {
        zinnen: [
          "roan klimt over de muur.",
          "puck klimt achter haar aan.",
          "ze zijn in de tuin van het slot.",
          "daar slaapt de grote reus.",
          "hij snurkt heel hard.",
          "de hond zit in een hok.",
          "wat doen ze nu?"
        ],
        keuzes: [
          { tekst: "sluip heel zacht", naar: "sluip" },
          { tekst: "pak de steen", naar: "straal" }
        ]
      },
      poort: {
        zinnen: [
          "roan klopt op de poort.",
          "de reus doet open.",
          "wat moet jij hier?",
          "bromt de grote reus.",
          "geef de hond terug zegt roan.",
          "de reus lacht heel hard.",
          "kom hem maar pakken!"
        ],
        keuzes: [
          { tekst: "wees heel dapper", naar: "dapper" },
          { tekst: "maak de reus klein", naar: "klein" }
        ]
      },
      sluip: {
        zinnen: [
          "ze sluipen heel zacht.",
          "langs de reus die slaapt.",
          "roan maakt het hok open.",
          "de hond rent naar haar toe.",
          "stil zegt roan zacht.",
          "ze sluipen weer terug.",
          "over de muur naar huis.",
          "de hond is gered!",
          "hij likt roan heel blij."
        ],
        einde: true
      },
      straal: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt het hok open.",
          "met een straal van licht.",
          "maar de reus wordt wakker!",
          "ze maakt de reus heel klein.",
          "nu is hij zo klein als puck.",
          "doe niet meer zo stoer.",
          "zegt roan tegen de reus.",
          "de hond is vrij en blij."
        ],
        einde: true
      },
      dapper: {
        zinnen: [
          "roan stapt naar binnen.",
          "ze is heel erg dapper.",
          "ze rent naar de hond.",
          "ze maakt het touw los.",
          "de reus pakt naar haar.",
          "maar roan is veel te snel.",
          "ze rent naar buiten.",
          "met de hond in haar arm.",
          "de reus is veel te traag."
        ],
        einde: true
      },
      klein: {
        zinnen: [
          "roan pakt de steen.",
          "ze wijst naar de reus.",
          "word maar klein roept ze.",
          "de reus krimpt heel snel.",
          "nu is hij heel erg klein.",
          "hij piept als een muis.",
          "sorry sorry roept hij.",
          "roan pakt de hond op.",
          "wees voortaan lief reus."
        ],
        einde: true
      }
    }
  },
  {
    titel: "de wolf in het bos",
    start: "begin",
    nodes: {
      begin: {
        zinnen: [
          "roan en puck zijn in het bos.",
          "een lam roept om hulp.",
          "het lam is heel klein.",
          "een wolf sluipt er naar toe.",
          "de wolf heeft honger.",
          "het lam is in gevaar!",
          "wat doet roan snel?"
        ],
        keuzes: [
          { tekst: "jaag de wolf weg", naar: "jaag" },
          { tekst: "praat met de wolf", naar: "praat" }
        ]
      },
      jaag: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt een hard geluid.",
          "boem als een donder.",
          "de wolf schrikt heel erg.",
          "maar hij gaat niet weg.",
          "hij gromt naar roan.",
          "wat doet ze nu?"
        ],
        keuzes: [
          { tekst: "maak de wolf klein", naar: "klein" },
          { tekst: "til het lam op", naar: "til" }
        ]
      },
      praat: {
        zinnen: [
          "wacht zegt roan zacht.",
          "eet dit lam niet op.",
          "de wolf kijkt naar haar.",
          "ik heb zo veel honger.",
          "zegt de wolf heel zacht.",
          "roan heeft een plan."
        ],
        keuzes: [
          { tekst: "geef hem ander eten", naar: "bout" },
          { tekst: "maak een grote vis", naar: "vis" }
        ]
      },
      klein: {
        zinnen: [
          "roan maakt de wolf klein.",
          "nu is hij zo klein als een muis.",
          "hij kan het lam niks doen.",
          "het lam huppelt blij weg.",
          "terug naar zijn mama.",
          "de kleine wolf rent weg.",
          "hij zoekt maar een muis.",
          "roan en puck lachen."
        ],
        einde: true
      },
      til: {
        zinnen: [
          "roan tilt het lam op.",
          "ze rent er snel mee weg.",
          "de wolf rent er achter aan.",
          "maar roan pakt de steen.",
          "ze maakt een muur van licht.",
          "de wolf kan er niet door.",
          "het lam is veilig!",
          "ze brengt het naar de wei."
        ],
        einde: true
      },
      bout: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt een grote bout.",
          "een dikke bout met vlees.",
          "hier zegt ze tegen de wolf.",
          "de wolf eet de bout op.",
          "hap slik weg.",
          "nu heeft hij geen honger meer.",
          "dank je wel zegt de wolf.",
          "hij laat het lam met rust."
        ],
        einde: true
      },
      vis: {
        zinnen: [
          "roan pakt de steen.",
          "ze maakt een hele grote vis.",
          "de vis valt voor de wolf.",
          "wauw zegt de wolf blij.",
          "die lust ik nog veel meer.",
          "hij sleept de vis mee.",
          "het lam rent snel naar huis.",
          "de wolf en het lam zijn vrienden.",
          "wat een goede afloop."
        ],
        einde: true
      }
    }
  }
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
  const [currentContent, setCurrentContent] = useState('');
  const [mode, setMode] = useState('words'); // 'words', 'sentences', 'story', 'avontuur'

  // Story state
  const [storyProgress, setStoryProgress] = useState({ chapter: 0, sentenceIndex: 0 });
  const [showChapterEnd, setShowChapterEnd] = useState(false);

  // Avontuur (interactief) state
  const [avontuurProgress, setAvontuurProgress] = useState({
    avontuur: 0,
    node: AVONTUREN[0].start,
    zinIndex: 0
  });
  const [showAvontuurEnd, setShowAvontuurEnd] = useState(false);

  // Modals (in-app i.p.v. alert/confirm)
  const [showPicker, setShowPicker] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showBookEndModal, setShowBookEndModal] = useState(false);

  // History for Undo
  const [history, setHistory] = useState([]);

  // Pools
  const [availableWords, setAvailableWords] = useState([]);
  const [availableSentences, setAvailableSentences] = useState([]);
  
  // Persisted Score & Progress
  const [count, setCount] = useState(() => {
    try {
      const savedCount = localStorage.getItem('readingAppCount');
      return savedCount ? parseInt(savedCount, 10) : 0;
    } catch (e) { return 0; }
  });

  // Load saved story progress
  useEffect(() => {
    try {
      const savedStory = localStorage.getItem('readingAppStoryProgress');
      if (savedStory) {
        setStoryProgress(JSON.parse(savedStory));
      }
      const savedAvontuur = localStorage.getItem('readingAppAvontuurProgress');
      if (savedAvontuur) {
        const parsed = JSON.parse(savedAvontuur);
        // Alleen herstellen als de opgeslagen node nog bestaat (data kan zijn gewijzigd)
        if (AVONTUREN[parsed.avontuur]?.nodes?.[parsed.node]) {
          setAvontuurProgress(parsed);
        }
      }
    } catch(e) {}
  }, []);

  // Save changes
  useEffect(() => {
    try { localStorage.setItem('readingAppCount', count.toString()); } catch (e) {}
  }, [count]);

  useEffect(() => {
    try { localStorage.setItem('readingAppStoryProgress', JSON.stringify(storyProgress)); } catch(e) {}
  }, [storyProgress]);

  useEffect(() => {
    try { localStorage.setItem('readingAppAvontuurProgress', JSON.stringify(avontuurProgress)); } catch(e) {}
  }, [avontuurProgress]);

  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Default light mode for kids usually better
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState('small');

  const audioApplause = useRef(null);
  const audioCheering = useRef(null);
  const audioFanfare = useRef(null);
  const audioClick = useRef(null);
  const audioPageFlip = useRef(null);

  useEffect(() => {
    const initialWords = [...new Set(WOORDEN_LIJST)]; // dubbele woorden eruit
    const initialSentences = [...ZINNEN_LIJST];

    // Initial content random pick
    const randomIndex = Math.floor(Math.random() * initialWords.length);
    setCurrentContent(initialWords[randomIndex]);
    initialWords.splice(randomIndex, 1);

    setAvailableWords(initialWords);
    setAvailableSentences(initialSentences);
    setLoading(false);

    audioApplause.current = new Audio(SOUNDS.applause);
    audioCheering.current = new Audio(SOUNDS.cheering);
    audioFanfare.current = new Audio(SOUNDS.fanfare);
    audioClick.current = new Audio(SOUNDS.click);
    audioPageFlip.current = new Audio(SOUNDS.pageFlip);
    
    if(audioClick.current) audioClick.current.volume = 0.3;
  }, []);

  // Preload voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Een lege aanroep om de voices in te laden in Chrome
        window.speechSynthesis.getVoices();
        
        // Luister naar het event wanneer de stemmen daadwerkelijk geladen zijn
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
  }, []);

  // Sync content when switching back to story mode
  useEffect(() => {
    if (mode === 'story' && !showChapterEnd) {
      const chapter = VERHALEN[storyProgress.chapter];
      if (chapter) {
        setCurrentContent(chapter.zinnen[storyProgress.sentenceIndex]);
      }
    }
  }, [mode, storyProgress, showChapterEnd]);

  // Sync content when in avontuur mode
  useEffect(() => {
    if (mode === 'avontuur' && !showAvontuurEnd) {
      const node = AVONTUREN[avontuurProgress.avontuur]?.nodes?.[avontuurProgress.node];
      if (node) {
        setCurrentContent(node.zinnen[avontuurProgress.zinIndex]);
      }
    }
  }, [mode, avontuurProgress, showAvontuurEnd]);

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
      } else if (type === 'pageFlip' && audioPageFlip.current) {
        audioPageFlip.current.currentTime = 0;
        audioPageFlip.current.play().catch(() => {});
      }
    } catch (e) {
      console.error("Audio play error", e);
    }
  }, [soundEnabled]);

  // Spreekt willekeurige tekst uit. Op Android via de Capacitor-plugin, in de browser via speechSynthesis.
  const speakText = useCallback(async (text) => {
    if (!text) return;

    // Native (Android/iOS): gebruik de Capacitor Text-to-Speech plugin
    if (Capacitor.isNativePlatform()) {
      try { await TextToSpeech.stop(); } catch (e) {}
      try {
        await TextToSpeech.speak({ text, lang: 'nl-NL', rate: 0.9 });
      } catch (e) {
        console.error("TTS (native) error", e);
      }
      return;
    }

    // Browser: speechSynthesis
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn("Spraak niet ondersteund in deze browser.");
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.rate = 0.85;
    const dutchVoice = voices.find(voice => voice.lang.includes('nl') || voice.lang.includes('NL'));
    if (dutchVoice) {
      utterance.voice = dutchVoice;
    }
    window.speechSynthesis.cancel(); // Stop vorige spraak
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakCurrentContent = useCallback((e) => {
    e && e.stopPropagation();
    const textToSpeak = showChapterEnd
      ? VERHALEN[storyProgress.chapter]?.vraag
      : currentContent;
    speakText(textToSpeak);
  }, [showChapterEnd, storyProgress.chapter, currentContent, speakText]);

  const handleUndo = (e) => {
    e.stopPropagation();
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    
    // Restore state
    setCount(prev => Math.max(0, prev - lastAction.points)); 
    setMode(lastAction.mode);
    
    if (lastAction.mode === 'story') {
        setStoryProgress(lastAction.storyProgress);
        setShowChapterEnd(lastAction.showChapterEnd);
        setCurrentContent(lastAction.content);
    } else if (lastAction.mode === 'avontuur') {
        setAvontuurProgress(lastAction.avontuurProgress);
        setShowAvontuurEnd(lastAction.showAvontuurEnd);
        setCurrentContent(lastAction.content);
    } else {
        setCurrentContent(lastAction.content);
    }

    setHistory(prev => prev.slice(0, -1));
    playSound('click');
  };

  const nextChapter = (e) => {
    e && e.stopPropagation();
    
    // Stop cheering if it is still playing
    if (audioCheering.current) {
        audioCheering.current.pause();
        audioCheering.current.currentTime = 0;
    }
    // OOK stoppen met applaus als dat nog speelt
    if (audioApplause.current) {
        audioApplause.current.pause();
        audioApplause.current.currentTime = 0;
    }

    const nextChapIdx = storyProgress.chapter + 1;
    if (nextChapIdx < VERHALEN.length) {
      setStoryProgress({ chapter: nextChapIdx, sentenceIndex: 0 });
      setShowChapterEnd(false);
      // playSound('pageFlip'); // REMOVED as requested
    } else {
      // Boek is uit!
      playSound('fanfare');
      triggerConfetti('big');
      setShowBookEndModal(true);
      // Terug naar het begin van het boek
      setStoryProgress({ chapter: 0, sentenceIndex: 0 });
      setShowChapterEnd(false);
    }
  };

  const handleTap = useCallback(async () => {
    if (showChapterEnd || showAvontuurEnd) return; // Moet op de knop klikken

    // Op een keuzemoment in avontuur-modus doet tikken op de achtergrond niets
    if (mode === 'avontuur') {
      const node = AVONTUREN[avontuurProgress.avontuur]?.nodes?.[avontuurProgress.node];
      if (node && node.keuzes && avontuurProgress.zinIndex >= node.zinnen.length - 1) return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    let pointsEarned = 1;
    let contentForHistory = currentContent;

    if (mode === 'sentences' || mode === 'story' || mode === 'avontuur') {
      pointsEarned = currentContent.trim().split(/\s+/).length;
    }

    // Save history
    setHistory(prev => [...prev, {
      content: contentForHistory,
      mode: mode,
      points: pointsEarned,
      storyProgress: { ...storyProgress },
      showChapterEnd: showChapterEnd,
      avontuurProgress: { ...avontuurProgress },
      showAvontuurEnd: showAvontuurEnd
    }]);

    // Update Content based on Mode
    if (mode === 'story') {
       const currentChap = VERHALEN[storyProgress.chapter];
       const nextIndex = storyProgress.sentenceIndex + 1;

       if (nextIndex < currentChap.zinnen.length) {
         // Next sentence in chapter
         setStoryProgress(prev => ({ ...prev, sentenceIndex: nextIndex }));
         // Content update happens in useEffect via storyProgress dependency, 
         // but for instant snappy feel we set it here too if we want, 
         // though useEffect is safer for sync. 
         // Let's trust React fast rerender or set it:
         setCurrentContent(currentChap.zinnen[nextIndex]);
         playSound('click');
       } else {
         // End of chapter
         setShowChapterEnd(true);
         playSound('cheering');
         playSound('applause'); // <--- NU SPELEN ZE ALLEBEI!
         triggerConfetti('small');
       }
    }
    else if (mode === 'avontuur') {
       const av = AVONTUREN[avontuurProgress.avontuur];
       const node = av.nodes[avontuurProgress.node];
       const nextIndex = avontuurProgress.zinIndex + 1;

       if (nextIndex < node.zinnen.length) {
         // Volgende zin in deze node
         setAvontuurProgress(prev => ({ ...prev, zinIndex: nextIndex }));
         setCurrentContent(node.zinnen[nextIndex]);
         playSound('click');
       } else {
         // Laatste zin van een einde-node → het avontuur is uit
         // (keuze-nodes worden hierboven al afgevangen en komen hier niet)
         setShowAvontuurEnd(true);
         playSound('cheering');
         playSound('applause');
         triggerConfetti('small');
       }
    }
    else if (mode === 'words') {
      let pool = [...availableWords];
      if (pool.length === 0) pool = [...WOORDEN_LIJST]; 
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentContent(pool[randomIndex]);
      pool.splice(randomIndex, 1);
      setAvailableWords(pool);
      playSound('click');
    } 
    else { // sentences
      let pool = [...availableSentences];
      if (pool.length === 0) pool = [...ZINNEN_LIJST];
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentContent(pool[randomIndex]);
      pool.splice(randomIndex, 1);
      setAvailableSentences(pool);
      playSound('click');
    }

    // Score Logic
    const oldScore = count;
    const newScore = count + pointsEarned;
    setCount(newScore);

    // Celebration
    if (Math.floor(newScore / 100) > Math.floor(oldScore / 100)) {
      playSound('fanfare');
      playSound('cheering');
      triggerConfetti('big');
    } 
    else if (mode !== 'story' && Math.floor(newScore / 10) > Math.floor(oldScore / 10)) {
      // In story mode celebration happens at chapter end, not mid-sentence ideally,
      // but points milestones are always fun.
      playSound('applause');
      triggerConfetti('small');
    }

  }, [mode, currentContent, availableWords, availableSentences, storyProgress, showChapterEnd, avontuurProgress, showAvontuurEnd, count, playSound]);

  // Keuze maken in een avontuur: spring naar de gekozen node
  const handleChoice = (keuze) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const pointsEarned = keuze.tekst.trim().split(/\s+/).length;

    // Geschiedenis bewaren zodat undo terug kan naar het keuzemoment
    setHistory(prev => [...prev, {
      content: currentContent,
      mode: 'avontuur',
      points: pointsEarned,
      storyProgress: { ...storyProgress },
      showChapterEnd: showChapterEnd,
      avontuurProgress: { ...avontuurProgress },
      showAvontuurEnd: showAvontuurEnd
    }]);

    const targetNode = AVONTUREN[avontuurProgress.avontuur].nodes[keuze.naar];
    setAvontuurProgress(prev => ({ ...prev, node: keuze.naar, zinIndex: 0 }));
    setCurrentContent(targetNode.zinnen[0]);

    const oldScore = count;
    const newScore = count + pointsEarned;
    setCount(newScore);
    if (Math.floor(newScore / 100) > Math.floor(oldScore / 100)) {
      playSound('fanfare');
      playSound('cheering');
      triggerConfetti('big');
    } else {
      playSound('click');
    }
  };

  // Avontuur opnieuw beginnen (vanaf het einde-scherm)
  const restartAvontuur = (e) => {
    e && e.stopPropagation();
    if (audioCheering.current) { audioCheering.current.pause(); audioCheering.current.currentTime = 0; }
    if (audioApplause.current) { audioApplause.current.pause(); audioApplause.current.currentTime = 0; }
    const av = AVONTUREN[avontuurProgress.avontuur];
    setAvontuurProgress({ avontuur: avontuurProgress.avontuur, node: av.start, zinIndex: 0 });
    setShowAvontuurEnd(false);
    setHistory([]);
  };

  // Kiezer: spring naar een specifiek verhaal of avontuur
  const pickStory = (chapterIndex) => {
    setMode('story');
    setStoryProgress({ chapter: chapterIndex, sentenceIndex: 0 });
    setShowChapterEnd(false);
    setShowAvontuurEnd(false);
    setHistory([]);
    setCurrentContent(VERHALEN[chapterIndex].zinnen[0]);
    setShowPicker(false);
    playSound('click');
  };

  const pickAvontuur = (avontuurIndex) => {
    setMode('avontuur');
    const av = AVONTUREN[avontuurIndex];
    setAvontuurProgress({ avontuur: avontuurIndex, node: av.start, zinIndex: 0 });
    setShowAvontuurEnd(false);
    setShowChapterEnd(false);
    setHistory([]);
    setCurrentContent(av.nodes[av.start].zinnen[0]);
    setShowPicker(false);
    playSound('click');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setHistory([]); // Clear history on mode switch to prevent complex state restoration issues

    if (newMode === 'words') {
      setShowChapterEnd(false);
      setShowAvontuurEnd(false);
      let pool = availableWords.length > 0 ? [...availableWords] : [...new Set(WOORDEN_LIJST)];
      setCurrentContent(pool[Math.floor(Math.random() * pool.length)]);
    } else if (newMode === 'sentences') {
      setShowChapterEnd(false);
      setShowAvontuurEnd(false);
      let pool = availableSentences.length > 0 ? [...availableSentences] : [...ZINNEN_LIJST];
      setCurrentContent(pool[Math.floor(Math.random() * pool.length)]);
    } else if (newMode === 'story') {
      // Hervat het verhaal bij de laatst gelezen zin
      setShowAvontuurEnd(false);
      const chap = VERHALEN[storyProgress.chapter];
      if(chap) {
        setCurrentContent(chap.zinnen[storyProgress.sentenceIndex]);
      }
    } else if (newMode === 'avontuur') {
      // Hervat het avontuur bij de laatst gelezen zin
      setShowChapterEnd(false);
      const av = AVONTUREN[avontuurProgress.avontuur];
      const node = av?.nodes?.[avontuurProgress.node];
      if (node) {
        setCurrentContent(node.zinnen[avontuurProgress.zinIndex] || node.zinnen[0]);
      }
    }
  };

  const triggerConfetti = (type) => {
    setConfettiType(type);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), type === 'big' ? 5000 : 3000);
  };

  const resetGame = (e) => {
    e.stopPropagation();
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setCount(0);
    setHistory([]);
    setStoryProgress({ chapter: 0, sentenceIndex: 0 });
    setShowChapterEnd(false);
    setAvontuurProgress({ avontuur: 0, node: AVONTUREN[0].start, zinIndex: 0 });
    setShowAvontuurEnd(false);
    setShowConfetti(false);
    setShowResetModal(false);
  };

  // Start Screen
  if (!gameStarted) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 dark:bg-slate-900 font-sans p-4 text-center select-none transition-colors duration-300">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full border-4 border-blue-200 dark:border-slate-700">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">Leren Lezen</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Welkom terug!<br/>
              Je hebt al <strong>{count}</strong> punten.
            </p>
            
            {loading ? (
              <div className="flex items-center justify-center text-blue-500 gap-2"><Loader2 className="animate-spin" /> Laden...</div>
            ) : (
              <button 
                onClick={() => { setGameStarted(true); playSound('click'); }}
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

  // Chapter End Card (Question Mode)
  if (mode === 'story' && showChapterEnd) {
    const currentChap = VERHALEN[storyProgress.chapter];
    return (
       <div className={darkMode ? "dark" : ""}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 dark:bg-slate-900 p-4 font-sans transition-colors duration-300">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-purple-200 dark:border-purple-900 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-purple-400"></div>
              
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              
              <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">Hoofdstuk Uit!</h2>
              <h3 className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                "{currentChap.titel}"
              </h3>

              <div className="bg-blue-50 dark:bg-slate-700 p-6 rounded-xl mb-8 text-left">
                <p className="text-sm font-bold text-blue-400 dark:text-blue-300 uppercase mb-2 tracking-wider">Vraag:</p>
                <p className="text-2xl font-medium text-slate-800 dark:text-slate-100 leading-snug">
                  {currentChap.vraag}
                </p>
                <button 
                  onClick={speakCurrentContent}
                  className="mt-4 flex items-center gap-2 text-blue-500 font-bold hover:underline"
                >
                  <Volume2 size={20} /> Lees vraag voor
                </button>
              </div>

              <button 
                onClick={nextChapter}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-4 px-8 rounded-xl shadow-[0_4px_0_rgb(126,34,206)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Volgende Hoofdstuk <ArrowRight size={28} />
              </button>
           </div>
           
           {/* Score still visible */}
           <div className="mt-8 flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-md">
              <Star className="text-yellow-400 fill-yellow-400" size={24} />
              <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{count}</span>
           </div>
        </div>
       </div>
    );
  }

  // Avontuur End Card
  if (mode === 'avontuur' && showAvontuurEnd) {
    const currentAv = AVONTUREN[avontuurProgress.avontuur];
    return (
       <div className={darkMode ? "dark" : ""}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 dark:bg-slate-900 p-4 font-sans transition-colors duration-300">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-purple-200 dark:border-purple-900 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-purple-400"></div>

              <Sparkles className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />

              <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">Avontuur Uit!</h2>
              <h3 className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                "{currentAv.titel}"
              </h3>

              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Goed gelezen! Wat wil je nu doen?
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={restartAvontuur}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-4 px-6 rounded-xl shadow-[0_4px_0_rgb(126,34,206)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={26} /> Nog een keer
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowPicker(true); }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-4 px-6 rounded-xl shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <List size={26} /> Kies avontuur
                </button>
              </div>
           </div>

           {/* Score still visible */}
           <div className="mt-8 flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-md">
              <Star className="text-yellow-400 fill-yellow-400" size={24} />
              <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{count}</span>
           </div>
        </div>
       </div>
    );
  }

  // Afgeleide waarden voor de avontuur-weergave
  const huidigeAvNode = mode === 'avontuur'
    ? AVONTUREN[avontuurProgress.avontuur]?.nodes?.[avontuurProgress.node]
    : null;
  const opKeuzeMoment = !!(huidigeAvNode && huidigeAvNode.keuzes &&
    avontuurProgress.zinIndex >= huidigeAvNode.zinnen.length - 1);

  // Main Reading Interface
  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        onClick={handleTap}
        className="relative flex flex-col items-center justify-between min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer touch-manipulation select-none transition-colors duration-300"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        {/* HEADER */}
        <div className="w-full p-2 pt-4 sm:p-4 sm:pt-12 flex flex-col sm:flex-row justify-between items-center z-10 gap-4">
          
          {/* Settings Left */}
          <div className="flex gap-2 order-2 sm:order-1">
            <button onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow hover:text-blue-500 text-slate-400 transition-colors">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); setDarkMode(!darkMode); }} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow hover:text-blue-500 text-slate-400 transition-colors">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {(mode === 'story' || mode === 'avontuur') && (
              <button onClick={(e) => { e.stopPropagation(); setShowPicker(true); }} className="p-3 bg-white dark:bg-slate-800 rounded-full shadow hover:text-blue-500 text-slate-400 transition-colors" title="Kies een verhaal of avontuur">
                <List size={20} />
              </button>
            )}
          </div>
          
          {/* Center Score & Undo */}
          <div className="flex items-center gap-3 order-1 sm:order-2">
             <button 
                onClick={handleUndo}
                disabled={history.length === 0}
                className={`p-2 rounded-full shadow-md border-2 border-orange-100 dark:border-slate-700 transition-all
                  ${history.length === 0 
                    ? 'bg-gray-100 text-gray-300 dark:bg-slate-800 dark:text-slate-700 cursor-not-allowed opacity-50' 
                    : 'bg-white dark:bg-slate-800 text-orange-500 dark:text-orange-400 hover:text-orange-600 hover:bg-orange-50'
                  }`}
             >
                <Undo size={20} />
             </button>

             <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-md border-2 border-yellow-100 dark:border-slate-700">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="text-2xl font-bold text-slate-700 dark:text-slate-200 font-mono">{count}</span>
             </div>
          </div>

          {/* Mode Switchers Right */}
          <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl order-3">
             {[
               { id: 'words', icon: Type, label: 'Woord' },
               { id: 'sentences', icon: BookOpen, label: 'Zin' },
               { id: 'story', icon: Library, label: 'Verhaal' },
               { id: 'avontuur', icon: Sparkles, label: 'Avontuur' }
             ].map((m) => (
               <button
                 key={m.id}
                 onClick={(e) => { e.stopPropagation(); switchMode(m.id); }}
                 className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition-all
                   ${mode === m.id 
                     ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' 
                     : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                   }`}
               >
                 <m.icon size={16} />
                 <span className="hidden md:inline">{m.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* STORY PROGRESS BAR */}
        {mode === 'story' && (
           <div className="w-full max-w-3xl px-8 mt-2 z-10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                 <span>Hfd {storyProgress.chapter + 1}: {VERHALEN[storyProgress.chapter].titel}</span>
                 <span>{storyProgress.sentenceIndex + 1} / {VERHALEN[storyProgress.chapter].zinnen.length}</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((storyProgress.sentenceIndex + 1) / VERHALEN[storyProgress.chapter].zinnen.length) * 100}%` }}
                 />
              </div>
           </div>
        )}

        {/* AVONTUUR TITLE BAR */}
        {mode === 'avontuur' && (
           <div className="w-full max-w-3xl px-8 mt-2 z-10">
              <div className="flex items-center justify-center gap-2 text-sm font-bold text-purple-400 dark:text-purple-300 uppercase tracking-wider">
                 <Sparkles size={16} />
                 <span>{AVONTUREN[avontuurProgress.avontuur].titel}</span>
              </div>
           </div>
        )}

        {/* MAIN CONTENT CARD */}
        <div className="flex-1 flex flex-col items-center justify-center w-full z-10 px-4 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-16 w-full max-w-4xl flex items-center justify-center border-b-8 border-slate-200 dark:border-slate-700 active:border-b-0 active:translate-y-2 transition-all duration-75 min-h-[300px] relative">
            
            <span 
              className={`font-bold text-slate-800 dark:text-slate-100 tracking-wide text-center break-words transition-all duration-300
                ${mode === 'words' 
                  ? 'text-6xl md:text-8xl lg:text-9xl' 
                  : 'text-3xl md:text-5xl lg:text-6xl leading-snug'
                }
              `}
              style={{ fontFamily: 'Verdana, sans-serif' }}
            >
              {currentContent}
            </span>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
               <button
                  onClick={speakCurrentContent}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg border-4 border-white dark:border-slate-700 active:scale-95 transition-all flex items-center gap-2"
                  title="Luister"
               >
                 <Play size={32} fill="currentColor" />
               </button>
            </div>
          </div>
          
          {opKeuzeMoment ? (
            <div className="mt-12 w-full max-w-2xl flex flex-col gap-3 px-2">
              {huidigeAvNode.keuzes.map((keuze, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleChoice(keuze); }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-2xl md:text-3xl font-bold py-5 px-6 rounded-2xl shadow-[0_5px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all text-center break-words"
                    style={{ fontFamily: 'Verdana, sans-serif' }}
                  >
                    {keuze.tekst}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); speakText(keuze.tekst); }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg active:scale-95 transition-all shrink-0"
                    title="Lees voor"
                  >
                    <Volume2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-slate-400 dark:text-slate-500 text-lg animate-pulse text-center">
              {(mode === 'story' || mode === 'avontuur') ? 'Tik voor het vervolg...' : 'Tik voor de volgende...'}
            </p>
          )}
        </div>

        {/* Confetti Effects */}
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
                    <div className="text-6xl md:text-9xl font-black text-pink-500 drop-shadow-lg bg-white dark:bg-slate-800 bg-opacity-95 p-8 rounded-3xl border-4 border-pink-300">
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
              </div>
            )}
          </div>
        )}
        
        {/* Reset Button (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20">
             <button
              onClick={resetGame}
              className="p-2 bg-white/50 dark:bg-slate-800/50 rounded-full hover:bg-red-100 text-slate-300 hover:text-red-500 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
        </div>

        {/* PICKER MODAL (verhaal / avontuur kiezen) */}
        {showPicker && (
          <div
            onClick={(e) => { e.stopPropagation(); setShowPicker(false); }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden border-4 border-blue-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300">Kies een verhaal</h2>
                <button onClick={() => setShowPicker(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto p-5 space-y-6">
                {/* Avonturen */}
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-purple-400 dark:text-purple-300 uppercase tracking-wider mb-2">
                    <Sparkles size={16} /> Avonturen (kies zelf)
                  </p>
                  <div className="space-y-2">
                    {AVONTUREN.map((av, idx) => (
                      <button
                        key={idx}
                        onClick={() => pickAvontuur(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-between
                          ${mode === 'avontuur' && avontuurProgress.avontuur === idx
                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200'
                            : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        {av.titel}
                        <ArrowRight size={20} className="text-purple-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verhalen */}
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-blue-400 dark:text-blue-300 uppercase tracking-wider mb-2">
                    <Library size={16} /> Verhalen (met vraag)
                  </p>
                  <div className="space-y-2">
                    {VERHALEN.map((v, idx) => (
                      <button
                        key={idx}
                        onClick={() => pickStory(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-lg transition-colors flex items-center justify-between
                          ${mode === 'story' && storyProgress.chapter === idx
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200'
                            : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700'
                          }`}
                      >
                        <span><span className="text-slate-400 mr-2">{idx + 1}.</span>{v.titel}</span>
                        <ArrowRight size={20} className="text-blue-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESET MODAL */}
        {showResetModal && (
          <div
            onClick={(e) => { e.stopPropagation(); setShowResetModal(false); }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-4 border-red-200 dark:border-slate-700"
            >
              <AlertCircle size={56} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Opnieuw beginnen?</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Dit zet de punten op 0 en de verhalen weer aan het begin.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Nee, laat maar
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Ja, reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOOK END MODAL */}
        {showBookEndModal && (
          <div
            onClick={(e) => { e.stopPropagation(); setShowBookEndModal(false); }}
            className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-4 border-yellow-200 dark:border-slate-700"
            >
              <Trophy size={64} className="text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Gefeliciteerd!</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                Je hebt het hele boek uitgelezen! Wat knap.
              </p>
              <button
                onClick={() => setShowBookEndModal(false)}
                className="w-full bg-green-500 text-white text-xl font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors"
              >
                Hoera!
              </button>
            </div>
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

export default function ReadingApp() {
  return (
    <ErrorBoundary>
      <ReadingAppContent />
    </ErrorBoundary>
  );
}