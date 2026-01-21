# Guide d'Installation de l'Application PWA

## Qu'est-ce qu'une PWA ?

Une Progressive Web App (PWA) est une application web qui peut être installée sur votre smartphone comme une application native. Elle fonctionne même hors ligne et offre une expérience utilisateur optimale.

## Comment installer l'application sur votre smartphone ?

### Sur Android (Chrome)

1. Ouvrez le site web dans Chrome
2. Un popup apparaîtra en bas de l'écran avec un bouton "Installer maintenant"
3. Cliquez sur "Installer maintenant"
4. Ou appuyez sur le menu ⋮ (trois points) en haut à droite
5. Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"
6. Confirmez l'installation
7. L'icône de l'application apparaîtra sur votre écran d'accueil

### Sur iPhone/iPad (Safari)

1. Ouvrez le site web dans Safari
2. Appuyez sur le bouton Partager (icône carrée avec une flèche vers le haut)
3. Faites défiler vers le bas et appuyez sur "Sur l'écran d'accueil"
4. Personnalisez le nom si nécessaire
5. Appuyez sur "Ajouter"
6. L'icône de l'application apparaîtra sur votre écran d'accueil

## Fonctionnalités de la PWA

✅ **Installation facile** : Un bouton pour installer l'application directement depuis le site
✅ **Accès hors ligne** : Consultez les documents même sans connexion internet
✅ **Mise en cache intelligente** : Les pages visitées sont enregistrées pour un accès rapide
✅ **Icône sur l'écran d'accueil** : Accédez rapidement à l'application
✅ **Expérience native** : L'application s'ouvre en plein écran sans la barre d'adresse du navigateur
✅ **Mises à jour automatiques** : L'application se met à jour automatiquement

## Configuration Technique

Les fichiers suivants ont été créés pour supporter la PWA :

- `/public/manifest.json` : Configuration de l'application (nom, icônes, couleurs)
- `/public/sw.js` : Service Worker pour le fonctionnement hors ligne
- `/public/icon-192.png` : Icône 192x192px
- `/public/icon-512.png` : Icône 512x512px
- `InstallPrompt` component : Popup d'invitation à l'installation

## Support des Navigateurs

✅ Chrome (Android)
✅ Edge (Android)
✅ Safari (iOS 11.3+)
✅ Firefox (Android)
✅ Opera (Android)
✅ Samsung Internet

## Désinstallation

### Sur Android
1. Maintenez l'icône de l'application
2. Sélectionnez "Informations sur l'application"
3. Appuyez sur "Désinstaller"

### Sur iOS
1. Maintenez l'icône de l'application
2. Appuyez sur "Supprimer l'app"
3. Confirmez la suppression
