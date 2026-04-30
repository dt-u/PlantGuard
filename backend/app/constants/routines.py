DISEASE_ROUTINES = {
    'Apple Scab': {
        'Mild': [
            {'day': 1, 'task': 'Vệ sinh tán lá', 'desc': 'Thu gom toàn bộ lá rụng và tiêu hủy để loại bỏ nguồn nấm Venturia.'},
            {'day': 5, 'task': 'Phun dung dịch đồng', 'desc': 'Sử dụng Copper Oxychloride nồng độ thấp để bảo vệ các lá non mới nhú.'},
            {'day': 12, 'task': 'Kiểm tra mặt dưới lá', 'desc': 'Đảm bảo không còn các vết đốm màu ô liu xuất hiện.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Xử lý hóa học đợt 1', 'desc': 'Phun Myclobutanil để ức chế sự phát triển của sợi nấm.'},
            {'day': 4, 'task': 'Tỉa cành dặm', 'desc': 'Cắt bỏ các cành quá dày để tăng độ thông thoáng và giảm độ ẩm.'},
            {'day': 9, 'task': 'Xử lý hóa học đợt 2', 'desc': 'Phun nhắc lại Myclobutanil để diệt trừ bào tử mới hình thành.'},
            {'day': 18, 'task': 'Phục hồi dinh dưỡng', 'desc': 'Bổ sung phân bón lá giàu vi lượng để tăng sức đề kháng cho cây.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp nội hấp mạnh', 'desc': 'Sử dụng Difenoconazole (Anvil) phun kỹ toàn bộ tán cây.'},
            {'day': 3, 'task': 'Kiểm tra vết loét', 'desc': 'Theo dõi xem các vết loét có khô lại và ngừng lan rộng hay không.'},
            {'day': 7, 'task': 'Can thiệp đợt 2', 'desc': 'Phun phối hợp Difenoconazole và Captan để tránh kháng thuốc.'},
            {'day': 12, 'task': 'Tiêu hủy tàn dư triệt để', 'desc': 'Dọn sạch và tiêu hủy toàn bộ lá bệnh rụng quanh gốc.'},
            {'day': 21, 'task': 'Kiểm tra chồi non', 'desc': 'Xác định các chồi mới mọc ra hoàn toàn sạch bệnh.'},
            {'day': 30, 'task': 'Bón vôi khử trùng đất', 'desc': 'Rắc vôi bột quanh gốc để diệt bào tử nấm tồn dư trong đất.'}
        ]
    },
    'Apple Rust': {
        'Mild': [
            {'day': 1, 'task': 'Kiểm soát cây chủ phụ', 'desc': 'Kiểm tra và loại bỏ các cây bách (cedar) trong bán kính 1km nếu có thể.'},
            {'day': 6, 'task': 'Tỉa lá bệnh ban đầu', 'desc': 'Ngắt bỏ thủ công các lá có đốm vàng cam nhỏ đơn lẻ.'},
            {'day': 15, 'task': 'Phun phòng ngừa sinh học', 'desc': 'Sử dụng dịch chiết tỏi xịt nhẹ lên bề mặt lá.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Sử dụng lưu huỳnh', 'desc': 'Phun Sulfur dust hoặc dung dịch lưu huỳnh lỏng lên tán lá.'},
            {'day': 5, 'task': 'Theo dõi mặt dưới lá', 'desc': 'Kiểm tra xem các ống bào tử hình gai đã bắt đầu khô chưa.'},
            {'day': 11, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục phun lưu huỳnh để ngăn chặn sự phát tán bào tử.'},
            {'day': 20, 'task': 'Bổ sung Kali', 'desc': 'Bón phân Kali trắng giúp thành tế bào lá cứng cáp hơn.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị gỉ sắt', 'desc': 'Phun Myclobutanil ngay lập tức khi thấy gai nấm dày đặc.'},
            {'day': 2, 'task': 'Theo dõi phản ứng', 'desc': 'Đảm bảo cây không bị sốc thuốc sau khi phun nồng độ cao.'},
            {'day': 6, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Fenbuconazole để luân phiên hoạt chất trị nấm.'},
            {'day': 13, 'task': 'Vệ sinh gốc triệt để', 'desc': 'Thu gom sạch lá rụng mang đi đốt để tránh lây nhiễm vụ sau.'},
            {'day': 25, 'task': 'Kiểm tra tầng lá ngọn', 'desc': 'Đảm bảo các tầng lá trên cùng không bị bào tử phát tán tới.'}
        ]
    },
    'Bell Pepper Leaf Spot': {
        'Mild': [
            {'day': 1, 'task': 'Thay đổi cách tưới', 'desc': 'Chuyển sang tưới gốc, tuyệt đối không làm ướt lá vào buổi tối.'},
            {'day': 4, 'task': 'Phun dịch chiết thảo mộc', 'desc': 'Sử dụng dịch chiết hành tây hoặc gừng để sát khuẩn bề mặt.'},
            {'day': 10, 'task': 'Kiểm tra mép lá', 'desc': 'Theo dõi các đốm sũng nước có dấu hiệu khô và chuyển nâu không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Diệt khuẩn gốc đồng', 'desc': 'Phun Copper Oxychloride (COC 85) để tiêu diệt vi khuẩn Xanthomonas.'},
            {'day': 3, 'task': 'Kiểm tra vết lan', 'desc': 'Xem các đốm có quầng vàng xung quanh có tiếp tục mở rộng không.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục sử dụng chế phẩm đồng để bảo vệ hoa và quả non.'},
            {'day': 15, 'task': 'Tỉa bỏ lá vàng', 'desc': 'Loại bỏ các lá đã mất khả năng quang hợp để cây tập trung nuôi quả.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Kháng sinh thực vật', 'desc': 'Sử dụng Streptomycin phối hợp Kasugamycin phun toàn diện.'},
            {'day': 2, 'task': 'Cắt giảm đạm', 'desc': 'Dừng toàn bộ phân đạm để tránh làm mô lá mềm yếu, dễ bị vi khuẩn tấn công.'},
            {'day': 5, 'task': 'Điều trị đợt 2', 'desc': 'Lặp lại liệu trình kháng sinh để khống chế dịch bệnh lan rộng.'},
            {'day': 10, 'task': 'Nhổ bỏ cây suy kiệt', 'desc': 'Tiêu hủy các cây bị cháy khô trên 70% diện tích lá.'},
            {'day': 17, 'task': 'Khử trùng vườn', 'desc': 'Rắc vôi bột và phun thuốc khử trùng toàn bộ khu vực trồng.'},
            {'day': 28, 'task': 'Phục hồi bằng vi sinh', 'desc': 'Tưới chế phẩm Bacillus subtilis để cải thiện hệ vi sinh đất.'}
        ]
    },
    'Corn Common Rust': {
        'Mild': [
            {'day': 1, 'task': 'Tỉa lá già nhiễm bệnh', 'desc': 'Ngắt bỏ các lá gốc có ổ nấm màu nâu đỏ.'},
            {'day': 7, 'task': 'Xử lý lưu huỳnh bột', 'desc': 'Rắc lưu huỳnh bột lên các ổ nấm mới phát sinh.'},
            {'day': 14, 'task': 'Kiểm tra mật độ', 'desc': 'Đảm bảo bệnh không lan lên tầng lá giữa của cây ngô.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun thuốc bảo vệ', 'desc': 'Sử dụng Mancozeb phun đều hai mặt lá ngô.'},
            {'day': 4, 'task': 'Theo dõi ổ nấm', 'desc': 'Kiểm tra xem các ổ nấm đỏ đã xẹp xuống và ngừng phát tán bào tử chưa.'},
            {'day': 10, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Chlorothalonil để tăng cường hiệu quả diệt nấm.'},
            {'day': 20, 'task': 'Kiểm tra râu ngô', 'desc': 'Đảm bảo nấm không bám vào phần râu và bẹ bắp.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Triazole', 'desc': 'Phun Tebuconazole hoặc Propiconazole nồng độ cao.'},
            {'day': 3, 'task': 'Đánh giá độ cháy lá', 'desc': 'Xác định xem thuốc có ngăn được hiện tượng cháy khô lá hàng loạt không.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục phun để bảo vệ các lá bao quanh bắp ngô.'},
            {'day': 15, 'task': 'Vệ sinh tàn dư', 'desc': 'Cắt bỏ và tiêu hủy các lá đã chết hoàn toàn.'},
            {'day': 25, 'task': 'Lên lịch luân canh', 'desc': 'Chuẩn bị kế hoạch trồng đậu hoặc lạc cho vụ tiếp theo.'}
        ]
    },
    'Corn Gray Leaf Spot': {
        'Mild': [
            {'day': 1, 'task': 'Làm sạch rơm rạ', 'desc': 'Dọn sạch tàn dư cây trồng từ vụ trước xung quanh gốc.'},
            {'day': 5, 'task': 'Theo dõi vết bệnh dài', 'desc': 'Kiểm tra các vết hình chữ nhật dọc gân lá ở các lá già dưới.'},
            {'day': 12, 'task': 'Xới đất thông thoáng', 'desc': 'Giảm độ ẩm vùng gốc để hạn chế nấm phát triển.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Propiconazole', 'desc': 'Sử dụng thuốc kháng nấm nội hấp phun ngay khi thấy vết bệnh.'},
            {'day': 4, 'task': 'Kiểm tra tầng lá trên', 'desc': 'Đảm bảo bệnh không chiếm quá 30% diện tích lá.'},
            {'day': 11, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Duy trì hiệu lực bảo vệ của thuốc trong điều kiện mưa ẩm.'},
            {'day': 21, 'task': 'Theo dõi độ chín hạt', 'desc': 'Đảm bảo bộ lá còn đủ xanh để nuôi hạt ngô.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Phun Pyraclostrobin', 'desc': 'Sử dụng Headline hoặc thuốc mạnh tương đương phun toàn diện.'},
            {'day': 2, 'task': 'Đánh giá hoại tử', 'desc': 'Theo dõi tốc độ cháy lá từ dưới lên trên sau khi phun.'},
            {'day': 6, 'task': 'Phun phối hợp đợt 2', 'desc': 'Sử dụng hỗn hợp Azoxystrobin và Propiconazole.'},
            {'day': 13, 'task': 'Thu hoạch sớm nếu cần', 'desc': 'Cân nhắc thu hoạch sớm nếu bộ lá bị cháy trên 80%.'},
            {'day': 25, 'task': 'Cày lật đất sâu', 'desc': 'Cày sâu để vùi lấp toàn bộ bào tử nấm cho vụ sau.'}
        ]
    },
    'Corn Northern Leaf Blight': {
        'Mild': [
            {'day': 1, 'task': 'Ngắt bỏ lá gốc', 'desc': 'Loại bỏ các lá già có vết bệnh hình thoi đầu tiên.'},
            {'day': 6, 'task': 'Phun Nano Bạc', 'desc': 'Sử dụng Nano Bạc để sát khuẩn bề mặt lá và thân.'},
            {'day': 15, 'task': 'Kiểm tra vết loét', 'desc': 'Theo dõi xem có vết bệnh mới phát sinh dọc gân lá không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Xử lý Azoxystrobin', 'desc': 'Phun thuốc diệt nấm nhóm Strobilurin lần 1.'},
            {'day': 5, 'task': 'Theo dõi vết hình thoi', 'desc': 'Xem các vết bệnh có khô tâm và ngừng lan rộng không.'},
            {'day': 12, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Propiconazole để luân chuyển hoạt chất.'},
            {'day': 22, 'task': 'Kiểm tra độ thông thoáng', 'desc': 'Tỉa bớt cỏ dại cạnh tranh và làm giảm độ ẩm ruộng.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Mancozeb', 'desc': 'Phun Mancozeb phối hợp với nấm đối kháng Trichoderma.'},
            {'day': 3, 'task': 'Kiểm tra điểm sinh trưởng', 'desc': 'Đảm bảo phần nõn ngô không bị nấm tấn công gây chết cây.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng thuốc nồng độ cao để cứu bộ lá còn xanh.'},
            {'day': 15, 'task': 'Dọn sạch lá cháy', 'desc': 'Thu gom toàn bộ phần lá đã bị cháy khô hoàn toàn.'},
            {'day': 25, 'task': 'Khử trùng đất vườn', 'desc': 'Rắc vôi bột nồng độ cao để diệt bào tử nấm tồn dư.'}
        ]
    },
    'Corn Fall Army Worm': {
        'Mild': [
            {'day': 1, 'task': 'Bắt sâu thủ công', 'desc': 'Bắt sâu vào sáng sớm hoặc chiều tối tại loa kèn.'},
            {'day': 3, 'task': 'Sử dụng chế phẩm Bt', 'desc': 'Phun Bacillus thuringiensis trực tiếp vào nõn ngô.'},
            {'day': 8, 'task': 'Kiểm tra lứa mới', 'desc': 'Theo dõi các vết xước nhỏ do sâu non mới nở gây ra.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun dịch chiết Neem', 'desc': 'Sử dụng dầu Neem nồng độ 0.5% xịt kỹ nách lá.'},
            {'day': 4, 'task': 'Đặt bẫy bả', 'desc': 'Sử dụng bẫy pheromone để thu hút và diệt sâu trưởng thành.'},
            {'day': 9, 'task': 'Phun thuốc sinh học', 'desc': 'Sử dụng Spinosad để tiêu diệt các ổ sâu ẩn nấp.'},
            {'day': 16, 'task': 'Vệ sinh mùn cưa', 'desc': 'Làm sạch phân sâu ở nõn cây để tránh thối ngọn.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị hóa học', 'desc': 'Phun Emamectin benzoate vào lúc trời mát.'},
            {'day': 2, 'task': 'Kiểm tra nõn cây', 'desc': 'Xác định xem điểm tăng trưởng có bị sâu cắn cụt không.'},
            {'day': 5, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng hoạt chất Chlorantraniliprole để diệt triệt để.'},
            {'day': 10, 'task': 'Theo dõi bắp ngô', 'desc': 'Kiểm tra xem sâu có xâm nhập vào hạt trong bắp không.'},
            {'day': 18, 'task': 'Bón phân hồi sức', 'desc': 'Bổ sung phân bón lá giàu đạm giúp cây ra lá mới.'},
            {'day': 28, 'task': 'Đánh giá lứa sâu kế', 'desc': 'Kiểm tra bướm đêm để chuẩn bị cho đợt phòng trừ tiếp theo.'}
        ]
    },
    'Corn Lethal Necrotic': {
        'Mild': [
            {'day': 1, 'task': 'Cách ly cây bệnh', 'desc': 'Nhổ bỏ và đốt ngay các cây có dấu hiệu vàng lá mép.'},
            {'day': 5, 'task': 'Kiểm soát côn trùng', 'desc': 'Phun thuốc thảo mộc diệt bọ trĩ và rầy xanh môi giới.'},
            {'day': 14, 'task': 'Rà soát toàn diện', 'desc': 'Kiểm tra kỹ các cây xung quanh vị trí vừa nhổ bỏ.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Diệt bọ trĩ/rầy xanh', 'desc': 'Sử dụng Imidacloprid để cắt đứt nguồn lây virus.'},
            {'day': 4, 'task': 'Theo dõi độ lùn', 'desc': 'Đánh dấu các cây bị chững lại so với đồng ruộng.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Thiamethoxam để tiêu diệt côn trùng môi giới còn sót.'},
            {'day': 18, 'task': 'Nhổ bỏ cây hoại tử', 'desc': 'Tiêu hủy các cây đã có vết cháy khô dọc gân lá.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Tiêu hủy vùng dịch', 'desc': 'Phá bỏ toàn bộ khu vực nhiễm bệnh để cứu phần còn lại.'},
            {'day': 2, 'task': 'Khử trùng ủng/dụng cụ', 'desc': 'Tuyệt đối không để virus lây lan qua chân tay người làm.'},
            {'day': 7, 'task': 'Rắc vôi toàn bộ luống', 'desc': 'Khử trùng đất sau khi nhổ bỏ cây bệnh nặng.'},
            {'day': 15, 'task': 'Dọn sạch cỏ dại', 'desc': 'Loại bỏ ký chủ phụ của virus xung quanh bờ ruộng.'},
            {'day': 30, 'task': 'Luân canh bắt buộc', 'desc': 'Chuyển sang trồng khoai lang hoặc lạc cho vụ sau.'}
        ]
    },
    'Corn Magnesium Deficiency': {
        'Mild': [
            {'day': 1, 'task': 'Phun Magie Sulfate', 'desc': 'Sử dụng muối Epsom pha loãng phun trực tiếp lên lá.'},
            {'day': 7, 'task': 'Theo dõi gân lá', 'desc': 'Kiểm tra xem màu xanh đã quay lại phần thịt lá chưa.'},
            {'day': 15, 'task': 'Bổ sung phân vi lượng', 'desc': 'Tưới bổ sung hỗn hợp vi lượng vào hệ thống nước.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Bón phân Kieserite', 'desc': 'Bón bổ sung Magie nồng độ cao vào gốc cây.'},
            {'day': 5, 'task': 'Phun lá đợt 2', 'desc': 'Sử dụng phân bón lá giàu Magie để phục hồi nhanh.'},
            {'day': 12, 'task': 'Kiểm tra pH đất', 'desc': 'Đo độ pH, nếu đất quá chua cần bón vôi để giải phóng Magie.'},
            {'day': 22, 'task': 'Theo dõi mép lá đỏ', 'desc': 'Đảm bảo sắc đỏ/tím ở mép lá cũ không lan rộng.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Bón vôi Dolomite', 'desc': 'Sử dụng vôi chứa Magie để cải tạo đất lâu dài.'},
            {'day': 3, 'task': 'Tưới hòa tan Magie', 'desc': 'Tưới đẫm dung dịch MgSO4 vào vùng rễ cây.'},
            {'day': 8, 'task': 'Phun lá đợt 3', 'desc': 'Duy trì cung cấp dinh dưỡng qua lá cho tầng lá ngọn.'},
            {'day': 15, 'task': 'Cắt bỏ lá chết', 'desc': 'Loại bỏ các lá già đã bị cháy khô hoàn toàn.'},
            {'day': 25, 'task': 'Đánh giá bắp ngô', 'desc': 'Kiểm tra xem sự thiếu hụt có làm hạt ngô bị lép không.'}
        ]
    },
    'Corn Aphids': {
        'Mild': [
            {'day': 1, 'task': 'Xịt nước áp lực', 'desc': 'Dùng vòi phun mạnh để đánh bật rệp ra khỏi nõn ngô.'},
            {'day': 4, 'task': 'Sử dụng xà phòng', 'desc': 'Phun dung dịch nước xà phòng loãng để diệt rệp còn sót.'},
            {'day': 10, 'task': 'Theo dõi nách lá', 'desc': 'Kiểm tra các khe hẹp xem rệp có tái xuất hiện không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun dầu Neem', 'desc': 'Sử dụng dầu Neem để bít lỗ thở và diệt rệp.'},
            {'day': 4, 'task': 'Kiểm soát kiến', 'desc': 'Diệt kiến xung quanh gốc vì chúng bảo vệ rệp.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục phun chế phẩm sinh học để diệt lứa rệp mới.'},
            {'day': 18, 'task': 'Làm sạch nấm muội', 'desc': 'Dùng nước sạch xịt rửa lớp nấm đen bám trên dịch rệp.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Phun Imidacloprid', 'desc': 'Sử dụng thuốc lưu dẫn mạnh để diệt sạch rệp ẩn nấp.'},
            {'day': 2, 'task': 'Kiểm tra râu ngô', 'desc': 'Đảm bảo rệp không làm hỏng khả năng thụ phấn.'},
            {'day': 6, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Thiamethoxam để tránh hiện tượng kháng thuốc.'},
            {'day': 12, 'task': 'Tỉa lá bị hại nặng', 'desc': 'Cắt bỏ các lá bị rệp bám dày đặc và đã xoăn tít.'},
            {'day': 22, 'task': 'Theo dõi bệnh virus', 'desc': 'Kiểm tra các dấu hiệu sọc lá do rệp truyền nhiễm.'}
        ]
    },
    'Corn Phosphorus Deficiency': {
        'Mild': [
            {'day': 1, 'task': 'Phun lân bón lá', 'desc': 'Sử dụng phân siêu lân (như 10-60-10) phun đều.'},
            {'day': 7, 'task': 'Theo dõi sắc tím', 'desc': 'Kiểm tra xem màu tím ở mép lá già có mờ dần không.'},
            {'day': 15, 'task': 'Xới tơi vùng rễ', 'desc': 'Giúp đất thoáng khí để rễ hấp thụ lân tốt hơn.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Bón thúc Super lân', 'desc': 'Bón phân lân vào gốc kết hợp vun gốc nhẹ.'},
            {'day': 5, 'task': 'Phun lá đợt 2', 'desc': 'Tiếp tục bổ sung lân qua lá để cây nhanh vươn cao.'},
            {'day': 12, 'task': 'Tưới kích rễ', 'desc': 'Sử dụng Humic để kích thích rễ phát triển mạnh.'},
            {'day': 22, 'task': 'Kiểm tra thân cây', 'desc': 'Đảm bảo thân cây cứng cáp và không bị mảnh khảnh.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Bón lân nung chảy', 'desc': 'Sử dụng lân Văn Điển bón lượng lớn quanh gốc.'},
            {'day': 3, 'task': 'Hòa lân tưới gốc', 'desc': 'Tưới dung dịch lân trực tiếp vào vùng rễ tích cực.'},
            {'day': 8, 'task': 'Phun lá đợt 3', 'desc': 'Duy trì cung cấp lân cho giai đoạn trỗ cờ.'},
            {'day': 15, 'task': 'Cân đối NPK', 'desc': 'Bổ sung thêm Kali để phối hợp với lân giúp bắp to.'},
            {'day': 30, 'task': 'Cải tạo đất hữu cơ', 'desc': 'Bón phân chuồng để giữ lân trong đất cho vụ sau.'}
        ]
    },
    'Corn Physoderma Brown Spot': {
        'Mild': [
            {'day': 1, 'task': 'Dọn sạch bẹ lá già', 'desc': 'Cắt bỏ các bẹ lá có chấm nhỏ không màu đầu tiên.'},
            {'day': 6, 'task': 'Rắc vôi bột gốc', 'desc': 'Khử trùng bề mặt đất để bào tử nấm không bắn lên.'},
            {'day': 15, 'task': 'Giảm mật độ trồng', 'desc': 'Tỉa bớt lá để vườn ngô nhận được nhiều ánh sáng hơn.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Copper Oxichloride', 'desc': 'Xịt kỹ vào các đốt thân và bẹ lá bằng thuốc đồng.'},
            {'day': 4, 'task': 'Theo dõi hạt lồi', 'desc': 'Kiểm tra gân chính xem các hạt nhỏ có lan rộng không.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Mancozeb để tăng hiệu quả bảo vệ bề mặt.'},
            {'day': 20, 'task': 'Kiểm tra độ giòn thân', 'desc': 'Lắc nhẹ thân xem có nguy cơ bị gãy đổ không.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp nội hấp', 'desc': 'Phun Tebuconazole hoặc Pyraclostrobin toàn bộ thân.'},
            {'day': 3, 'task': 'Cắm cọc chống đổ', 'desc': 'Gia cố cho cây để tránh bị gãy ngang ở các đốt thân.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục bảo vệ các đốt thân phía trên.'},
            {'day': 15, 'task': 'Tiêu hủy cây gãy', 'desc': 'Nhổ và mang đốt toàn bộ các cây đã bị mục gãy.'},
            {'day': 25, 'task': 'Xử lý đất triệt để', 'desc': 'Phun thuốc diệt nấm phổ rộng lên toàn bộ mặt luống.'}
        ]
    },
    'Corn Streak Virus': {
        'Mild': [
            {'day': 1, 'task': 'Bẫy dính màu vàng', 'desc': 'Đặt bẫy quanh vườn để theo dõi và bắt rầy xanh.'},
            {'day': 5, 'task': 'Kiểm tra sọc vàng', 'desc': 'Theo dõi các lá non xem có chấm vàng li ti mới không.'},
            {'day': 14, 'task': 'Dọn sạch cỏ bờ', 'desc': 'Loại bỏ nơi trú ngụ của côn trùng môi giới.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Diệt rầy xanh sinh học', 'desc': 'Sử dụng nấm Beauveria bassiana xịt vào chiều tối.'},
            {'day': 4, 'task': 'Theo dõi độ cao', 'desc': 'Xác định các cây bị lùn và sọc rõ nét dọc gân.'},
            {'day': 11, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục diệt rầy để ngăn chặn virus phát tán.'},
            {'day': 21, 'task': 'Loại bỏ cây sọc nặng', 'desc': 'Nhổ bỏ các cây đã bị virus chiếm hữu hoàn toàn.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Diệt rầy tổng lực', 'desc': 'Sử dụng thuốc hóa học mạnh như Buprofezin.'},
            {'day': 2, 'task': 'Đánh giá bắp lép', 'desc': 'Kiểm tra xem cây có khả năng kết hạt được hay không.'},
            {'day': 6, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Đảm bảo không còn rầy xanh trên toàn bộ diện tích.'},
            {'day': 12, 'task': 'Tiêu hủy tổng diện tích', 'desc': 'Nhổ bỏ sạch các cây lùn sọc để làm sạch vườn.'},
            {'day': 25, 'task': 'Thay đổi giống kháng', 'desc': 'Mua giống ngô đã được chứng nhận kháng virus MSV.'}
        ]
    },
    'Grape Black Rot': {
        'Mild': [
            {'day': 1, 'task': 'Vệ sinh giàn nho', 'desc': 'Dọn sạch lá và quả rụng dưới gốc và trên giàn.'},
            {'day': 5, 'task': 'Tỉa lá đốm nâu', 'desc': 'Cắt bỏ các lá có đốm tròn viền đen đậm đầu tiên.'},
            {'day': 12, 'task': 'Kiểm tra quả non', 'desc': 'Đảm bảo không có chấm đen li ti trên vỏ quả.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Mancozeb', 'desc': 'Xịt đều lên cả hai mặt lá và các chùm quả nho.'},
            {'day': 4, 'task': 'Theo dõi vết loét', 'desc': 'Xem các đốm trên quả có bị héo và khô lại không.'},
            {'day': 10, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Myclobutanil để tăng cường hiệu quả trị nấm.'},
            {'day': 18, 'task': 'Tỉa chùm bệnh', 'desc': 'Cắt bỏ các quả đã bị thối đen để tránh lây sang quả khác.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị Black Rot', 'desc': 'Sử dụng Systhane nồng độ cao cho toàn bộ giàn.'},
            {'day': 3, 'task': 'Theo dõi độ khô quả', 'desc': 'Đảm bảo nấm không làm héo toàn bộ các chùm quả.'},
            {'day': 8, 'task': 'Phun đợt 2', 'desc': 'Duy trì lịch trình phun 7 ngày/lần trong mùa ẩm.'},
            {'day': 15, 'task': 'Dọn dẹp triệt để', 'desc': 'Mang toàn bộ lá và quả bệnh đi đốt xa khu vực trồng.'},
            {'day': 25, 'task': 'Bón phân hồi sức', 'desc': 'Bổ sung phân bón lá giàu trung vi lượng giúp cây phục hồi.'}
        ]
    },
    'Grape Esca': {
        'Mild': [
            {'day': 1, 'task': 'Cắt tỉa cành bệnh', 'desc': 'Cắt sâu vào phần gỗ khỏe và bôi keo liền sẹo.'},
            {'day': 7, 'task': 'Sát trùng dụng cụ', 'desc': 'Khử trùng kéo bằng cồn sau mỗi vết cắt cành.'},
            {'day': 15, 'task': 'Theo dõi gân lá', 'desc': 'Kiểm tra các vết vàng nhạt giữa gân lá có lan không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Xử lý mạch dẫn', 'desc': 'Phun Fosetyl-Al để bảo vệ hệ thống dẫn nhựa của cây.'},
            {'day': 5, 'task': 'Theo dõi lá da báo', 'desc': 'Kiểm tra xem các vết cháy hình da báo có tăng thêm không.'},
            {'day': 12, 'task': 'Tưới Trichoderma', 'desc': 'Bổ sung nấm đối kháng vào vùng rễ để bảo vệ gốc.'},
            {'day': 22, 'task': 'Kiểm tra thân gỗ', 'desc': 'Gõ nhẹ vào thân xem có hiện tượng rỗng hoặc xốp không.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Apoplexy', 'desc': 'Cắt bỏ toàn bộ cành đã bị héo rũ đột ngột.'},
            {'day': 3, 'task': 'Sử dụng keo sát trùng', 'desc': 'Bôi thuốc gốc đồng vào các vết cắt lớn ở thân chính.'},
            {'day': 8, 'task': 'Phun lá đợt 2', 'desc': 'Tiếp tục sử dụng thuốc kháng nấm nội hấp mạnh.'},
            {'day': 15, 'task': 'Loại bỏ cây chết', 'desc': 'Nhổ bỏ các gốc nho đã bị khô hoàn toàn mạch dẫn.'},
            {'day': 30, 'task': 'Khử trùng đất sâu', 'desc': 'Xới đất và rắc vôi bột nồng độ cao để làm sạch đất.'}
        ]
    },
    'Grape Leaf Blight': {
        'Mild': [
            {'day': 1, 'task': 'Phun dịch Bordeaux', 'desc': 'Sử dụng dung dịch Bordeaux 1% để phòng nấm bề mặt.'},
            {'day': 6, 'task': 'Dọn sạch lá rụng', 'desc': 'Loại bỏ nguồn bào tử nấm Pseudocercospora dưới gốc.'},
            {'day': 14, 'task': 'Kiểm tra mặt dưới lá', 'desc': 'Theo dõi lớp nấm màu xám có tiếp tục phát triển không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Can thiệp Copper', 'desc': 'Phun Copper Oxychloride lên toàn bộ giàn nho.'},
            {'day': 4, 'task': 'Theo dõi đốm đỏ', 'desc': 'Kiểm tra xem các vết nâu đỏ ở mặt trên lá có khô lại không.'},
            {'day': 10, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Mancozeb để bảo vệ bộ lá đang phát triển.'},
            {'day': 20, 'task': 'Thông thoáng tán', 'desc': 'Tỉa bớt cành dặm để nắng có thể xuyên qua giàn.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Phun nội hấp mạnh', 'desc': 'Sử dụng Carbendazim hoặc Thiophanate-methyl.'},
            {'day': 3, 'task': 'Theo dõi độ rụng lá', 'desc': 'Xác định xem thuốc có ngăn được hiện tượng trút lá hàng loạt không.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục liệu trình điều trị để bảo vệ chùm quả.'},
            {'day': 15, 'task': 'Vệ sinh giàn triệt để', 'desc': 'Thu gom và đốt sạch toàn bộ lá rụng để diệt bào tử.'},
            {'day': 25, 'task': 'Hồi phục dinh dưỡng', 'desc': 'Phun phân bón lá giàu Kali để giúp quả ngọt hơn.'}
        ]
    },
    'Peach Bacterial Spot': {
        'Mild': [
            {'day': 1, 'task': 'Tỉa cành bệnh ban đầu', 'desc': 'Cắt bỏ lá có đốm đen nhỏ và bôi thuốc đồng.'},
            {'day': 5, 'task': 'Phun Nano Bạc', 'desc': 'Sát khuẩn toàn bộ tán cây đào bằng Nano Bạc sinh học.'},
            {'day': 12, 'task': 'Kiểm tra lỗ thủng', 'desc': 'Theo dõi xem lá có bị hiện tượng thủng lỗ li ti không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Sử dụng Đồng đỏ', 'desc': 'Phun Copper Hydroxide để tiêu diệt vi khuẩn Xanthomonas.'},
            {'day': 4, 'task': 'Theo dõi vỏ quả', 'desc': 'Đảm bảo trên quả đào không xuất hiện các vết loét sẫm màu.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục sử dụng chế phẩm đồng định kỳ mỗi 7-10 ngày.'},
            {'day': 20, 'task': 'Vệ sinh vườn đào', 'desc': 'Quét sạch lá rụng và rắc vôi bột quanh gốc cây.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Kháng sinh đặc trị', 'desc': 'Sử dụng Oxytetracycline phối hợp với thuốc gốc đồng.'},
            {'day': 2, 'task': 'Kiểm tra rụng lá', 'desc': 'Theo dõi tốc độ trút lá của cây sau khi can thiệp.'},
            {'day': 6, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Lặp lại liệu trình kháng sinh để bảo vệ điểm sinh trưởng.'},
            {'day': 13, 'task': 'Cắt tỉa sâu', 'desc': 'Loại bỏ toàn bộ các cành đã bị loét nặng và chết khô.'},
            {'day': 25, 'task': 'Khử trùng tầng đất', 'desc': 'Sử dụng thuốc diệt khuẩn đất chuyên dụng dưới tán cây.'}
        ]
    },
    'Potato Early Blight': {
        'Mild': [
            {'day': 1, 'task': 'Bổ sung dinh dưỡng', 'desc': 'Bón thêm phân đạm nhẹ giúp lá chân khỏe mạnh.'},
            {'day': 6, 'task': 'Theo dõi vòng đồng tâm', 'desc': 'Kiểm tra đốm đen hình bia bắn trên các lá sát mặt đất.'},
            {'day': 15, 'task': 'Tưới nước thấm', 'desc': 'Hạn chế tưới phun mưa, chuyển sang tưới rãnh.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Chlorothalonil', 'desc': 'Sử dụng thuốc phun toàn bộ ruộng khoai tây.'},
            {'day': 4, 'task': 'Kiểm tra quầng vàng', 'desc': 'Xem các vết bệnh có làm vàng toàn bộ lá chân không.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Mancozeb để luân phiên hoạt chất bảo vệ.'},
            {'day': 18, 'task': 'Tỉa lá già rạp', 'desc': 'Loại bỏ các lá già tiếp xúc trực tiếp với mặt đất ẩm.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Azoxystrobin', 'desc': 'Sử dụng Ridomil Gold phun nồng độ cao.'},
            {'day': 3, 'task': 'Đánh giá độ cháy', 'desc': 'Xác định diện tích bộ lá bị hỏng sau đợt phun đầu.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục bảo vệ các tầng lá phía trên để nuôi củ.'},
            {'day': 15, 'task': 'Kiểm tra củ khoai', 'desc': 'Đào thử để kiểm tra xem nấm có lây sang vỏ củ không.'},
            {'day': 25, 'task': 'Vệ sinh sau thu hoạch', 'desc': 'Dọn sạch thân lá và đốt bỏ hoàn toàn để diệt mầm nấm.'}
        ]
    },
    'Potato Late Blight': {
        'Mild': [
            {'day': 1, 'task': 'Tiêu hủy cây nghi nhiễm', 'desc': 'Nhổ ngay cây có đốm sũng nước và mang ra khỏi ruộng.'},
            {'day': 3, 'task': 'Rắc vôi bột toàn diện', 'desc': 'Khử trùng mặt đất để ngăn bào tử Phytophthora phát tán.'},
            {'day': 7, 'task': 'Theo dõi thời tiết', 'desc': 'Kiểm soát chặt chẽ nếu có mưa phùn và độ ẩm cao.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Metalaxyl', 'desc': 'Sử dụng hỗn hợp Metalaxyl + Mancozeb phun kỹ.'},
            {'day': 3, 'task': 'Kiểm tra mốc trắng', 'desc': 'Lật mặt dưới lá tìm lớp mốc mịn vào buổi sáng sớm.'},
            {'day': 7, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục liệu trình thuốc mỗi 5-7 ngày một lần.'},
            {'day': 12, 'task': 'Theo dõi thân đen', 'desc': 'Kiểm tra xem vết loét sũng nước có lan vào thân chính không.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Cứu vãn bằng Ranman', 'desc': 'Sử dụng Cyazofamid hoặc Revus nồng độ tối đa.'},
            {'day': 2, 'task': 'Theo dõi nhũn lá', 'desc': 'Xác định xem nấm có ngừng làm thối bộ lá sau 24h không.'},
            {'day': 5, 'task': 'Phun đợt 2', 'desc': 'Duy trì áp lực thuốc để bảo vệ phần lá còn xanh.'},
            {'day': 10, 'task': 'Phá bỏ dây khoai', 'desc': 'Cắt bỏ toàn bộ thân lá nếu bệnh không thể khống chế.'},
            {'day': 15, 'task': 'Thu hoạch củ nhanh', 'desc': 'Thu hoạch ngay để tránh nấm xâm nhập làm thối củ trong đất.'},
            {'day': 25, 'task': 'Khử trùng đất ruộng', 'desc': 'Xử lý hóa chất đất mạnh trước khi bước vào vụ mới.'}
        ]
    },
    'Squash Powdery Mildew': {
        'Mild': [
            {'day': 1, 'task': 'Liệu pháp sữa tươi', 'desc': 'Phun sữa tươi pha loãng tỉ lệ 1:9 lên mặt lá.'},
            {'day': 5, 'task': 'Theo dõi bột trắng', 'desc': 'Kiểm tra xem các vết phấn nhỏ có mờ dần đi không.'},
            {'day': 12, 'task': 'Hỗn hợp Baking soda', 'desc': 'Phun Baking soda phối hợp với dầu ăn để sát khuẩn.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun dầu Neem', 'desc': 'Sử dụng dầu Neem nồng độ 1% để diệt nấm phấn trắng.'},
            {'day': 4, 'task': 'Tăng thông thoáng tán', 'desc': 'Tỉa bớt lá già và các nhánh phụ quá dày.'},
            {'day': 10, 'task': 'Sử dụng vi sinh', 'desc': 'Phun Bacillus subtilis để ức chế nấm phát triển.'},
            {'day': 18, 'task': 'Kiểm tra cuống bí', 'desc': 'Đảm bảo phấn trắng không phủ kín cuống quả.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị hóa học', 'desc': 'Sử dụng Anvil (Difenoconazole) hoặc Topsin M.'},
            {'day': 3, 'task': 'Theo dõi độ giòn lá', 'desc': 'Kiểm tra xem lá có bị khô vàng và rụng sớm không.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng thuốc gốc lưu huỳnh nồng độ cao.'},
            {'day': 15, 'task': 'Dọn sạch lá tàn', 'desc': 'Thu gom và tiêu hủy các lá bị bao phủ hoàn toàn bởi phấn.'},
            {'day': 25, 'task': 'Bón phân Kali', 'desc': 'Tăng sức đề kháng cho dây bí giúp chống lại nấm.'}
        ]
    },
    'Strawberry Leaf Scorch': {
        'Mild': [
            {'day': 1, 'task': 'Vệ sinh lá dâu tây', 'desc': 'Ngắt bỏ lá có đốm tím nhỏ rải rác.'},
            {'day': 6, 'task': 'Lót rơm khô', 'desc': 'Đảm bảo lá không tiếp xúc trực tiếp với đất ẩm.'},
            {'day': 14, 'task': 'Kiểm tra tâm cây', 'desc': 'Theo dõi các lá non mới mọc xem có sạch bệnh không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Myclobutanil', 'desc': 'Xịt đều lên bề mặt lá dâu tây lần 1.'},
            {'day': 4, 'task': 'Theo dõi mép cháy', 'desc': 'Kiểm tra xem vết đốm tím có lan thành mảng cháy khô không.'},
            {'day': 10, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Captan để luân phiên hoạt chất trị nấm.'},
            {'day': 18, 'task': 'Tỉa bỏ ngó dâu', 'desc': 'Cắt bỏ ngó để cây tập trung sức đề kháng cho bộ lá.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Pristine', 'desc': 'Sử dụng hỗn hợp Pyraclostrobin + Boscalid.'},
            {'day': 3, 'task': 'Theo dõi rụng lá', 'desc': 'Đánh giá xem cây còn đủ lá để nuôi quả hay không.'},
            {'day': 8, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục điều trị nồng độ cao cho bộ lá non.'},
            {'day': 15, 'task': 'Cắt tỉa tổng lực', 'desc': 'Loại bỏ toàn bộ lá bệnh nặng và mang đi tiêu hủy.'},
            {'day': 25, 'task': 'Kích thích ra lá mới', 'desc': 'Tưới phân bón lá vi lượng giúp cây nhanh hồi phục.'}
        ]
    },
    'Tomato Early Blight': {
        'Mild': [
            {'day': 1, 'task': 'Tỉa lá chân cà chua', 'desc': 'Loại bỏ các lá già sát mặt đất có đốm vòng.'},
            {'day': 7, 'task': 'Phun dịch tỏi', 'desc': 'Sử dụng dung dịch tỏi ớt để xua đuổi bào tử nấm.'},
            {'day': 15, 'task': 'Theo dõi tầng lá thấp', 'desc': 'Kiểm tra vết bệnh có lan lên tầng lá thứ hai không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Mancozeb', 'desc': 'Sử dụng thuốc nấm phổ rộng phun đều hai mặt lá.'},
            {'day': 4, 'task': 'Kiểm tra tâm đốm', 'desc': 'Xem các vòng tròn đồng tâm có bị khô lại không.'},
            {'day': 11, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Chlorothalonil để tăng cường bảo vệ.'},
            {'day': 21, 'task': 'Vệ sinh gốc', 'desc': 'Dọn sạch cỏ và rác hữu cơ xung quanh luống cà chua.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị Score', 'desc': 'Sử dụng Difenoconazole nồng độ cao phun kỹ toàn cây.'},
            {'day': 3, 'task': 'Theo dõi độ héo', 'desc': 'Đảm bảo cây không bị trút lá hàng loạt gây cháy nắng quả.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục bảo vệ các lá bao quanh chùm hoa.'},
            {'day': 15, 'task': 'Bón phân Kali trắng', 'desc': 'Giúp thân cây cứng cáp và tăng chất lượng quả.'},
            {'day': 25, 'task': 'Tiêu hủy tàn dư', 'desc': 'Mang toàn bộ lá cháy khô đi đốt xa khu vực trồng.'}
        ]
    },
    'Tomato Late Blight': {
        'Mild': [
            {'day': 1, 'task': 'Bón lót Trichoderma', 'desc': 'Bổ sung nấm đối kháng vào gốc cây cà chua.'},
            {'day': 4, 'task': 'Theo dõi đốm sũng nước', 'desc': 'Kiểm tra kỹ rìa lá và cuống lá vào buổi sáng.'},
            {'day': 10, 'task': 'Rắc vôi mặt luống', 'desc': 'Hạn chế bào tử nấm Phytophthora phát tán từ đất.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Ridomil Gold', 'desc': 'Sử dụng Metalaxyl phối hợp Mancozeb phun ngay.'},
            {'day': 3, 'task': 'Kiểm tra tơ nấm trắng', 'desc': 'Xác định xem lớp mốc ở mặt dưới lá đã biến mất chưa.'},
            {'day': 7, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục điều trị định kỳ mỗi 5 ngày một lần.'},
            {'day': 14, 'task': 'Cắt bỏ cành thối', 'desc': 'Loại bỏ phần thân bị đen để ngăn chặn thối nhũn gốc.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Infinito', 'desc': 'Sử dụng Fluopicolide + Propamocarb cực mạnh.'},
            {'day': 2, 'task': 'Theo dõi quả thối', 'desc': 'Xác định tỉ lệ quả bị nhiễm bệnh xanh đen nhũn.'},
            {'day': 5, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục liệu trình để cứu lấy bộ khung cây.'},
            {'day': 10, 'task': 'Nhổ bỏ cây rữa nát', 'desc': 'Tiêu hủy sạch các cây đã bị nhũn hôi hoàn toàn.'},
            {'day': 18, 'task': 'Khử trùng vườn', 'desc': 'Phun dung dịch sát khuẩn nồng độ cao toàn bộ ruộng.'},
            {'day': 30, 'task': 'Xử lý đất sau dịch', 'desc': 'Phơi đất ít nhất 2 tuần trước khi trồng vụ mới.'}
        ]
    },
    'Tomato Bacterial Spot': {
        'Mild': [
            {'day': 1, 'task': 'Phun Nano Đồng', 'desc': 'Sử dụng đồng sinh học để sát khuẩn bề mặt lá.'},
            {'day': 6, 'task': 'Theo dõi đốm cứng', 'desc': 'Kiểm tra các chấm đen sần sùi có to thêm không.'},
            {'day': 15, 'task': 'Vệ sinh dụng cụ tỉa', 'desc': 'Khử trùng kéo bằng cồn để không làm lây lan vi khuẩn.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Sử dụng Kasumin', 'desc': 'Phun thuốc kháng sinh Kasugamycin lần 1.'},
            {'day': 4, 'task': 'Kiểm tra mép lá cháy', 'desc': 'Xem hiện tượng cháy vàng mép lá có thuyên giảm không.'},
            {'day': 11, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục khống chế vi khuẩn bằng chế phẩm đồng Hydroxide.'},
            {'day': 22, 'task': 'Tỉa lá bệnh nặng', 'desc': 'Loại bỏ lá có mật độ đốm đen dày đặc.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Phối hợp Đồng + Mancozeb', 'desc': 'Tạo màng bảo vệ kép cho cả lá và quả cà chua.'},
            {'day': 3, 'task': 'Theo dõi vỏ quả', 'desc': 'Đảm bảo quả không bị các vết loét cứng làm hỏng.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Lặp lại liệu trình kháng sinh sinh học mạnh.'},
            {'day': 15, 'task': 'Tiêu hủy cây hoại tử', 'desc': 'Nhổ bỏ cây bị đen vỏ thân và héo rũ không hồi phục.'},
            {'day': 28, 'task': 'Cải tạo đất mặt', 'desc': 'Rắc hỗn hợp vôi và thuốc diệt khuẩn quanh gốc.'}
        ]
    },
    'Tomato Septoria Leaf Spot': {
        'Mild': [
            {'day': 1, 'task': 'Hạn chế độ ẩm lá', 'desc': 'Tưới nước dưới gốc, tuyệt đối không tưới lên tán.'},
            {'day': 5, 'task': 'Theo dõi đốm xám', 'desc': 'Kiểm tra các chấm nhỏ viền đen có lan ra lá mới không.'},
            {'day': 12, 'task': 'Phun tinh dầu quế', 'desc': 'Sử dụng thảo mộc để sát khuẩn nấm Septoria.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Can thiệp Antracol', 'desc': 'Sử dụng Propineb phun đều bề mặt tán cây.'},
            {'day': 4, 'task': 'Dọn sạch lớp phủ gốc', 'desc': 'Thay rơm mới nếu lớp cũ đã bị nhiễm bào tử nấm.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Daconil để ngăn chặn bào tử nấm bắn lên.'},
            {'day': 20, 'task': 'Tỉa bớt lá già', 'desc': 'Tạo khoảng trống giữa mặt đất và tầng lá thấp nhất.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị Chlorothalonil', 'desc': 'Phun nồng độ cao cho toàn bộ khu vực bị nhiễm.'},
            {'day': 3, 'task': 'Theo dõi độ rụng lá', 'desc': 'Xác định xem nấm có ngừng làm chết lá từ dưới lên không.'},
            {'day': 8, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục điều trị để bảo vệ tầng lá ngọn.'},
            {'day': 15, 'task': 'Bổ sung vi lượng', 'desc': 'Phun phân bón lá giúp cây ra chồi mới thay thế lá rụng.'},
            {'day': 25, 'task': 'Vệ sinh vườn triệt để', 'desc': 'Thu gom toàn bộ lá bệnh rụng mang đi đốt sạch.'}
        ]
    },
    'Tomato Mosaic Virus': {
        'Mild': [
            {'day': 1, 'task': 'Liệu pháp sữa gầy', 'desc': 'Phun Skim milk để làm bất hoạt các hạt virus bề mặt.'},
            {'day': 5, 'task': 'Vệ sinh tay chân', 'desc': 'Rửa tay bằng xà phòng trước và sau khi chạm vào cây.'},
            {'day': 14, 'task': 'Theo dõi lá khảm', 'desc': 'Kiểm tra xem lá non có bị loang lổ xanh vàng không.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Tiêu diệt côn trùng hút', 'desc': 'Phun Actara để diệt rầy, rệp truyền virus.'},
            {'day': 4, 'task': 'Theo dõi biến dạng lá', 'desc': 'Xác định các cây có lá bị vặn xoắn bất thường.'},
            {'day': 10, 'task': 'Phun đợt 2', 'desc': 'Tiếp tục diệt côn trùng môi giới để cắt đứt nguồn lây.'},
            {'day': 20, 'task': 'Nhổ bỏ cây nghi nhiễm', 'desc': 'Tiêu hủy các cây có dấu hiệu khảm rõ nét.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Tiêu hủy tổng lực', 'desc': 'Nhổ và đốt toàn bộ cây có lá hình sợi chỉ.'},
            {'day': 3, 'task': 'Khử trùng nông cụ', 'desc': 'Ngâm kéo, dao vào nước Javel nồng độ 10%.'},
            {'day': 8, 'task': 'Rà soát diện rộng', 'desc': 'Kiểm tra toàn bộ vườn cà chua và các cây họ cà lân cận.'},
            {'day': 15, 'task': 'Dọn sạch cỏ ký chủ', 'desc': 'Loại bỏ các loại cỏ dại có thể chứa virus ToMV.'},
            {'day': 30, 'task': 'Luân canh cây trồng', 'desc': 'Chuyển sang trồng ngô hoặc hành tỏi ở vụ sau.'}
        ]
    },
    'Tomato Yellow Leaf Curl Virus': {
        'Mild': [
            {'day': 1, 'task': 'Dùng lưới mắt nhỏ', 'desc': 'Che chắn toàn bộ khu vực trồng để ngăn bọ phấn trắng.'},
            {'day': 6, 'task': 'Đặt bẫy vàng', 'desc': 'Sử dụng bẫy dính màu vàng để theo dõi mật độ côn trùng.'},
            {'day': 15, 'task': 'Kiểm tra ngọn vàng', 'desc': 'Theo dõi kỹ sắc tố vàng ở các chồi non trên cùng.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun dầu khoáng SK', 'desc': 'Tạo màng bảo vệ ngăn bọ phấn đậu và chích hút.'},
            {'day': 5, 'task': 'Theo dõi độ xoắn', 'desc': 'Kiểm tra mép lá có bị cuốn ngược lên thành hình chén không.'},
            {'day': 12, 'task': 'Phun thảo mộc đợt 2', 'desc': 'Sử dụng dịch chiết hạt neem để diệt bọ phấn.'},
            {'day': 22, 'task': 'Nhổ bỏ cây lùn', 'desc': 'Loại bỏ các cây đã bị virus làm ngừng vươn cao.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp Pymetrozine', 'desc': 'Sử dụng thuốc Chess để diệt bọ phấn tuyệt đối.'},
            {'day': 2, 'task': 'Kiểm tra bết ngọn', 'desc': 'Xác định các cây có ngọn bị túm lại không thể mọc mới.'},
            {'day': 7, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Diệt triệt để các lứa bọ phấn mới nở từ trứng.'},
            {'day': 15, 'task': 'Tiêu hủy sạch vườn', 'desc': 'Nếu nhiễm trên 60%, nên phá bỏ để tránh lây sang vùng khác.'},
            {'day': 25, 'task': 'Dọn dẹp môi trường', 'desc': 'Loại bỏ toàn bộ cây dại xung quanh có bọ phấn trú ngụ.'}
        ]
    },
    'Tomato Leaf Mold': {
        'Mild': [
            {'day': 1, 'task': 'Tăng thông gió nhà màng', 'desc': 'Mở tối đa các cửa thông gió và dùng quạt đảo chiều.'},
            {'day': 6, 'task': 'Kiểm tra màng mốc', 'desc': 'Theo dõi lớp lông tơ màu xám ở mặt dưới lá già.'},
            {'day': 14, 'task': 'Tưới nước buổi sáng', 'desc': 'Đảm bảo lá khô ráo trước khi trời tối.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun Chlorothalonil', 'desc': 'Sử dụng thuốc nấm bảo vệ bề mặt tán lá.'},
            {'day': 5, 'task': 'Theo dõi vệt vàng', 'desc': 'Xem các đốm vàng nhạt mặt trên lá có lan rộng không.'},
            {'day': 12, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Tiếp tục khống chế nấm Fulvia trong môi trường ẩm.'},
            {'day': 20, 'task': 'Tỉa lá bệnh nặng', 'desc': 'Loại bỏ các lá có lớp nhung xám phủ kín mặt dưới.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Can thiệp nội hấp mạnh', 'desc': 'Sử dụng Azoxystrobin nồng độ cao lần 1.'},
            {'day': 3, 'task': 'Đánh giá rụng lá', 'desc': 'Xác định xem thuốc có ngăn được hiện tượng rụng lá sớm không.'},
            {'day': 8, 'task': 'Phun đợt 2', 'desc': 'Sử dụng Cyproconazole để luân phiên hoạt chất.'},
            {'day': 15, 'task': 'Vệ sinh khung giàn', 'desc': 'Sát khuẩn các dây buộc và cột chống để diệt bào tử nấm.'},
            {'day': 25, 'task': 'Xông hơi nhà màng', 'desc': 'Sử dụng biện pháp xông hơi hóa chất để diệt nấm triệt để.'}
        ]
    },
    'Tomato Two Spotted Spider Mites': {
        'Mild': [
            {'day': 1, 'task': 'Rửa trôi bằng nước', 'desc': 'Xịt nước áp lực mạnh vào mặt dưới lá lúc nắng gắt.'},
            {'day': 5, 'task': 'Theo dõi chấm trắng', 'desc': 'Dùng kính lúp kiểm tra mật độ nhện ở mặt sau lá.'},
            {'day': 12, 'task': 'Tưới đủ nước gốc', 'desc': 'Duy trì độ ẩm tốt giúp cây chống lại nhện đỏ.'}
        ],
        'Moderate': [
            {'day': 1, 'task': 'Phun xà phòng nông nghiệp', 'desc': 'Làm tắc lỗ thở của nhện bằng dung dịch xà phòng.'},
            {'day': 4, 'task': 'Theo dõi màng tơ', 'desc': 'Đảm bảo không còn các màng nhện mỏng bao phủ tán lá.'},
            {'day': 10, 'task': 'Phun dầu Neem', 'desc': 'Sử dụng dầu Neem để diệt lứa nhện mới mọc từ trứng.'},
            {'day': 18, 'task': 'Bổ sung phân Kali', 'desc': 'Giúp thành tế bào lá dày lên, khó bị chích hút hơn.'}
        ],
        'Severe': [
            {'day': 1, 'task': 'Đặc trị Abamectin', 'desc': 'Sử dụng thuốc diệt nhện chuyên dụng nồng độ cao.'},
            {'day': 3, 'task': 'Kiểm tra ngọn cây', 'desc': 'Đảm bảo nhện không còn tập trung dày đặc ở phần ngọn.'},
            {'day': 8, 'task': 'Phun nhắc lại đợt 2', 'desc': 'Sử dụng Spiromesifen để tránh hiện tượng kháng thuốc.'},
            {'day': 15, 'task': 'Cắt bỏ lá cháy vàng', 'desc': 'Loại bỏ phần lá đã bị nhện hút kiệt nhựa.'},
            {'day': 25, 'task': 'Khống chế độ ẩm vườn', 'desc': 'Tạo môi trường ẩm cao để hạn chế sự sinh sản của nhện.'}
        ]
    }
}
