# AnimalShop - Mikrostoritvena arhitektura z Micro Frontends

## 🏗️ Opis sistema

AnimalShop je informacijski sistem za trgovino s hišnimi ljubljenčki, ki vključuje:

- **3 mikrostoritve** za upravljanje z uporabniki, ponudbami in naročili
- **Micro Frontends arhitekturo** za spletni uporabniški vmesnik
- **Docker containerizacijo** vseh komponent
- **CI/CD pipeline** za avtomatsko gradnjo in objavo na DockerHub

## 🎯 Funkcionalnosti

### Mikrostoritve
- **UserService** (Node.js + gRPC) - registracija, prijava, upravljanje uporabnikov
- **OfferService** (Python + FastAPI) - upravljanje ponudb in popustov
- **OrderService** (Java + Spring Boot) - upravljanje naročil
- **WebGateway** (Node.js + Express) - API gateway za spletne kliente

### Micro Frontends
- **Shell App** (port 3000) - glavna aplikacija, ki povezuje vse mikro frontend-e
- **Auth Frontend** (port 3002) - avtentifikacija in upravljanje profila
- **Offers Frontend** (port 3003) - pregled in upravljanje ponudb
- **Orders Frontend** (port 3004) - pregled in upravljanje naročil

## 🚀 Hitri zagon

### Predpogoji
- Docker in Docker Compose
- Node.js 18+
- Git

### Koraki za zagon

1. **Kloniraj repozitorij**
```bash
git clone <repository-url>
cd AnimalShop
```

2. **Zaženi celoten sistem**
```bash
docker-compose up --build
```

3. **Dostop do aplikacij**
- Glavna aplikacija: http://localhost:3000
- Auth Frontend: http://localhost:3002/auth
- Offers Frontend: http://localhost:3003/offers
- Orders Frontend: http://localhost:3004/orders
- WebGateway API: http://localhost:3001

## 🏗️ Arhitektura

### Mikrostoritve
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ UserService │    │OfferService │    │OrderService │
│   (50051)   │    │   (50052)   │    │   (50053)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │ WebGateway  │
                    │   (3001)    │
                    └─────────────┘
```

### Micro Frontends
```
┌─────────────────────────────────────────────────┐
│                Shell App (3000)                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │    Auth     │ │   Offers    │ │   Orders    │ │
│  │   (3002)    │ │   (3003)    │ │   (3004)    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────┘
```

## 🐳 Docker Containerizacija

Vsi servisi so containerizirani z Docker:

```bash
# Posamezni servisi
docker build -t animalshop-userservice ./microservices/UserService
docker build -t animalshop-offerservice ./microservices/OfferService
docker build -t animalshop-orderservice ./microservices/OrderService
docker build -t animalshop-webgateway ./microservices/WebGateway

# Micro frontends
docker build -t animalshop-shell ./frontend/shell
docker build -t animalshop-auth ./frontend/auth
docker build -t animalshop-offers ./frontend/offers
docker build -t animalshop-orders ./frontend/orders
```

## 🔄 CI/CD Pipeline

GitHub Actions avtomatsko:
- Gradi Docker slike za vse komponente
- Objavi slike na DockerHub
- Zažene ob push na main branch

### Potrebne GitHub Secrets
- `DOCKERHUB_USERNAME` - DockerHub uporabniško ime
- `DOCKERHUB_TOKEN` - DockerHub access token

## 🧪 Testiranje funkcionalnosti

### API Endpoints (WebGateway - port 3001)

**Uporabniki:**
```bash
GET    /api/users          # Pridobi vse uporabnike
POST   /api/users          # Ustvari novega uporabnika
GET    /api/users/:id      # Pridobi uporabnika po ID
PUT    /api/users/:id      # Posodobi uporabnika
DELETE /api/users/:id      # Izbriši uporabnika
```

**Ponudbe:**
```bash
GET    /api/offers         # Pridobi vse ponudbe
POST   /api/offers         # Ustvari novo ponudbo
PUT    /api/offers/:id     # Posodobi ponudbo
DELETE /api/offers/:id     # Izbriši ponudbo
```

**Naročila:**
```bash
GET    /api/orders         # Pridobi vsa naročila
POST   /api/orders         # Ustvari novo naročilo
PUT    /api/orders/:id     # Posodobi naročilo
DELETE /api/orders/:id     # Izbriši naročilo
```

### Frontend funkcionalnosti

1. **Avtentifikacija** - registracija, prijava, upravljanje profila
2. **Ponudbe** - pregled, dodajanje, urejanje, brisanje ponudb
3. **Naročila** - pregled, ustvarjanje, spremljanje statusa naročil

## 🛠️ Razvoj

### Lokalni razvoj

```bash
# Frontend razvoj
cd frontend
npm install
npm run start  # Zažene vse mikro frontend-e

# Posamezni mikro frontend
cd frontend/auth
npm start

cd frontend/offers
npm start

cd frontend/orders
npm start

cd frontend/shell
npm start
```

### Mikrostoritve razvoj

```bash
# UserService
cd microservices/UserService
npm install
npm start

# OfferService
cd microservices/OfferService
pip install -r requirements.txt
python main.py

# OrderService
cd microservices/OrderService
mvn spring-boot:run

# WebGateway
cd microservices/WebGateway
npm install
npm start
```

## 📊 Podatkovna baza

Sistem uporablja MongoDB z ločenimi bazami za vsako mikrostoritev:
- `userservice` - podatki o uporabnikih
- `offerservice` - podatki o ponudbah
- `orderservice` - podatki o naročilih

## 🔧 Konfiguracija

### Okoljske spremenljivke

```bash
# Mikrostoritve
MONGODB_URI=mongodb://localhost:27017
USER_SERVICE_URL=localhost:50051
OFFER_SERVICE_URL=localhost:50052
ORDER_SERVICE_URL=localhost:50053

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

## 📝 Licenca

MIT License

## 🤝 Prispevki

1. Fork repozitorija
2. Ustvari feature branch
3. Commit sprememb
4. Push na branch
5. Ustvari Pull Request

---

**AnimalShop** - Vaša trgovina za hišne ljubljenčke 🐾 