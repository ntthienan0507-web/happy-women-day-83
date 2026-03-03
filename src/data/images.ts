// 24 beautiful Unsplash images - one for each hour
// Using flower, rose, love, romantic themes
export const hourlyImages: string[] = [
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", // 0h - roses
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80", // 1h - night flowers
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80", // 2h - dreamy flowers
  "https://images.unsplash.com/photo-1518882054407-1f978be04e3c?w=800&q=80", // 3h - gentle petals
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80", // 4h - morning bloom
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", // 5h - sunrise flowers
  "https://images.unsplash.com/photo-1518882054407-1f978be04e3c?w=800&q=80", // 6h - fresh morning
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80", // 7h - bouquet
  "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80", // 8h - pink roses
  "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=800&q=80", // 9h - tulips
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80", // 10h - white roses
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", // 11h - red roses
  "https://images.unsplash.com/photo-1518882054407-1f978be04e3c?w=800&q=80", // 12h - sunflowers
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80", // 13h - garden
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80", // 14h - love flowers
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80", // 15h - romantic
  "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800&q=80", // 16h - afternoon roses
  "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=800&q=80", // 17h - sunset bouquet
  "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80", // 18h - evening flowers
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=800&q=80", // 19h - twilight roses
  "https://images.unsplash.com/photo-1518882054407-1f978be04e3c?w=800&q=80", // 20h - night garden
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80", // 21h - moonlit flowers
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80", // 22h - starlight roses
  "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&q=80", // 23h - midnight bloom
];

export const getImageByHour = (): string => {
  const hour = new Date().getHours();
  return hourlyImages[hour % hourlyImages.length];
};
