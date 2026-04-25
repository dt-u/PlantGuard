# Affiliate Link Management Workflow

## Overview
This document outlines the complete workflow for managing affiliate links in the PlantGuard system, enabling monetization through Shopee affiliate links for agricultural products.

## 1. Database Schema

### Treatments Collection Structure
```json
{
  "id": "UUID (Primary Key)",
  "disease_id": "Apple Scab",
  "level": "Mild",
  "identification_guide": "Guide text",
  "action": "Action to take",
  "product_name": "Anvil 5SC Difenoconazole",
  "affiliate_url": "https://shope.ee/xxxxx (Optional)",
  "search_fallback_keyword": "difenoconazole (Optional)",
  "created_at": "ISO Date",
  "updated_at": "ISO Date"
}
```

## 2. Admin API Endpoints

### Base URL: `/api/admin/affiliate`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/treatments` | Get all treatments |
| GET | `/treatments/{id}` | Get specific treatment |
| POST | `/treatments` | Create new treatment |
| PUT | `/treatments/{id}` | Update treatment |
| DELETE | `/treatments/{id}` | Delete treatment |
| POST | `/treatments/{id}/affiliate-link` | Update only affiliate link |
| GET | `/treatments/disease/{disease_id}` | Get treatments by disease |
| GET | `/stats` | Get affiliate coverage statistics |
| POST | `/batch-update` | Update multiple treatments |

## 3. Affiliate Link Management Process

### Step 1: Find Products on Shopee
1. **Access Shopee** or Shopee Seller Center
2. **Search for agricultural products**:
   - Pesticides: Captan 80WP, Anvil 5SC Difenoconazole
   - Fungicides: Various brands
   - Agricultural chemicals and treatments
3. **Prioritize Shop Mall** and high-rated sellers
4. **Verify product authenticity** and availability

### Step 2: Generate Affiliate Links
1. **Join Shopee Affiliate Program** if not already registered
   - Visit: https://affiliate.shopee.vn/
   - Complete registration process
2. **Get product URLs** from Shopee
3. **Generate affiliate links**:
   - Use Shopee Affiliate Tools
   - Or use AccessTrade platform
   - Ensure tracking parameters are included
4. **Test affiliate links** to verify they work correctly

### Step 3: Update Database
#### Option A: Individual Updates
```bash
# Update single treatment affiliate link
curl -X POST "http://127.0.0.1:8000/api/admin/affiliate/treatments/{treatment_id}/affiliate-link" \
  -H "Content-Type: application/json" \
  -d '{
    "affiliate_url": "https://shope.ee/xxxxx",
    "search_fallback_keyword": "difenoconazole 5sc"
  }'
```

#### Option B: Batch Updates
```bash
# Update multiple treatments at once
curl -X POST "http://127.0.0.1:8000/api/admin/affiliate/batch-update" \
  -H "Content-Type: application/json" \
  -d '{
    "treatments": [
      {
        "id": "treatment-uuid-1",
        "affiliate_url": "https://shope.ee/xxxxx",
        "search_fallback_keyword": "captan 80wp"
      },
      {
        "id": "treatment-uuid-2", 
        "affiliate_url": "https://shope.ee/yyyyy",
        "search_fallback_keyword": "anvil difenoconazole"
      }
    ]
  }'
```

### Step 4: Verify Integration
1. **Check frontend behavior**:
   - Visit diagnosis detail page
   - Verify buy buttons appear
   - Test affiliate link opens correctly
2. **Check mobile app behavior**:
   - Open diagnosis detail screen
   - Expand treatment cards
   - Test buy button opens Shopee app
3. **Monitor affiliate clicks** through Shopee dashboard

## 4. Quality Guidelines

### Affiliate Link Requirements
- ✅ **Valid HTTPS URLs** starting with https://
- ✅ **Working links** that open to correct product pages
- ✅ **Tracking enabled** for commission tracking
- ✅ **Mobile-friendly** links that work on both web and mobile

### Product Selection Criteria
- **Relevance**: Product must match treatment recommendation
- **Availability**: Product should be in stock and regularly available
- **Quality**: Prefer Shop Mall and high-rated sellers
- **Price**: Competitive pricing with good value for users
- **Authenticity**: Genuine agricultural products from reputable brands

### Fallback Keywords
- **Specific**: Use exact product names when possible
- **Alternative**: Include common brand variations
- **Generic**: Use general product categories if specific unavailable
- **Vietnamese**: Include Vietnamese terms for local users

## 5. Monitoring and Maintenance

### Weekly Tasks
1. **Check affiliate link performance**:
   ```bash
   curl -X GET "http://127.0.0.1:8000/api/admin/affiliate/stats"
   ```
2. **Update broken links**:
   - Test all affiliate links weekly
   - Replace out-of-stock products
   - Update discontinued items
3. **Add new products**:
   - Monitor for new agricultural products
   - Add affiliate links for new treatments

### Monthly Tasks
1. **Coverage Analysis**:
   - Aim for 80%+ affiliate link coverage
   - Prioritize high-traffic diseases
   - Focus on common treatments
2. **Performance Optimization**:
   - Analyze click-through rates
   - Optimize product selections
   - Test different product options

## 6. Troubleshooting

### Common Issues
1. **Affiliate link not working**:
   - Verify URL format (must start with https://)
   - Check if product is still available
   - Test link in incognito browser
2. **Buy button not showing**:
   - Verify product field is populated
   - Check frontend console for errors
   - Ensure onBuyPress prop is passed
3. **Mobile app not opening Shopee**:
   - Verify Linking.canOpenURL returns true
   - Check if Shopee app is installed
   - Test with different devices

### Error Codes
- **400**: Invalid URL format
- **404**: Treatment not found
- **500**: Server error - check logs

## 7. Security Considerations

- **API Authentication**: Implement admin authentication for affiliate endpoints
- **URL Validation**: All URLs validated for format and security
- **Rate Limiting**: Prevent abuse of affiliate link generation
- **Audit Trail**: Log all affiliate link changes for tracking

## 8. Best Practices

1. **Test thoroughly** before deploying to production
2. **Document all changes** to affiliate links
3. **Monitor performance** regularly
4. **Keep links updated** with current products
5. **Provide fallback options** for when affiliate links fail
6. **Optimize for mobile** user experience
7. **Track analytics** to optimize conversions

## 9. Integration Status

### Completed Features
- ✅ Database schema with UUID primary keys
- ✅ Admin API endpoints for affiliate management
- ✅ Frontend buy button with affiliate prioritization
- ✅ Mobile app Linking integration
- ✅ Fallback search functionality

### Next Steps
- 🔄 Implement admin authentication
- 🔄 Create admin dashboard UI
- 🔄 Add affiliate analytics tracking
- 🔄 Implement automated link checking
- 🔄 Add affiliate revenue reporting

## 10. Contact and Support

For technical issues with affiliate integration:
- Check API documentation at `/docs` endpoint
- Review server logs for error details
- Test with Postman or curl commands
- Contact development team for complex issues

For affiliate program questions:
- Shopee Affiliate Support
- AccessTrade documentation
- Marketing team for strategy questions
