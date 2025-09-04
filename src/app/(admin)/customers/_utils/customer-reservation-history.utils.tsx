export const formatDate = (dateString: string) => {
  const formattedDate = new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Capitalizar solo la primera letra
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
};

export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;

  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;

  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `Hace ${months} ${months === 1 ? "mes" : "meses"}`;

  const years = Math.floor(diffDays / 365);
  return `Hace ${years} ${years === 1 ? "año" : "años"}`;
};
