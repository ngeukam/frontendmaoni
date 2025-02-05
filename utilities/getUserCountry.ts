const getUserCountry = async (apiUrl: string = "http://ip-api.com/json", timeout: number = 5000): Promise<string> => {
    // Check if we already have the country stored in localStorage
    const cachedCountry = localStorage.getItem('userCountry');
    if (cachedCountry) {
      return cachedCountry; // Use cached country if available
    }
  
    // Create a promise that rejects after the specified timeout
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    );
  
    try {
      // Race the timeout against the fetch request
      const response = await Promise.race([
        fetch(apiUrl),
        timeoutPromise
      ]);
  
      // If the fetch succeeds, parse the response
      const data = await response.json();
      if (data.country) {
        // Cache the result and return the country
        localStorage.setItem('userCountry', data.country);
        return data.country;
      } else {
        throw new Error("Country not found");
      }
    } catch (error) {
      console.error("Error fetching country:", error);
      return "Unable to determine country";  // Return a fallback country
    }
  };
  
  export default getUserCountry;
  
//   Using https://members.ip-api.com/ for production