# Kiné Georges Schmidt — Site Vitrine + Portail Patient

> Site vitrine SEO-first et portail de réservation pour un cabinet de kinésithérapie.
> Conçu comme template réutilisable — un fichier de config à éditer pour un nouveau praticien.

## 🏗 Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, SSG) |
| Styling | Tailwind CSS 4 |
| Images | Cloudinary (f_auto, q_auto responsive) |
| Auth | Firebase Auth (Google sign-in) |
| Database | Firestore (europe-west) |
| Notifications | Email (Resend/SendGrid) — pluggable |
| Hosting | Vercel |

## 🚀 Setup

### 1. Clone & Install

```bash
git clone https://github.com/flyxtaxi-oss/kine-georges-schmidt.git
cd kine-georges-schmidt
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase client config (6 vars) |
| `EMAIL_PROVIDER` | `resend` or `sendgrid` |
| `EMAIL_API_KEY` | Transactional email API key |
| `EMAIL_FROM` | Sender email address |
| `PRACTITIONER_EMAIL` | Practitioner's email (for dashboard access) |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Google Maps Embed API key |

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → **Google** provider
3. Enable **Firestore Database** in region `europe-west1`
4. Copy the web app config to `.env.local`
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   ⚠️ Update `PRACTITIONER_EMAIL_HERE` in `firestore.rules` with the practitioner's Google email.

### 4. Cloudinary Setup

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Create a folder matching `practitioner.cloudinary.folder` (default: `kine-georges-schmidt`)
3. Upload images with the public IDs defined in `src/config/practitioner.ts`
4. Add your cloud name to `.env.local`

### 5. Run

```bash
npm run dev     # Development
npm run build   # Production build
npm run start   # Production server
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/notifications/email/   # Email API route
│   ├── portail/                   # Patient booking portal
│   │   ├── dashboard/             # Practitioner dashboard
│   │   └── page.tsx               # Patient booking flow
│   ├── politique-de-confidentialite/
│   ├── layout.tsx                 # Root layout (SEO, fonts, JSON-LD)
│   ├── page.tsx                   # Homepage
│   ├── sitemap.ts                 # Dynamic sitemap
│   └── robots.ts                  # Robots.txt
├── components/
│   ├── Header.tsx                 # Sticky nav with glass morphism
│   ├── Hero.tsx                   # Full-screen hero
│   ├── Services.tsx               # Service cards
│   ├── About.tsx                  # Bio, ratings, INAMI
│   ├── Contact.tsx                # Contact info + Google Maps
│   ├── Footer.tsx                 # Footer
│   ├── CloudinaryImage.tsx        # Responsive Cloudinary images
│   └── AuthProvider.tsx           # Firebase auth context
├── config/
│   └── practitioner.ts            # ⭐ ONE CONFIG FILE FOR EVERYTHING
└── lib/
    ├── firebase.ts                # Firebase client (auth + Firestore)
    └── notifications.ts           # Pluggable notification system
```

## 🔄 Clone for a New Client

1. Fork or clone this repository
2. Edit `src/config/practitioner.ts`:
   - Name, title, contact info
   - Services list
   - Brand colors
   - Cloudinary folder
   - SEO keywords
3. Update `firestore.rules` with the new practitioner's email
4. Set up new Firebase project & Cloudinary folder
5. Update `.env.local`
6. Deploy to Vercel

**That's it.** The entire site adapts from the single config file.

## ⚖️ Belgian Healthcare Advertising Compliance

This site follows Belgian healthcare advertising rules:
- **Factual and objective** information only
- **No superlatives** (no "best", "leading", etc.)
- **No promotional** language about "free" or "reimbursed" services
- **No testimonials** used for promotional purposes
- Google rating mentioned **factually** (score + number of reviews)
- Hours displayed as "Sur rendez-vous" until confirmed

## 🔒 GDPR

> ⚠️ **Important**: Before go-live, a **Data Processing Agreement (DPA)** must be signed
> between the agency (data processor) and the practitioner (data controller), in compliance
> with GDPR Article 28.

The portal stores the **minimum** data required:
- Patient name and email (from Google sign-in)
- Appointment slot and optional reason
- **No medical notes** stored online

## 📧 Notifications

The notification system uses a pluggable interface (`src/lib/notifications.ts`):

- ✅ **Email** — implemented (Resend/SendGrid)
- 🔲 **SMS** — stub ready, implement when needed
- 🔲 **WhatsApp** — stub ready, implement when needed

## 📜 License

Private — All rights reserved.
