# SPECS

Spécification de conception des agents MIA (source de vérité).
Documentation d'usage : [AGENTS.md](./AGENTS.md). Skills exécutables : `.cursor/skills/mia-*/SKILL.md`. Conventions partagées : [skills/reference.md](./skills/reference.md).

je veux que tu m'aide à créer une série d'agents IA

I) description du projet

- Ce sont des agents qui doivent m'aider à initialiser puis maintenir des plugins pour ma box domotique, basés sur le répo "https://github.com/Psychopoulet/mia-template"
- Ils doivent se baser sur ce répo comme référence.
- Ils doivent être rédigés en anglais
- Je dois avoir un agent de référence qui communiquera avec moi et pilotera des sous-agents spécialisés (dans l'ordre de description), il demandera en entrée un dossier qui contiendra tous les projets et fera une pause entre chaque étape pour échanger avec l'utilisateurs sur ce qui a été fait (résumé court et synthétique, suggestions d'améliorations) pour éventuellement relancer l'agent
- Je dois avoir plusieurs sous-agents qui auront chacun leur spécialité, décrits dans le chapitre "sous-agents", et qui pourront être appelés indépendament. Ils pourront être rappelés en modifiant les instructions, ce qui amènera à une mise à jour de l'existant et non une réécriture complète.
- Modes d'exécution de l'orchestrateur :
    - `create` : routine complète (git → init → … → review)
    - `maintain` : skip `mia-init` et `mia-git`, partir du plugin existant + `PLAN.md` + périmètre (staged / fichiers cités / consignes)
- Après `mia-init` (ou dès le début en `maintain`), le cwd de travail est **toujours la racine du plugin**, jamais le template (sauf pour les étapes propres à `mia-init` / `mia-deps` sur le template).
- Chaque sous-agent doit terminer avec un statut explicite : `pass` | `fail` | `blocked`. L'orchestrateur ne propose la suite que sur `pass` ; sur `fail`/`blocked`, pause obligatoire.
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
- OpenAPI status : `201` pour les `put` ; sinon `200` avec corps ; sinon `204` succès sans corps
- OpenAPI paramètres URL : **jamais** de donnée texte longue (ex. token, secret, payload) en path/query — toujours via le **body**
- Types générés :
    - back : `npm run transpile-openapi-back` → `lib/src/Descriptor.ts`
    - front : `npm run transpile-openapi-front` → `public/src/Descriptor.ts`
- Marquage d'avancement dans le `PLAN.md` du plugin :
    - section figée uniquement : `## Step status` (checkboxes)
    - **interdire** toute autre modification du contenu du plan (objectifs, estimations, descriptions)
- Statuts agent : `pass` (ok pour enchaîner), `fail` (erreurs à corriger), `blocked` (attente humaine, ex. deps obsolètes)
- Entrées obligatoires : gate avant tout travail ; manquant → `fail` + message hyper concis avec champ(s) en **gras** (ex. `Missing: **plugin root**.`)
- Git (`mia-git`) : avant `mia-init` ; vérifier `git` + `gh` / user loggué ; refuser si le répo distant du plugin existe déjà ; créer le répo ; après init, branches `master` puis `develop` (issue de `master`) en local + push ; skip en `maintain`

IV) sous-agents

0) un agent pour mettre à jour les dépendances (trou comblé quand les checks versions échouent)
    - raison d'être : dependency maintainer
    - il est appelé par l'orchestrateur quand `mia-init` (ou un check ultérieur) remonte des versions obsolètes / exit code `1`
    - il doit prendre en entrée le chemin du projet concerné (template et/ou plugin) et le rapport des checks (`check-node-engine`, `check-updates`)
    - il doit proposer puis appliquer (après validation utilisateur via l'orchestrateur) la mise à jour des dépendances / engines
    - il doit rejouer `npm run check-node-engine` et `npm run check-updates` jusqu'à `pass`, sinon rester `blocked`
    - conclusion avec statut `pass` | `fail` | `blocked`

1) un agent pour provisionner le dépôt git distant
    - raison d'être : git / GitHub provisioner
    - ignoré en mode `maintain`
    - appelé **avant** `mia-init` (fail-fast + création du remote)
    - il doit prendre en entrée le nom du plugin et le dossier projets (`PROJET_REP`) ; racine plugin attendue = `PROJET_REP/<nom>`
    - **avant toute opération** :
        1) vérifier l'accessibilité de `git` (et de `gh` pour l'utilisateur loggué)
        2) vérifier que, pour l'utilisateur loggué, le répo avec le nom du plugin n'existe pas déjà ; s'il existe → `fail`
        3) créer le répo git distant avec le nom du plugin
    - si la racine plugin n'existe pas encore → `pass` et proposer `mia-init` (pas de tree local inventé)
    - après `mia-init` (re-appel) : lier le remote au plugin local, créer/pousser `master` puis `develop` issue de `master`
    - conclusion avec statut `pass` | `fail` | `blocked`

2)  un agent pour initialiser le nouveau projet.
    - raison d'être : script de copie
    - ignoré en mode `maintain`
    - il doit prendre en entrée un dossier qui contiendra tous les projets, un nom de plugin, et une description
    - il doit s'assurer que le répo "https://github.com/Psychopoulet/mia-template" est bien présent dans un sous-dossier
    - il doit se placer dans le dossier du template
    - il doit vérifier que le répo est à jour (git fetch, git pull)
    - il doit installer, si ce n'est pas fait, les dépendances dans le plugin de template
    - il doit exécuter les commandes "npm run check-node-engine" et "npm run check-updates" pour s'assurer de la validité des versions utilisées
    - si ces versions sont obsolètes (retour process "1"), statut `blocked` : prévenir l'agent principal de mettre en pause et d'appeler `mia-deps`
    - il doit exécuter la commande de copie (npx create-mia-plugin --name "<NOUVEAU_NOM>" --description "<NOUVELLE_DESCRIPTION>" --directory "<PROJET_REP>/<NOUVEAU_NOM>")
    - il doit installer les dépendances dans le plugin créé
    - en sortie : chemin absolu de la racine du plugin (cwd de travail pour la suite)
    - next step sur `pass` : re-appeler `mia-git` pour le link local / branches

3) un agent pour plannifier le dev
    - raison d'être : product owner
    - il doit prendre en entrée les spécificités du plugin : ce qu'il va faire, ce qui est attendu
    - en `maintain` : lire le `PLAN.md` existant + consignes / périmètre, puis **mettre à jour** (pas réécriture complète sauf demande)
    - il doit discuter avec l'agent principal (et l'agent principal avec l'utilisateur) pour élaborer un premier jet de document de plannification
    - le document doit contenir un plan en plusieurs étapes chiffrées en temps :
        a) mettre à jour le document OpenAPI sur lequel se basera tout le plugin
        b) mettre à jour tout le back-office (essentiellement le Mediator, eventuellement le Serveur s'il y a des events)
        c) mettre à jour le SDK du front-office
        d) créer les composants du front-office
        e) créer les tests unitaires
        f) faire une review
    - le document final doit être sous format markdown et être sauvegardé à la racine du plugin sous le nom "PLAN.md"
    - il doit inclure une section figée `## Step status` avec checkboxes a→f (seule section modifiable ensuite par les autres agents pour l'avancement)

4) un agent pour mettre à jour le document OpenAPI
    - raison d'être : documentaliste technique
    - il doit lire sa partie dans le document "PLAN.md"
    - il doit mettre à jour le document OpenAPI "lib/data/Descriptor.json", autant les routes que les types de données
    - il doit respecter les conventions du chapitre III
    - checklist minimale à respecter :
        - `operationId` clair et stable
        - schémas de requête / réponse en `application/json` quand il y a un corps
        - schéma d'erreur aligné sur le Descriptor existant du template
        - méthodes et codes HTTP conformes (put/201, get/post → 200 ou 204, delete → 200 ou 204)
        - jamais de texte long (token, secret, etc.) en paramètres URL (path/query) — passer par le body
    - il doit cocher ses points dans `## Step status` uniquement, sans modifier le reste du plan
    - conclusion avec statut `pass` | `fail` | `blocked`

5) un agent pour mettre à jour le back
    - raison d'être : dev sénior Typescript back NodeJS
    - il doit lire sa partie dans le document "PLAN.md"
    - cwd = racine du plugin
    - il doit exécuter la commande "npm run transpile-openapi-back" pour créer les types issus du document OpenAPI (`lib/src/Descriptor.ts`)
    - il doit créer les fonctions dans "lib/src/Mediator.ts" correspondant aux nouvelles opérations de "lib/data/Descriptor.json" en s'assurant d'utiliser des types présents dans "lib/src/Descriptor.ts"
    - il doit s'assurer de la qualité du code livré, de sa découpe (en créant d'éventuels nouveaux fichiers dans "lib/src/utils")
    - il doit exécuter "npm run lint-back" puis "npm run build-back"
    - en cas d'échec lint/build : statut `fail`, ne pas cocher le step
    - il doit cocher ses points dans `## Step status` uniquement, sans modifier le reste du plan

6) un agent pour mettre à jour le SDK front
    - raison d'être : dev sénior Typescript
    - il doit lire sa partie dans le document "PLAN.md" (étape c)
    - cwd = racine du plugin
    - il doit exécuter "npm run transpile-openapi-front" → types dans "public/src/Descriptor.ts"
    - il doit mettre à jour le SDK ("public/src/SDK.ts" et helpers si besoin) pour exposer les nouvelles opérations du Descriptor, en utilisant les types de "public/src/Descriptor.ts"
    - il doit s'assurer de la qualité / découpe du code
    - il doit exécuter "npm run lint-front" (périmètre SDK) puis vérifier que le front buildera (ou "npm run build-front" si nécessaire à ce stade)
    - pause orchestrateur après cet agent avant les composants
    - il doit cocher l'étape c dans `## Step status` uniquement

7) un agent pour créer les composants front
    - raison d'être : dev sénior Typescript front React/Bootstrap/Fontawesome — spécialité UI
    - il doit lire sa partie dans le document "PLAN.md" (étape d)
    - cwd = racine du plugin
    - il s'appuie sur le SDK et sur "public/src/Descriptor.ts" (relancer "npm run transpile-openapi-front" si besoin)
    - il doit créer / mettre à jour les composants dans "public/src" (idéalement "public/src/components/") avec un workflow cohérent entre les composants
    - il doit s'assurer de la qualité / découpe du code
    - il doit exécuter "npm run lint-front" puis "npm run build-front"
    - en cas d'échec : statut `fail`, ne pas cocher
    - il doit cocher l'étape d dans `## Step status` uniquement

8) un agent pour créer les tests unitaires
    - raison d'être : Quality Analyst sénior
    - il doit lire sa partie dans le document "PLAN.md"
    - cwd = racine du plugin
    - il doit utiliser mocha
    - il doit créer les tests unitaires dans le dossier "test" correspondant au nouveau code back en s'assurant un code coverage de 95% au minimum pour le Mediator
    - mesure du coverage : "npm run unit-tests-local" (nyc). Si coverage Mediator < 95% : statut `fail`, ne pas cocher le step, lister les trous
    - il doit s'assurer de la qualité du code livré, de sa découpe (fichiers dans "test", préfixe numérique croissant : 0_, 1_, 2_, …)
    - il doit s'assurer que le code se teste bien avec "npm run build-back" puis "npm run unit-tests"
    - lint tests recommandé : "npm run lint-tests" avant de conclure `pass`
    - il doit cocher ses points dans `## Step status` uniquement

9) un agent transversal de lint (optionnel mais recommandé avant review, ou fusionné dans back/front/tests)
    - raison d'être : guardian of lint consistency
    - entrée : racine plugin + périmètre (`back` | `front` | `tests` | `all`)
    - exécute les scripts lint correspondants (`npm run lint-back`, `npm run lint-front`, `npm run lint-tests`, ou `npm run lint`)
    - statut `pass` seulement si tout est vert ; sinon `fail` avec liste des erreurs
    - peut être sauté si chaque agent spé a déjà linté avec succès, mais l'orchestrateur peut le forcer avant `mia-review`

10) un agent pour faire une review
    - raison d'être : developpeur sénior fullstack
    - il doit soit analyser l'ensemble du projet, ou limiter à un périmètre si le projet a déjà été analysé (si des documents sont en stage par exemple) (demander confirmation dans ce cas)
    - il doit s'assurer de la qualité du code livré, de la sécurité et des points d'amélioration
    - si disponibles (MCP / outils locaux) : s'appuyer aussi sur Snyk et/ou SonarQube pour sécurité / qualité, et résumer les findings critiques
    - il doit s'assurer que la suite passe avec "npm run tests"
    - il doit cocher l'étape f dans `## Step status` uniquement si verdict prêt (ou documenter les blockers en `fail` / `blocked` sans cocher)

V) ordre orchestrateur

Mode `create` :

    1. mia-git (remote / fail-fast)
    2. mia-init
    3. (si blocked deps) mia-deps → reprise mia-init checks / suite
    4. mia-git (link local + master / develop si encore pending)
    5. mia-plan
    6. mia-openapi
    7. mia-back
    8. mia-front-sdk
    9. pause → mia-front-ui
    10. mia-tests
    11. (optionnel) mia-lint
    12. mia-review
    — pause utilisateur entre chaque étape

Mode `maintain` :

    1. confirmer racine plugin + périmètre
    2. mia-plan (update) si besoin
    3. enchaîner uniquement les sous-agents concernés par le delta / les consignes
    4. mia-review en fin de lot
    — pause utilisateur entre chaque étape
