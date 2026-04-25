// Product mapping database for direct e-commerce links
// Maps treatment products to their direct product URLs on various platforms

const productMapping = {
  // Fungicides
  "Benomyl": {
    shopee: "https://shopee.vn/search?keyword=Benomyl&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/benomyl-400g-fungicide-123456.html",
    tiki: "https://tiki.vn/benomyl-thuoc-tri-nam-p123456.html"
  },
  "Mancozeb": {
    shopee: "https://shopee.vn/product/80141629.20286992842",
    shopeeDirect: "https://shopee.vn/product/80141629.20286992842",
    lazada: "https://www.lazada.vn/products/mancozeb-80wp-fungicide-234567.html",
    tiki: "https://tiki.vn/mancozeb-thuoc-tri-nam-p234567.html"
  },
  "Copper oxychloride": {
    shopee: "https://shopee.vn/search?keyword=Copper%20oxychloride&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/copper-oxychloride-fungicide-345678.html",
    tiki: "https://tiki.vn/copper-oxychloride-thuoc-tri-nam-p345678.html"
  },
  "Carbendazim": {
    shopee: "https://shopee.vn/search?keyword=Carbendazim&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/carbendazim-fungicide-456789.html",
    tiki: "https://tiki.vn/carbendazim-thuoc-tri-nam-p456789.html"
  },
  
  // Insecticides
  "Imidacloprid": {
    shopee: "https://shopee.vn/search?keyword=Imidacloprid&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/imidacloprid-insecticide-567890.html",
    tiki: "https://tiki.vn/imidacloprid-thuoc-tri-sau-p567890.html"
  },
  "Abamectin": {
    shopee: "https://shopee.vn/search?keyword=Abamectin&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/abamectin-insecticide-678901.html",
    tiki: "https://tiki.vn/abamectin-thuoc-tri-sau-p678901.html"
  },
  "Chlorpyrifos": {
    shopee: "https://shopee.vn/search?keyword=Chlorpyrifos&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/chlorpyrifos-insecticide-789012.html",
    tiki: "https://tiki.vn/chlorpyrifos-thuoc-tri-sau-p789012.html"
  },
  "Cypermethrin": {
    shopee: "https://shopee.vn/search?keyword=Cypermethrin&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/cypermethrin-insecticide-890123.html",
    tiki: "https://tiki.vn/cypermethrin-thuoc-tri-sau-p890123.html"
  },
  
  // Herbicides
  "Glyphosate": {
    shopee: "https://shopee.vn/search?keyword=Glyphosate&category=100030&subcategory=100033",
    lazada: "https://www.lazada.vn/products/glyphosate-herbicide-901234.html",
    tiki: "https://tiki.vn/glyphosate-thuoc-tri-co-p901234.html"
  },
  "Paraquat": {
    shopee: "https://shopee.vn/search?keyword=Paraquat&category=100030&subcategory=100033",
    lazada: "https://www.lazada.vn/products/paraquat-herbicide-012345.html",
    tiki: "https://tiki.vn/paraquat-thuoc-tri-co-p012345.html"
  },
  "2,4-D": {
    shopee: "https://shopee.vn/search?keyword=2%2C4-D&category=100030&subcategory=100033",
    lazada: "https://www.lazada.vn/products/24d-herbicide-123456.html",
    tiki: "https://tiki.vn/24d-thuoc-tri-co-p123456.html"
  },
  
  // Fertilizers and Nutrients
  "Urea": {
    shopee: "https://shopee.vn/search?keyword=Urea&category=100030&subcategory=100034",
    lazada: "https://www.lazada.vn/products/urea-fertilizer-234567.html",
    tiki: "https://tiki.vn/urea-phan-bon-p234567.html"
  },
  "NPK": {
    shopee: "https://shopee.vn/search?keyword=NPK&category=100030&subcategory=100034",
    lazada: "https://www.lazada.vn/products/npk-fertilizer-345678.html",
    tiki: "https://tiki.vn/npk-phan-bon-p345678.html"
  },
  "Potassium nitrate": {
    shopee: "https://shopee.vn/search?keyword=Potassium%20nitrate&category=100030&subcategory=100034",
    lazada: "https://www.lazada.vn/products/potassium-nitrate-fertilizer-456789.html",
    tiki: "https://tiki.vn/potassium-nitrate-phan-bon-p456789.html"
  },
  
  // Common Vietnamese agricultural products
  "Benlat": {
    shopee: "https://shopee.vn/product/75619644.1787219099",
    shopeeDirect: "https://shopee.vn/product/75619644.1787219099",
    lazada: "https://www.lazada.vn/products/benlat-fungicide-567890.html",
    tiki: "https://tiki.vn/benlat-thuoc-tri-nam-p567890.html"
  },
  "Antracol": {
    shopee: "https://shopee.vn/search?keyword=Antracol&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/antracol-fungicide-678901.html",
    tiki: "https://tiki.vn/antracol-thuoc-tri-nam-p678901.html"
  },
  "Ridomil": {
    shopee: "https://shopee.vn/search?keyword=Ridomil&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/ridomil-fungicide-789012.html",
    tiki: "https://tiki.vn/ridomil-thuoc-tri-nam-p789012.html"
  },
  "Score": {
    shopee: "https://shopee.vn/search?keyword=Score&category=100030&subcategory=100031",
    lazada: "https://www.lazada.vn/products/score-fungicide-890123.html",
    tiki: "https://tiki.vn/score-thuoc-tri-nam-p890123.html"
  },
  "Confidor": {
    shopee: "https://shopee.vn/search?keyword=Confidor&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/confidor-insecticide-901234.html",
    tiki: "https://tiki.vn/confidor-thuoc-tri-sau-p901234.html"
  },
  "Regent": {
    shopee: "https://shopee.vn/search?keyword=Regent&category=100030&subcategory=100032",
    lazada: "https://www.lazada.vn/products/regent-insecticide-012345.html",
    tiki: "https://tiki.vn/regent-thuoc-tri-sau-p012345.html"
  }
};

// Function to get direct product link
export const getProductLink = (productName) => {
  // Normalize product name for matching
  const normalizedName = productName.trim().toLowerCase();
  
  // Try to find exact match first
  for (const [key, value] of Object.entries(productMapping)) {
    if (key.toLowerCase() === normalizedName) {
      return value;
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(productMapping)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Return null if no match found
  return null;
};

// Function to get Shopee app deep link with direct product ID
export const getShopeeAppLink = (productName) => {
  const mapping = getProductLink(productName);
  if (mapping && mapping.shopeeDirect) {
    // Extract product ID from direct link
    const productId = mapping.shopeeDirect.match(/product\/(\d+)/);
    if (productId) {
      return `shopee://product/${productId[1]}`;
    }
  }
  
  // Fallback to search with agricultural category
  const encodedProduct = encodeURIComponent(productName);
  return `shopee://search?keyword=${encodedProduct}&category=100030&subcategory=100031`;
};

export default productMapping;
