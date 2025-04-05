// js/components/utils.js

export function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // You might have other utility functions here, like:
  // - Functions to make API calls
  // - Data formatting or manipulation functions
  // - Common validation functions