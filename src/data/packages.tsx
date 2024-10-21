interface PricingFeatures {
  KouahAiBot: number;
  queriesPerMonth: number;
  maxWebPages: number;
  maxYoutube: number;
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
      maxWebPages: 100,
      maxYoutube: 100,
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
      maxWebPages: 100,
      maxYoutube: 100,
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
      maxWebPages: 2000,
      maxYoutube: 2000,
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
      maxWebPages: 10000,
      maxYoutube: 10000,
      maxStoragePerBot: 5368709120, // 5GB in bytes
      restAPI: true,
      removePoweredByLabel: true,
      queryLogRetention: 360,
    },
  },
];
