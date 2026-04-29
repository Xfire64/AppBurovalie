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
