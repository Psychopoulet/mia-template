# SPECS

Spécification de conception des agents MIA (document de création / **source de vérité** — **pas** un document runtime).
Ne **jamais** le charger pendant un create/maintain. Ne **supprimer aucun contenu** (brief, sous-agents, ordre V). Runtime = skills.
Documentation d'usage : [AGENTS.md](./AGENTS.md). Pipeline runtime : [skills/mia-orchestrator/SKILL.md](./skills/mia-orchestrator/SKILL.md). Skills exécutables : `.cursor/skills/mia-*/SKILL.md`. Conventions partagées : [skills/reference.md](./skills/reference.md).

je veux que tu m'aide à créer une série d'agents IA

I) description du projet

- Ce sont des agents qui doivent m'aider à initialiser puis maintenir des plugins pour ma box domotique, basés sur le répo "https://github.com/Psychopoulet/mia-template"
- Ils doivent se baser sur ce répo comme référence.
- Ils doivent être rédigés en anglais
- Je dois avoir un agent de référence qui communiquera avec moi et pilotera des sous-agents spécialisés (dans l'ordre de description), il demandera en entrée un dossier qui contiendra tous les projets et fera une pause entre chaque étape pour échanger avec l'utilisateurs sur ce qui a été fait (résumé court et synthétique, suggestions d'améliorations) pour éventuellement relancer l'agent
- Je dois avoir plusieurs sous-agents qui auront chacun leur spécialité, décrits dans le chapitre "sous-agents", et qui pourront être appelés indépendament. Ils pourront être rappelés en modifiant les instructions, ce qui amènera à une mise à jour de l'existant et non une réécriture complète.
- Modes d'exécution de l'orchestrateur :
    - `create` : routine complète (git provision → init → commits après étapes clefs → … → readme → review → push final)
    - `maintain` : skip `mia-init` et `mia-git` **provision** uniquement ; garder `mia-git` **commit** / **push**
- Après `mia-init` (ou dès le début en `maintain`), le cwd de travail est **toujours la racine du plugin**, jamais le template (sauf pour les étapes propres à `mia-init` / `mia-deps` sur le template).
- Chaque sous-agent doit terminer avec un statut explicite : `pass` | `warning` | `fail` | `blocked`. L'orchestrateur ne propose la suite que sur `pass` ; sur `warning`, pause + **⚠️** (l'utilisateur décide de continuer) ; sur `fail`/`blocked`, pause obligatoire sans enchaîner.
- Les sous-agents sont invocables explicitement (`@mia-…`). Préférer `disable-model-invocation: true` sur les sous-agents ; l'orchestrateur peut rester découvrable.
- Conventions partagées (HTTP, chemins, scripts npm) : fichier `reference.md` commun sous `.cursor/skills/`, plutôt que de tout dupliquer dans chaque agent.
- Ce fichier est `.cursor/SPECS.md` (pas `PLAN.md`) pour éviter le conflit avec le `PLAN.md` généré par `mia-plan` dans chaque plugin.

II) description de la structure des agents

- l'agent doit avoir un nom en minuscule commençant par "mia-"
- l'agent doit être sous format markdown pour la lisibilité
- la première partie doit être une description de sa raison d'être (son rôle ou sa spécialité, ex : "dev senior spécialisé en QA")
- la seconde partie doit être ce qui est attendu en entrée de l'agent (prompt, infos obligatoires, contexte) pour son fonctionnement (ex : "fais les tests de tout le projet" ou "mets à jours les tests en fonction des modifications en stage")
- **avant toute action** : vérifier la disponibilité de chaque info obligatoire ; si une manque → statut `fail` immédiat, **aucun autre travail** ; message d'explication **hyper concis** avec la donnée manquante mise en avant (ex. en **gras**)
- la troisième partie doit être ce qui doit être produit comme résultat par l'agent (ex : nouveaux tests unitaires)
- la dernière partie doit être le document de conclusion (markdown, synthétique, mise en gras des éléments importants) incluant obligatoirement le statut `pass` | `fail` | `blocked`

III) conventions communes (à documenter aussi dans reference.md)

- Scripts npm : toujours préfixer par `npm run` (`npm run build-back`, `npm run build-front`, `npm run unit-tests`, `npm run unit-tests-local`, `npm run tests`, `npm run lint-back`, `npm run lint-front`, etc.)
- OpenAPI methods : `put` = création, `post` = mise à jour, `delete` = suppression, `get` = lecture
- OpenAPI status : succès — `201` pour les `put` ; sinon `200` avec corps ; sinon `204` succès sans corps ; pour les **nouvelles** opérations, erreurs **uniquement via `default`** (ne pas ajouter `401` / `403` / `404` / `409` / etc.) ; **conserver** les réponses d'erreur spécifiques déjà fournies par le template (ex. `404` sur `getPluginStatus`)

- OpenAPI paramètres URL : **jamais** de donnée texte longue (ex. token, secret, payload) en path/query — toujours via le **body**
- Types générés :
    - back : `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`
    - front : `npm run transpile-openapi-front` → `public/src/Descriptor.ts`
- Marquage d'avancement dans le `PLAN.md` du plugin (fichier **local**, **jamais commité**, **supprimé après le push final**) :
    - **écriture** : `mia-plan` **seul** crée / met à jour le **contenu** ; `mia-orchestrator` **seul** marque l'avancement **après validation utilisateur** ; tous les autres skills = **lecture seule**
    - **uniquement le titre** de l'étape, en **remplaçant** le préfixe `[ ]` (jamais de marqueur en fin de ligne, jamais de tableau `## Step status`) :
        - pending → **`[ ]`** (`### [ ] a) OpenAPI — ~2h`)
        - **`pass`** → **✅** (`### ✅ a) OpenAPI — ~2h`)
        - **`fail`** → **❌** (`### ❌ a) OpenAPI — ~2h`)
        - **`warning`** / **`blocked`** → **⚠️** (`### ⚠️ a) OpenAPI — ~2h`)
    - **interdire** toute autre modification du contenu du plan lors du marquage (objectifs, estimations, descriptions, items numérotés)
- Statuts agent : `pass` (ok pour enchaîner), `warning` (incomplet / attention / lint KO + build OK → **⚠️**), `fail` (erreurs à corriger), `blocked` (attente humaine, ex. deps obsolètes)
- Entrées obligatoires : gate avant tout travail ; manquant → `fail` + message hyper concis avec champ(s) en **gras** (ex. `Missing: **plugin root**.`)
- Git (`mia-git`) :
    - opérations : **`provision`** | **`commit`** | **`push`**
    - **confirmation utilisateur obligatoire** avant chaque mutation, avec résumé synthétique :
        - commit → fichiers en stage + texte du message
        - push → branche + noms des fichiers envoyés
    - `provision` (create only, avant `mia-init`) : vérifier `git` + `gh` / user loggué ; refuser si le répo distant existe déjà ; créer le répo **public** (défaut) ; créer `PROJET_REP` / racine plugin ; placeholder **`tmp.txt`** ; créer/pousser `master` puis `develop` ; basculer en local sur `develop` et supprimer la branche **locale** `master` (conserver `master` distant) ; `mia-init` supprime `tmp.txt`
    - `commit` : après chaque étape clef (init, openapi, back, tests, sdk, front, readme, review si besoin, …) — **jamais** `PLAN.md`
    - `push` : **uniquement en fin** de routine create/maintain (après review), avec confirmation ; **puis suppression locale de `PLAN.md`**
    - en `maintain` : pas de `provision` ; oui `commit` / `push`


IV) sous-agents

0) un agent pour mettre à jour les dépendances (trou comblé quand les checks versions échouent)
    - raison d'être : dependency maintainer
    - il est appelé par l'orchestrateur quand `mia-init` (ou un check ultérieur) remonte des versions obsolètes / exit code `1`
    - il doit prendre en entrée le chemin du projet concerné (template et/ou plugin) et le rapport des checks (`check-node-engine`, `check-updates`)
    - il doit proposer puis appliquer (après validation utilisateur via l'orchestrateur) la mise à jour des dépendances / engines
    - il doit rejouer `npm run check-node-engine` et `npm run check-updates` jusqu'à `pass`, sinon rester `blocked`
    - conclusion avec statut `pass` | `fail` | `blocked`

1) un agent git / GitHub (`mia-git`)
    - raison d'être : git / GitHub provisioner + committer + pusher
    - opérations : **`provision`** | **`commit`** | **`push`**
    - **avant toute mutation** : demander confirmation utilisateur avec résumé synthétique (commit : fichiers staged + message ; push : fichiers envoyés)
    - `provision` (ignoré en `maintain`) : appelé **avant** `mia-init`
        - entrée : nom du plugin + `PROJET_REP` ; racine = `PROJET_REP/<nom>`
        - vérifier `git` + `gh` / user loggué ; si le répo distant existe déjà → `fail`
        - créer le remote, les dossiers, `tmp.txt`, commit initial, pousser `master` puis `develop` (confirmations à chaque étape) ; checkout `develop` et suppression de `master` locale (conserver `master` distant)
        - next : `mia-init`
    - `commit` : après étapes clefs ; cwd = racine plugin ; stage + message ; confirmation ; puis `git commit` (ou `pass` si rien à committer)
    - `push` : en fin de lot ; confirmation avec liste des fichiers des commits à pousser ; puis `git push` (pas de force-push sauf demande explicite)
    - conclusion avec statut `pass` | `fail` | `blocked`

2)  un agent pour initialiser le nouveau projet.
    - raison d'être : script de copie
    - ignoré en mode `maintain`
    - il doit prendre en entrée un dossier qui contiendra tous les projets, un nom de plugin, et une description
    - la racine plugin `PROJET_REP/<nom>` est censée exister déjà (créée par `mia-git` avec `.git` + `tmp.txt` si besoin) ; supprimer **`tmp.txt`** s'il est présent, puis `create-mia-plugin` la remplit (conserver `.git` / branches)
    - il doit s'assurer que le répo "https://github.com/Psychopoulet/mia-template" est bien présent dans un sous-dossier
    - il doit se placer dans le dossier du template
    - il doit vérifier que le répo est à jour (git fetch, git pull)
    - il doit installer, si ce n'est pas fait, les dépendances dans le plugin de template
    - il doit exécuter les commandes "npm run check-node-engine" et "npm run check-updates" pour s'assurer de la validité des versions utilisées
    - si ces versions sont obsolètes (retour process "1"), statut `blocked` : prévenir l'agent principal de mettre en pause et d'appeler `mia-deps`
    - il doit exécuter la commande de copie (npx create-mia-plugin --name "<NOUVEAU_NOM>" --description "<NOUVELLE_DESCRIPTION>" --directory "<PROJET_REP>/<NOUVEAU_NOM>")
    - il doit installer les dépendances dans le plugin créé
    - il doit exécuter `npx husky` à la racine du plugin pour activer les Git hooks (`.husky/`)
    - en sortie : chemin absolu de la racine du plugin (cwd de travail pour la suite)
    - next step sur `pass` : `mia-git` (`commit`) puis `mia-plan`

3) un agent pour plannifier le dev
    - raison d'être : product owner
    - il doit prendre en entrée les spécificités du plugin : ce qu'il va faire, ce qui est attendu
    - en `maintain` : lire le `PLAN.md` existant + consignes / périmètre, puis **mettre à jour** (pas réécriture complète sauf demande)
    - il doit discuter avec l'agent principal (et l'agent principal avec l'utilisateur) pour élaborer un premier jet de document de plannification
    - le document doit contenir un plan en plusieurs étapes chiffrées en temps :
        a) mettre à jour le document OpenAPI sur lequel se basera tout le plugin
        b) mettre à jour tout le back-office (Mediator = logique + events documentés ; Server = passe-plat de ces events uniquement)
        c) créer les tests unitaires back (bloquant avant le front)
        d) mettre à jour le SDK du front-office
        e) créer les composants du front-office
        f) rédiger / mettre à jour le README.md (doc utilisateur succincte)
        g) faire une review
    - **sous-étapes numérotées (obligatoire)** : le corps de **chaque** étape a→g est une **liste ordonnée** `1.` `2.` `3.` … d'actions **discrètes et implémentables** (une action = un livrable clair : route, schéma, fonction, fichier, cas de test, composant, paragraphe README, point de review). Interdire un paragraphe de prose à la place de la liste. Les identifiants a→g restent stables ; en `maintain`, ne pas renuméroter les items existants (ajouter à la suite). Les agents suivants exécutent ces items **dans l'ordre**.
    - le document final doit être sous format markdown et être sauvegardé à la racine du plugin sous le nom "PLAN.md" (**local uniquement** : entrée dans `.gitignore`, jamais commité, supprimé après le push final)
    - **seul** cet agent **crée** / met à jour le **contenu** de `PLAN.md` (les autres skills sont en lecture seule ; l'orchestrateur marque l'avancement après validation)
    - **pas** de section / tableau `## Step status` : chaque titre a→g **commence par `[ ]`** (`### [ ] a) OpenAPI — ~Xh`) ; `mia-orchestrator` **remplace** ce `[ ]` après validation par **✅** (terminé), **❌** (échec) ou **⚠️** (partiel / attention). En `maintain`, supprimer un éventuel `## Step status` et convertir un marqueur trailing / `[x]` en préfixe ; **conserver** les marques d'avancement existantes sauf réouverture d'étape.

4) un agent pour mettre à jour le document OpenAPI
    - raison d'être : documentaliste technique
    - il doit lire sa partie dans le document "PLAN.md" (**lecture seule**, ne pas écrire `PLAN.md`) et exécuter les items numérotés **dans l'ordre**
    - il doit mettre à jour le document OpenAPI "lib/data/Descriptor.json", autant les routes que les types de données
    - il doit respecter les conventions du chapitre III
    - checklist minimale à respecter :
        - `operationId` clair et stable
        - schémas de requête / réponse en `application/json` quand il y a un corps
        - pour les **nouvelles** opérations : **uniquement** la/les réponse(s) de **succès** (`200` / `201` / `204`) et la réponse **`default`** pour l'erreur (schéma Error)
        - **interdire** d'ajouter des réponses d'erreur dédiées (`401`, `403`, `404`, `409`, etc.) sur les routes créées par l'agent
        - **conserver** les réponses d'erreur spécifiques du template sur les routes scaffold (`getPluginStatus` `404`, front, descriptor, status, …) — ne pas les supprimer
        - **pas de component à usage unique** : laisser les objets déclarés **inline** dans leur contexte (requestBody / response / `items`) ; n'extraire dans `components.schemas` que si le schéma est **réutilisé** (ou déjà fourni par le template : `Error`, `PluginName`, events, …)
        - méthodes et codes HTTP de succès conformes (put/201, get/post → 200 ou 204, delete → 200 ou 204)
        - jamais de texte long (token, secret, etc.) en paramètres URL (path/query) — passer par le body
    - sur `pass` / `warning` / `fail` / `blocked` : **statut seulement** — **ne pas écrire** `PLAN.md` (l'orchestrateur marque après validation)
    - conclusion avec statut `pass` | `fail` | `blocked`

5) un agent pour mettre à jour le back
    - raison d'être : dev sénior Typescript back NodeJS
    - il doit lire sa partie dans le document "PLAN.md" (**lecture seule**, ne pas écrire `PLAN.md`) et exécuter les items numérotés **dans l'ordre**
    - cwd = racine du plugin
    - il doit exécuter la commande "npm run transpile-openapi-back" pour créer les types issus du document OpenAPI (`lib/src/Descriptor.ts`)
    - il doit créer les fonctions dans "lib/src/Mediator.ts" correspondant aux nouvelles opérations de "lib/data/Descriptor.json" en s'assurant d'utiliser des types présents dans "lib/src/Descriptor.ts"
    - **toute la logique métier** (émission d'events incluse) est dans le Mediator
    - documenter les events plugin dans `lib/data/DescriptorEvents.json` (ajouter les `$ref` dans `Descriptor.json` `components.schemas`, puis re-transpiler)
    - `lib/src/Server.ts` **n'a pas de logique propre** : passe-plat uniquement des events **générés et documentés** par le Mediator (`on` → `this.push`, même `command` / payload que le schéma). Pas de méthodes API, pas de mapping métier, pas de validation
    - **ne pas** contrôler / valider les paramètres d'entrée dans le Mediator (géré par le host / `checkParameters`)
    - **ne pas** ré-implémenter l'**authentification** host (login, vérification JWT comme gate) ; en revanche, si le PLAN du plugin impose des règles d'**autorisation** métier (ex. soi-même ou admin), les implémenter dans le Mediator
    - se concentrer sur la logique métier et les services Container (ex. `auth-db`)
    - il doit s'assurer de la qualité du code livré, de sa découpe :
        - fichiers avec du **code exécutable** (fonctions, classes, exports runtime) → `lib/src/utils/`
        - fichiers **uniquement** de typing (`type` / `interface` / aliases, sans runtime) → `lib/src/@types/`
        - un fichier mixte (code + types locaux) reste dans `utils` ; ne pas mettre de runtime dans `@types`
        - fonctions **autonomes** (pas de `this` / état d'instance) : **fichier à part** dans `utils/` quand c'est possible (un fichier par fonction, nommé comme l'export) ; **pas** de méthodes `private` pour ça (Mediator / Server). Garder les méthodes de classe **du Mediator** pour les opérations OpenAPI, le cycle de vie, et la logique qui a besoin de l'instance. **Server** : bind/unbind d'events uniquement
    - **commentaires d'explication dans le Mediator** (et helpers `utils/` appelés par lui) dès qu'une méthode a un corps ≥ **25 lignes** :
        - commentaire anglais `//` au-dessus de la méthode (but + flux principal), indenté comme le fichier existant
        - expliquer le *pourquoi*, pas narrer chaque ligne ; les méthodes plus courtes **peuvent** aussi être commentées si ça aide
    - **condition de succès `pass`** : `npm run lint-back` puis `npm run build-back`
    - build KO → `fail` ; lint KO + build OK, travail incomplet, ou point d'attention → `warning`
    - **ne pas écrire** `PLAN.md` (l'orchestrateur marque après validation)
    - l'étape suivante attendue est l'agent QA (tests unitaires back, gate bloquante)

6) un agent pour créer les tests unitaires back (immédiatement après le back)
    - raison d'être : Quality Analyst sénior
    - il doit lire sa partie dans le document "PLAN.md" (étape c, **lecture seule**) et exécuter les items numérotés **dans l'ordre**
    - cwd = racine du plugin
    - il s'exécute **après** l'agent back et **avant** tout travail front
    - **gate bloquante** : en `fail` / `blocked`, l'orchestrateur n'enchaîne pas (pas de SDK / UI) tant que les tests ne passent pas
    - il doit utiliser mocha
    - il doit créer les tests unitaires dans le dossier "test" correspondant au nouveau code back en s'assurant un code coverage de 95% au minimum pour le Mediator
    - mesure du coverage : "npm run unit-tests-local" (nyc). Si coverage Mediator < 95% : statut `fail`, lister les trous
    - il doit s'assurer de la qualité du code livré, de sa découpe (fichiers dans "test", préfixe numérique croissant : 0_, 1_, 2_, …)
    - il doit s'assurer que le code se teste bien avec "npm run build-back" puis "npm run unit-tests" (échec → `fail`, bloquant)
    - lint tests recommandé : "npm run lint-tests" avant de conclure `pass` ; lint-tests KO + tests OK → `warning`
    - statut seulement (`pass` / `warning` / `fail` / `blocked`) — **ne pas écrire** `PLAN.md`

7) un agent pour mettre à jour le SDK front
    - raison d'être : dev sénior Typescript
    - il doit lire sa partie dans le document "PLAN.md" (étape d, **lecture seule**) et exécuter les items numérotés **dans l'ordre**
    - cwd = racine du plugin
    - il ne démarre qu'après `pass` de l'agent QA (tests back)
    - il doit exécuter "npm run transpile-openapi-front" → types dans "public/src/Descriptor.ts"
    - il doit mettre à jour le SDK ("public/src/SDK.ts" et helpers si besoin) pour exposer les nouvelles opérations du Descriptor, en utilisant les types de "public/src/Descriptor.ts"
    - il doit s'assurer de la qualité / découpe du code
    - **condition de succès `pass`** : `npm run lint-front` (périmètre SDK) puis build si besoin
    - build KO → `fail` ; lint KO + build OK, incomplet, ou attention → `warning`
    - pause orchestrateur après cet agent avant les composants
    - statut seulement (`pass` / `warning` / `fail` / `blocked`) — **ne pas écrire** `PLAN.md`

8) un agent pour créer les composants front
    - raison d'être : dev sénior Typescript front React/Bootstrap/Fontawesome — spécialité UI
    - il doit lire sa partie dans le document "PLAN.md" (étape e, **lecture seule**) et exécuter les items numérotés **dans l'ordre**
    - cwd = racine du plugin
    - il s'appuie sur le SDK et sur "public/src/Descriptor.ts" (relancer "npm run transpile-openapi-front" si besoin)
    - il doit créer / mettre à jour les composants dans "public/src" (idéalement "public/src/components/") avec un workflow cohérent entre les composants
    - un fichier de composant (`.tsx`) doit **toujours** porter le même nom que le composant qu'il exporte (ex. `StatusCard.tsx` exporte `StatusCard`)
    - il doit s'assurer de la qualité / découpe du code
    - **condition de succès `pass`** : `npm run lint-front` puis `npm run build-front`
    - build KO → `fail` ; lint KO + build OK, incomplet, ou attention → `warning`
    - **ne pas écrire** `PLAN.md` (l'orchestrateur marque après validation)

9) un agent pour faire une doc succinte en améliorant le README.md (`mia-readme`)
    - raison d'être : documentaliste (README utilisateur)
    - cwd = racine du plugin
    - Required : racine plugin ; `README.md` existant ; `PLAN.md` ; `lib/data/Descriptor.json` (pour le lien OpenAPI)
    - gate : si une entrée Required manque → `fail` immédiat, aucun autre travail
    - il doit conserver le préfixe README issu du template : titre `# <plugin>`, section Badges, et la section OpenAPI / lien existants
    - il doit résumer le fonctionnement du plugin et de ses workflows utilisateur (qui peut faire quoi)
    - il ne doit rien afficher de technique (pas de chemins `lib/`, Mediator, scripts npm, stack, coverage, détails d'implémentation)
    - il doit faire mention du document OpenAPI et garantir un lien vers `./lib/data/Descriptor.json`
    - sources : `PLAN.md` (items numérotés de l'étape f, **dans l'ordre**), Descriptor, UI si besoin ; en `maintain` → **update** du README, pas de réécriture complète
    - il s'exécute après `mia-front-ui`, avant `mia-review`
    - statut seulement (`pass` / `warning` / `fail` / `blocked`) — **ne pas écrire** `PLAN.md`
    - conclusion avec statut `pass` | `fail` | `blocked` ; next sur `pass` : `mia-review`

10) un agent pour faire une review
    - raison d'être : developpeur sénior fullstack
    - il doit soit analyser l'ensemble du projet, ou limiter à un périmètre si le projet a déjà été analysé (si des documents sont en stage par exemple) (demander confirmation dans ce cas)
    - s'il y a des items numérotés à l'étape g, les suivre **dans l'ordre** comme checklist de review (`PLAN.md` en **lecture seule**)
    - il doit s'assurer de la qualité du code livré, de la sécurité et des points d'amélioration (dont commentaires d'explication sur les méthodes Mediator ≥ 25 lignes)
    - si disponibles (MCP / outils locaux) : s'appuyer aussi sur Snyk et/ou SonarQube pour sécurité / qualité, et résumer les findings critiques
    - il doit s'assurer que la suite passe avec "npm run tests"
    - verdict en **statut seulement** (`pass` / `warning` / `fail` / `blocked`) — **ne pas écrire** `PLAN.md`

V) ordre orchestrateur

Mode `create` :

    Agents métier dans cet ordre. Après chaque spécialiste qui produit des livrables : `mia-git` (`commit`) (confirmation utilisateur ; jamais `PLAN.md`). `mia-plan` : pas de commit. `mia-git` (`push`) uniquement après review, puis suppression locale de `PLAN.md`.
    Le lint n'est **pas** un agent : lint KO + build OK → `warning` ; build KO → `fail`.

    1. mia-git (provision : remote + tmp.txt + master / develop ; fail-fast ; confirmations)
    2. mia-init (supprime tmp.txt, scaffold)
    3. (si blocked deps) mia-deps → reprise
    4. mia-plan (pas de commit)
    5. mia-openapi
    6. mia-back — lint KO + build OK → `warning`
    7. mia-tests (bloquant avant le front — `pass` obligatoire)
    8. mia-front-sdk — lint KO + build OK → `warning`
    9. pause → mia-front-ui — lint KO + build OK → `warning`
    10. mia-readme
    11. mia-review
    12. mia-git (push) — push final avec confirmation
    — pause utilisateur entre chaque étape
    — `fail` / `blocked` d'un sous-agent → stop pipeline ; `warning` → pause **⚠️**, l'utilisateur décide (sauf mia-tests : `warning` bloque aussi le front)

Mode `maintain` :

    1. confirmer racine plugin + périmètre
    2. mia-plan (update) si besoin → mia-git (commit)
    3. enchaîner uniquement les sous-agents concernés par le delta / les consignes
       — si le back change : mia-tests juste après, gate bloquante avant tout front ; lint KO + build OK → `warning`
       — si SDK / UI : lint KO + build OK → `warning`
       — si le comportement utilisateur change : mia-readme avant mia-review
       — après chaque étape clef exécutée : mia-git (commit) avec confirmation
    4. mia-review en fin de lot → mia-git (commit) si besoin
    5. mia-git (push) — push final avec confirmation
    — pause utilisateur entre chaque étape
