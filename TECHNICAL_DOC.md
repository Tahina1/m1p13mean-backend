# Documentation Technique — m1p13mean-miangaly-tahina

> Projet Master 1 Promotion 13 — ITU
> Application de gestion d'un centre commercial
> Stack : Node.js · Express.js · MongoDB · JavaScript (MEAN)

---

## Table des matières

1. [Objectif de l'application](#1-objectif-de-lapplication)
2. [Stack technique](#2-stack-technique)
3. [Architecture du projet](#3-architecture-du-projet)
4. [Conception base de données](#4-conception-base-de-données)
5. [API — Endpoints](#5-api--endpoints)
6. [Authentification & Autorisation](#6-authentification--autorisation)
7. [Upload de fichiers](#7-upload-de-fichiers)
8. [Variables d'environnement](#8-variables-denvironnement)
9. [Lancement du projet](#9-lancement-du-projet)

---

## 1. Objectif de l'application

Application backend REST API pour la gestion d'un **centre commercial** avec trois profils d'utilisateurs :

| Profil | Rôle |
|---|---|
| **ADMIN** | Gère les boutiques, les catégories de produits, les utilisateurs |
| **SHOP** | Gère ses propres produits |
| **CLIENT** | Consulte les boutiques et les produits |

Fonctionnalités principales :
- Inscription / connexion avec JWT
- Gestion des boutiques (création, mise à jour statut, galerie photos)
- Gestion des catégories de produits
- Gestion des produits avec images (upload cloud)
- Contrôle d'accès basé sur les rôles (RBAC)

---

## 2. Stack technique

| Composant | Technologie | Version |
|---|---|---|
| Runtime | Node.js | - |
| Framework | Express.js | 5.2.1 |
| Base de données | MongoDB Atlas | - |
| ODM | Mongoose | 9.1.5 |
| Authentification | jsonwebtoken | 9.0.3 |
| Hashage mot de passe | bcryptjs | 3.0.3 |
| Validation | express-validator | 7.3.1 |
| Upload fichiers | multer + @vercel/blob | 2.0.2 / 2.1.0 |
| Sécurité headers | helmet | 8.1.0 |
| CORS | cors | 2.8.6 |
| Déploiement | Vercel (serverless-http) | - |
| Dev local | Docker + nodemon | - |

---

## 3. Architecture du projet

```
m1p13mean-backend/
├── server.js                  # Point d'entrée, chargement dotenv
├── src/
│   ├── app.js                 # Configuration Express, montage routes
│   ├── config/
│   │   └── db.js              # Connexion MongoDB
│   ├── models/                # Schémas Mongoose
│   │   ├── user.model.js
│   │   ├── shop.model.js
│   │   ├── product-category.model.js
│   │   └── product.model.js
│   ├── routes/                # Définition des routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── shop.routes.js
│   │   ├── product-category.routes.js
│   │   └── product.routes.js
│   ├── controllers/           # Gestion req/res
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── shop.controller.js
│   │   ├── product-category.controller.js
│   │   └── product.controller.js
│   ├── services/              # Logique métier (sans req/res)
│   │   ├── shop.service.js
│   │   ├── product-category.service.js
│   │   └── product.service.js
│   ├── validators/            # Validation des entrées (express-validator)
│   │   ├── shop.validator.js
│   │   ├── product-category.validator.js
│   │   └── product.validator.js
│   ├── middlewares/
│   │   ├── auth.middleware.js         # Vérifie le JWT (authenticate)
│   │   ├── authorize.middleware.js    # Vérifie les rôles (authorize)
│   │   └── vercel-upload.middleware.js # Upload vers Vercel Blob
│   └── utils/
│       └── AppError.js        # Classe d'erreur HTTP personnalisée
```

### Flux d'une requête

```
Request
  └─► Route
        └─► Middleware (authenticate → authorize)
              └─► Multer (parse multipart)
                    └─► VercelUpload (upload cloud)
                          └─► Validator (express-validator)
                                └─► Controller (req/res)
                                      └─► Service (logique métier)
                                            └─► Model (Mongoose)
                                                  └─► MongoDB Atlas
```

---

## 4. Conception base de données

### Vue d'ensemble des relations

```
User (1) ──────────────────────── (N) Shop
                                        │
                                        │ shopId
                                        ▼
ProductCategory (N) ◄──── categories[] ── Product
```

MongoDB est utilisé en mode **référencement** (ObjectId refs) plutôt qu'en embedding, car :
- Les boutiques et produits sont consultés indépendamment
- Les catégories sont partagées entre plusieurs produits
- Les données nécessitent des mises à jour ciblées

---

### Collection `users`

```js
{
  _id:        ObjectId,
  firstName:  String (required),
  lastName:   String (required),
  email:      String (required, unique, lowercase),
  password:   String (required, select: false, hashé bcrypt),
  roles:      [String] (enum: ADMIN | SHOP | CLIENT, default: [CLIENT]),
  createdAt:  Date,
  updatedAt:  Date
}
```

| Champ | Index | Notes |
|---|---|---|
| email | unique | Login identifier |
| password | - | Non retourné par défaut (select: false) |
| roles | - | Multi-rôles possible |

---

### Collection `shops`

```js
{
  _id:       ObjectId,
  ownerId:   ObjectId (ref: User, required, index),
  name:      String (required),
  category:  String (index),
  gallery:   [String],   // URLs Vercel Blob
  location: {
    floor:      String,
    shopNumber: String
  },
  status:    String (enum: PENDING | ACTIVE | SUSPENDED, default: PENDING, index),
  contract: {
    startDate: Date,
    endDate:   Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

| Champ | Index | Notes |
|---|---|---|
| ownerId | index | Référence vers users |
| status | index | Filtrage par statut fréquent |
| category | index | Filtrage par catégorie de boutique |

**Cycle de vie du statut d'une boutique :**
```
PENDING ──► ACTIVE ──► SUSPENDED
              │              │
              └──────────────┘ (peut changer via PATCH /:id/status)
```

---

### Collection `productcategories`

```js
{
  _id:       ObjectId,
  name:      String (required, unique, trim),
  isActive:  Boolean (default: true, index),
  createdAt: Date,
  updatedAt: Date
}
```

| Champ | Index | Notes |
|---|---|---|
| name | unique | Nom de catégorie unique |
| isActive | index | Activer/désactiver une catégorie |

---

### Collection `products`

```js
{
  _id:         ObjectId,
  name:        String (required, trim),
  description: String,
  categories:  [ObjectId] (ref: ProductCategory, index),  // multi-catégories
  images:      [String],  // URLs Vercel Blob
  price:       Number (required, min: 0),
  shopId:      ObjectId (ref: Shop, required, index),
  isActive:    Boolean (default: true, index),
  stock:       Number (default: 0, min: 0),
  viewsCount:  Number (default: 0),
  createdAt:   Date,
  updatedAt:   Date
}
```

| Champ | Index | Notes |
|---|---|---|
| shopId | index | Référence vers shops |
| categories | index | Recherche par catégorie ($in) |
| isActive | index | Filtrage actif/inactif |

**Choix de conception — `categories` comme tableau de refs :**
- Un produit peut appartenir à plusieurs catégories (ex: "Informatique" + "Promotions")
- Les catégories sont réutilisées entre produits → référencement (pas d'embedding)
- Requête : `Product.find({ categories: { $in: [id1, id2] } })`

---

## 5. API — Endpoints

Base URL : `/api`

### Auth — `/api/auth`

| Méthode | Endpoint | Auth | Corps | Description |
|---|---|---|---|---|
| POST | `/register` | Public | `{ firstName, lastName, email, password, roles? }` | Inscription |
| POST | `/login` | Public | `{ email, password }` | Connexion → retourne JWT |

---

### Users — `/api/users`

> ⚠️ Route actuellement protégée par `authorize(CLIENT)` seulement (manque `authenticate`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | CLIENT | Liste tous les utilisateurs |
| POST | `/` | CLIENT | Crée un utilisateur |

---

### Shops — `/api/shops`

| Méthode | Endpoint | Auth | Corps / Query | Description |
|---|---|---|---|---|
| POST | `/` | ADMIN | `form-data: name, category?, location?, contract?, gallery[]` | Créer une boutique |
| PATCH | `/:id/status` | ADMIN | `{ status: PENDING\|ACTIVE\|SUSPENDED }` | Changer le statut |
| PATCH | `/:id` | ADMIN, SHOP | `form-data: name?, category?, location?, contract?, gallery[]?` | Modifier une boutique |
| GET | `/` | Public | `?status=&ownerId=&page=&limit=` | Lister les boutiques |
| GET | `/:id` | Public | - | Détail d'une boutique |

---

### Product Categories — `/api/product-categories`

| Méthode | Endpoint | Auth | Corps / Query | Description |
|---|---|---|---|---|
| GET | `/` | Public | - | Toutes les catégories |
| GET | `/search` | Public | `?name=` | Recherche par nom |
| GET | `/:id` | Public | - | Détail d'une catégorie |
| POST | `/` | ADMIN | `{ name, isActive? }` | Créer une catégorie |
| PATCH | `/:id` | ADMIN | `{ name?, isActive? }` | Modifier une catégorie |

---

### Products — `/api/products`

| Méthode | Endpoint | Auth | Corps / Query | Description |
|---|---|---|---|---|
| POST | `/` | ADMIN, SHOP | `form-data: name, categoryIds[], price, shopId?, isActive?, stock?, images[]` | Créer un produit |
| PATCH | `/:id` | ADMIN, SHOP | `form-data: name?, categoryIds[]?, price?, shopId?, isActive?, stock?, images[]?` | Modifier un produit |
| GET | `/` | Public | `?name=&categoryIds=&minPrice=&maxPrice=&shopId=&isActive=&page=&limit=` | Lister avec filtres |

---

## 6. Authentification & Autorisation

### Stratégie JWT — Access Token uniquement

```
Login ──► JWT signé (secret + expiration 1h) ──► Client stocke le token
Request ──► Header: Authorization: Bearer <token>
         ──► authenticate middleware vérifie signature + expiration
         ──► authorize middleware vérifie les rôles
```

**Pas de refresh token** — l'expiration du token = déconnexion (choix simplifié pour le projet).

### Middlewares

**`authenticate`** ([auth.middleware.js](src/middlewares/auth.middleware.js))
- Extrait le token du header `Authorization: Bearer <token>`
- Vérifie la signature avec `JWT_ACCESS_SECRET`
- Injecte `req.user = { id, roles }` pour les middlewares suivants

**`authorize(...roles)`** ([authorize.middleware.js](src/middlewares/authorize.middleware.js))
- Factory function : `authorize("ADMIN", "SHOP")`
- Vérifie que `req.user.roles` contient au moins un rôle autorisé
- Doit toujours être précédé de `authenticate`

### Règles d'accès par ressource

| Ressource | Public | CLIENT | SHOP | ADMIN |
|---|---|---|---|---|
| Auth (register/login) | ✓ | ✓ | ✓ | ✓ |
| Shops (lecture) | ✓ | ✓ | ✓ | ✓ |
| Shops (création) | | | | ✓ |
| Shops (modification) | | | ✓ (propre) | ✓ |
| Shops (statut) | | | | ✓ |
| Product Categories (lecture) | ✓ | ✓ | ✓ | ✓ |
| Product Categories (écriture) | | | | ✓ |
| Products (lecture) | ✓ | ✓ | ✓ | ✓ |
| Products (création/modification) | | | ✓ | ✓ |

---

## 7. Upload de fichiers

Middleware factory `uploadToVercelBlob(fieldName)` ([vercel-upload.middleware.js](src/middlewares/vercel-upload.middleware.js))

```
Request (multipart)
  └─► multer (memoryStorage) ──► req.files = [{ buffer, originalname, mimetype }]
        └─► uploadToVercelBlob("images")
              ├─► Aucun fichier → req.images = []
              └─► Fichiers présents → upload parallel sur Vercel Blob
                    └─► req.images = ["https://blob.vercel.../uuid-filename.jpg", ...]
```

- Nom de fichier : `files/{uuid}-{originalname}` (évite les collisions)
- Accès : public
- Réutilisable par champ : `uploadToVercelBlob("gallery")`, `uploadToVercelBlob("images")`

---

## 8. Variables d'environnement

| Variable | Description | Exemple |
|---|---|---|
| `MONGO_URI` | URI MongoDB Atlas | `mongodb+srv://...` |
| `PORT` | Port serveur | `5000` |
| `JWT_ACCESS_SECRET` | Secret signature JWT | chaîne aléatoire hex 32 bytes |
| `JWT_EXPIRES_IN` | Durée validité token | `1h` |
| `FRONTEND_URL` | Origine CORS autorisée | `*` ou `https://monfront.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob | `vercel_blob_rw_...` |

> ⚠️ **Important Docker Compose** : les secrets contenant `$` doivent être échappés avec `$$` dans `.env` ou utiliser des chaînes sans `$`.
>
> Générer un secret propre : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 9. Lancement du projet

### Local avec Docker

```bash
docker compose up --build
```

### Local sans Docker

```bash
npm install
npm run dev   # nodemon server.js
```

### Production (Vercel)

Déploiement automatique via GitHub Actions sur push vers la branche principale.
Variables d'environnement à configurer dans le dashboard Vercel : Settings → Environment Variables.