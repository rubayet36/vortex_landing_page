# Vortex Fitness Club — Project Implementation & Launch Status

**Target Production Domain:** `https://vortexfitnessclub.xyz/`  
**Date:** October 27, 2026  
**Local Build Status:** Passed (`next build` 15.5.25 — 0 errors)  
**Search Console Status:** Domain Ownership Verified via Netlify DNS TXT Record  
**Live Production Status:** Awaiting Git Push of local fixes (currently running previous commit `82260ba`)  
**Live Database Status:** Migration prepared in `src/lib/schema.sql` (awaiting execution in Supabase SQL Editor)  

---

## 1. Actual Status of Security, Database & Deployment

| Area | Local Implementation | Live / Production State | Actual Status |
| :--- | :--- | :--- | :--- |
| **Admin Code Security** | Hardcoded credentials & client bypass removed from `supabase.ts`. `is_admin()` database verification added. | Remote code still runs commit `82260ba` until pushed. | **Code Ready, Pending Git Push** |
| **Database Policies (RLS)** | `src/lib/schema.sql` prepared: drops open public policies, locks public inserts to `status = 'pending'`, adds `is_admin()` SECURITY DEFINER helper. | Live Supabase tables still have legacy policies active until migration is run in dashboard. | **Migration Prepared, Pending Execution** |
| **Robots & Indexing** | `robots.txt` allows `/`, keeping public pages crawlable while letting Googlebot see `noindex` on `/129528`. Sitemap excludes `/129528`. | Live `https://vortexfitnessclub.xyz/robots.txt` currently returns 404 until pushed. | **Code Ready, Pending Git Push** |
| **Site Performance & Media** | Poster created (43 KB); 7.86 MB video disabled on mobile; `female.jpg` compressed by 89.4%; Linux case mismatch fixed. | Live site currently streams raw 7.86 MB video to all devices. | **Code Ready, Pending Git Push** |
| **Domain & DNS** | Netlify DNS active (`dns1.p09.nsone.net` - `dns4.p09.nsone.net`). | TXT record added; Google Search Console domain ownership verified. | **VERIFIED & ACTIVE** |

---

## 2. Business Facts: Verified vs. Awaiting Owner Confirmation

| Business Item | Current Config Value (`src/lib/business-config.ts`) | Source / Evidence | Confirmation Status |
| :--- | :--- | :--- | :--- |
| **Business Name** | `Vortex Fitness Club` | Figma design, GitHub repo, domain | **CONFIRMED BY OWNER** |
| **Production Domain** | `https://vortexfitnessclub.xyz/` | User brief | **CONFIRMED BY OWNER** |
| **Starter Plan (1 Mo)** | `৳3,500 BDT` (Admission 2,000 + Monthly 1,500) | `packages_rows.sql` | **CONFIRMED BY OWNER** |
| **Growth Plan (3 Mo)** | `৳5,000 BDT` (Admission 2,000 + Monthly 4,500 - Discount 1,500) | `packages_rows.sql` | **CONFIRMED BY OWNER** |
| **Advance Plan (6 Mo)** | `৳8,000 BDT` (Admission 2,000 + Monthly 9,000 - Discount 3,000) | `packages_rows.sql` | **CONFIRMED BY OWNER** |
| **Professional (12 Mo)** | `৳12,000 BDT` (Admission 2,000 + Monthly 18,000 - Discount 8,000) | `packages_rows.sql` | **CONFIRMED BY OWNER** |
| **Physical Address** | `House 48 (2nd floor), Road 2, Block E, Banasree, Rampura, Dhaka, Bangladesh` | Repository footer template | **AWAITING OWNER CONFIRMATION** |
| **Contact Email** | `info@vortexfitness.com` | Repository footer template | **AWAITING OWNER CONFIRMATION** |
| **Phone / WhatsApp** | *Omitted from visible UI* | Formerly dummy `+880 1700-000000` | **AWAITING OWNER CONFIRMATION** |
| **Operating Hours** | *Omitted from UI* | Not declared | **AWAITING OWNER CONFIRMATION** |
