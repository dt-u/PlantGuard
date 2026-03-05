DISEASES_SEED_DATA = [
    {
        "name": "Common_rust",
        "common_name": "Gỉ sắt ngô (Common Rust)",
        "description": "Bệnh do nấm Puccinia sorghi gây ra, thường xuất hiện trong điều kiện ẩm ướt.",
        "symptoms": ["Các ổ nấm màu nâu đỏ xuất hiện trên cả hai mặt lá", "Lá có thể bị vàng và khô héo"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Chỉ xuất hiện vài đốm nhỏ rải rác trên một vài lá dưới.", "action": "Tỉa bỏ lá nhiễm bệnh, tạo thông thoáng", "product": "Lưu huỳnh (Sulfur dust)"},
            {"level": "Moderate", "identification_guide": "Đốm nấm xuất hiện nhiều hơn, lan lên các lá giữa, mật độ đốm dày đặc.", "action": "Phun thuốc kháng nấm định kỳ", "product": "Chlorothalonil hoặc Mancozeb"},
            {"level": "Severe", "identification_guide": "Toàn bộ lá bị phủ kín bởi các ổ nấm, lá khô cháy và rụng sớm.", "action": "Tiêu hủy cây bị nặng, luân canh cây trồng", "product": "Thuốc đặc trị nhóm Triazole"}
        ]
    },
    {
        "name": "Fall-Army-Worm",
        "common_name": "Sâu keo mùa thu (Fall Armyworm)",
        "description": "Loài sâu hại nguy hiểm có khả năng tàn phá diện rộng cây lương thực.",
        "symptoms": ["Lá bị cắn rách tả tơi", "Phân sâu (mùn cưa) đọng ở nách lá", "Sâu ẩn nấp trong loa kèn"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Thấy vết xước nhỏ trên lá, có ít phân sâu ở nõn, mật độ sâu thấp.", "action": "Bắt sâu bằng tay, bón phân cân đối", "product": "Chế phẩm Bacillus thuringiensis (Bt)"},
            {"level": "Moderate", "identification_guide": "Lá bắt đầu bị thủng lỗ lớn, thấy sâu non xuất hiện, nõn cây có nhiều mùn cưa.", "action": "Sử dụng bẫy bả, phun thảo mộc", "product": "Dịch chiết Neem oil"},
            {"level": "Severe", "identification_guide": "Lá bị ăn cụt, sâu ăn vào điểm tăng trưởng làm chết nõn, mật độ sâu dày đặc.", "action": "Phun thuốc hóa học đặc trị sâu keo", "product": "Emamectin benzoate hoặc Spinetoram"}
        ]
    },
    {
        "name": "Lethal_necrotic",
        "common_name": "Bệnh hoại tử ngô (Maize Lethal Necrosis)",
        "description": "Bệnh cực kỳ nguy hiểm do sự kết hợp của hai loại virus (MCMV và SCMV).",
        "symptoms": ["Lá vàng từ mép vào trong", "Hoại tử dọc theo gân lá", "Cây còi cọc, bắp bị lép"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Cây có dấu hiệu vàng lá nhẹ ở ngọn hoặc mép lá non.", "action": "Nhổ bỏ cây nghi nhiễm ngay lập tức", "product": "Không có thuốc chữa (Virus)"},
            {"level": "Moderate", "identification_guide": "Các vết hoại tử bắt đầu xuất hiện rõ dọc theo gân lá, cây có dấu hiệu lùn.", "action": "Kiểm soát côn trùng môi giới (bọ trĩ, rệp)", "product": "Thuốc trừ sâu nhóm Neonicotinoid"},
            {"level": "Severe", "identification_guide": "Toàn bộ cây bị cháy khô từ ngọn xuống, bắp không phát triển hoặc bị thối.", "action": "Phá bỏ toàn bộ ruộng nếu nhiễm trên 50%", "product": "Luân canh cây không cùng họ (Đậu, Lạc)"}
        ]
    },
    {
        "name": "Magnezium_deficiency",
        "common_name": "Thiếu Magie (Magnesium Deficiency)",
        "description": "Rối loạn dinh dưỡng làm giảm khả năng quang hợp của cây.",
        "symptoms": ["Vàng lá giữa các gân (Interveinal chlorosis)", "Lá già bị ảnh hưởng trước", "Mép lá có thể chuyển màu đỏ hoặc tím"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Chỉ có các lá già dưới cùng có sọc vàng nhẹ giữa gân xanh.", "action": "Bón bổ sung phân bón lá chứa Magie", "product": "Magnesium Sulfate (Epsom salt)"},
            {"level": "Moderate", "identification_guide": "Nhiều lá ở thân dưới bị vàng đậm, mép lá bắt đầu chuyển đỏ/tím.", "action": "Bón phân bón gốc chứa hàm lượng Magie cao", "product": "Phân Kieserite (MgSO4.H2O)"},
            {"level": "Severe", "identification_guide": "Vàng lá lan lên gần ngọn, lá già bị khô chết hoàn toàn.", "action": "Điều chỉnh pH đất, bón vôi Dolomite", "product": "Vôi Dolomite (CaMg(CO3)2)"}
        ]
    },
    {
        "name": "Maize_aphids",
        "common_name": "Rệp ngô (Maize Aphids)",
        "description": "Côn trùng chích hút dịch cây và truyền bệnh virus.",
        "symptoms": ["Rệp bám dày đặc ở nõn và bắp ngô", "Lá bị xoăn lại và dính dịch ngọt", "Xuất hiện nấm muội đen"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Thấy vài cụm rệp nhỏ ở nách lá hoặc nõn cây.", "action": "Tưới nước áp lực cao để rửa trôi rệp", "product": "Nước xà phòng loãng"},
            {"level": "Moderate", "identification_guide": "Rệp bám thành mảng lớn, lá bắt đầu bị biến dạng và có dịch dính.", "action": "Dùng thiên địch hoặc dầu thảo mộc", "product": "Dầu khoáng (Mineral oil) hoặc Neem"},
            {"level": "Severe", "identification_guide": "Rệp phủ kín nõn và râu ngô, xuất hiện nấm muội đen bao phủ lá.", "action": "Sử dụng thuốc trừ sâu lưu dẫn", "product": "Imidacloprid hoặc Thiamethoxam"}
        ]
    },
    {
        "name": "Maize_blight",
        "common_name": "Bệnh cháy lá ngô (Maize Blight)",
        "description": "Bệnh do nấm Exserohilum turcicum gây ra trong thời tiết mát và ẩm.",
        "symptoms": ["Vết bệnh hình thoi, màu xám hoặc nâu", "Các vết loét lớn chạy dọc theo gân lá", "Lá khô cháy sớm"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vài vết bệnh hình thoi nhỏ xuất hiện đơn lẻ trên lá già.", "action": "Loại bỏ lá gốc bị bệnh, làm sạch cỏ", "product": "Dịch chiết tỏi hoặc gừng"},
            {"level": "Moderate", "identification_guide": "Nhiều vết bệnh dài lan ra các lá xung quanh, chiếm khoảng 25% diện tích lá.", "action": "Phun thuốc phòng trừ nấm", "product": "Propiconazole hoặc Azoxystrobin"},
            {"level": "Severe", "identification_guide": "Các vết bệnh nối liền nhau làm cháy toàn bộ lá, cây còi cọc.", "action": "Sử dụng giống kháng bệnh cho vụ sau", "product": "Mancozeb phối hợp với nấm đối kháng Trichoderma"}
        ]
    },
    {
        "name": "Phosphorus_deficiency",
        "common_name": "Thiếu Phốt pho (Phosphorus Deficiency)",
        "description": "Thiếu hụt lân làm cây sinh trưởng kém, rễ yếu.",
        "symptoms": ["Lá già chuyển màu tím hoặc đỏ tía", "Cây nhỏ, còi cọc", "Trổ hoa chậm"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Chỉ có mép lá già dưới cùng hơi có sắc tím.", "action": "Phun phân bón lá giàu lân", "product": "Phân bón lá NPK (ví dụ: 10-60-10)"},
            {"level": "Moderate", "identification_guide": "Màu tím lan rộng toàn bộ lá già, cây có vẻ hơi thấp hơn bình thường.", "action": "Bón thúc phân lân cho cây", "product": "Phân DAP hoặc Super lân"},
            {"level": "Severe", "identification_guide": "Nhiều tầng lá bị tím, thân cây mảnh khảnh, rễ kém phát triển.", "action": "Cải tạo đất định kỳ bằng phân hữu cơ", "product": "Phân lân nung chảy (Văn Điển)"}
        ]
    },
    {
        "name": "Physoderma_brown_spot",
        "common_name": "Đốm nâu Physoderma (Physoderma Brown Spot)",
        "description": "Bệnh thường thấy trên thân và gân lá ngô dưới tác động của độ ẩm cao.",
        "symptoms": ["Vết đốm nhỏ màu vàng hoặc nâu tím ở bẹ lá", "Gân chính có các hạt nhỏ lồi lên", "Thân cây bị yếu, dễ gãy"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vài đốm nhỏ không màu xuất hiện ở bẹ lá và gân chính.", "action": "Dọn dẹp tàn dư cây trồng sau vụ thu hoạch", "product": "Vôi bột khử trùng đất"},
            {"level": "Moderate", "identification_guide": "Đốm chuyển màu tím nâu rõ rệt, bám dày ở các đốt thân.", "action": "Giảm mật độ trồng, tưới nước hợp lý", "product": "Thuốc trừ nấm chứa gốc đồng (Copper Oxichloride)"},
            {"level": "Severe", "identification_guide": "Bệnh lan khắp thân và lá, thân cây trở nên giòn và dễ gãy ở các đốt.", "action": "Sử dụng thuốc hóa học khi bệnh lan rộng", "product": "Tebuconazole hoặc Pyraclostrobin"}
        ]
    },
    {
        "name": "Streak_virus",
        "common_name": "Virus sọc lá (Maize Streak Virus)",
        "description": "Bệnh do virus lây truyền bởi rầy xanh (Leafhoppers).",
        "symptoms": ["Các sọc nhỏ màu vàng nhạt chạy dọc lá", "Cây bị lùn, lá nhỏ lại", "Bắp không kết hạt được"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Xuất hiện các chấm vàng nhỏ li ti ở gốc lá non.", "action": "Tiêu diệt bọ rầy môi giới", "product": "Bẫy dính màu vàng"},
            {"level": "Moderate", "identification_guide": "Các sọc vàng hình thành rõ nét dọc gân lá, cây bắt đầu chậm lớn.", "action": "Sử dụng chế phẩm sinh học diệt rầy", "product": "Nấm Beauveria bassiana"},
            {"level": "Severe", "identification_guide": "Lá ngọn bị sọc vàng toàn bộ, cây lùn hẳn so với đồng ruộng, không ra bắp.", "action": "Nhổ bỏ cây bệnh, chuyển sang giống kháng MSV", "product": "Thuốc diệt rầy nồng độ cao"}
        ]
    },
    {
        "name": "Apple Scab Leaf",
        "common_name": "Bệnh ghẻ lá táo (Apple Scab)",
        "description": "Bệnh do nấm Venturia inaequalis gây ra, ảnh hưởng nặng đến năng suất táo.",
        "symptoms": ["Vết bệnh màu nâu đen tròn, hơi lồi", "Lá bị biến dạng, nhăn nheo", "Lá rụng sớm"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vài vết đốm nhỏ màu ô liu xuất hiện ở mặt dưới lá.", "action": "Quét dọn lá rụng, tưới nước gốc", "product": "Nước vôi trong"},
            {"level": "Moderate", "identification_guide": "Nhiều đốm nâu đen to dần ở cả hai mặt lá, lá bắt đầu hơi cong.", "action": "Phun thuốc kháng nấm khi chồi nở", "product": "Captan hoặc Myclobutanil"},
            {"level": "Severe", "identification_guide": "Vết loét dày đặc làm lá nhăn nheo, khô vụn và rụng sớm hàng loạt.", "action": "Áp dụng lịch trình phun thuốc nghiêm ngặt", "product": "Difenoconazole (Anvil)"}
        ]
    },
    {
        "name": "Apple leaf",
        "common_name": "Lá táo khỏe mạnh (Healthy Apple Leaf)",
        "is_healthy": True,
        "description": "Lá táo ở trạng thái phát triển tốt nhất.",
        "symptoms": ["Màu xanh lục đều, bề mặt nhẵn", "Không có vết đốm hay sâu bệnh"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá duy trì màu xanh mượt, không tìm thấy bất kỳ dấu hiệu bất thường nào.", "action": "Tiếp tục chăm sóc định kỳ, tưới nước đều đặn", "product": "Phân hữu cơ vi sinh"},
            {"level": "Maintenance", "identification_guide": "Toàn bộ tán cây trông đều màu, không có lá vàng rụng bất thường.", "action": "Kiểm tra sâu bệnh thường xuyên ở mặt sau lá", "product": "Nước sạch"},
            {"level": "Maintenance", "identification_guide": "Điểm sinh trưởng phát triển tốt, chồi non mạnh khỏe.", "action": "Giữ vững chế độ bón phân đa trung vi lượng", "product": "NPK định kỳ"}
        ]
    },
    {
        "name": "Apple rust leaf",
        "common_name": "Bệnh gỉ sắt táo (Cedar Apple Rust)",
        "description": "Nấm Gymnosporangium juniperi-virginianae gây ra các vết cam nổi bật.",
        "symptoms": ["Các đốm màu cam sáng ở mặt trên lá", "Dưới mặt lá có các gai nấm nhỏ", "Lá bị rụng hàng loạt"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vài đốm nhỏ màu vàng chanh xuất hiện đơn lẻ trên mặt lá.", "action": "Loại bỏ cây chủ phụ (cây bách) lân cận", "product": "Tỉa cành thủ công"},
            {"level": "Moderate", "identification_guide": "Đốm chuyển màu cam đậm, bắt đầu thấy các chấm đen nhỏ ở tâm vết bệnh.", "action": "Phun khi lá non vừa nhú", "product": "Thuốc chứa Sulfur (Lưu huỳnh)"},
            {"level": "Severe", "identification_guide": "Dưới mặt lá mọc ra các ống bào tử hình gai, lá bị vàng đi và rụng.", "action": "Sử dụng thuốc kháng nấm mạnh", "product": "Myclobutanil hoặc Fenbuconazole"}
        ]
    },
    {
        "name": "Bell_pepper leaf spot",
        "common_name": "Đốm lá ớt chuông (Bell Pepper Leaf Spot)",
        "description": "Thường do vi khuẩn Xanthomonas gây ra trong môi trường nóng ẩm.",
        "symptoms": ["Các đốm nhỏ sũng nước, sau khô lại màu nâu", "Mép lá bị cháy", "Hoa và quả rụng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Xuất hiện các đốm nhỏ sũng nước ở rìa lá hoặc mặt dưới lá.", "action": "Tránh tưới nước trực tiếp lên lá", "product": "Dịch chiết hành tây"},
            {"level": "Moderate", "identification_guide": "Đốm bệnh lan rộng, có tâm màu nâu sáng viền đậm, lá bắt đầu vàng.", "action": "Phun chế phẩm đồng diệt khuẩn", "product": "Copper Oxychloride (COC 85)"},
            {"level": "Severe", "identification_guide": "Nhiều lá bị cháy khô, rụng hàng loạt, ảnh hưởng đến cả hoa và quả non.", "action": "Nhổ cây bệnh, dừng bón phân đạm quá mức", "product": "Streptomycin hoặc Kasugamycin"}
        ]
    },
    {
        "name": "Bell_pepper leaf",
        "common_name": "Lá ớt chuông khỏe mạnh (Healthy Pepper Leaf)",
        "is_healthy": True,
        "description": "Cây ớt chuông phát triển ổn định.",
        "symptoms": ["Lá xanh bóng, cứng cáp", "Không có triệu chứng héo hay đốm"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá xanh đều, không bị quăn hay có vết đốm sũng nước.", "action": "Duy trì độ ẩm đất ổn định", "product": "Nước sạch"},
            {"level": "Maintenance", "identification_guide": "Mặt dưới lá sạch, không có sâu bọ hay bào tử nấm.", "action": "Bổ sung dinh dưỡng tăng sức đề kháng", "product": "Phân NPK cân đối"},
            {"level": "Maintenance", "identification_guide": "Cây mọc thẳng, tán lá cân đối.", "action": "Đảm bảo cây nhận đủ ánh sáng mặt trời", "product": "Ánh sáng tự nhiên"}
        ]
    },
    {
        "name": "Blueberry leaf",
        "common_name": "Lá việt quất (Blueberry Leaf)",
        "is_healthy": True,
        "description": "Phân tích trạng thái lá cây việt quất khỏe mạnh.",
        "symptoms": ["Nhìn chung xanh tốt, có thể có sẹo nhỏ tự nhiên"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá có màu sắc đặc trưng của giống, bề mặt nhẵn bóng.", "action": "Theo dõi độ pH đất định kỳ (4.5-5.5)", "product": "Phân bón chuyên dụng cho cây ưa acid"},
            {"level": "Maintenance", "identification_guide": "Mép lá thẳng, không bị cháy nâu hay xoăn lại.", "action": "Kiểm tra sâu đục cành ở các nhánh chính", "product": "Dầu Neem (phòng ngừa)"},
            {"level": "Maintenance", "identification_guide": "Gân lá không bị vàng bất thường so với thịt lá.", "action": "Bổ sung sắt định kỳ để giữ màu lá xanh đậm", "product": "Chelated Iron"}
        ]
    },
    {
        "name": "Cherry leaf",
        "common_name": "Lá anh đào (Cherry Leaf)",
        "is_healthy": True,
        "description": "Lá cây anh đào khỏe mạnh.",
        "symptoms": ["Lá xanh đậm, có răng cưa mép lá đều", "Cành chắc khỏe"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá xanh sẫm, cân đối, không có vết thủng lỗ li ti.", "action": "Tưới nước đều đặn vào buổi sáng tránh đọng nước", "product": "Nước sạch"},
            {"level": "Maintenance", "identification_guide": "Thân cành trơn láng, không có nấm mốc trắng hay đỏ.", "action": "Bón phân hữu cơ quanh gốc định kỳ", "product": "Phân chuồng hoai mục"},
            {"level": "Maintenance", "identification_guide": "Bộ tán râm mát, không có hiện tượng rụng lá sớm.", "action": "Cắt tỉa nhẹ các cành khuất tán", "product": "Kéo cắt cành"}
        ]
    },
    {
        "name": "Corn Gray leaf spot",
        "common_name": "Đốm xám ngô (Gray Leaf Spot)",
        "description": "Bệnh do nấm Cercospora zeae-maydis, rất phổ biến ở vùng canh tác ngô.",
        "symptoms": ["Các vết bệnh hình chữ nhật kéo dài giữa hai gân lá", "Màu xám nâu sáng", "Vết bệnh làm chết cả lá"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vết bệnh mới là những vệt nhỏ dài sũng nước trên các lá già thấp.", "action": "Luân canh cây trồng (với đậu)", "product": "Dọn dẹp tàn dư rơm rạ"},
            {"level": "Moderate", "identification_guide": "Các vết bệnh hình chữ nhật rõ rệt xuất hiện trên 50% số lá.", "action": "Phun thuốc khi thấy vết bệnh đầu tiên", "product": "Propiconazole"},
            {"level": "Severe", "identification_guide": "Vết bệnh bao phủ hoàn toàn lá, làm khô cháy từ dưới lên trên.", "action": "Sử dụng thuốc nồng độ cao hoặc giống kháng", "product": "Pyraclostrobin (Headline)"}
        ]
    },
    {
        "name": "Corn leaf blight",
        "common_name": "Bệnh cháy lá ngô (Corn Northern Leaf Blight)",
        "description": "Bệnh thối/cháy lá ngô phương Bắc.",
        "symptoms": ["Vết bệnh hình thoi dài 2.5-15cm", "Màu xám xanh hoặc cà phê sữa", "Xuất hiện lớp bột nấm màu xám khi ẩm"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vài đốm nhỏ hình điếu thuốc xì gà mọc rải rác.", "action": "Tiêu hủy gốc rạ sau vụ", "product": "Trichoderma"},
            {"level": "Moderate", "identification_guide": "Vết bệnh lan rộng nhanh theo chiều dọc, chiếm 1/3 diện tích mặt lá.", "action": "Phun thuốc nấm khi cây trổ cờ", "product": "Mancozeb hoặc Zineb"},
            {"level": "Severe", "identification_guide": "Tất cả các lá từ dưới lên ngọn đều bị cháy rụi, ảnh hưởng đến hạt bắp.", "action": "Phun nhắc lại sau 10 ngày nếu bệnh nặng", "product": "Amistar Top (Azoxystrobin + Difenoconazole)"}
        ]
    },
    {
        "name": "Corn rust leaf",
        "common_name": "Bệnh gỉ sắt ngô (Corn Leaf Rust)",
        "description": "Dạng bệnh gỉ sắt khác thường gặp trên lá ngô.",
        "symptoms": ["Các mụn nhỏ li ti chứa bào tử bột màu vàng cam", "Cây yếu rũ, lá nhanh khô"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Bắt đầu thấy các chấm vàng nhạt ở mặt trên lá.", "action": "Kiểm tra độ thoáng của ruộng", "product": "Phun nước xà phòng"},
            {"level": "Moderate", "identification_guide": "Ổ nấm màu cam mọc dày đặc, khi vuốt tay thấy bột màu cam dính vào.", "action": "Phun thuốc kháng nấm nhóm Triazole", "product": "Tebuconazole"},
            {"level": "Severe", "identification_guide": "Lá bị bao phủ kín bởi nấm đen/cam, lá chết nhanh chóng, cây vàng vọt.", "action": "Phun kết hợp gốc Đồng và Sulfur", "product": "Dung dịch Bordeaux"}
        ]
    },
    {
        "name": "Peach leaf",
        "common_name": "Lá đào khỏe mạnh (Healthy Peach Leaf)",
        "is_healthy": True,
        "description": "Trạng thái lá đào sinh trưởng bình thường.",
        "symptoms": ["Lá thon dài, xanh mượt", "Không bị sần hay xoăn"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá thon dài, mép lá không bị đục lỗ bởi sâu bọ.", "action": "Phong trừ sâu ăn lá bằng chế phẩm sinh học", "product": "Chế phẩm Bt"},
            {"level": "Maintenance", "identification_guide": "Màu sắc xanh lục nhạt đều, mặt lá không có màng trắng.", "action": "Xới đất quanh gốc để tăng độ thông thoáng", "product": "Phân hữu cơ khoáng"},
            {"level": "Maintenance", "identification_guide": "Cành lá vươn dài tự nhiên, không bị vặn xoắn.", "action": "Phòng bệnh xoăn lá khi thời tiết chuyển mùa", "product": "Phun Copper Sulfate khi mùa đông kết thúc"}
        ]
    },
    {
        "name": "Potato leaf early blight",
        "common_name": "Bệnh lở cổ rễ/Đốm vòng khoai tây (Early Blight)",
        "description": "Do nấm Alternaria solani gây ra, tấn công các lá già trước.",
        "symptoms": ["Các đốm đen có vòng đồng tâm như bia bắn", "Lá chuyển vàng và rụng sớm", "Lây sang cả củ"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vết bệnh vòng tròn nhỏ xuất hiện ở các lá dưới cùng.", "action": "Duy trì bón phân đầy đủ, tránh thiếu đạm", "product": "Phân bón đạm (Urea) vừa đủ"},
            {"level": "Moderate", "identification_guide": "Vết bệnh to dần, xung quanh có quầng vàng, lan lên tầng lá giữa.", "action": "Tưới nước nhỏ giọt, tránh ướt lá", "product": "Chlorothalonil"},
            {"level": "Severe", "identification_guide": "Toàn bộ tán lá bị vàng và cháy, thân cây bị héo.", "action": "Áp dụng hóa chất diệt nấm phổ rộng", "product": "Mancozeb hoặc Azoxystrobin (Ridomil Gold)"}
        ]
    },
    {
        "name": "Potato leaf late blight",
        "common_name": "Bệnh mốc sương khoai tây (Late Blight)",
        "description": "Bệnh nguy hiểm nhất trên khoai tây do Phytophthora infestans gây ra.",
        "symptoms": ["Vết bệnh sũng nước ở mép lá", "Lớp mốc trắng mịn ở mặt dưới lá khi ẩm", "Cây thối nhũn nhanh chóng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Vết đốm xanh đậm hơi sũng nước ở rìa lá.", "action": "Loại bỏ mầm bệnh, tiêu hủy nhanh", "product": "Rắc vôi bột"},
            {"level": "Moderate", "identification_guide": "Vết loét thối rộng, mặt dưới lá có mốc trắng bao phủ.", "action": "Phun thuốc phòng ngay khi thời tiết mưa ẩm", "product": "Mancozeb phối hợp Metalaxyl"},
            {"level": "Severe", "identification_guide": "Thân cây bị thối đen, toàn bộ diện tích lá bị rữa nát.", "action": "Sử dụng thuốc đặc trị dòng Cyazofamid", "product": "Ranman hoặc Revus"}
        ]
    },
    {
        "name": "Potato leaf",
        "common_name": "Lá khoai tây khỏe mạnh (Healthy Potato Leaf)",
        "is_healthy": True,
        "description": "Lá khoai tây phát triển bình thường.",
        "symptoms": ["Lá xanh, bóng, không có vết thâm", "Cây mọc khỏe"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá mở rộng hoàn toàn, không có các vết đốm vòng nâu đen.", "action": "Theo dõi mật độ côn trùng gây hại", "product": "Bẫy dán/Bẫy vàng"},
            {"level": "Maintenance", "identification_guide": "Gân lá nổi rõ, mặt lá nhẵn, mép không bị héo sờn.", "action": "Vun gốc tăng diện tích hình thành củ", "product": "Phân Kali"},
            {"level": "Maintenance", "identification_guide": "Cây trông cứng cáp, không bị gục đầu khi trời nắng.", "action": "Đảm bảo thoát nước tốt tránh thối rễ", "product": "N/A"}
        ]
    },
    {
        "name": "Raspberry leaf",
        "common_name": "Lá mâm xôi (Raspberry Leaf)",
        "is_healthy": True,
        "description": "Trạng thái lá mâm xôi khỏe mạnh.",
        "symptoms": ["Lá kép lông chim, xanh tươi", "Cành mọc xuôi đều"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá kép ba hoặc năm xanh đậm, không bị bạc màu ở gân.", "action": "Tỉa bỏ các cành già đã cho quả để tập trung dinh dưỡng", "product": "Phân bón lá vi lượng"},
            {"level": "Maintenance", "identification_guide": "Cành non mọc thẳng, không bị đốm tím hay nấm trắng bao phủ.", "action": "Quản lý độ ẩm gốc bằng vật liệu che phủ", "product": "Mùn cưa phủ gốc"},
            {"level": "Maintenance", "identification_guide": "Lá mọc dày nhưng thoáng khí tốt.", "action": "Phòng trừ nấm rỉ sắt khi mưa ẩm", "product": "Dung dịch Bordeaux"}
        ]
    },
    {
        "name": "Soyabean leaf",
        "common_name": "Lá đậu nành (Soybean Leaf)",
        "is_healthy": True,
        "description": "Sức khỏe lá cây đậu tương/đậu nành ổn định.",
        "symptoms": ["Lá xanh đều, không bị thủng do sâu"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Ba lá chét xanh đều, không có chấm vàng li ti do nhện đỏ.", "action": "Bón lân định kỳ tăng cường phát triển bộ rễ", "product": "Supe lân"},
            {"level": "Maintenance", "identification_guide": "Mặt sau lá sạch, bẹ lá không bị nấm hồng bao phủ.", "action": "Kiểm tra rệp sáp ở các nách lá", "product": "Phun nước áp lực"},
            {"level": "Maintenance", "identification_guide": "Thân đậu mảnh nhẹ nhưng dai, chịu được gió.", "action": "Đảm bảo rãnh thoát nước luốn thông thoáng", "product": "N/A"}
        ]
    },
    {
        "name": "Soybean leaf",
        "common_name": "Lá đậu nành (Soybean Leaf)",
        "description": "Sức khỏe lá cây đậu tương (lớp dữ liệu tương tự).",
        "symptoms": ["Lá xanh tốt, quang hợp mạnh mẽ"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Cây hơi thiếu đạm, lá có màu xanh nhạt hơn bình thường.", "action": "Kiểm tra tình trạng đất", "product": "Phân chuồng"},
            {"level": "Moderate", "identification_guide": "Bắt đầu xuất hiện vài đốm nâu li ti rải rác.", "action": "Duy trì độ ẩm trung bình", "product": "Nước sạch"},
            {"level": "Severe", "identification_guide": "Lá bị sâu ăn mất quá 30% diện tích hoặc nấm lan rộng.", "action": "Bón phân đa trung vi lượng", "product": "NPK + TE"}
        ]
    },
    {
        "name": "Squash Powdery mildew leaf",
        "common_name": "Phấn trắng bí ngô (Squash Powdery Mildew)",
        "description": "Lớp bột trắng như phấn phủ lên lá bí, làm giảm năng suất.",
        "symptoms": ["Lớp phấn trắng bao phủ bề mặt lá", "Lá có thể bị khô vàng và giòn", "Dây bí kém phát triển"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Chỉ có vài chấm trắng nhỏ li ti như hạt bột trên mặt lá.", "action": "Phun hỗn hợp sữa tươi và nước (tỷ lệ 1:9)", "product": "Sữa tươi hoặc Baking soda"},
            {"level": "Moderate", "identification_guide": "Khoảng 1/2 diện tích lá bị bao phủ bởi lớp phấn trắng dày.", "action": "Sử dụng chế phẩm sinh học", "product": "Bacillus subtilis hoặc Dầu Neem"},
            {"level": "Severe", "identification_guide": "Phấn trắng bao phủ toàn bộ lá, cuống lá, lá bị khô giòn và tàn sớm.", "action": "Dùng thuốc trừ nấm gốc Sulfur hoặc Triazole", "product": "Anvil hoặc Topsin M"}
        ]
    },
    {
        "name": "Strawberry leaf",
        "common_name": "Lá dâu tây khỏe mạnh (Healthy Strawberry Leaf)",
        "is_healthy": True,
        "description": "Lá dâu tây trong trạng thái xanh tốt.",
        "symptoms": ["Lá xanh bóng đẹp, mép lá không bị cháy đen"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá xanh chùm, mép lá sắc nét, không có đốm nâu khô.", "action": "Vệ sinh cỏ dại và lá già quanh gốc thường xuyên", "product": "Nước muối sinh lý loãng (xịt nhẹ)"},
            {"level": "Maintenance", "identification_guide": "Không tìm thấy sâu cuốn lá hay sâu tơ trên tán lá.", "action": "Bổ sung phân bón Kali khi cây bắt đầu ra hoa", "product": "Kali trắng (K2SO4)"},
            {"level": "Maintenance", "identification_guide": "Ngó dâu (nếu có) mọc khỏe, không bị đen đầu.", "action": "Lót rơm quanh gốc để quả không chạm đất", "product": "Rơm khô hoặc màng phủ"}
        ]
    },
    {
        "name": "Tomato Early blight leaf",
        "common_name": "Đốm vòng cà chua (Tomato Early Blight)",
        "description": "Do nấm Alternaria solani, tạo vết đen đồng tâm.",
        "symptoms": ["Vết bệnh màu đen hoặc nâu có vòng đồng tâm", "Thường bắt đầu từ lá già phía dưới", "Lá vàng nhanh và rụng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Thấy ít đốm nâu có vòng tròn nhỏ xuất hiện ở các lá tầng sát đất.", "action": "Phun chế phẩm sinh học định kỳ", "product": "Nano Bạc"},
            {"level": "Moderate", "identification_guide": "Vết bệnh lan lên đến các tầng lá giữa, quầng vàng quanh vết bệnh rộng ra.", "action": "Tỉa bỏ lá sát mặt đất", "product": "Mancozeb"},
            {"level": "Severe", "identification_guide": "Cây héo rũ, các lá cháy đen hoàn toàn, bám dày nấm mốc.", "action": "Phun phối hợp thuốc trị nấm nội hấp", "product": "Score (Difenoconazole)"}
        ]
    },
    {
        "name": "Tomato Septoria leaf spot",
        "common_name": "Đốm lá Septoria cà chua (Septoria Leaf Spot)",
        "description": "Nấm gây ra nhiều đốm nhỏ, tâm xám viền nâu.",
        "symptoms": ["Nhiều đốm nhỏ hình tròn màu xám trắng viền đen", "Đốm bệnh mọc dày đặc gây chết lá", "Lá rụng gốc lên ngọn"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Chỉ có vài đốm xám mờ rải rác ở một vài lá đơn.", "action": "Tránh tưới nước vào lá khi trời tối", "product": "Tinh dầu quế"},
            {"level": "Moderate", "identification_guide": "Cả lá chi chít hàng chục đốm nhỏ, mép lá bắt đầu xoăn khô.", "action": "Vệ sinh thật sạch rơm rạ phủ gốc", "product": "Antracol (Propineb)"},
            {"level": "Severe", "identification_guide": "Lá gốc rụng sạch, bệnh lan sát ngọn, cây gầy yếu.", "action": "Dùng thuốc đặc trị nấm mốc", "product": "Daconil (Chlorothalonil)"}
        ]
    },
    {
        "name": "Tomato leaf bacterial spot",
        "common_name": "Đốm đen vi khuẩn cà chua (Bacterial Spot)",
        "description": "Vi khuẩn Xanthomonas vesicatoria gây ra.",
        "symptoms": ["Đốm nhỏ đen, cứng, sần sùi trên lá và quả", "Vết bệnh lan nhanh khi mưa nhiều", "Lá chuyển vàng và khô"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Đốm đen nhỏ hơi sướt nhẹ ở mặt sau lá, chưa lan sang bẹ lá.", "action": "Sử dụng hạt giống sạch bệnh, ngâm nước ấm", "product": "Dung dịch Nano Đồng"},
            {"level": "Moderate", "identification_guide": "Đốm đen dày đặc, có hiện tượng cháy mép lá, cây hơi héo nhẹ.", "action": "Phun thuốc kháng khuẩn sinh học", "product": "Kasumin (Kasugamycin)"},
            {"level": "Severe", "identification_guide": "Bệnh lan ra cả cành và quả non, cây thối đen vỏ, hoại tử nặng.", "action": "Phun hỗn hợp Đồng và Mancozeb", "product": "Kocide + Mancozeb"}
        ]
    },
    {
        "name": "Tomato leaf late blight",
        "common_name": "Bệnh mốc sương cà chua (Tomato Late Blight)",
        "description": "Bệnh rất nguy hiểm, có thể làm chết cả ruộng cà chua sau vài ngày.",
        "symptoms": ["Vết loét sũng nước màu xanh đen", "Dưới lá có tơ nấm trắng khi trời ẩm", "Hoa quả thối nhũn đen"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Đốm dầu sũng nước nhỏ ở rìa lá ngọn hoặc sát cuống.", "action": "Kiểm tra kỹ cây giống ban đầu", "product": "Trichoderma bón lót"},
            {"level": "Moderate", "identification_guide": "Vết loét đen lan dọc theo thân và cuống lá, tơ nấm trắng xuất hiện rõ.", "action": "Phun nhắc lại mỗi 7 ngày", "product": "Ridomil Gold"},
            {"level": "Severe", "identification_guide": "Toàn bộ tán cây bị nhũn, bốc mùi hôi, quả bị thối nhũn xanh đen.", "action": "Dùng thuốc nội hấp cực mạnh", "product": "Infinito (Fluopicolide + Propamocarb)"}
        ]
    },
    {
        "name": "Tomato leaf mosaic virus",
        "common_name": "Virus khảm cà chua (Tomato Mosaic Virus - ToMV)",
        "description": "Virus lây lan qua hạt giống, công cụ và côn trùng.",
        "symptoms": ["Lá lốm đốm xanh vàng (khảm)", "Lá biến dạng giống hình sợi chỉ", "Cây còi cọc, quả kém phát triển"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Một phần nhỏ của lá non có sự loang lổ xanh nhạt - xanh đậm.", "action": "Rửa tay bằng sà phòng sau khi chạm cây bệnh", "product": "Sữa gầy (Skim milk) ngăn virus"},
            {"level": "Moderate", "identification_guide": "Lá mọc ra bị vặn xoắn, có đốm vàng loang lổ khắp tán.", "action": "Tiêu diệt côn trùng truyền bệnh rầy, rệp", "product": "Actara (Thiamethoxam)"},
            {"level": "Severe", "identification_guide": "Cây bị biến dạng hoàn toàn, lá hình sợi kim, không thể ra hoa kết quả.", "action": "Nhổ toàn bộ cây bệnh, khử trùng dụng cụ", "product": "Dừng canh tác cây họ cà một vụ"}
        ]
    },
    {
        "name": "Tomato leaf yellow virus",
        "common_name": "Virus vàng lá cà chua (Tomato Yellow Leaf Curl Virus - TYLCV)",
        "description": "Virus do bọ phấn trắng truyền, làm lá cuốn và vàng.",
        "symptoms": ["Lá vàng rõ rệt ở ngọn, lá non bị nhỏ lại", "Mép lá cuốn ngược lên trên", "Cây ngừng sinh trưởng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Ngọn cây bắt đầu có màu vàng chanh, lá hơi bị dày lên.", "action": "Dùng lưới chắn bọ phấn trắng", "product": "Lưới mắt nhỏ"},
            {"level": "Moderate", "identification_guide": "Lá non xoắn tít lại, mép cuốn lên dạng hình chén, cây ngừng vươn cao.", "action": "Phun dầu khoáng để bọ phấn không đậu", "product": "Dầu khoáng SK Enspray"},
            {"level": "Severe", "identification_guide": "Ngọn bí bết lại không phát triển, toàn bộ tán lá bị vàng úa.", "action": "Kiểm soát bọ phấn tuyệt đối bằng thuốc mạnh", "product": "Pymetrozine (Chess)"}
        ]
    },
    {
        "name": "Tomato leaf",
        "common_name": "Lá cà chua khỏe mạnh (Healthy Tomato Leaf)",
        "is_healthy": True,
        "description": "Lá cà chua bình thường, sinh trưởng tốt.",
        "symptoms": ["Cành lá xanh mướt, hoa đậu tốt"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá xanh đều, phiến lá phẳng, không có vết khảm hay đốm dầu sũng nước.", "action": "Duy trì bổ sung phân hữu cơ vi sinh định kỳ", "product": "Dịch trùn quế"},
            {"level": "Maintenance", "identification_guide": "Lá mọc đối xứng đều, không có côn trùng chích hút ở mặt dưới.", "action": "Làm sạch cỏ dại cạnh tranh dinh dưỡng", "product": "Công cụ thủ công"},
            {"level": "Maintenance", "identification_guide": "Tán cây thông thoáng, không có mùi ẩm mốc khó chịu.", "action": "Tỉa cành tạo độ thông thoáng phòng nấm mốc", "product": "Kéo tỉa sạch"}
        ]
    },
    {
        "name": "Tomato mold leaf",
        "common_name": "Nấm mốc lá cà chua (Leaf Mold)",
        "description": "Bệnh do nấm Fulvia fulva gây ra trong môi trường độ ẩm cực cao.",
        "symptoms": ["Mặt trên lá có đốm vàng nhạt, mặt dưới có lớp mốc lục/xám", "Lá khô rụng nhưng không héo", "Thường xuất hiện trong nhà màng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Thấy vài vệt vàng nhạt mờ ở mặt trên lá, lật mặt dưới thấy mớp lông mịn màu xám.", "action": "Tăng cường thông gió nhà màng", "product": "Quạt thông gió"},
            {"level": "Moderate", "identification_guide": "Nấm mốc bám dày như nhung xám ở mặt dưới hầu hết các lá già.", "action": "Sử dụng thuốc kháng nấm phổ rộng", "product": "Chlorothalonil"},
            {"level": "Severe", "identification_guide": "Lá khô đen rụng hàng loạt, bệnh lan cả lên phần lá non ở ngọn.", "action": "Cần can thiệp thuốc đặc trị hóa học", "product": "Azoxystrobin phối hợp Cyproconazole"}
        ]
    },
    {
        "name": "Tomato two spotted spider mites leaf",
        "common_name": "Nhện đỏ cà chua (Two-spotted Spider Mite)",
        "description": "Nhện chích hút làm lá biến màu và khô.",
        "symptoms": ["Các đốm trắng li ti trên lá", "Lá nhạt màu, có màng nhện mỏng mặt dưới", "Lá bị cháy vàng cánh đồng"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Lá có vài vết chấm trắng mờ li ti, nhìn kỹ thấy nhện nhỏ di động ở mặt sau.", "action": "Phun nước xịt mạnh mặt dưới lá", "product": "Nước sạch"},
            {"level": "Moderate", "identification_guide": "Lá có màu bạc trắng rõ rệt, mặt sau có màng tơ mỏng, lá hơi bị quăn.", "action": "Dùng dầu thảo mộc hoặc xà phòng", "product": "Neem oil hoặc Salicylic acid"},
            {"level": "Severe", "identification_guide": "Toàn ruộng bị vàng cháy, lá bị tàn khô, nhện bao phủ kín các ngọn cây.", "action": "Sử dụng thuốc đặc trị nhện", "product": "Abamectin hoặc Spiromesifen"}
        ]
    },
    {
        "name": "grape leaf black rot",
        "common_name": "Bệnh thối đen lá nho (Grape Black Rot)",
        "description": "Nấm Guignardia bidwellii gây hại cho cả lá và quả nho.",
        "symptoms": ["Vết đốm tròn màu nâu có viền đen đậm", "Các điểm đen nhỏ li ti trong tâm vết bệnh", "Quả bị héo khô như nho khô"],
        "treatments": [
            {"level": "Mild", "identification_guide": "Xuất hiện vài đốm nâu tròn đơn lẻ trên lá non.", "action": "Dọn dẹp lá và quả khô rụng", "product": "Vệ sinh đồng ruộng"},
            {"level": "Moderate", "identification_guide": "Đốm bệnh to rộng, viền đen nâu rõ rệt, xuất hiện trên chùm quả non.", "action": "Phun thuốc nấm ngay sau khi trổ hoa", "product": "Mancozeb"},
            {"level": "Severe", "identification_guide": "Quả nho bị thối đen hoàn toàn, lá bị rụng sạch ảnh hưởng đến vụ sau.", "action": "Phun nhắc lại định kỳ 10-14 ngày", "product": "Systhane (Myclobutanil)"}
        ]
    },
    {
        "name": "grape leaf",
        "common_name": "Lá nho khỏe mạnh (Healthy Grape Leaf)",
        "is_healthy": True,
        "description": "Lá nho ở trạng thái phát triển tốt.",
        "symptoms": ["Lá xanh đậm, mọng nước, không bị rỉ sắt"],
        "treatments": [
            {"level": "Maintenance", "identification_guide": "Lá mở rộng to, xanh mượt, cuống lá chắc khỏe không bị đốm dầu.", "action": "Bốn phân đa vi lượng cân đối", "product": "Phân bón NPK 15-15-15"},
            {"level": "Maintenance", "identification_guide": "Không có sương mốc hay bột trắng dính vào tay khi vuốt lá.", "action": "Tưới nước trực tiếp vào gốc, hạn chế làm ướt lá", "product": "Hệ thống tưới nhỏ giọt"},
            {"level": "Maintenance", "identification_guide": "Luôn quan sát các kẽ cành để phòng ngừa sâu đục phá.", "action": "Kiểm tra dấu hiệu sâu đục thân định kỳ", "product": "Chế phẩm sinh học"}
        ]
    }
]
