// Function to get the color of the star based on the rating
export const getStarColor = (rating: number): string => {
    if (rating >= 4.5) return "#008000"; // Green for excellent
    if (rating >= 4) return "#7cfc00"; // Light Green for excellent
    if (rating >= 3) return "#ffa500"; // Orange for good
    if (rating >= 1) return "#ff6347"; // Red for bad
    return "#ccc"; // Default gray for empty stars
};

export const getStarColor2 = (rating: number): string => {
    switch (rating) {
      case 1:
        return '#ff0000'; // Rouge
      case 2:
        return '#ff6347'; // Tomate
      case 3:
        return '#ffa500'; // Orange
      case 4:
        return '#7cfc00'; // Vert clair
      case 5:
        return '#008000'; // Vert
      default:
        return '#ccc'; // Couleur par défaut
    }
  };