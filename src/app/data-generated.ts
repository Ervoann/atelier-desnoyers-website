// Ce fichier est généré automatiquement depuis les JSON du CMS
// Ne le modifiez pas manuellement !

export type Slide =
  | { type: "image"; src: string }
  | { type: "youtube"; videoId: string };

export const portfolio = [
  {
    "id": 1,
    "slug": "jardin-naturaliste-lyon",
    "titre": "Jardin naturaliste",
    "lieu": "Lyon 6e, 69",
    "type": "Jardin privé",
    "annee": "2024",
    "surface": "320 m²",
    "img": "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=600&h=600&fit=crop&auto=format",
    "slides": [
      {
        "type": "image",
        "src": "https://images.unsplash.com/photo-1758192333796-ad8120cc987b?w=1600&h=900&fit=crop&auto=format"
      },
      {
        "type": "youtube",
        "videoId": "r_epbFJ231Y"
      },
      {
        "type": "image",
        "src": "https://images.unsplash.com/photo-1532211387405-12202cb81d7b?w=1600&h=900&fit=crop&auto=format"
      },
      {
        "type": "image",
        "src": "https://images.unsplash.com/photo-1492496913980-501348b61469?w=1600&h=900&fit=crop&auto=format"
      }
    ],
    "description": "Un jardin de ville reconverti en espace vivant, planté de graminées, de vivaces et d'arbustes à floraison décalée pour assurer une présence végétale tout au long de l'année. Le sol a été travaillé en profondeur pour favoriser la vie microbienne et limiter les arrosages. La composition s'inspire des prairies naturelles de la région lyonnaise, retraduites dans un cadre privé.",
    "tags": [
      "Vivaces",
      "Graminées",
      "Sol vivant",
      "Aménagement"
    ]
  },
  {
    "id": 2,
    "slug": "test-jardin",
    "titre": "Test Jardin",
    "lieu": "Paris",
    "type": "Jardin test",
    "annee": "2026",
    "surface": "100 m²",
    "img": "/uploads/bush-hammered-concrete-stack-3020mm.jpg",
    "slides": [
      {
        "type": "image",
        "src": "bush-hammered-concrete-stack-3020mm.jpg"
      }
    ],
    "description": "Mon test",
    "tags": []
  }
];

// TODO: Générer aussi les autres données (FAQ, accompagnements, articles) depuis le CMS
export const faq = [];
export const accompagnements = [];
export const articles = [];
