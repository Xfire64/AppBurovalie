# AppBurovalie

Petite webapp de gestion de stock avec lecteur de code-barres.

## Fonctionnalites

- gestion d'articles en stock
- lecture code-barres par douchette USB ou saisie clavier
- scanner camera mobile avec `html5-qrcode`
- sauvegarde locale dans le navigateur
- installation possible comme PWA
- mode hors ligne via service worker

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
