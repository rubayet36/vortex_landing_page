# Project Memory: Vortex Fitness Club Landing Page & Registration

## 1. Project Overview & Context
- **Project**: Vortex Fitness Club Landing Page & Membership Registration Form
- **Source Design**: 2 Figma export PNGs in `Figma Image/`
  1. `lifthub-editable-design.png` (1440 x 3981 px) - Full landing page
  2. `join-now-form.png` (1440 x 1353 px) - Dedicated membership registration page & modal
- **Tech Stack**: Next.js 15+ (App Router), React 19 / 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Core Goal**: Pixel-accurate, high-fidelity replica of the Figma designs with interactive functionality (routing between landing page and join-now form, plan selection sync, interactive pricing cards, working form validation and submission feedback, responsive layout).

---

## 2. Design System & Style Specifications

### A. Color Palette
- **Primary Accent Red/Coral**: `#FF3B30` / `#FA3838` / `#FF4742` (used in buttons, badges, highlights, logo accent)
- **Soft Peach/Rose Accent**: `#FDE4E1` (used in "Progress, Not Perfection" bento card)
- **Soft Coral Accent**: `#FF5B5B` (used in "Integrity Movement" bento card)
- **Dark Background / Hero**: `#0B0E14` / `#0D1117` / `#161B22`
- **Dark Card (Growth Plan)**: `#0F1420` (Navy-black with subtle blue undertone and glow)
- **Neutral Dark Footer**: `#0B0E14`
- **Body / Main Background**: `#FFFFFF` (pure white) and subtle off-white `#F9FAFB`
- **Text Colors**:
  - Headings: `#0F172A` / `#111827` (almost pure black, heavy bold)
  - Subtext / Body: `#64748B` / `#6B7280`
  - Dark container headings: `#FFFFFF`
  - Dark container subtext: `#94A3B8` / `#A1A1AA`
- **Borders & Inputs**: `#E2E8F0` / `#E5E7EB` with focus ring `#FF3B30`

### B. Typography & Font Hierarchy
- **Font Family**: Inter / Plus Jakarta Sans / system sans-serif (clean modern geometric sans)
- **Logo**: Bold uppercase with red accent bars: `| VORTEX FITNESS CLUB |` or `||| VORTEX FITNESS CLUB`
- **Hero Title**: Bold uppercase / title-case: "Stronger Move," / "Healthier Living" (approx 56px-64px bold)
- **Section Titles**: Bold title-case (approx 36px-44px)
- **Card Badges**: Uppercase small tracked text (e.g., "MOST POPULAR", "MEMBERSHIP REGISTRATION", "+ ABOUT")

---

## 3. Page Structure & Component Breakdown

### Landing Page (`/`):
1. **Navigation Bar**:
   - Floating pill / clean top bar
   - Links: Home, About, Logo (`| VORTEX FITNESS CLUB |`), Classes, Contact
   - "Join Now" CTA linking to `/join`
2. **Hero Section**:
   - Dark rounded container (28px-32px border radius)
   - Background image of muscular athlete deadlifting
   - Top-left: Social proof avatar stack + "Over 5,000 members strong and growing with us every day!"
   - Bottom-left: Headline "Stronger Move, Healthier Living"
   - Bottom-right: Community description + "JOIN NOW" red pill button
3. **About Section ("More Than Reps, It's a Way of Life")**:
   - Header with `+ ABOUT` tag, bold headline, and right-aligned subtext
   - Bento Grid Layout:
     - Card 1: Tall image of woman doing cable pulldown
     - Card 2: Soft peach card "Progress, Not Perfection" + arrow icon
     - Card 3: Middle tall image of man doing dip bar exercises
     - Card 4: Vibrant red card "Community Driven" + user icon
     - Card 5: Wide image of 3 Olympic lifters with Iron Rebel backdrop
     - Card 6: Coral card "Integrity Movement" + shield icon
     - Card 7: 3-square image row (kettlebell, shoe laces, weight plates)
4. **Facilities Section ("Take A Tour Of Our Facilities")**:
   - Header with play icon `▷`
   - Headline and description
   - 3 facility cards:
     - "Supplement Cafe"
     - "Advance Equipment"
     - "Only Female Zone"
5. **Pricing Plans Section ("Choose the plan that matches your training goals")**:
   - Tag: `PRICING PLANS`
   - Headline and subtext
   - 4 Cards:
     - Starter ($29/mo, 1 Month)
     - Growth ($79/mo, 3 Months, "MOST POPULAR" highlighted dark card, red button)
     - Advance ($149/mo, 6 Months)
     - Professional ($249/mo, 12 Months)
   - Clicking any plan button pre-selects the plan in the Join Form!
6. **Footer & Location**:
   - Gym address & brand statement
   - Interactive dark map preview with red pin
   - Opening hours, Contact info + WhatsApp button (`+1 (555) 123-4567`)
   - Social links (Instagram, Facebook, YouTube, TikTok)
   - Copyright & legal links

### Registration Page (`/join`):
1. **Header**: Logo and navigation with "JOIN NOW" active button
2. **Background**: Gym atmosphere with ambient glow
3. **Hero Title & Badge**: `MEMBERSHIP REGISTRATION` badge, "START YOUR FITNESS JOURNEY", subtext
4. **Registration Form Card**:
   - User Name input
   - Email Address input
   - Phone Number input
   - Desired Package dropdown (Starter, Growth, Advance, Professional)
   - Terms checkbox
   - "SUBMIT APPLICATION" red CTA
5. **Footer / Back Link**: "← Back to main website" and copyright

---

## 4. Execution Plan & Status
- [x] Initial design analysis of `lifthub-editable-design.png` & `join-now-form.png`
- [x] Create `memory.md` with complete architectural and design specification
- [x] User instruction: User will add images manually; configured structured asset placeholders and resilient image fallbacks.
- [x] Next.js dependencies installed (Next.js 15.5, React 19, Tailwind CSS v4, Lucide icons)
- [x] Configure Tailwind CSS v4 (`postcss.config.mjs`, `@import "tailwindcss"`, custom brand theme tokens in `globals.css`)
- [x] Set up typography with Google Font *Plus Jakarta Sans* in `layout.tsx`
- [x] Build shared UI components:
  - `Navbar.tsx`: Floating pill header, logo with red accent bars `| VORTEX FITNESS CLUB |`, navigation links, and mobile menu toggle.
  - `Footer.tsx`: Dark theme (`#0B0E14`), address box, stylized district map with bouncing location pin, operating hours table, WhatsApp CTA (`+1 555 123-4567`), social links, copyright.
- [x] Build Landing Page sections (`/`):
  - `Hero.tsx`: Dark hero card, 5,000+ member avatar stack, headline *"Stronger Move, Healthier Living"*, and red *"JOIN NOW"* CTA.
  - `AboutBento.tsx`: 3-column Bento grid with exact Figma cards:
    - Col 1: Lat Pulldown image + "Community Driven" red card with users icon
    - Col 2: "Progress, Not Perfection" peach card (`#FDE4E1`) with arrow icon + outdoor dips image
    - Col 3: Barbell lifters photo + "Integrity Movement" coral card (`#FF5B5B`) with shield icon + 3 detail square images (kettlebell, shoes, plates)
  - `Facilities.tsx`: Tour showcase with play badge, title, and cards for *Supplement Cafe*, *Advance Equipment*, and *Only Female Zone*.
  - `Pricing.tsx`: 4 tiers (*Starter $29*, *Growth $79 "MOST POPULAR"*, *Advance $149*, *Professional $249*) with direct URL query sync to `/join?plan=...`.
  - `page.tsx`: Seamless page integration.
- [x] Build Registration Page (`/join`):
  - `src/app/join/page.tsx`: Navbar with active Join button, ambient blurred gym glow, `MEMBERSHIP REGISTRATION` badge, headline *"START YOUR FITNESS JOURNEY"*, elevated form card with User Name, Email, Phone, Desired Package dropdown (with auto-selection support), Terms checkbox, Submit button, validation state, success confirmation screen, and "← Back to main website" link.
- [x] Create asset reference documentation: `public/assets/README.md`
- [x] Verification: Successfully ran `npm run build` with 0 errors (all routes statically prerendered).

---

## 5. Viewport & Layout Adjustments (Turn 2)
- **Problem Identified**: The user reported too much blank space on both sides on desktop displays because the containers were restricted to Tailwind's default `max-w-7xl` (1280px).
- **Figma Design Reference**: The Figma artboard is 1440px wide, and the hero container + sections have only 40px margins on either side (1360px content width / 94.4% width).
- **Solution Applied**:
  - Updated all sections to use `w-full max-w-[1400px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10` so on any desktop display there is no excessive blank void.
  - Refined the landing page Navbar to be a centered 880px pill (`max-w-[880px] mx-auto`) containing `Home`, `About`, `| VORTEX FITNESS CLUB |`, `Classes`, and `Contact` exactly as in `lifthub-editable-design.png`.
  - Kept the full-bleed dark footer (`bg-[#0B0E14] w-full`) with inner container matching the 1400px content width.

---

## 6. Hero Video, Audio & Full-Size Layout (Turn 3)
- **User Requirements**:
  1. Make the Hero full-size (full viewport width edge-to-edge, flush to the top) with rounded corners at the bottom.
  2. Position the Navbar directly on top of the Hero.
  3. Use the hero video from `public/assets/` (`Hero video.mp4` / `hero-video.mp4`) and play sound.
- **Implementation**:
  - Full-size hero with `rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[64px]`.
  - Looping video background with audio policy auto-unmute and manual sound toggle.

---

## 7. Notch Navbar & Side-Aligned Hero Content (Turn 4)
- **User Requirements**:
  1. Make the Navbar look like a top "notch" (attached directly to the top edge, rounded at the bottom).
  2. Push *"Stronger Move, Healthier Living"*, the *"JOIN NOW"* button, and all hero layers to the outer sides rather than crowded into the middle, keeping the center clear for the video subject.
- **Implementation**:
  - Notch Navbar: Attached directly to `top-0`, `rounded-b-[22px] sm:rounded-b-[26px]`, `rounded-t-none`.
  - Expanded hero content to `w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24`.

---

## 8. Sticky Navbar, Sound Button Removal & 1200+ Members (Turn 5)
- **User Requirements**:
  1. Make the notch navbar sticky so it follows the user while scrolling.
  2. Remove the sound toggle / sound off button UI.
  3. Remove the 3 avatar headshot image circles and update member count to `1200+ members`.
- **Implementation**:
  - Sticky Notch Navbar: `fixed top-0 left-0 right-0 z-50` with click pass-through.
  - Removed sound button UI; audio plays cleanly in background.
  - Updated to 1200+ members with pulsing red dot indicator.

---

## 9. React Bits <DepthCarousel /> Integration in Facilities (Turn 6)
- Installed `gsap` and integrated `<DepthCarousel />` with 3D cards and metadata overlays.

---

## 10. Scroll-Based 3D Carousel & Play Button Removal (Turn 7)
- Removed circular play button `▷` from the Facilities heading.
- Added initial ScrollTrigger integration.

---

## 11. Enlarged Images & Buttery Smooth Pin-Scroll (Turn 8)
- Enlarged 3D cards to 440px x 580px with 680px stage.
- Added smooth inertial scrolling.

---

## 12. Complete Prevention of Section Overlap & Sequential Scroll Track (Turn 9)
- Re-architected Facilities using native sticky scroll track.

---

## 13. Guaranteed Full Card Traversal & Dwell Buffer (Turn 10)
- **Problem Identified**: The user noted that the page advanced to the next section before all facility cards were completely viewed because the previous animation reached 100% right at the exit threshold, and inertial lag delayed the final card.
- **Solution Applied**:
  - **Scroll Track Extended**: Increased the `#facilities` scroll track to `380vh` (`~280vh` scrollable travel).
  - **Responsive Scrubbing (`scrub: 0.5`)**: Reduced inertial lag so the 3D cards follow the scroll wheel in real-time.
  - **Final Card Dwell Buffer**:
    - Mapped `0% -> 80%` of the scroll track to cycle through all 5 cards (Card 0 -> Card 4).
    - Mapped the final `80% -> 100%` of the scroll track (a ~600px scroll window) as a **dedicated dwell buffer** where Card 4 (*Recovery & Sauna Suite*) remains completely settled and stationary on screen.
    - Only after scrolling through this entire buffer does the page release to the Pricing section, mathematically guaranteeing that all cards are fully viewed before the next section appears.

---

## 14. Development & Running Commands
- **Start Dev Server**: `npm run dev` (Runs locally on `http://localhost:3000`)
- **Build for Production**: `npm run build`
- **Start Production Server**: `npm run start`
