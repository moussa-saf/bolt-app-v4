# Guide de Déploiement - Application Documents Perdus

## Préparation

✅ L'application est prête à être déployée !
✅ Build testé et fonctionnel
✅ Fichiers de configuration créés

---

## Option 1 : Netlify (Recommandé - Le Plus Simple)

### Méthode A : Avec Interface Web (Sans Git)

1. **Créer un compte**
   - Allez sur https://netlify.com
   - Cliquez sur "Sign up" (gratuit)

2. **Déployer**
   - Une fois connecté, allez dans "Sites"
   - Glissez-déposez le dossier `dist` directement sur la page
   - OU cliquez sur "Add new site" → "Deploy manually"
   - Votre site sera en ligne en 30 secondes !

3. **Configurer les variables d'environnement**
   - Allez dans "Site settings" → "Environment variables"
   - Ajoutez ces 2 variables :
     ```
     VITE_SUPABASE_URL = https://mndchzfwufysplzrflvp.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZGNoemZ3dWZ5c3BsenJmbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTM1NTMsImV4cCI6MjA3OTg2OTU1M30.bWWo4DYfn6_HGUh9vQaLgnbwApVbx8eVj3gjATvO5Xs
     ```
   - Cliquez sur "Trigger deploy" pour redéployer avec les variables

4. **URL de votre application**
   - Format : `https://votre-app-random.netlify.app`
   - Vous pouvez personnaliser le nom dans les paramètres

### Méthode B : Avec CLI (Si vous préférez le terminal)

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod

# Suivre les instructions :
# - Créer un nouveau site
# - Dossier à déployer : ./dist
```

---

## Option 2 : Vercel

### Avec Interface Web

1. **Créer un compte**
   - Allez sur https://vercel.com
   - Cliquez sur "Sign up" (gratuit)

2. **Déployer**
   - Cliquez sur "Add New" → "Project"
   - Si pas de Git : Glissez-déposez le dossier du projet
   - Vercel détectera automatiquement Vite

3. **Variables d'environnement**
   - Dans les paramètres du projet → "Environment Variables"
   - Ajoutez :
     ```
     VITE_SUPABASE_URL = https://mndchzfwufysplzrflvp.supabase.co
     VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZGNoemZ3dWZ5c3BsenJmbHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyOTM1NTMsImV4cCI6MjA3OTg2OTU1M30.bWWo4DYfn6_HGUh9vQaLgnbwApVbx8eVj3gjATvO5Xs
     ```
   - Redéployez le projet

4. **URL**
   - Format : `https://votre-app.vercel.app`

### Avec CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

---

## Option 3 : Cloudflare Pages

1. **Créer un compte**
   - Allez sur https://pages.cloudflare.com
   - Cliquez sur "Sign up" (gratuit)

2. **Déployer**
   - "Create a project"
   - Glissez-déposez le dossier ou connectez Git
   - Build command : `npm run build`
   - Build output directory : `dist`

3. **Variables d'environnement**
   - Dans "Settings" → "Environment variables"
   - Ajoutez les mêmes variables Supabase

---

## ⚠️ Important : Configuration Supabase

Après le déploiement, vous devez autoriser votre nouveau domaine dans Supabase :

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans "Authentication" → "URL Configuration"
4. Dans "Site URL", ajoutez votre nouveau domaine :
   - Exemple : `https://votre-app.netlify.app`
5. Dans "Redirect URLs", ajoutez :
   - `https://votre-app.netlify.app/**`

**Sans cette étape, l'authentification ne fonctionnera pas !**

---

## Commandes Utiles

### Avant de déployer

```bash
# Installer les dépendances
npm install

# Tester en local
npm run dev

# Créer le build
npm run build

# Prévisualiser le build
npm run preview
```

### Après modification

```bash
# Reconstruire
npm run build

# Sur Netlify
netlify deploy --prod

# Sur Vercel
vercel --prod
```

---

## Résolution de Problèmes

### Le site affiche une page blanche

1. Vérifiez les variables d'environnement dans votre plateforme
2. Vérifiez la console du navigateur (F12) pour voir les erreurs
3. Assurez-vous d'avoir autorisé le domaine dans Supabase

### L'authentification ne fonctionne pas

1. Vérifiez que vous avez ajouté l'URL dans Supabase (voir section Important ci-dessus)
2. Vérifiez les variables d'environnement
3. Redéployez après avoir modifié les paramètres

### Erreur 404 sur les routes

Les fichiers `netlify.toml`, `vercel.json` et `public/_redirects` sont déjà configurés pour gérer le routing React. Si vous avez encore des erreurs 404, redéployez le projet.

---

## Comparaison des Plateformes

| Plateforme | Vitesse Deploy | Gratuit | Personnalisation URL | Facilité |
|------------|---------------|---------|---------------------|----------|
| **Netlify** | ⚡⚡⚡ Très rapide | ✅ Oui | ✅ Oui | ⭐⭐⭐ Facile |
| **Vercel** | ⚡⚡⚡ Très rapide | ✅ Oui | ✅ Oui | ⭐⭐⭐ Facile |
| **Cloudflare** | ⚡⚡ Rapide | ✅ Oui | ✅ Oui | ⭐⭐ Moyen |

---

## Pour Supprimer le Site (Provisoire)

### Netlify
- Allez dans Site settings → Dangerous zone → Delete site

### Vercel
- Allez dans Settings → Advanced → Delete Project

### Cloudflare Pages
- Allez dans le projet → Settings → Delete Project

---

## Besoin d'Aide ?

Si vous rencontrez un problème :
1. Vérifiez les logs de build sur votre plateforme
2. Vérifiez les variables d'environnement
3. Assurez-vous que le domaine est autorisé dans Supabase
4. Testez en local avec `npm run build && npm run preview`

---

**🎉 Félicitations ! Votre application est prête à être testée en ligne !**
