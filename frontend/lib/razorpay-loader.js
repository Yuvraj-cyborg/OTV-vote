/**
 * Dynamically loads the Razorpay script
 * @returns {Promise<any>} - Returns the Razorpay object if loaded successfully, null otherwise
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      return resolve(window.Razorpay);
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        console.error('Razorpay script loaded but window.Razorpay is not defined');
        resolve(null);
      }
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(null);
    };
    
    document.body.appendChild(script);
  });
}; 