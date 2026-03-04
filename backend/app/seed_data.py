DISEASES_SEED_DATA = [
    {
        "name": "Common_rust",
        "common_name": "Gỉ sắt ngô (Common Rust)",
        "description": "Bệnh do nấm Puccinia sorghi gây ra, thường xuất hiện trong điều kiện ẩm ướt.",
        "symptoms": ["Các ổ nấm màu nâu đỏ xuất hiện trên cả hai mặt lá", "Lá có thể bị vàng và khô héo"],
        "treatments": [
            {"level": "Mild", "action": "Tỉa bỏ lá nhiễm bệnh, tạo thông thoáng", "product": "Lưu huỳnh (Sulfur dust)"},
            {"level": "Moderate", "action": "Phun thuốc kháng nấm định kỳ", "product": "Chlorothalonil hoặc Mancozeb"},
            {"level": "Severe", "action": "Tiêu hủy cây bị nặng, luân canh cây trồng", "product": "Thuốc đặc trị nhóm Triazole"}
        ]
    },
    {
        "name": "Fall-Army-Worm",
        "common_name": "Sâu keo mùa thu (Fall Armyworm)",
        "description": "Loài sâu hại nguy hiểm có khả năng tàn phá diện rộng cây lương thực.",
        "symptoms": ["Lá bị cắn rách tả tơi", "Phân sâu (mùn cưa) đọng ở nách lá", "Sâu ẩn nấp trong loa kèn"],
        "treatments": [
            {"level": "Mild", "action": "Bắt sâu bằng tay, bón phân cân đối", "product": "Chế phẩm Bacillus thuringiensis (Bt)"},
            {"level": "Moderate", "action": "Sử dụng bẫy bả, phun thảo mộc", "product": "Dịch chiết Neem oil"},
            {"level": "Severe", "action": "Phun thuốc hóa học đặc trị sâu keo", "product": "Emamectin benzoate hoặc Spinetoram"}
        ]
    },
    {
        "name": "Lethal_necrotic",
        "common_name": "Bệnh hoại tử ngô (Maize Lethal Necrosis)",
        "description": "Bệnh cực kỳ nguy hiểm do sự kết hợp của hai loại virus (MCMV và SCMV).",
        "symptoms": ["Lá vàng từ mép vào trong", "Hoại tử dọc theo gân lá", "Cây còi cọc, bắp bị lép"],
        "treatments": [
            {"level": "Mild", "action": "Nhổ bỏ cây nghi nhiễm ngay lập tức", "product": "Không có thuốc chữa (Virus)"},
            {"level": "Moderate", "action": "Kiểm soát côn trùng môi giới (bọ trĩ, rệp)", "product": "Thuốc trừ sâu nhóm Neonicotinoid"},
            {"level": "Severe", "action": "Phá bỏ toàn bộ ruộng nếu nhiễm trên 50%", "product": "Luân canh cây không cùng họ (Đậu, Lạc)"}
        ]
    },
    {
        "name": "Magnezium_deficiency",
        "common_name": "Thiếu Magie (Magnesium Deficiency)",
        "description": "Rối loạn dinh dưỡng làm giảm khả năng quang hợp của cây.",
        "symptoms": ["Vàng lá giữa các gân (Interveinal chlorosis)", "Lá già bị ảnh hưởng trước", "Mép lá có thể chuyển màu đỏ hoặc tím"],
        "treatments": [
            {"level": "Mild", "action": "Bón bổ sung phân bón lá chứa Magie", "product": "Magnesium Sulfate (Epsom salt)"},
            {"level": "Moderate", "action": "Bón phân bón gốc chứa hàm lượng Magie cao", "product": "Phân Kieserite (MgSO4.H2O)"},
            {"level": "Severe", "action": "Điều chỉnh pH đất, bón vôi Dolomite", "product": "Vôi Dolomite (CaMg(CO3)2)"}
        ]
    },
    {
        "name": "Maize_aphids",
        "common_name": "Rệp ngô (Maize Aphids)",
        "description": "Côn trùng chích hút dịch cây và truyền bệnh virus.",
        "symptoms": ["Rệp bám dày đặc ở nõn và bắp ngô", "Lá bị xoăn lại và dính dịch ngọt", "Xuất hiện nấm muội đen"],
        "treatments": [
            {"level": "Mild", "action": "Tưới nước áp lực cao để rửa trôi rệp", "product": "Nước xà phòng loãng"},
            {"level": "Moderate", "action": "Dùng thiên địch hoặc dầu thảo mộc", "product": "Dầu khoáng (Mineral oil) hoặc Neem"},
            {"level": "Severe", "action": "Sử dụng thuốc trừ sâu lưu dẫn", "product": "Imidacloprid hoặc Thiamethoxam"}
        ]
    },
    {
        "name": "Maize_blight",
        "common_name": "Bệnh cháy lá ngô (Maize Blight)",
        "description": "Bệnh do nấm Exserohilum turcicum gây ra trong thời tiết mát và ẩm.",
        "symptoms": ["Vết bệnh hình thoi, màu xám hoặc nâu", "Các vết loét lớn chạy dọc theo gân lá", "Lá khô cháy sớm"],
        "treatments": [
            {"level": "Mild", "action": "Loại bỏ lá gốc bị bệnh, làm sạch cỏ", "product": "Dịch chiết tỏi hoặc gừng"},
            {"level": "Moderate", "action": "Phun thuốc phòng trừ nấm", "product": "Propiconazole hoặc Azoxystrobin"},
            {"level": "Severe", "action": "Sử dụng giống kháng bệnh cho vụ sau", "product": "Mancozeb phối hợp với nấm đối kháng Trichoderma"}
        ]
    },
    {
        "name": "Phosphorus_deficiency",
        "common_name": "Thiếu Phốt pho (Phosphorus Deficiency)",
        "description": "Thiếu hụt lân làm cây sinh trưởng kém, rễ yếu.",
        "symptoms": ["Lá già chuyển màu tím hoặc đỏ tía", "Cây nhỏ, còi cọc", "Trổ hoa chậm"],
        "treatments": [
            {"level": "Mild", "action": "Phun phân bón lá giàu lân", "product": "Phân bón lá NPK (ví dụ: 10-60-10)"},
            {"level": "Moderate", "action": "Bón thúc phân lân cho cây", "product": "Phân DAP hoặc Super lân"},
            {"level": "Severe", "action": "Cải tạo đất định kỳ bằng phân hữu cơ", "product": "Phân lân nung chảy (Văn Điển)"}
        ]
    },
    {
        "name": "Physoderma_brown_spot",
        "common_name": "Đốm nâu Physoderma (Physoderma Brown Spot)",
        "description": "Bệnh thường thấy trên thân và gân lá ngô dưới tác động của độ ẩm cao.",
        "symptoms": ["Vết đốm nhỏ màu vàng hoặc nâu tím ở bẹ lá", "Gân chính có các hạt nhỏ lồi lên", "Thân cây bị yếu, dễ gãy"],
        "treatments": [
            {"level": "Mild", "action": "Dọn dẹp tàn dư cây trồng sau vụ thu hoạch", "product": "Vôi bột khử trùng đất"},
            {"level": "Moderate", "action": "Giảm mật độ trồng, tưới nước hợp lý", "product": "Thuốc trừ nấm chứa gốc đồng (Copper Oxichloride)"},
            {"level": "Severe", "action": "Sử dụng thuốc hóa học khi bệnh lan rộng", "product": "Tebuconazole hoặc Pyraclostrobin"}
        ]
    },
    {
        "name": "Streak_virus",
        "common_name": "Virus sọc lá (Maize Streak Virus)",
        "description": "Bệnh do virus lây truyền bởi rầy xanh (Leafhoppers).",
        "symptoms": ["Các sọc nhỏ màu vàng nhạt chạy dọc lá", "Cây bị lùn, lá nhỏ lại", "Bắp không kết hạt được"],
        "treatments": [
            {"level": "Mild", "action": "Tiêu diệt bọ rầy môi giới", "product": "Bẫy dính màu vàng"},
            {"level": "Moderate", "action": "Sử dụng chế phẩm sinh học diệt rầy", "product": "Nấm Beauveria bassiana"},
            {"level": "Severe", "action": "Nhổ bỏ cây bệnh, chuyển sang giống kháng MSV", "product": "Thuốc diệt rầy nồng độ cao"}
        ]
    },
    {
        "name": "Apple Scab Leaf",
        "common_name": "Bệnh ghẻ lá táo (Apple Scab)",
        "description": "Bệnh do nấm Venturia inaequalis gây ra, ảnh hưởng nặng đến năng suất táo.",
        "symptoms": ["Vết bệnh màu nâu đen tròn, hơi lồi", "Lá bị biến dạng, nhăn nheo", "Lá rụng sớm"],
        "treatments": [
            {"level": "Mild", "action": "Quét dọn lá rụng, tưới nước gốc", "product": "Nước vôi trong"},
            {"level": "Moderate", "action": "Phun thuốc kháng nấm khi chồi nở", "product": "Captan hoặc Myclobutanil"},
            {"level": "Severe", "action": "Áp dụng lịch trình phun thuốc nghiêm ngặt", "product": "Difenoconazole (Anvil)"}
        ]
    },
    {
        "name": "Apple leaf",
        "common_name": "Lá táo khỏe mạnh (Healthy Apple Leaf)",
        "description": "Lá táo ở trạng thái phát triển tốt nhất.",
        "symptoms": ["Màu xanh lục đều, bề mặt nhẵn", "Không có vết đốm hay sâu bệnh"],
        "treatments": [
            {"level": "Mild", "action": "Tiếp tục chăm sóc định kỳ", "product": "Phân hữu cơ vi sinh"},
            {"level": "Moderate", "action": "Kiểm tra sâu bệnh thường xuyên", "product": "Nước sạch"},
            {"level": "Severe", "action": "Giữ vững chế độ bón phân", "product": "N/A"}
        ]
    },
    {
        "name": "Apple rust leaf",
        "common_name": "Bệnh gỉ sắt táo (Cedar Apple Rust)",
        "description": "Nấm Gymnosporangium juniperi-virginianae gây ra các vết cam nổi bật.",
        "symptoms": ["Các đốm màu cam sáng ở mặt trên lá", "Dưới mặt lá có các gai nấm nhỏ", "Lá bị rụng hàng loạt"],
        "treatments": [
            {"level": "Mild", "action": "Loại bỏ cây chủ phụ (cây bách) lân cận", "product": "Tỉa cành thủ công"},
            {"level": "Moderate", "action": "Phun khi lá non vừa nhú", "product": "Thuốc chứa Sulfur (Lưu huỳnh)"},
            {"level": "Severe", "action": "Sử dụng thuốc kháng nấm mạnh", "product": "Myclobutanil hoặc Fenbuconazole"}
        ]
    },
    {
        "name": "Bell_pepper leaf spot",
        "common_name": "Đốm lá ớt chuông (Bell Pepper Leaf Spot)",
        "description": "Thường do vi khuẩn Xanthomonas gây ra trong môi trường nóng ẩm.",
        "symptoms": ["Các đốm nhỏ sũng nước, sau khô lại màu nâu", "Mép lá bị cháy", "Hoa và quả rụng"],
        "treatments": [
            {"level": "Mild", "action": "Tránh tưới nước trực tiếp lên lá", "product": "Dịch chiết hành tây"},
            {"level": "Moderate", "action": "Phun chế phẩm đồng diệt khuẩn", "product": "Copper Oxychloride (COC 85)"},
            {"level": "Severe", "action": "Nhổ cây bệnh, dừng bón phân đạm quá mức", "product": "Streptomycin hoặc Kasugamycin"}
        ]
    },
    {
        "name": "Bell_pepper leaf",
        "common_name": "Lá ớt chuông khỏe mạnh (Healthy Pepper Leaf)",
        "description": "Cây ớt chuông phát triển ổn định.",
        "symptoms": ["Lá xanh bóng, cứng cáp", "Không có triệu chứng héo hay đốm"],
        "treatments": [
            {"level": "Mild", "action": "Duy trì độ ẩm đất", "product": "Phân NPK cân đối"},
            {"level": "Moderate", "action": "Duy trì độ ẩm đất", "product": "Phân NPK cân đối"},
            {"level": "Severe", "action": "Duy trì độ ẩm đất", "product": "Phân NPK cân đối"}
        ]
    },
    {
        "name": "Blueberry leaf",
        "common_name": "Lá việt quất (Blueberry Leaf)",
        "description": "Phân tích trạng thái lá cây việt quất.",
        "symptoms": ["Nhìn chung xanh tốt, có thể có sẹo nhỏ tự nhiên"],
        "treatments": [
            {"level": "Mild", "action": "Theo dõi độ pH đất (4.5-5.5)", "product": "Phân bón chuyên dụng cho cây ưa acid"},
            {"level": "Moderate", "action": "Kiểm tra sâu đục cành", "product": "Dầu Neem"},
            {"level": "Severe", "action": "Bổ sung sắt nếu lá có dấu hiệu bạc màu", "product": "Chelated Iron"}
        ]
    },
    {
        "name": "Cherry leaf",
        "common_name": "Lá anh đào (Cherry Leaf)",
        "description": "Lá cây anh đào khỏe mạnh.",
        "symptoms": ["Lá xanh đậm, có răng cưa mép lá đều", "Cành chắc khỏe"],
        "treatments": [
            {"level": "Mild", "action": "Tưới nước đều đặn vào buổi sáng", "product": "Nước sạch"},
            {"level": "Moderate", "action": "Bón phân hữu cơ quanh gốc", "product": "Phân chuồng hoai mục"},
            {"level": "Severe", "action": "Cắt tỉa cành khô, cành vượt", "product": "Kéo cắt cành"}
        ]
    },
    {
        "name": "Corn Gray leaf spot",
        "common_name": "Đốm xám ngô (Gray Leaf Spot)",
        "description": "Bệnh do nấm Cercospora zeae-maydis, rất phổ biến ở vùng canh tác ngô.",
        "symptoms": ["Các vết bệnh hình chữ nhật kéo dài giữa hai gân lá", "Màu xám nâu sáng", "Vết bệnh làm chết cả lá"],
        "treatments": [
            {"level": "Mild", "action": "Luân canh cây trồng (với đậu)", "product": "Dọn dẹp tàn dư rơm rạ"},
            {"level": "Moderate", "action": "Phun khi thấy vết bệnh đầu tiên", "product": "Propiconazole"},
            {"level": "Severe", "action": "Sử dụng thuốc nồng độ cao hoặc giống kháng", "product": "Pyraclostrobin (Headline)"}
        ]
    },
    {
        "name": "Corn leaf blight",
        "common_name": "Bệnh cháy lá ngô (Corn Northern Leaf Blight)",
        "description": "Bệnh thối/cháy lá ngô phương Bắc.",
        "symptoms": ["Vết bệnh hình thoi dài 2.5-15cm", "Màu xám xanh hoặc cà phê sữa", "Xuất hiện lớp bột nấm màu xám khi ẩm"],
        "treatments": [
            {"level": "Mild", "action": "Tiêu hủy gốc rạ sau vụ", "product": "Trichoderma"},
            {"level": "Moderate", "action": "Phun thuốc nấm khi cây trổ cờ", "product": "Mancozeb hoặc Zineb"},
            {"level": "Severe", "action": "Phun nhắc lại sau 10 ngày nếu bệnh nặng", "product": "Amistar Top (Azoxystrobin + Difenoconazole)"}
        ]
    },
    {
        "name": "Corn rust leaf",
        "common_name": "Bệnh gỉ sắt ngô (Corn Leaf Rust)",
        "description": "Dạng bệnh gỉ sắt khác thường gặp trên lá ngô.",
        "symptoms": ["Các mụn nhỏ li ti chứa bào tử bột màu vàng cam", "Cây yếu rũ, lá nhanh khô"],
        "treatments": [
            {"level": "Mild", "action": "Kiểm tra độ thoáng của ruộng", "product": "Phun nước xà phòng"},
            {"level": "Moderate", "action": "Phun thuốc kháng nấm nhóm Triazole", "product": "Tebuconazole"},
            {"level": "Severe", "action": "Phun kết hợp gốc Đồng và Sulfur", "product": "Dung dịch Bordeaux"}
        ]
    },
    {
        "name": "Peach leaf",
        "common_name": "Lá đào (Peach Leaf)",
        "description": "Trạng thái lá đào bình thường.",
        "symptoms": ["Lá thon dài, xanh mượt", "Không bị sần hay xoăn"],
        "treatments": [
            {"level": "Mild", "action": "Phòng trừ sâu ăn lá", "product": "Chế phẩm Bt"},
            {"level": "Moderate", "action": "Xới đất quanh gốc cho tơi xốp", "product": "Phân hữu cơ khoáng"},
            {"level": "Severe", "action": "Phòng bệnh xoăn lá sớm", "product": "Phun Copper Sulfate khi mùa đông kết thúc"}
        ]
    },
    {
        "name": "Potato leaf early blight",
        "common_name": "Bệnh lở cổ rễ/Đốm vòng khoai tây (Early Blight)",
        "description": "Do nấm Alternaria solani gây ra, tấn công các lá già trước.",
        "symptoms": ["Các đốm đen có vòng đồng tâm như bia bắn", "Lá chuyển vàng và rụng sớm", "Lây sang cả củ"],
        "treatments": [
            {"level": "Mild", "action": "Duy trì bón phân đầy đủ, tránh thiếu đạm", "product": "Phân bón đạm (Urea) vừa đủ"},
            {"level": "Moderate", "action": "Tưới nước nhỏ giọt, tránh ướt lá", "product": "Chlorothalonil"},
            {"level": "Severe", "action": "Áp dụng hóa chất diệt nấm phổ rộng", "product": "Mancozeb hoặc Azoxystrobin (Ridomil Gold)"}
        ]
    },
    {
        "name": "Potato leaf late blight",
        "common_name": "Bệnh mốc sương khoai tây (Late Blight)",
        "description": "Bệnh nguy hiểm nhất trên khoai tây do Phytophthora infestans gây ra.",
        "symptoms": ["Vết bệnh sũng nước ở mép lá", "Lớp mốc trắng mịn ở mặt dưới lá khi ẩm", "Cây thối nhũn nhanh chóng"],
        "treatments": [
            {"level": "Mild", "action": "Loại bỏ mầm bệnh, tiêu hủy nhanh", "product": "Rắc vôi bột"},
            {"level": "Moderate", "action": "Phun thuốc phòng ngay khi thời tiết mưa ẩm", "product": "Mancozeb phối hợp Metalaxyl"},
            {"level": "Severe", "action": "Sử dụng thuốc đặc trị dòng Cyazofamid", "product": "Ranman hoặc Revus"}
        ]
    },
    {
        "name": "Potato leaf",
        "common_name": "Lá khoai tây khỏe mạnh (Healthy Potato Leaf)",
        "description": "Lá khoai tây phát triển bình thường.",
        "symptoms": ["Lá xanh, bóng, không có vết thâm", "Cây mọc khỏe"],
        "treatments": [
            {"level": "Mild", "action": "Theo dõi sâu vẽ bùa", "product": "Bẫy dán"},
            {"level": "Moderate", "action": "Vun gốc tăng diện tích củ", "product": "Phân Kali"},
            {"level": "Severe", "action": "Duy trì quản lý nước tốt", "product": "N/A"}
        ]
    },
    {
        "name": "Raspberry leaf",
        "common_name": "Lá mâm xôi (Raspberry Leaf)",
        "description": "Trạng thái lá mâm xôi khỏe mạnh.",
        "symptoms": ["Lá kép lông chim, xanh tươi", "Cành mọc xuôi đều"],
        "treatments": [
            {"level": "Mild", "action": "Tỉa bỏ các cành già đã cho quả", "product": "Phân bón lá vi lượng"},
            {"level": "Moderate", "action": "Quản lý độ ẩm gốc", "product": "Mùn cưa phủ gốc"},
            {"level": "Severe", "action": "Sử dụng thuốc nấm phòng trừ rỉ sắt", "product": "Dung dịch Bordeaux"}
        ]
    },
    {
        "name": "Soyabean leaf",
        "common_name": "Lá đậu nành (Soybean Leaf)",
        "description": "Sức khỏe lá cây đậu tương/đậu nành.",
        "symptoms": ["Lá xanh đều, không bị thủng do sâu"],
        "treatments": [
            {"level": "Mild", "action": "Bón lân tăng cường phát triển rễ", "product": "Supe lân"},
            {"level": "Moderate", "action": "Kiểm tra rệp sáp đầu vụ", "product": "Phun nước áp lực"},
            {"level": "Severe", "action": "Duy trì thoát nước tốt", "product": "N/A"}
        ]
    },
    {
        "name": "Soybean leaf",
        "common_name": "Lá đậu nành (Soybean Leaf)",
        "description": "Sức khỏe lá cây đậu tương (lớp dữ liệu tương tự).",
        "symptoms": ["Lá xanh tốt, quang hợp mạnh mẽ"],
        "treatments": [
            {"level": "Mild", "action": "Kiểm tra tình trạng đất", "product": "Phân chuồng"},
            {"level": "Moderate", "action": "Duy trì độ ẩm trung bình", "product": "Nước sạch"},
            {"level": "Severe", "action": "Bón phân đa trung vi lượng", "product": "NPK + TE"}
        ]
    },
    {
        "name": "Squash Powdery mildew leaf",
        "common_name": "Phấn trắng bí ngô (Squash Powdery Mildew)",
        "description": "Lớp bột trắng như phấn phủ lên lá bí, làm giảm năng suất.",
        "symptoms": ["Lớp phấn trắng bao phủ bề mặt lá", "Lá có thể bị khô vàng và giòn", "Dây bí kém phát triển"],
        "treatments": [
            {"level": "Mild", "action": "Phun hỗn hợp sữa tươi và nước (tỷ lệ 1:9)", "product": "Sữa tươi hoặc Baking soda"},
            {"level": "Moderate", "action": "Sử dụng chế phẩm sinh học", "product": "Bacillus subtilis hoặc Dầu Neem"},
            {"level": "Severe", "action": "Dùng thuốc trừ nấm gốc Sulfur hoặc Triazole", "product": "Anvil hoặc Topsin M"}
        ]
    },
    {
        "name": "Strawberry leaf",
        "common_name": "Lá dâu tây (Strawberry Leaf)",
        "description": "Lá dâu tây trong trạng thái xanh tốt.",
        "symptoms": ["Lá xanh bóng đẹp, mép lá không bị cháy đen"],
        "treatments": [
            {"level": "Mild", "action": "Vệ sinh cỏ dại quanh gốc", "product": "Nước muối sinh lý loãng"},
            {"level": "Moderate", "action": "Bổ sung phân bón Kali cho quả", "product": "Kali trắng (K2SO4)"},
            {"level": "Severe", "action": "Thường xuyên dọn lá già để tránh nấm", "product": "Vôi bột"}
        ]
    },
    {
        "name": "Tomato Early blight leaf",
        "common_name": "Đốm vòng cà chua (Tomato Early Blight)",
        "description": "Do nấm Alternaria solani, tạo vết đen đồng tâm.",
        "symptoms": ["Vết bệnh màu đen hoặc nâu có vòng đồng tâm", "Thường bắt đầu từ lá già phía dưới", "Lá vàng nhanh và rụng"],
        "treatments": [
            {"level": "Mild", "action": "Phun chế phẩm sinh học định kỳ", "product": "Nano Bạc"},
            {"level": "Moderate", "action": "Tỉa bỏ lá sát mặt đất", "product": "Mancozeb"},
            {"level": "Severe", "action": "Phun phối hợp thuốc trị nấm nội hấp", "product": "Score (Difenoconazole)"}
        ]
    },
    {
        "name": "Tomato Septoria leaf spot",
        "common_name": "Đốm lá Septoria cà chua (Septoria Leaf Spot)",
        "description": "Nấm gây ra nhiều đốm nhỏ, tâm xám viền nâu.",
        "symptoms": ["Nhiều đốm nhỏ hình tròn màu xám trắng viền đen", "Đốm bệnh mọc dày đặc gây chết lá", "Lá rụng gốc lên ngọn"],
        "treatments": [
            {"level": "Mild", "action": "Tránh tưới nước vào lá khi trời tối", "product": "Tinh dầu quế"},
            {"level": "Moderate", "action": "Vệ sinh thật sạch rơm rạ phủ gốc", "product": "Antracol (Propineb)"},
            {"level": "Severe", "action": "Dùng thuốc đặc trị nấm mốc", "product": "Daconil (Chlorothalonil)"}
        ]
    },
    {
        "name": "Tomato leaf bacterial spot",
        "common_name": "Đốm đen vi khuẩn cà chua (Bacterial Spot)",
        "description": "Vi khuẩn Xanthomonas vesicatoria gây ra.",
        "symptoms": ["Đốm nhỏ đen, cứng, sần sùi trên lá và quả", "Vết bệnh lan nhanh khi mưa nhiều", "Lá chuyển vàng và khô"],
        "treatments": [
            {"level": "Mild", "action": "Sử dụng hạt giống sạch bệnh, ngâm nước ấm", "product": "Dung dịch Nano Đồng"},
            {"level": "Moderate", "action": "Phun thuốc kháng khuẩn sinh học", "product": "Kasumin (Kasugamycin)"},
            {"level": "Severe", "action": "Phun hỗn hợp Đồng và Mancozeb", "product": "Kocide + Mancozeb"}
        ]
    },
    {
        "name": "Tomato leaf late blight",
        "common_name": "Bệnh mốc sương cà chua (Tomato Late Blight)",
        "description": "Bệnh rất nguy hiểm, có thể làm chết cả ruộng cà chua sau vài ngày.",
        "symptoms": ["Vết loét sũng nước màu xanh đen", "Dưới lá có tơ nấm trắng khi trời ẩm", "Hoa quả thối nhũn đen"],
        "treatments": [
            {"level": "Mild", "action": "Kiểm tra kỹ cây giống ban đầu", "product": "Trichoderma bón lót"},
            {"level": "Moderate", "action": "Phun nhắc lại mỗi 7 ngày", "product": "Ridomil Gold"},
            {"level": "Severe", "action": "Dùng thuốc nội hấp cực mạnh", "product": "Infinito (Fluopicolide + Propamocarb)"}
        ]
    },
    {
        "name": "Tomato leaf mosaic virus",
        "common_name": "Virus khảm cà chua (Tomato Mosaic Virus - ToMV)",
        "description": "Virus lây lan qua hạt giống, công cụ và côn trùng.",
        "symptoms": ["Lá lốm đốm xanh vàng (khảm)", "Lá biến dạng giống hình sợi chỉ", "Cây còi cọc, quả kém phát triển"],
        "treatments": [
            {"level": "Mild", "action": "Rửa tay bằng sà phòng sau khi chạm cây bệnh", "product": "Sữa gầy (Skim milk) ngăn virus"},
            {"level": "Moderate", "action": "Tiêu diệt côn trùng truyền bệnh rầy, rệp", "product": "Actara (Thiamethoxam)"},
            {"level": "Severe", "action": "Nhổ toàn bộ cây bệnh, khử trùng dụng cụ", "product": "Dừng canh tác cây họ cà một vụ"}
        ]
    },
    {
        "name": "Tomato leaf yellow virus",
        "common_name": "Virus vàng lá cà chua (Tomato Yellow Leaf Curl Virus - TYLCV)",
        "description": "Virus do bọ phấn trắng truyền, làm lá cuốn và vàng.",
        "symptoms": ["Lá vàng rõ rệt ở ngọn, lá non bị nhỏ lại", "Mép lá cuốn ngược lên trên", "Cây ngừng sinh trưởng"],
        "treatments": [
            {"level": "Mild", "action": "Dùng lưới chắn bọ phấn trắng", "product": "Lưới mắt nhỏ"},
            {"level": "Moderate", "action": "Phun dầu khoáng để bọ phấn không đậu", "product": "Dầu khoáng SK Enspray"},
            {"level": "Severe", "action": "Kiểm soát bọ phấn tuyệt đối bằng thuốc mạnh", "product": "Pymetrozine (Chess)"}
        ]
    },
    {
        "name": "Tomato leaf",
        "common_name": "Lá cà chua khỏe mạnh (Healthy Tomato Leaf)",
        "description": "Lá cà chua bình thường, sinh trưởng tốt.",
        "symptoms": ["Cành lá xanh mướt, hoa đậu tốt"],
        "treatments": [
            {"level": "Mild", "action": "Duy trì bón phân hữu cơ", "product": "Dịch trùn quế"},
            {"level": "Moderate", "action": "Làm sạch cỏ dại", "product": "Công cụ thủ công"},
            {"level": "Severe", "action": "Tỉa cành tạo độ thoáng", "product": "Kéo tỉa"}
        ]
    },
    {
        "name": "Tomato mold leaf",
        "common_name": "Nấm mốc lá cà chua (Leaf Mold)",
        "description": "Bệnh do nấm Fulvia fulva gây ra trong môi trường độ ẩm cực cao.",
        "symptoms": ["Mặt trên lá có đốm vàng nhạt, mặt dưới có lớp mốc lục/xám", "Lá khô rụng nhưng không héo", "Thường xuất hiện trong nhà màng"],
        "treatments": [
            {"level": "Mild", "action": "Tăng cường thông gió nhà màng", "product": "Quạt thông gió"},
            {"level": "Moderate", "action": "Sử dụng thuốc kháng nấm phổ rộng", "product": "Chlorothalonil"},
            {"level": "Severe", "action": "Cần can thiệp thuốc đặc trị hóa học", "product": "Azoxystrobin phối hợp Cyproconazole"}
        ]
    },
    {
        "name": "Tomato two spotted spider mites leaf",
        "common_name": "Nhện đỏ cà chua (Two-spotted Spider Mite)",
        "description": "Nhện chích hút làm lá biến màu và khô.",
        "symptoms": ["Các đốm trắng li ti trên lá", "Lá nhạt màu, có màng nhện mỏng mặt dưới", "Lá bị cháy vàng cánh đồng"],
        "treatments": [
            {"level": "Mild", "action": "Phun nước xịt mạnh mặt dưới lá", "product": "Nước sạch"},
            {"level": "Moderate", "action": "Dùng dầu thảo mộc hoặc xà phòng", "product": "Neem oil hoặc Salicylic acid"},
            {"level": "Severe", "action": "Sử dụng thuốc đặc trị nhện", "product": "Abamectin hoặc Spiromesifen"}
        ]
    },
    {
        "name": "grape leaf black rot",
        "common_name": "Bệnh thối đen lá nho (Grape Black Rot)",
        "description": "Nấm Guignardia bidwellii gây hại cho cả lá và quả nho.",
        "symptoms": ["Vết đốm tròn màu nâu có viền đen đậm", "Các điểm đen nhỏ li ti trong tâm vết bệnh", "Quả bị héo khô như nho khô"],
        "treatments": [
            {"level": "Mild", "action": "Dọn dẹp lá và quả khô rụng", "product": "Vệ sinh đồng ruộng"},
            {"level": "Moderate", "action": "Phun thuốc nấm ngay sau khi trổ hoa", "product": "Mancozeb"},
            {"level": "Severe", "action": "Phun nhắc lại định kỳ 10-14 ngày", "product": "Systhane (Myclobutanil)"}
        ]
    },
    {
        "name": "grape leaf",
        "common_name": "Lá nho khỏe mạnh (Healthy Grape Leaf)",
        "description": "Lá nho ở trạng thái tốt.",
        "symptoms": ["Lá xanh đậm, mọng nước, không bị rỉ sắt"],
        "treatments": [
            {"level": "Mild", "action": "Bón phân đa vi lượng định kỳ", "product": "Phân bón NPK 15-15-15"},
            {"level": "Moderate", "action": "Tưới nước gốc, hạn chế ướt lá", "product": "Hệ thống tưới nhỏ giọt"},
            {"level": "Severe", "action": "Kiểm tra sâu đục thân sớm", "product": "Thuốc tẩm gốc sinh học"}
        ]
    }
]
