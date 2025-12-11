[![npm version](https://img.shields.io/npm/v/@itrocks/default-action-workflow?logo=npm)](https://www.npmjs.org/package/@itrocks/default-action-workflow)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/default-action-workflow)](https://www.npmjs.org/package/@itrocks/default-action-workflow)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/default-action-workflow?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/default-action-workflow)
[![issues](https://img.shields.io/github/issues/itrocks-ts/default-action-workflow)](https://github.com/itrocks-ts/default-action-workflow/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# default-action-workflow

Defines shared actions across domain objects of your app.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/default-action-workflow
```

Le paquet dépend de `@itrocks/action`, qui sera installé automatiquement comme
dépendance. Vous l'utiliserez généralement dans une application Node.js ou
TypeScript basée sur l'écosystème it.rocks.

## Usage

`@itrocks/default-action-workflow` fournit une fonction unique `build()` qui
enregistre, dans le registre global de `@itrocks/action` :

- la feuille de style par défaut des actions ;
- les templates HTML utilisés pour l'exécution des actions ;
- un ensemble de « workflows » standards reliant des actions entre elles
  (liste → nouveau / supprimer, login → signup / forgot-password, output →
  edit / print / delete, etc.).

Vous appelez `build()` une fois au démarrage de votre application afin que
tous les modules qui consomment `@itrocks/action` bénéficient de ces valeurs
par défaut.

### Exemple minimal

```ts
import { build as buildDefaultActionWorkflow } from '@itrocks/default-action-workflow'

// Point d'entrée de votre application (par exemple index.ts)
async function bootstrap() {
  // Configure les CSS, templates et workflows d'actions par défaut
  buildDefaultActionWorkflow()

  // ... démarrez ensuite votre serveur HTTP, vos routes, etc.
}

bootstrap()
```

Après cet appel, tout code qui utilise `@itrocks/action` (par exemple vos
actions de liste, d'édition, de suppression, vos écrans de login, etc.) peut
tirer parti de cette configuration partagée sans avoir à re-déclarer les
styles et workflows de base.

### Exemple complet avec configuration d'application

Dans une application it.rocks typique, vous combinez cette configuration avec
d'autres paquets (routes, config, framework…) pour centraliser l'initialisation
au démarrage.

```ts
// framework.ts ou server.ts
import { build as buildDefaultActionWorkflow } from '@itrocks/default-action-workflow'
import { build as buildConfig } from '@itrocks/config'
import { build as buildFramework } from '@itrocks/framework'

export async function bootstrap() {
  // 1. Configure les workflows d'actions partagés
  buildDefaultActionWorkflow()

  // 2. Charge la configuration applicative (routes, modules métier, ...)
  await buildConfig()

  // 3. Démarre le framework (serveur HTTP, middlewares, ...)
  await buildFramework()
}

bootstrap().catch((error) => {
  // Gérer proprement les erreurs de démarrage
  console.error('Bootstrap error', error)
  process.exit(1)
})
```

Dans cet exemple, `buildDefaultActionWorkflow()` garantit que :

- les actions de liste proposent automatiquement un lien « nouveau » et une
  action « supprimer » adaptée ;
- les écrans de login exposent des actions « mot de passe oublié » et
  « inscription » ;
- les vues « output » (affichage d'un objet) proposent des actions « éditer »,
  « imprimer » et « supprimer » ;
- les templates et la CSS par défaut sont enregistrés pour les écrans
  d'action.

Vous pouvez ensuite surcharger ou compléter ces comportements pour des cas
spécifiques en utilisant directement les helpers de `@itrocks/action`.

## API

Le paquet expose une seule fonction publique.

### `build(): void`

Configure les fonctionnalités par défaut de `@itrocks/action` pour votre
application.

#### Effets

L'appel à `build()` effectue les opérations suivantes :

1. **CSS des actions**

   ```ts
   setActionCss(
     { file: '/@itrocks/(action)/css/action.css' }
   )
   ```

   - Enregistre une feuille de style commune pour les écrans d'action.
   - Le chemin est relatif à vos assets statiques et suit la convention
     it.rocks avec `(action)` comme partie variable.

2. **Templates HTML des actions**

   ```ts
   setActionTemplates(
     { file: '/@itrocks/action/cjs/selectionAction.html', need: 'object' },
     { file: '/@itrocks/action/cjs/action.html' }
   )
   ```

   - `selectionAction.html` : utilisé lorsque l'action a besoin d'un
     « object » (sélection d'un objet existant avant exécution).
   - `action.html` : gabarit générique pour l'exécution d'une action.

3. **Workflows d'actions par défaut**

   ```ts
   setAction('edit',   'delete')
   setAction('login',  'forgot-password')
   setAction('login',  'signup', { caption: 'Sign up' })
   setAction('list',   'new')
   setAction('list',   'delete', { need: 'object' })
   setAction('output', 'edit')
   setAction('output', 'print',  { target: undefined })
   setAction('output', 'delete')
   ```

   Pour chaque action « source », `setAction(source, target, options?)`
   enregistre une action « cible » qui apparaît habituellement dans l'interface
   utilisateur (bouton, lien, etc.). Les couples configurés sont :

   - **`edit → delete`** : depuis un écran d'édition, proposer une action de
     suppression de l'objet courant.
   - **`login → forgot-password`** : depuis l'écran de connexion, proposer un
     lien « mot de passe oublié ».
   - **`login → signup`** avec `{ caption: 'Sign up' }` : ajoute un lien
     d'inscription (caption personnalisée).
   - **`list → new`** : depuis la liste d'objets, proposer la création d'un
     nouvel élément.
   - **`list → delete`** avec `{ need: 'object' }` : suppression d'un élément
     sélectionné dans la liste.
   - **`output → edit`** : depuis l'affichage détaillé d'un objet, proposer
     l'édition.
   - **`output → print`** avec `{ target: undefined }` : action d'impression
     (par exemple ouverture dans la même fenêtre / même contexte).
   - **`output → delete`** : suppression de l'objet affiché.

#### Signature

```ts
export function build(): void
```

- **Paramètres** : aucun.
- **Retour** : `void` (la fonction ne renvoie rien).
- **Utilisation** : appelez-la une fois au démarrage de votre application,
  avant de manipuler les actions ou d'exposer vos routes HTTP.

## Typical use cases

- **Démarrage rapide d'une application it.rocks** :
  vous utilisez `@itrocks/default-action-workflow` pour obtenir immédiatement
  un ensemble cohérent d'actions (liste, nouveau, éditer, supprimer, login,
  signup, etc.) sans avoir à tout recâbler manuellement.

- **Configuration centralisée des actions** :
  dans un module « framework » ou « bootstrap », vous appelez `build()` une
  fois, et tous vos autres modules (CRUD, login, affichage, impression) se
  branchent automatiquement sur ces workflows par défaut.

- **Base commune avant surcharges spécifiques** :
  vous laissez `@itrocks/default-action-workflow` installer les liens
  d'actions standards, puis, pour certains écrans, vous surdéclarez des
  `setAction(...)`, `setActionCss(...)` ou `setActionTemplates(...)` propres
  à votre projet.

- **Prototypage / démonstrations** :
  pour une démo rapide, il suffit de combiner ce paquet avec `@itrocks/action`
  et quelques actions métier pour disposer d'un workflow complet (login,
  navigation liste → détail → édition → suppression, impression, etc.).
