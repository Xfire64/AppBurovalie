# AppBurovalie

Webapp de gestion de stock pour dépôts et véhicules techniciens.

## Fonctionnalites

- gestion d'articles en stock
- lecture code-barres par douchette USB ou saisie clavier
- scanner camera mobile avec `html5-qrcode`
- sauvegarde locale dans le navigateur
- installation possible comme PWA
- mode hors ligne via service worker
- backend API Fastify + PostgreSQL en préparation

## Utilisation locale

Lancer un serveur local dans ce dossier :

```bash
py -m http.server 5173
```

Puis ouvrir :

```text
http://localhost:5173
```

## Telephone

Pour utiliser la camera du telephone, il faut une URL HTTPS.
Publier l'application avec GitHub Pages, Netlify ou Vercel.

## Domaines de production

Webapp :

```text
https://app.appburovalie.fr
```

API :

```text
https://api.appburovalie.fr
```

Le VPS sert l'API avec Caddy en reverse proxy vers `127.0.0.1:3000`. La webapp peut etre servie par Caddy depuis le dossier racine du projet.

## Backend serveur

Le dossier `backend/` contient la première API serveur :

- Fastify
- Prisma
- PostgreSQL
- authentification JWT
- rôles utilisateur
- articles et codes-barres
- stocks par dépôt/véhicule
- mouvements groupés
- pointage admin
- top articles

Déploiement de test sur VPS :

```bash
git clone https://github.com/Xfire64/AppBurovalie.git
cd AppBurovalie
cp backend/.env.example backend/.env
docker compose -f compose.server.yaml up -d --build
```

Créer les données de démonstration :

```bash
docker compose -f compose.server.yaml exec api npx prisma db seed
```

Compte de test :

```text
admin@appburovalie.local
demo1234
```

## Preparation integration Kapasoft

La documentation publique Kapasoft n'etant pas disponible au moment de la preparation, l'API contient un connecteur configurable sans endpoint metier invente.

Variables a renseigner dans `backend/.env` quand Kapasoft fournit les informations :

```env
KAPASOFT_BASE_URL="https://api.kapasoft.example"
KAPASOFT_API_KEY="cle-fournie-par-kapasoft"
KAPASOFT_AUTH_HEADER="Authorization"
KAPASOFT_AUTH_SCHEME="Bearer"
KAPASOFT_HEALTH_PATH="/health"
KAPASOFT_TIMEOUT_MS=8000
```

Routes disponibles pour les profils `ADMIN`, `RESPONSABLE` et `DIRECTION` :

- `GET /integrations/kapasoft/status` : verifie si la configuration est presente sans afficher la cle API.
- `POST /integrations/kapasoft/ping` : teste l'appel Kapasoft via le chemin configure.

Quand la documentation Kapasoft sera fournie, il faudra completer le mapping articles, stocks, emplacements et mouvements dans `backend/src/integrations/kapasoft.js`.
