import { Linking } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const treatmentService = {
  // Get treatments by disease ID
  getTreatmentsByDisease: async (diseaseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments/disease/${diseaseId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching treatments:', error);
      throw error;
    }
  },

  // Get affiliate link for product
  getAffiliateLink: async (productName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/treatments/search/affiliate/${encodeURIComponent(productName)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching affiliate link:', error);
      return null;
    }
  },

  // Handle purchase action with affiliate URL fallback
  handlePurchase: async (treatment) => {
    try {
      // Get product name from correct field - treatment object has product_name
      const productName = treatment.product_name || treatment.product;
      
      let targetUrl = null;

      // Priority 1: Use affiliate URL from treatment object (direct product link)
      if (treatment.affiliate_url) {
        targetUrl = treatment.affiliate_url;
      } else {
        // Priority 2: Try to fetch affiliate link by product name from database
        if (productName && productName !== 'undefined') {
          const affiliateData = await treatmentService.getAffiliateLink(productName);
          if (affiliateData && affiliateData.affiliate_url) {
            targetUrl = affiliateData.affiliate_url;
          }
        }
      }

      // Priority 3: Fallback to search if no affiliate link available
      if (!targetUrl) {
        const keyword = treatment.search_fallback_keyword || productName;
        targetUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(keyword)}`;
      }

      // Check if URL can be opened
      const supported = await Linking.canOpenURL(targetUrl);
      
      if (supported) {
        await Linking.openURL(targetUrl);
      } else {
        // Ultimate fallback - try simple search
        const fallbackUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(productName)}`;
        const fallbackSupported = await Linking.canOpenURL(fallbackUrl);
        if (fallbackSupported) {
          await Linking.openURL(fallbackUrl);
        }
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
      // Ultimate fallback - simple search
      try {
        const productName = treatment.product_name || treatment.product;
        const fallbackUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(productName)}`;
        const fallbackSupported = await Linking.canOpenURL(fallbackUrl);
        if (fallbackSupported) {
          await Linking.openURL(fallbackUrl);
        }
      } catch (fallbackError) {
        // Silently fail if even fallback fails
      }
    }
  }
};

export default treatmentService;
