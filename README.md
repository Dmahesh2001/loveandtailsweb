# Love & Tails — web

React 19 + Vite + Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com), built from the Figma file **L-T › webpages**.

## Scripts

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build → dist/
npm run preview   # serve the build locally
```

## Structure

```
src/
  components/
    ui/            shadcn/ui components (Button has extra Love & Tails pill sizes + brand variants)
    app/           app shell (Sidebar, MobileHeader, TabBar, TopBar) and shared pieces
                   (PostCard, PetCard, SearchField, Chip, ShareDialog, ResponsiveModal, …)
    auth/          Login / Sign up layout + form
    onboarding/    step template (StepLayout) and centred FocusLayout
  pages/           one file per screen (see routes below)
  data/            mock data (pets, the signed-in user)
  assets/figma/    images and icons exported from Figma
  index.css        Tailwind + design tokens (brand #ce2c2c, TikTok Sans, Pacifico)
```

Breakpoints follow the Figma frames: **390** mobile (mobile header + bottom tab bar), **768** tablet
(collapsed 80px sidebar, `md:`), **1440** laptop (expanded 248px sidebar, `xl:`).

## Routes

| Route | Figma screen |
| --- | --- |
| `/` | Landing (mobile: intro carousel) |
| `/splash`, `/loading` | Splash, Loading |
| `/login`, `/signup`, `/welcome-back` | 02 Login, 14 Sign up / Welcome back |
| `/onboarding/1…6` (`/personalize` = step 4) | 06 Onboarding step, 15 Personalize |
| `/badge-quiz/1…6` | 16 Badge quiz (+ voice answer) |
| `/kyc` | 18 KYC verification |
| `/permissions` | Permissions |
| `/home` | 01 Home feed |
| `/create`, `/create/edit` | 12 Create post, Media editor |
| `/reels` | 13 Reels |
| `/adopt`, `/adopt/:petId`, `/adopt/new` | 04 Adopt, 07 Pet details, 17 Create adoption profile |
| `/applications` | 11 Application status |
| `/messages`, `/messages/:id` | 03 Messages |
| `/notifications` | 10 Notifications |
| `/profile` | 05 Profile |
| `/pets/:petId`, `/pets/:petId/documents` | 08 My pet’s profile, 09 Documents (+ upload modal, `?upload=1`) |
| `/settings`, `/settings/profile`, `/settings/accounts` | 19 Settings · Edit profile / Profile menu, Switch accounts |
| `/share` | Share |
| `/search` | (no Figma frame — composed from the design system) |
| `/coming-soon` | the original pre-launch page |

Data is mocked; there is no backend yet.
