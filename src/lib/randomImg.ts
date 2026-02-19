export function getRandomRoomImage(): string {
  const images = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=500",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500",
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}