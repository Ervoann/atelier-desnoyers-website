export type Slide =
  | { type: "image"; src: string }
  | { type: "youtube"; videoId: string };

export const portfolio = [
  {
    id: 1,
    slug: "jardin-naturaliste-lyon",
    titre: "Jardin naturaliste",
    lieu: "Lyon 6e, 69",
    type: "Jardin privé",
    annee: "2024",
    surface: "320 m²",
    img: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format" },
      { type: "youtube", videoId: "r_epbFJ231Y" },
      { type: "image", src: "https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "Un jardin de ville reconverti en espace vivant, planté de graminées, de vivaces et d'arbustes à floraison décalée pour assurer une présence végétale tout au long de l'année. Le sol a été travaillé en profondeur pour favoriser la vie microbienne et limiter les arrosages. La composition s'inspire des prairies naturelles de la région lyonnaise, retraduites dans un cadre privé.",
    tags: ["Vivaces", "Graminées", "Sol vivant", "Aménagement"],
  },
  {
    id: 2,
    slug: "prairie-fleurie-annecy",
    titre: "Prairie fleurie",
    lieu: "Annecy, 74",
    type: "Jardin privé",
    annee: "2024",
    surface: "800 m²",
    img: "https://images.unsplash.com/photo-1594886551831-610f739902e9?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "Une vaste parcelle en pente douce, transformée en prairie naturelle semée de fleurs sauvages et de bulbes automnaux. Le projet cherchait à créer un paysage de montagne apprivoisé — libre dans son allure mais pensé dans ses rythmes et ses contrastes. La tonte différenciée crée des chemins informels qui invitent à la promenade.",
    tags: ["Prairie", "Bulbes", "Pente", "Biodiversité"],
  },
  {
    id: 3,
    slug: "massif-de-vivaces-grenoble",
    titre: "Massif de vivaces",
    lieu: "Grenoble, 38",
    type: "Espace partagé",
    annee: "2023",
    surface: "150 m²",
    img: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "Un massif conçu pour un espace partagé entre copropriétaires, avec l'ambition d'être à la fois beau et résilient. La palette végétale privilégie les espèces peu gourmandes en eau, résistantes au calcaire et attrayantes pour les pollinisateurs. Chaque plante a été choisie pour son comportement à la fois individuel et en groupe.",
    tags: ["Vivaces", "Pollinisateurs", "Espace collectif"],
  },
  {
    id: 4,
    slug: "cour-interieure-lyon",
    titre: "Cour intérieure",
    lieu: "Lyon 3e, 69",
    type: "Cour urbaine",
    annee: "2023",
    surface: "80 m²",
    img: "https://images.unsplash.com/photo-1771830916705-ab69d12196af?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1771830916705-ab69d12196af?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "Un espace minéral et ombragé, transformé en jardin de cour intérieure à Lyon. Le défi était de travailler dans une contrainte forte — peu de lumière directe, sol bétonné — pour créer un espace habité, végétalisé et agréable à vivre toute l'année. Des bacs sur mesure, des plantes d'ombre et un travail soigné sur les matériaux.",
    tags: ["Cour urbaine", "Ombre", "Bacs", "Minéral"],
  },
  {
    id: 5,
    slug: "jardin-automnal-villefranche",
    titre: "Jardin automnal",
    lieu: "Villefranche-sur-Saône, 69",
    type: "Jardin privé",
    annee: "2023",
    surface: "450 m²",
    img: "https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1594886551831-610f739902e9?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "Conçu autour d'une palette végétale aux coloris chauds — ocres, rouilles, bordeaux — ce jardin célèbre l'automne comme sa saison de gloire. Graminées en mouvement, hydrangéas persistants, feuillages colorés et baies ornementales composent un tableau qui change de semaine en semaine entre septembre et décembre.",
    tags: ["Couleurs d'automne", "Graminées", "Feuillages"],
  },
  {
    id: 6,
    slug: "sous-bois-chartreuse",
    titre: "Sous-bois aménagé",
    lieu: "Chartreuse, 38",
    type: "Parc privé",
    annee: "2022",
    surface: "1 200 m²",
    img: "https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=600&h=600&fit=crop&auto=format",
    slides: [
      { type: "image", src: "https://images.unsplash.com/photo-1719174724959-58e1876a1dc4?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1764070140879-1120c0a9e9eb?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=1600&h=900&fit=crop&auto=format" },
      { type: "image", src: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format" },
    ] as Slide[],
    description:
      "En lisière de forêt, ce parc privé a été aménagé pour révéler les qualités d'un sous-bois existant tout en créant des clairières habitables. Le travail principal a consisté à ouvrir des perspectives, à sélectionner les strates végétales à conserver et à introduire des plantes de sous-bois adaptées au contexte montagnard.",
    tags: ["Sous-bois", "Parc", "Strates végétales", "Montagne"],
  },
];

export const faq = [
  {
    q: "Vous êtes jardinier ou designer ?",
    a: "Oui. Je dessine des jardins, mais je passe aussi beaucoup de temps les mains dans la terre. J'aime savoir si ce que j'imagine sur le papier a une chance raisonnable de survivre dehors.",
  },
  {
    q: "Pourquoi faire appel à vous plutôt qu'à un autre paysagiste ?",
    a: "Parce que les autres sont déjà très occupés.\n\nPlus sérieusement, je dessine des jardins pour les personnes qui aiment les lieux un peu vivants, un peu libres, et qui préfèrent le charme d'un jardin qui évolue à la perfection d'une image figée. Je ne promets ni paradis terrestre, ni jardin sans entretien, ni floraisons permanentes de janvier à décembre. Les plantes n'ont signé aucun contrat en ce sens.",
  },
  {
    q: "Combien de temps faut-il pour faire un beau jardin ?",
    a: "Entre quelques mois et plusieurs années. Les jardins ont un défaut majeur : ils poussent à leur rythme. Heureusement, c'est aussi leur principale qualité.",
  },
  {
    q: "Est-ce qu'il faut aimer jardiner pour avoir un jardin ?",
    a: "Pas du tout. Il faut simplement être honnête sur le temps que l'on souhaite y consacrer. Mon travail consiste justement à imaginer des jardins adaptés à leurs propriétaires, et non l'inverse.",
  },
  {
    q: "Faites-vous des jardins naturels ?",
    a: "Oui, mais pas des jungles abandonnées. Un jardin vivant reste un jardin pensé. La nature est merveilleuse, mais elle n'a pas forcément lu vos plans.",
  },
  {
    q: "J'aimerais un jardin sans entretien.",
    a: "J'ai une excellente nouvelle : cela existe. On appelle cela un parking.\n\nPour un jardin, en revanche, il faudra accepter un minimum de dialogue avec le vivant.",
  },
  {
    q: "Acceptez-vous tous les projets ?",
    a: "Pas tout à fait. J'ai du mal à m'enthousiasmer pour les faux gazons, les oliviers centenaires transplantés à la grue, les murs végétalisés sous perfusion ou les jardins qui demandent davantage de technologie qu'une station spatiale. J'ai une préférence assumée pour les plantes qui ont une chance raisonnable d'être heureuses là où elles poussent.",
  },
  {
    q: "Avez-vous une plante préférée ?",
    a: "Oui, et elle change régulièrement, ce qui est le signe soit d'une grande ouverture d'esprit, soit d'un manque de constance.",
  },
];

export const accompagnements = [
  {
    titre: "Saison",
    rythme: "2 visites / an",
    desc: "Les moments essentiels. On observe les moments clés du jardin au fil de l'année.",
  },
  {
    titre: "Cycle",
    rythme: "4 visites / an",
    desc: "Le rythme complet du jardin. Observer, ajuster, tailler, enrichir, conseiller. Le client participe s'il le souhaite.",
  },
  {
    titre: "Présence",
    rythme: "6 à 8 visites / an",
    desc: "Un accompagnement attentif tout au long de l'année : suivi des plantations, interventions ciblées, recommandations saisonnières, ajustements et conseils à distance.",
  },
  {
    titre: "Cocréation",
    rythme: "½ journée ou journée",
    desc: "Le jardin devient une œuvre commune. Je vous transmets le jardin et vous donne des outils : comprendre son sol, composer un massif naturaliste, reconnaître les végétaux, tailler sans crainte.",
  },
];

export type ArticleParagraph =
  | { type: "text"; content: string }
  | { type: "quote"; content: string }
  | { type: "image"; src: string; caption?: string };

export const articles = [
  {
    id: 1,
    slug: "lire-son-jardin-avant-de-le-dessiner",
    titre: "Lire son jardin avant de le dessiner",
    categorie: "Démarche",
    date: "2025-03-12",
    extrait:
      "Avant le premier coup de crayon, il y a un temps d'écoute. Observer un terrain, c'est apprendre à lire ce qu'il raconte déjà.",
    image: "https://images.unsplash.com/photo-1611843467160-25afb8df1074?w=1200&h=700&fit=crop&auto=format",
    contenu: [
      { type: "text", content: "Il m'arrive souvent d'arriver sur un terrain et de rester un long moment sans rien noter. Pas par manque d'idées — plutôt pour laisser le lieu s'exprimer avant de projeter quoi que ce soit sur lui. Un jardin, même à l'état brut, parle. Il suffit de savoir écouter." },
      { type: "quote", content: "Un jardin existe souvent déjà en puissance. Avant toute intervention, il s'agit de comprendre." },
      { type: "text", content: "La topographie d'abord : les pentes, les creux, les zones qui retiennent l'eau. Puis l'ensoleillement — combien d'heures, à quelle saison, dans quelle direction se déplace l'ombre. Les plantes bio-indicatrices ensuite : elles disent tout sur la nature du sol, son pH, son humidité, sa compaction. Une grande ortie ne pousse pas par hasard." },
      { type: "image", src: "https://images.unsplash.com/photo-1492496913980-501348b61469?w=1200&h=700&fit=crop&auto=format", caption: "L'observation précède toujours le dessin." },
      { type: "text", content: "Ce temps d'observation n'est pas du temps perdu. C'est au contraire le moment où se construit l'essentiel du projet. Un jardin dessiné sans avoir vraiment regardé le terrain finit souvent par se battre contre lui. Un jardin qui part du lieu se contente de le révéler." },
    ] as ArticleParagraph[],
  },
  {
    id: 2,
    slug: "palette-vegetale-robuste-et-belle",
    titre: "Palette végétale : robuste et belle, les deux à la fois",
    categorie: "Botanique",
    date: "2025-04-28",
    extrait:
      "Choisir ses plantes, c'est composer un tableau dont les éléments vont changer, se développer, parfois surprendre. Quelques principes pour bien démarrer.",
    image: "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1200&h=700&fit=crop&auto=format",
    contenu: [
      { type: "text", content: "La première question que je pose lorsque l'on me parle de végétaux, c'est : pour qui et pour où ? Une plante n'est pas belle dans l'absolu. Elle est belle parce qu'elle est à sa place, parce qu'elle prospère, parce qu'elle vieillit bien. Une plante inadaptée à son milieu devient rapidement un problème — esthétique d'abord, puis pratique." },
      { type: "text", content: "Dans un contexte méditerranéen ou semi-aride, j'oriente souvent vers les graminées, les vivaces à feuillage persistant, les arbustes méditerranéens et les bulbes. Ils tiennent l'été sans arrosage intensif, ils bougent au vent, ils changent de couleur selon les saisons. Ce sont des végétaux vivants — et cela se voit." },
      { type: "quote", content: "Je préfère les plantes adaptées aux plantes héroïques. L'exotisme m'intéresse à condition qu'il ne ressemble pas à un programme de protection des témoins pour végétaux déracinés." },
      { type: "image", src: "https://images.unsplash.com/photo-1695616827909-6f147f22d40f?w=1200&h=700&fit=crop&auto=format", caption: "Massif de vivaces en fin d'été — Grenoble, 38." },
      { type: "text", content: "La robustesse ne s'oppose pas à la beauté. Les Stipa, les Pennisetum, les Salvia, les Echinacea, les Helenium — ce sont des plantes magnifiques, généreuses en floraison, appréciées des pollinisateurs et presque autonomes une fois installées. Composer avec elles, c'est construire un jardin qui tient dans le temps." },
    ] as ArticleParagraph[],
  },
  {
    id: 3,
    slug: "jardiner-en-ville-contraintes-et-ressources",
    titre: "Jardiner en ville : contraintes et ressources",
    categorie: "Projets urbains",
    date: "2025-06-03",
    extrait:
      "La ville est un terrain difficile pour les plantes — et pourtant certains des jardins les plus inventifs naissent dans ses interstices.",
    image: "https://images.unsplash.com/photo-1771830916705-ab69d12196af?w=1200&h=700&fit=crop&auto=format",
    contenu: [
      { type: "text", content: "Une cour intérieure de 40 m², un toit-terrasse exposé plein sud, une bande de terre longeant un mur nord — ce sont des espaces que l'on pourrait croire condamnés à rester stériles. Et pourtant, ce sont souvent ces projets qui m'apportent le plus de satisfaction." },
      { type: "text", content: "La contrainte force la créativité. Quand on ne peut pas planter en pleine terre, on travaille en bacs, en jardinières, en substrats allégés. Quand la lumière manque, on choisit les fougères, les hostas, les astilbes, les hydrangéas — des plantes qui non seulement tolèrent l'ombre, mais l'habitent avec élégance." },
      { type: "quote", content: "La ville a ses propres règles climatiques — îlot de chaleur, vents canalisés, sols souvent compactés. Les comprendre, c'est déjà mi-chemin vers un bon jardin." },
      { type: "image", src: "https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1200&h=700&fit=crop&auto=format", caption: "Esquisse pour une cour intérieure lyonnaise." },
      { type: "text", content: "L'arrosage est souvent la question centrale en ville. Un système goutte-à-goutte bien conçu change tout — il libère le propriétaire et garantit une hydratation régulière même en canicule. Ce n'est pas de la paresse, c'est du réalisme." },
    ] as ArticleParagraph[],
  },
];
