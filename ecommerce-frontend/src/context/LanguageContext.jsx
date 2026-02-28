import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    dashboard: 'Dashboard',
    search: 'Search products...',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    // ... more keys
  },
  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    cart: 'السلة',
    dashboard: 'لوحة التحكم',
    search: 'ابحث عن منتجات...',
    addToCart: 'أضف إلى السلة',
    viewDetails: 'عرض التفاصيل',
    // ...
  },
  fr: {
    home: 'Accueil',
    products: 'Produits',
    cart: 'Panier',
    dashboard: 'Tableau de bord',
    search: 'Rechercher des produits...',
    addToCart: 'Ajouter au panier',
    viewDetails: 'Voir détails',
    // ...
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);