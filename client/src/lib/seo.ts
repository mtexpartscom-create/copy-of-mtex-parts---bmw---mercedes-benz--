/*
  SEO Metadata Helper
  Управление на SEO елементи за всяка страница
*/

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEO_PAGES: Record<string, SEOMetadata> = {
  home: {
    title: "MTEX PARTS - Автоморга, Авточасти, Автосервиз, Автоклиматици | Варна",
    description: "Пълна грижа за BMW и Mercedes-Benz. Автоморга, авточасти, автосервиз, автоклиматици, пътна помощ 24/7 във Варна.",
    keywords: "автоморга, авточасти, автосервиз, автоклиматици, пътна помощ, BMW, Mercedes-Benz, Варна",
  },
  catalog: {
    title: "Каталог Автомобили и Авточасти | MTEX PARTS",
    description: "Разгледайте нашия каталог с автомобили за части и авточасти за BMW и Mercedes-Benz.",
    keywords: "каталог, автомобили, авточасти, BMW, Mercedes-Benz",
  },
  autoService: {
    title: "Автосервиз Варна | Ремонт BMW и Mercedes-Benz | MTEX PARTS",
    description: "Професионален автосервиз във Варна. Ремонт на двигатели, спирачна система, ходова част, компютърна диагностика.",
    keywords: "автосервиз, ремонт, BMW, Mercedes-Benz, диагностика, Варна",
  },
  acService: {
    title: "Автоклиматици Варна | Зареждане и Обслужване | MTEX PARTS",
    description: "Професионално зареждане и обслужване на автомобилни климатични системи. Диагностика, откривање на течове, смяна на компресори.",
    keywords: "автоклиматици, зареждане, обслужване, климатик, Варна",
  },
  roadAssistance: {
    title: "Пътна Помощ 24/7 | MTEX PARTS | Варна",
    description: "Спешна пътна помощ 24/7. Техническа помощ, буксиране, смяна на гума, доставка на гориво.",
    keywords: "пътна помощ, спешна помощ, буксиране, техническа помощ, 24/7",
  },
  sellCar: {
    title: "Продай Своя Автомобил | MTEX PARTS | Варна",
    description: "Бързо и лесно продай своя BMW или Mercedes-Benz. Справедлива оценка и гарантирана покупка.",
    keywords: "продай автомобил, оценка, BMW, Mercedes-Benz, Варна",
  },
};

export function setSEOMetadata(metadata: SEOMetadata) {
  // Set title
  document.title = metadata.title;

  // Set or update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute("content", metadata.description);

  // Set keywords if provided
  if (metadata.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", metadata.keywords);
  }

  // Set Open Graph tags
  if (metadata.ogImage) {
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", metadata.ogImage);
  }

  if (metadata.ogType) {
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement("meta");
      ogType.setAttribute("property", "og:type");
      document.head.appendChild(ogType);
    }
    ogType.setAttribute("content", metadata.ogType);
  }

  // Set og:title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", metadata.title);

  // Set og:description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement("meta");
    ogDescription.setAttribute("property", "og:description");
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute("content", metadata.description);
}
