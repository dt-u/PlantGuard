# Treatment seed data with real Shopee direct product URLs
TREATMENTS_SEED_DATA = [
    # Apple Scab treatments
    {
        "disease_id": "Apple Scab",
        "level": "Mild",
        "identification_guide": "Xuất hiện các đốm nhỏ màu ô liu hoặc đen trên lá, quả non.",
        "action": "Phun thuốc khi mới phát hiện bệnh",
        "product_name": "Nước vôi trong",
        "affiliate_url": "https://s.shopee.vn/gMO8N1BhD",  # Nước vôi trong direct link
        "search_fallback_keyword": "nước vôi trong phun cây"
    },
    {
        "disease_id": "Apple Scab",
        "level": "Moderate",
        "identification_guide": "Đốm bệnh lan rộng, lá có thể bị quăn lại và rụng.",
        "action": "Sử dụng thuốc trừ nấm có hiệu quả",
        "product_name": "Captan 80WP",
        "affiliate_url": "https://s.shopee.vn/3B3j71CwEb",  # Captan direct link
        "search_fallback_keyword": "captan 80wp tri nam"
    },
    {
        "disease_id": "Apple Scab",
        "level": "Severe",
        "identification_guide": "Bệnh nặng, nhiều lá và quả bị nhiễm, cây suy yếu.",
        "action": "Sử dụng thuốc đặc trị nấm mạnh",
        "product_name": "Anvil 5SC Difenoconazole",
        "affiliate_url": "https://s.shopee.vn/5L8Dh3B2YC",  # Anvil direct link
        "search_fallback_keyword": "anvil 5sc difenoconazole"
    },
    
    # Apple Rust treatments
    {
        "disease_id": "Apple Rust",
        "level": "Mild",
        "identification_guide": "Vài đốm nhỏ màu vàng chanh xuất hiện đơn lẻ trên mặt lá.",
        "action": "Loại bỏ cây chủ phụ (cây bách) lân cận",
        "product_name": "Kéo tỉa cành",
        "affiliate_url": None,  # No affiliate link for manual tools
        "search_fallback_keyword": "kéo tỉa cành cây"
    },
    {
        "disease_id": "Apple Rust",
        "level": "Moderate",
        "identification_guide": "Đốm chuyển màu cam đậm, bắt đầu thấy các chấm đen nhỏ ở tâm vết bệnh.",
        "action": "Phun khi lá non vừa nhú",
        "product_name": "Lưu huỳnh 80WP",
        "affiliate_url": "https://shopee.vn/search?keyword=l%C6%B0u%20hu%E1%BB%B3nh%2080wp",
        "search_fallback_keyword": "lưu huỳnh phun lá"
    },
    {
        "disease_id": "Apple Rust",
        "level": "Severe",
        "identification_guide": "Dưới mặt lá mọc ra các ống bào tử hình gai, lá bị vàng đi và rụng.",
        "action": "Sử dụng thuốc kháng nấm mạnh",
        "product_name": "Myclobutanil 40WP",
        "affiliate_url": "https://s.shopee.vn/9padSDpxJ8",  # Difenoconazole direct link
        "search_fallback_keyword": "myclobutanil tri nam"
    },
    
    # Bell Pepper Leaf Spot treatments
    {
        "disease_id": "Bell Pepper Leaf Spot",
        "level": "Mild",
        "identification_guide": "Xuất hiện các đốm nhỏ sũng nước ở rìa lá hoặc mặt dưới lá.",
        "action": "Tránh tưới nước trực tiếp lên lá",
        "product_name": "Dịch chiết hành tây",
        "affiliate_url": "https://s.shopee.vn/9fHDFsEDGS",  # Dầu tỏi ớt direct link
        "search_fallback_keyword": "dịch chiết hành tây trị bệnh"
    },
    {
        "disease_id": "Bell Pepper Leaf Spot",
        "level": "Moderate",
        "identification_guide": "Đốm bệnh lan rộng, có tâm màu nâu sáng viền đậm, lá bắt đầu vàng.",
        "action": "Phun chế phẩm đồng diệt khuẩn",
        "product_name": "Copper Oxychloride 85WP",
        "affiliate_url": "https://shopee.vn/search?keyword=copper%20oxychloride%2085wp",
        "search_fallback_keyword": "copper oxychloride 85"
    },
    {
        "disease_id": "Bell Pepper Leaf Spot",
        "level": "Severe",
        "identification_guide": "Nhiều lá bị cháy khô, rụng hàng loạt, ảnh hưởng đến cả hoa và quả non.",
        "action": "Nhổ cây bệnh, dừng bón phân đạm quá mức",
        "product_name": "Streptomycin 1.5SL",
        "affiliate_url": "https://shopee.vn/search?keyword=streptomycin%2015sl",
        "search_fallback_keyword": "streptomycin nông nghiệp"
    },
    
    # Common agricultural products with affiliate links
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Lá duy trì màu xanh mượt, không tìm thấy bất kỳ dấu hiệu bất thường nào.",
        "action": "Tiếp tục chăm sóc định kỳ, tưới nước đều đặn",
        "product_name": "Phân hữu cơ vi sinh Tricho",
        "affiliate_url": "https://shopee.vn/search?keyword=ph%C3%A2n%20h%E1%BB%AF%20c%C3%B4%20vi%20sinh%20tricho",
        "search_fallback_keyword": "phân hữu cơ vi sinh"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Toàn bộ tán cây trông đều màu, không có lá vàng rụng bất thường.",
        "action": "Kiểm tra sâu bệnh thường xuyên ở mặt sau lá",
        "product_name": "Nước sạch",
        "affiliate_url": None,  # Basic resource
        "search_fallback_keyword": "hệ thống tưới nước sạch"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Điểm sinh trưởng phát triển tốt, chồi non mạnh khỏe.",
        "action": "Giữ vững chế độ bón phân đa trung vi lượng",
        "product_name": "Phân NPK 20-20-20",
        "affiliate_url": "https://s.shopee.vn/2LUcWGKGnA",  # Phân NPK direct link
        "search_fallback_keyword": "phân npk 20-20-20"
    },
    
    # Additional products with affiliate links
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Bảo vệ cây khỏi sâu hại và nấm bệnh tổng quát.",
        "action": "Phun định kỳ để phòng trừ sâu bệnh",
        "product_name": "Mancozeb",
        "affiliate_url": "https://s.shopee.vn/2BBCKBQjIM",  # Mancozeb direct link
        "search_fallback_keyword": "mancozeb thuoc tri nam"
    },
    {
        "disease_id": "General", 
        "level": "Maintenance",
        "identification_guide": "Phòng trừ sâu hại bằng phương pháp hữu cơ.",
        "action": "Phun khi phát hiện dấu hiệu sâu hại",
        "product_name": "Dầu tỏi, Thuringiensis",
        "affiliate_url": "https://s.shopee.vn/6VKBVJhMax",  # Dầu tỏi, Thuringiensis direct link
        "search_fallback_keyword": "dau toi thuringiensis"
    },
    {
        "disease_id": "General",
        "level": "Maintenance", 
        "identification_guide": "Bảo vệ cây bằng phương pháp hữu cơ an toàn.",
        "action": "Phun định kỳ để tăng sức đề kháng cho cây",
        "product_name": "Dầu neem chotosan",
        "affiliate_url": "https://s.shopee.vn/3qJQKUktDI",  # Dầu neem chotosan direct link
        "search_fallback_keyword": "dau neem chotosan"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Bảo quản nông sản và ngăn ngừa nấm mốc.",
        "action": "Sử dụng để xử lý sau thu hoạch hoặc bảo quản",
        "product_name": "Sodium benzoate E211",
        "affiliate_url": "https://s.shopee.vn/2Vo2k6bDed",  # Sodium benzoate E211 direct link
        "search_fallback_keyword": "sodium benzoate E211"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Tăng cường dinh dưỡng và sức đề kháng cho cây.",
        "action": "Phun lá hoặc tưới gốc định kỳ",
        "product_name": "Sữa tách kem skim milk",
        "affiliate_url": "https://s.shopee.vn/7VCihy5H71",  # Sữa tách kem skim milk direct link
        "search_fallback_keyword": "sua tach kem skim milk"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Cân bằng pH đất và cung cấp canxi cho cây.",
        "action": "Bón vào đất hoặc phun lá khi cần",
        "product_name": "Vôi bột",
        "affiliate_url": "https://s.shopee.vn/6AhL7rL7I8",  # Vôi bột direct link
        "search_fallback_keyword": "voi bot nong nghiep"
    },
    {
        "disease_id": "General",
        "level": "Maintenance",
        "identification_guide": "Phòng trừ nấm bệnh và tăng sức đề kháng.",
        "action": "Phun định kỳ để bảo vệ cây",
        "product_name": "Ranman",
        "affiliate_url": "https://s.shopee.vn/7AZsJoUIGG",  # Ranman direct link
        "search_fallback_keyword": "ranman thuoc tri nam"
    }
]

async def seed_treatments():
    """Seed treatments collection with initial data"""
    from .database.mongodb import treatments_collection
    from datetime import datetime
    
    try:
        # Check if treatments collection exists and has data
        treatments_count = await treatments_collection.count_documents({})
        
        if treatments_count == 0:
            print("🌱 Seeding treatments collection...")
            
            # Add timestamps to each treatment
            for treatment in TREATMENTS_SEED_DATA:
                treatment["created_at"] = datetime.utcnow()
                treatment["updated_at"] = datetime.utcnow()
            
            # Insert treatments
            result = await treatments_collection.insert_many(TREATMENTS_SEED_DATA)
            print(f"✅ Created {len(result.inserted_ids)} treatments")
        else:
            print(f"✅ Treatments collection already contains {treatments_count} treatments")
            
    except Exception as e:
        print(f"❌ Error seeding treatments: {e}")

async def update_treatments():
    """Update treatments collection with new affiliate links"""
    from .database.mongodb import treatments_collection
    from datetime import datetime
    
    try:
        print("🔄 Clearing existing treatments...")
        await treatments_collection.delete_many({})
        
        print("🌱 Inserting updated treatments with new affiliate links...")
        
        # Add timestamps to each treatment
        for treatment in TREATMENTS_SEED_DATA:
            treatment["created_at"] = datetime.utcnow()
            treatment["updated_at"] = datetime.utcnow()
        
        # Insert treatments
        result = await treatments_collection.insert_many(TREATMENTS_SEED_DATA)
        print(f"✅ Updated {len(result.inserted_ids)} treatments with new affiliate links")
        
        # Show updated treatments with affiliate links
        print("\n📋 Updated treatments with affiliate links:")
        affiliate_count = 0
        for i, treatment in enumerate(TREATMENTS_SEED_DATA, 1):
            if treatment["affiliate_url"]:
                print(f"{i}. {treatment['product_name']} - {treatment['affiliate_url']}")
                affiliate_count += 1
        print(f"\n🔗 Total treatments with affiliate links: {affiliate_count}")
            
    except Exception as e:
        print(f"❌ Error updating treatments: {e}")

async def import_all_treatments_from_seed_data():
    """Import treatments for all diseases from seed_data.py"""
    from .database.mongodb import treatments_collection
    from .seed_data import DISEASES_SEED_DATA
    from datetime import datetime
    
    try:
        print("🔄 Clearing existing treatments...")
        await treatments_collection.delete_many({})
        
        print("🌱 Importing treatments from seed_data for all diseases...")
        
        all_treatments = []
        
        for disease in DISEASES_SEED_DATA:
            disease_name = disease['name']
            if 'treatments' in disease and disease['treatments']:
                for treatment_data in disease['treatments']:
                    treatment = {
                        "disease_id": disease_name,
                        "level": treatment_data['level'],
                        "identification_guide": treatment_data['identification_guide'],
                        "action": treatment_data['action'],
                        "product_name": treatment_data['product'],
                        "affiliate_url": None,  # Will be updated later
                        "search_fallback_keyword": treatment_data['product'].lower(),
                        "created_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                    all_treatments.append(treatment)
                    print(f"📋 Added: {disease_name} - {treatment_data['level']} - {treatment_data['product']}")
        
        # Insert all treatments
        if all_treatments:
            result = await treatments_collection.insert_many(all_treatments)
            print(f"✅ Imported {len(result.inserted_ids)} treatments for all diseases")
        else:
            print("❌ No treatments found in seed_data")
            
    except Exception as e:
        print(f"❌ Error importing treatments: {e}")

async def update_affiliate_links():
    """Update affiliate links for existing treatments"""
    from .database.mongodb import treatments_collection
    
    # Mapping of product names to affiliate URLs
    affiliate_mapping = {
        "Nước vôi trong": "https://s.shopee.vn/gMO8N1BhD",
        "Captan 80WP": "https://s.shopee.vn/3B3j71CwEb", 
        "Anvil 5SC Difenoconazole": "https://s.shopee.vn/5L8Dh3B2YC",
        "Dịch chiết hành tây": "https://s.shopee.vn/9fHDFsEDGS",
        "Difenoconazole (Anvil)": "https://s.shopee.vn/9padSDpxJ8",
        "Phân NPK 20-20-20": "https://s.shopee.vn/2LUcWGKGnA",
        "Mancozeb": "https://s.shopee.vn/9paehv3noE",
        "Dầu tỏi, Thuringiensis": "https://s.shopee.vn/6VKBVJhMax",
        "Dầu neem chotosan": "https://s.shopee.vn/3qJQKUktDI",
        "Sodium benzoate E211": "https://s.shopee.vn/2Vo2k6bDed",
        "Sữa tách kem skim milk": "https://s.shopee.vn/7VCihy5H71",
        "Vôi bột": "https://s.shopee.vn/6AhL7rL7I8",
        "Ranman": "https://s.shopee.vn/7AZsJoUIGG",
        "Captan hoặc Myclobutanil": "https://s.shopee.vn/3B3j71CwEb",
        "Myclobutanil hoặc Fenbuconazole": "https://s.shopee.vn/9padSDpxJ8",
        "Thuốc chứa Sulfur (Lưu huỳnh)": "https://s.shopee.vn/2Vo3wz0uWX",
        "Copper Oxychloride (COC 85)": "https://s.shopee.vn/3B3j71CwEb",
        "Streptomycin hoặc Kasugamycin": "https://s.shopee.vn/2BBCKBQjIM",
        "Lưu huỳnh (Sulfur dust)": "https://s.shopee.vn/8Klqw5bdOu",
        "Nước muối sinh lý loãng": "https://s.shopee.vn/5L8FKIdoHE",
        "Tinh dầu quế": "https://s.shopee.vn/1VvWmGUsZW",
        "Antracol": "https://s.shopee.vn/LjZOBMuaf",
        "Daconil": "https://s.shopee.vn/AADYU7bdGB",
        "Nano Bạc": "https://s.shopee.vn/9paehsU6ej",
        "Score (Difenoconazole)": "https://s.shopee.vn/4LFi9u7T4U",
        "Trichoderma bón lót": "https://s.shopee.vn/70GWhzHlVP",
        "Ridomil Gold": "https://s.shopee.vn/2BBGx9dQCz",
        "Infinito (Fluopicolide + Propamocarb)": "https://s.shopee.vn/6px6Voiey4",
        "Antracol (Propineb)": "https://s.shopee.vn/2BBGxN0yV5",
        "Daconil (Chlorothalonil)": "https://s.shopee.vn/AADYU7bdGB",
        "Sữa gầy (Skim milk) ngăn ngừa virus": "https://s.shopee.vn/8093uH9rkB",
        "Sữa tươi hoặc Baking Soda": "https://s.shopee.vn/9AL1ItFQwK",
        "Bacillus subtilis hoặc Dầu Neem": "https://s.shopee.vn/3qJUxGkPxj",
        "Actara (Thiamethoxam)": "https://s.shopee.vn/4fsbwCPXMn",
        "Dầu Neem": "https://s.shopee.vn/8ASU6oCNLz",
        "Phân bón chuyên dụng cho cây ưa acid": "https://s.shopee.vn/6px6WPHown",
        "Chelated Iron": "https://s.shopee.vn/1qYQZJldAi",
        "Baking Soda": "https://s.shopee.vn/9AL1ItFQwK",
        "Bacillus subtilis": "https://s.shopee.vn/BQCaQlfyn",
        "Anvil": "https://s.shopee.vn/2BBGyACBZa",
        "Topsin M": "https://s.shopee.vn/3qJUxGkPxj",
        "Bẫy dán": "https://s.shopee.vn/2LUhAadS8Z",
        "Phân Kali": "https://s.shopee.vn/50VSLWO5r3",
        "Phân bón lá vi lượng": "https://s.shopee.vn/50VSLfHz0a",
        "Mùn cưa phủ gốc": "https://s.shopee.vn/60NzXXvMiS",
        "Dung dịch Bordeaux": "https://s.shopee.vn/gMTBrulmz"
    }
    
    try:
        print("🔗 Updating affiliate links...")
        updated_count = 0
        
        async for treatment in treatments_collection.find():
            product_name = treatment.get('product_name', '')
            if product_name in affiliate_mapping:
                await treatments_collection.update_one(
                    {"_id": treatment["_id"]},
                    {"$set": {"affiliate_url": affiliate_mapping[product_name]}}
                )
                updated_count += 1
                print(f"✅ Updated affiliate URL for: {product_name}")
        
        print(f"🔗 Updated affiliate URLs for {updated_count} products")
        
    except Exception as e:
        print(f"❌ Error updating affiliate links: {e}")

if __name__ == "__main__":
    import asyncio
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "update":
            asyncio.run(update_treatments())
        elif command == "import_all":
            asyncio.run(import_all_treatments_from_seed_data())
        elif command == "update_affiliate":
            asyncio.run(update_affiliate_links())
        elif command == "full_import":
            asyncio.run(import_all_treatments_from_seed_data())
            asyncio.run(update_affiliate_links())
        else:
            print("Available commands: update, import_all, update_affiliate, full_import")
    else:
        asyncio.run(seed_treatments())
