interface PricingFeatures {
  KouahAiBot: number;
  queriesPerMonth: number;
  maxDocsPerBot: number;
  maxStoragePerBot: number; // in bytes
  restAPI: boolean;
  removePoweredByLabel: boolean;
  queryLogRetention: number;
}

interface PricingPackage {
  name: string;
  indication: string;
  price: number;
  isPopular?: boolean;
  features: PricingFeatures;
}

export const pricingPackages: PricingPackage[] = [
  {
    indication: "Free",
    name: "Free Trial",
    price: 0,
    features: {
      KouahAiBot: 1,
      queriesPerMonth: 20,
      maxDocsPerBot: 100,
      maxStoragePerBot: 52428800, // 50MB in bytes
      restAPI: false,
      removePoweredByLabel: false,
      queryLogRetention: 0,
    },
  },
  {
    indication: "STANDARD",
    name: "Starter",
    price: 19,
    features: {
      KouahAiBot: 2,
      queriesPerMonth: 1500,
      maxDocsPerBot: 100,
      maxStoragePerBot: 52428800, // 50MB in bytes
      restAPI: true,
      removePoweredByLabel: false,
      queryLogRetention: 30,
    },
  },
  {
    indication: "PRO",
    name: "Standard",
    price: 89,
    isPopular: true,
    features: {
      KouahAiBot: 4,
      queriesPerMonth: 7500,
      maxDocsPerBot: 2000,
      maxStoragePerBot: 1073741824, // 1GB in bytes
      restAPI: true,
      removePoweredByLabel: true,
      queryLogRetention: 90,
    },
  },
  {
    indication: "ULTIMATE",
    name: "Business",
    price: 399,
    features: {
      KouahAiBot: 8,
      queriesPerMonth: 15000,
      maxDocsPerBot: 10000,
      maxStoragePerBot: 5368709120, // 5GB in bytes
      restAPI: true,
      removePoweredByLabel: true,
      queryLogRetention: 360,
    },
  },
];
