# Code Karbone - Webflow Custom Interactions

Bienvenue sur le dépôt des scripts personnalisés de mon portfolio Code Karbone (https://www.codekarbone.fr/). 

En tant que développeur Low-Code, j'utilise Webflow comme moteur de rendu visuel (UI/UX) et j'externalise la logique complexe et les animations sur-mesure ici, sur GitHub. 

Ce workflow me permet de maintenir un code propre et de l'injecter via **jsDelivr CDN** directement dans Webflow, garantissant des performances optimales (96% Lighthouse) et évitant la surcharge des balises `<head>` du CMS.

## 🛠 Tech Stack & Librairies
* **Animations & DOM :** Vanilla JavaScript (ES6)
* **Moteur d'animation :** GSAP (Timeline, Flip Plugin)
* **Smooth Scroll :** Lenis
* **Effets visuels :** Particles.js, SplitType, TextScramble (Custom Class)

## 🚀 Fonctionnalités clés développées dans `main.js`
1.  **Architecture Dark/Light Mode :** Gestion du thème via `localStorage` avec persistance et ciblage dynamique des variables CSS pour un switch instantané sans rechargement.
2.  **Boutons "Magnétiques" (Directional Hover) :** Calcul mathématique (via `getBoundingClientRect`) de la position de la souris pour créer une onde de choc inversée lors du survol des CTA.
3.  **Routeur Intelligent (Anchor Links) :** Interception des clics sur la navbar pour synchroniser le smooth scroll de Lenis avec la fermeture asynchrone du menu plein écran.
4.  **GSAP Flip Portfolio :** Transition fluide (sans rechargement) entre la vue grille et la vue liste des projets via la mémorisation des états du DOM.
5.  **Parallax Scroll & Observer :** Animations au scroll optimisées (Intersection Observer) pour les éléments de timeline et le footer en cascade.

## 📂 Structure
* `main.js` : Toute la logique applicative et les timelines GSAP.
* `styles.css` : Les overrides CSS profonds (sécurité Navbar, fix particules, custom properties) pour palier aux limitations de l'éditeur Webflow.
