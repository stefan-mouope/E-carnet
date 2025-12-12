# Topitoh Backend

Ce projet est le backend de l'application mobile Topitoh, développé avec Node.js, Express, Sequelize et PostgreSQL.

## Configuration

1.  **Cloner le dépôt**

    ```bash
    git clone <URL_DU_DEPOT>
    cd Topitoh
    ```

2.  **Installer les dépendances**

    ```bash
    npm install
    ```

3.  **Variables d'environnement**

    Créez un fichier `.env` à la racine du projet en copiant le contenu de `.env.example` et en ajustant les valeurs si nécessaire.

    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=ecarnet_user
    DB_PASS=ecarnet_password
    DB_NAME=ecarnet_db

    JWT_SECRET=supersecretjwtkey
    JWT_ACCESS_EXPIRES=1h
    JWT_REFRESH_EXPIRES=7d

    BCRYPT_SALT_ROUNDS=10
    ```

4.  **Base de données PostgreSQL**

    Assurez-vous d'avoir une instance PostgreSQL en cours d'exécution. Vous pouvez utiliser Docker :

    ```bash
    docker run --name ecarnet-db -e POSTGRES_USER=ecarnet_user -e POSTGRES_PASSWORD=ecarnet_password -e POSTGRES_DB=ecarnet_db -p 5432:5432 -d postgres
    ```

## Scripts NPM

*   **Lancer le serveur en mode développement**

    ```bash
    npm run dev
    ```

*   **Lancer le serveur en mode production**

    ```bash
    npm start
    ```

*   **Exécuter les migrations de base de données**

    ```bash
    npm run migrate
    ```

*   **Exécuter les seeders de base de données (données de test)**

    ```bash
    npm run seed
    ```

## Structure du projet

```
─ src/
  │   ├─ modules/
  │   │   ├─ accounts/
  │   │   │   ├─ controllers/
  │   │   │   ├─ routes/
  │   │   │   ├─ models/
  │   │   │   ├─ services/
  │   │   │   └─ validators/
  │   │   ├─ patients/
  │   │   │   ├─ controllers/
  │   │   │   ├─ routes/
  │   │   │   ├─ models/
  │   │   │   └─ validators/
  │   │   └─ consultations/
  │   │       ├─ controllers/
  │   │       ├─ routes/
  │   │       ├─ models/
  │   │       └─ validators/
  │   ├─ middlewares/
  │   │   ├─ auth.js
  │   │   └─ role.js
  │   ├─ config/
  │   │   ├─ database.js
  │   │   └─ index.js
  │   ├─ app.js
  │   └─ server.js
  ├─ migrations/
  ├─ seeders/
  ├─ .env.example
  ├─ package.json
  └─ README.md
```

## Fonctionnalités principales

*   **Gestion des comptes** : Enregistrement et authentification des docteurs et patients.
*   **Gestion des patients** : Création, mise à jour et consultation des dossiers patients.
*   **Gestion des consultations** : Création et listage des consultations.

## Sécurité

*   Mots de passe hachés avec `bcrypt`.
*   Authentification basée sur des tokens JWT.
*   Contrôle d'accès basé sur les rôles (`DOCTEUR` / `PATIENT`) via des middlewares.

## Gestion des erreurs

Les réponses d'API sont formatées en JSON et incluent une gestion robuste des erreurs (400, 401, 403, 404, 500).

## Auteurs

[Votre Nom] - [Votre Email]

