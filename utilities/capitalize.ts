const capitalizeWords = (str: string): string => {
    return str
      ?.split(" ") // Split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join the words back into a string
  };
  export default capitalizeWords