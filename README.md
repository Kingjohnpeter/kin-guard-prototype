# KIN-GUARD Prototype

Prototype mobile (Expo React Native) et backend Node/Express pour démonstration des concepts KIN-GUARD : signalement, KG-TRACKS, RBAC et affectation automatique heuristique.

Contenu
- app-frontend/: frontend Expo (React Native)
- app-backend/: backend Node/Express (mock en mémoire)

Comptes de test
- Citoyen: alice@citoyen / 1234
- Policier: police1 / 1234 (numero_ordre P-247, unit_id U1)
- Commissaire: comm1 / 1234 (numero_ordre C-101, commune Ngaliema)
- Commissaire général: general / 1234 (numero_ordre CG-1)

Lancement
1) Frontend (mobile)
   cd app-frontend
   npm install
   npm start
   Scanner le QR avec Expo Go (Android/iOS)

2) Backend (local)
   cd app-backend
   npm install
   npm run dev
   (Le serveur démarre sur http://localhost:3000)

Remarques
- Prototype: autorisations implémentées côté client et backend mock; en production, imposer RBAC strict côté serveur, MFA, chiffrement et validation administrative du numéro d'ordre.
- Cartes et GPS: prototypes utilisent position simulée. Intégrer react-native-maps / Mapbox pour suivi réel.

