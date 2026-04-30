import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const treatmentService = {
  // Get treatments by disease ID
  getTreatmentsByDisease: async (diseaseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/treatments/disease/${diseaseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching treatments:', error);
      throw error;
    }
  },

  // Get affiliate link for product
  getAffiliateLink: async (productName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/treatments/search/affiliate/${encodeURIComponent(productName)}`);
      return response.data;
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
      
      // Priority 1: Use affiliate URL from treatment object (direct product link)
      if (treatment.affiliate_url && treatment.affiliate_url.trim() !== '') {
        try {
          window.open(treatment.affiliate_url, '_blank');
        } catch (openError) {
          console.error('Error opening affiliate URL:', openError);
        }
        return;
      }

      // Priority 2: Try to fetch affiliate link by product name from database
      if (productName && productName !== 'undefined' && productName.trim() !== '') {
        try {
          const affiliateData = await treatmentService.getAffiliateLink(productName);
          
          if (affiliateData && affiliateData.affiliate_url) {
            try {
              window.open(affiliateData.affiliate_url, '_blank');
            } catch (openError) {
              console.error('Error opening fetched affiliate URL:', openError);
            }
            return;
          }
        } catch (apiError) {
          console.error('API call failed:', apiError);
        }
      }

      // Priority 3: Fallback to search if no affiliate link available
      const keyword = treatment.search_fallback_keyword || productName || 'thuoc trong cay';
      const searchUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(keyword)}`;
      
      try {
        window.open(searchUrl, '_blank');
      } catch (searchError) {
        console.error('Error opening search URL:', searchError);
      }
      
    } catch (error) {
      console.error('CRITICAL ERROR in purchase handler:', error);
      
      // Ultimate fallback - simple search
      try {
        const productName = treatment.product_name || treatment.product || 'thuoc trong cay';
        const searchUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(productName)}`;
        window.open(searchUrl, '_blank');
      } catch (fallbackError) {
        console.error('ULTIMATE FALLBACK FAILED:', fallbackError);
      }
    }
  }
};

export default treatmentService;
