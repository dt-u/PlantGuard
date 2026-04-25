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
      console.log('=== PURCHASE HANDLER START ===');
      console.log('Treatment object:', JSON.stringify(treatment, null, 2));
      
      // Get product name from correct field - treatment object has product_name
      const productName = treatment.product_name || treatment.product;
      
      console.log('Product name extracted:', productName);
      console.log('Treatment has affiliate_url:', !!treatment.affiliate_url);
      console.log('Affiliate URL value:', treatment.affiliate_url);

      // Priority 1: Use affiliate URL from treatment object (direct product link)
      if (treatment.affiliate_url && treatment.affiliate_url.trim() !== '') {
        console.log('✅ Using affiliate URL from treatment:', treatment.affiliate_url);
        try {
          window.open(treatment.affiliate_url, '_blank');
          console.log('✅ Affiliate URL opened successfully');
        } catch (openError) {
          console.error('❌ Error opening affiliate URL:', openError);
        }
        return;
      }

      // Priority 2: Try to fetch affiliate link by product name from database
      if (productName && productName !== 'undefined' && productName.trim() !== '') {
        console.log('🔍 Fetching affiliate link for product:', productName);
        try {
          const affiliateData = await treatmentService.getAffiliateLink(productName);
          console.log('API response:', affiliateData);
          
          if (affiliateData && affiliateData.affiliate_url) {
            console.log('✅ Using fetched affiliate URL:', affiliateData.affiliate_url);
            try {
              window.open(affiliateData.affiliate_url, '_blank');
              console.log('✅ Fetched affiliate URL opened successfully');
            } catch (openError) {
              console.error('❌ Error opening fetched affiliate URL:', openError);
            }
            return;
          } else {
            console.log('❌ No affiliate data returned from API');
          }
        } catch (apiError) {
          console.error('❌ API call failed:', apiError);
        }
      } else {
        console.log('❌ Invalid product name:', productName);
      }

      // Priority 3: Fallback to search if no affiliate link available
      console.log('🔄 No affiliate link found, using search fallback');
      const keyword = treatment.search_fallback_keyword || productName || 'thuoc trong cay';
      const searchUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(keyword)}`;
      console.log('🔍 Search URL:', searchUrl);
      
      try {
        window.open(searchUrl, '_blank');
        console.log('✅ Search URL opened successfully');
      } catch (searchError) {
        console.error('❌ Error opening search URL:', searchError);
      }
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in purchase handler:', error);
      console.error('Error stack:', error.stack);
      
      // Ultimate fallback - simple search
      try {
        const productName = treatment.product_name || treatment.product || 'thuoc trong cay';
        const searchUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(productName)}`;
        console.log('🚨 ULTIMATE FALLBACK - Search URL:', searchUrl);
        window.open(searchUrl, '_blank');
      } catch (fallbackError) {
        console.error('🚨 ULTIMATE FALLBACK FAILED:', fallbackError);
      }
    } finally {
      console.log('=== PURCHASE HANDLER END ===');
    }
  }
};

export default treatmentService;
