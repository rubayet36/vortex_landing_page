/**
 * Vortex Fitness Club - Shared Business & Membership Configuration
 *
 * Single source of truth for business details, facilities,
 * membership plans, and structured metadata.
 *
 * ============================================================================
 * BUSINESS FACTS CONFIRMATION STATUS:
 * [CONFIRMED BY OWNER]:
 *   - Business Name: Vortex Fitness Club
 *   - Production Domain: https://vortexfitnessclub.xyz
 *   - Membership Pricing & Breakdown in BDT (Confirmed via packages_rows.sql):
 *     - Starter: ৳3,500 (Admission 2,000/- + Monthly 1,500/-)
 *     - Growth: ৳5,000 (Admission 2,000/- + Monthly 4,500/- - Discount 1,500/-)
 *     - Advance: ৳8,000 (Admission 2,000/- + Monthly 9,000/- - Discount 3,000/-)
 *     - Professional: ৳12,000 (Admission 2,000/- + Monthly 18,000/- - Discount 8,000/-)
 *
 * [AWAITING OWNER CONFIRMATION]:
 *   - Physical Address: "House 48 (2nd floor), Road 2, Block E, Banasree, Rampura, Dhaka"
 *     (Sourced from repository template; pending owner confirmation)
 *   - Contact Email: "info@vortexfitness.com"
 *     (Sourced from repository template; pending confirmation if active or needs @vortexfitnessclub.xyz)
 *   - Phone & WhatsApp: Omitted from public UI until owner provides real number
 *   - Operating & Female Hours: Not yet declared
 * ============================================================================
 */

export interface MembershipPlan {
  id: "starter" | "growth" | "advance" | "professional";
  name: string;
  duration: string;
  months: number;
  tagline: string;
  priceBDT: number;
  features: string[];
  confirmationStatus?: "CONFIRMED" | "AWAITING_OWNER_CONFIRMATION";
}

export const SITE_CONFIG = {
  name: "Vortex Fitness Club",
  shortName: "VORTEX",
  tagline: "Stronger Move, Healthier Living",
  description:
    "Fitness club in Banasree, Rampura with strength training equipment, dedicated female zones, aerobics & Zumba classes, and sauna recovery.",
  url: "https://vortexfitnessclub.xyz",
  contact: {
    email: "info@vortexfitness.com",
    emailConfirmationStatus: "AWAITING_OWNER_CONFIRMATION",
    address: {
      street: "House 48 (2nd floor), Road 2, Block E",
      neighborhood: "Banasree",
      locality: "Rampura",
      city: "Dhaka",
      country: "Bangladesh",
      countryCode: "BD",
      fullAddress:
        "House 48 (2nd floor), Road 2, Block E, Banasree, Rampura, Dhaka, Bangladesh",
      addressConfirmationStatus: "AWAITING_OWNER_CONFIRMATION",
    },
  },
  plans: [
    {
      id: "starter",
      name: "Starter",
      duration: "1 Month",
      months: 1,
      tagline: "Essential access for beginners",
      priceBDT: 3500,
      features: [
        "Admission 2,000/-",
        "Monthly 1,500/-",
      ],
      confirmationStatus: "CONFIRMED",
    },
    {
      id: "growth",
      name: "Growth",
      duration: "3 Months",
      months: 3,
      tagline: "Ideal for steady progress & results",
      priceBDT: 5000,
      features: [
        "Admission 2,000/-",
        "Monthly 4,500/-",
        "Discount 1,500/-",
      ],
      confirmationStatus: "CONFIRMED",
    },
    {
      id: "advance",
      name: "Advance",
      duration: "6 Months",
      months: 6,
      tagline: "Comprehensive training & conditioning",
      priceBDT: 8000,
      features: [
        "Admission 2,000/-",
        "Monthly 9,000/-",
        "Discount 3,000/-",
      ],
      confirmationStatus: "CONFIRMED",
    },
    {
      id: "professional",
      name: "Professional",
      duration: "12 Months",
      months: 12,
      tagline: "Year-round peak performance & perks",
      priceBDT: 12000,
      features: [
        "Admission 2,000/-",
        "Monthly 18,000/-",
        "Discount 8,000/-",
      ],
      confirmationStatus: "CONFIRMED",
    },
  ] as MembershipPlan[],
  facilities: [
    {
      title: "Supplement Cafe",
      description:
        "Buy supplements or take them by the scoop — fuel before and after every session.",
      tag: "Nutrition",
      image: "/assets/cafe.jpg",
    },
    {
      title: "Advance Equipment",
      description:
        "State-of-the-art machines for every muscle group, maintained and updated regularly.",
      tag: "Training",
      image: "/assets/equipment.jpg",
    },
    {
      title: "Only Female Time Zone",
      description:
        "A private, comfortable space and dedicated schedule designed exclusively for women.",
      tag: "Exclusive",
      image: "/assets/female.jpg",
    },
    {
      title: "Aerobics & Zumba Classes for Women",
      description:
        "Energetic group fitness and Zumba sessions led by certified female trainers.",
      tag: "Classes",
      image: "/assets/zumba.jpg",
    },
    {
      title: "Recovery & Sauna",
      description:
        "Infrared heat therapy and Finnish cedar saunas for post-workout recovery.",
      tag: "Recovery",
      image: "/assets/sauna.jpg",
    },
    {
      title: "Boxing Zone",
      description:
        "Dedicated combat conditioning ring with heavy bags and speed drills.",
      tag: "Training",
      image: "/assets/boxing.jpg",
    },
  ],
} as const;
