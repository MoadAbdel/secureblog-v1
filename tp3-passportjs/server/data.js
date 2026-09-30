const posts = [
  {
    id: 1,
    title: "5 thèmes premium pour React",
    img: "https://images.pexels.com/photos/7963572/pexels-photo-7963572.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    desc: "Un tour d'horizon des thèmes React les plus utilisés en production.",
    longDesc:
      "Contenu réservé aux utilisateurs authentifiés. Le détail complet d'un article n'est renvoyé par l'API que si la session Passport est valide, ce qui rend le contrôle d'accès indépendant du front.",
  },
  {
    id: 2,
    title: "OAuth 2.0 et OpenID Connect",
    img: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    desc: "OAuth délègue l'accès, OpenID Connect ajoute la couche d'identité.",
    longDesc:
      "OAuth 2.0 a été conçu pour déléguer un accès à des ressources sans partager les identifiants. OpenID Connect ajoute la couche d'identification manquante en renvoyant un ID Token, un JWT signé prouvant qu'une authentification a bien eu lieu.",
  },
  {
    id: 3,
    title: "Sessions et cookies sécurisés",
    img: "https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    desc: "HttpOnly, Secure, SameSite : les trois attributs indispensables.",
    longDesc:
      "Un cookie de session doit porter HttpOnly pour être inaccessible en JavaScript, Secure pour ne transiter qu'en HTTPS, et SameSite pour limiter son envoi lors des requêtes cross-site, ce qui bloque une grande partie des attaques CSRF.",
  },
];

module.exports = { posts };
