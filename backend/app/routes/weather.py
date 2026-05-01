import os
from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

DEFAULT_LAT = os.getenv("WEATHER_LAT", os.getenv("OPENWEATHER_LAT", "21.0285"))
DEFAULT_LON = os.getenv("WEATHER_LON", os.getenv("OPENWEATHER_LON", "105.8542"))
RAINY_WEATHER_CODES = {
    51, 53, 55, 56, 57,  # drizzle/freezing drizzle
    61, 63, 65, 66, 67,  # rain/freezing rain
    80, 81, 82,          # rain showers
}
STORM_CODES = {95, 96, 99}
FOG_CODES = {45, 48}
SNOW_CODES = {71, 73, 75, 77, 85, 86}


def _build_alert(status: str, title: str, message: str, recommendation: str, condition: str):
    return {
        "status": status,
        "title": title,
        "message": message,
        "recommendation": recommendation,
        "condition": condition,
    }


@router.get("/weather-alert")
def get_weather_alert():
    weather_url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": DEFAULT_LAT,
        "longitude": DEFAULT_LON,
        "hourly": (
            "relative_humidity_2m,weather_code,temperature_2m,"
            "wind_speed_10m,precipitation_probability"
        ),
        "forecast_days": 3,
        "timezone": "auto",
    }

    try:
        response = requests.get(weather_url, params=params, timeout=15)
        response.raise_for_status()
        forecast_data = response.json()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Weather service error: {exc}") from exc

    hourly = forecast_data.get("hourly", {})
    humidities = hourly.get("relative_humidity_2m", [])
    weather_codes = hourly.get("weather_code", [])
    temperatures = hourly.get("temperature_2m", [])
    wind_speeds = hourly.get("wind_speed_10m", [])
    rain_probabilities = hourly.get("precipitation_probability", [])
    length = min(
        len(humidities),
        len(weather_codes),
        len(temperatures),
        len(wind_speeds),
        len(rain_probabilities),
    )

    # Counters for multi-condition scoring across next 3 days.
    fungal_risk_hits = 0
    storm_hits = 0
    heat_hits = 0
    cold_hits = 0
    fog_hits = 0
    heavy_rain_hits = 0

    for i in range(length):
        humidity = humidities[i] or 0
        weather_code = weather_codes[i]
        temp = temperatures[i] or 0
        wind = wind_speeds[i] or 0
        rain_probability = rain_probabilities[i] or 0

        if humidity > 80 and weather_code in RAINY_WEATHER_CODES:
            fungal_risk_hits += 1
        if weather_code in STORM_CODES or wind >= 35:
            storm_hits += 1
        if temp >= 34 and humidity < 75:
            heat_hits += 1
        if temp <= 16:
            cold_hits += 1
        if weather_code in FOG_CODES and humidity >= 85:
            fog_hits += 1
        if rain_probability >= 80 and weather_code in RAINY_WEATHER_CODES:
            heavy_rain_hits += 1
        if weather_code in SNOW_CODES:
            cold_hits += 2  # Snow condition is harsher than normal cold.

    # Priority order: severe weather first, then disease and crop stress risks.
    if storm_hits >= 2:
        return _build_alert(
            status="danger",
            title="CẢNH BÁO GIÔNG/BÃO MẠNH",
            message=(
                "Dự báo có giông hoặc gió mạnh trong 72 giờ tới. Nguy cơ gãy cành, đổ cây "
                "và phát tán mầm bệnh qua nước bắn."
            ),
            recommendation=(
                "Gia cố giàn, thoát nước gấp, tỉa cành yếu và tạm dừng phun thuốc khi có mưa giông."
            ),
            condition="storm_or_strong_wind",
        )

    if fungal_risk_hits >= 3 or heavy_rain_hits >= 2:
        return _build_alert(
            status="danger",
            title="CẢNH BÁO RỦI RO DỊCH BỆNH CAO",
            message=(
                "Độ ẩm cao kèm mưa xuất hiện nhiều khung giờ trong 3 ngày tới, điều kiện thuận lợi "
                "cho nấm bệnh và thối lá lây lan."
            ),
            recommendation=(
                "Ưu tiên phun chế phẩm sinh học phòng nấm, tăng thông thoáng tán lá và kiểm tra ổ bệnh sớm."
            ),
            condition="high_humidity_with_rain",
        )

    if heat_hits >= 3:
        return _build_alert(
            status="warning",
            title="CẢNH BÁO NẮNG NÓNG KÉO DÀI",
            message=(
                "Nhiệt độ cao liên tục có thể gây sốc nhiệt, cháy lá và giảm sức đề kháng tự nhiên của cây."
            ),
            recommendation=(
                "Tăng tưới nhỏ giọt sáng sớm/chiều muộn, phủ gốc giữ ẩm và tránh bón đạm liều cao."
            ),
            condition="heat_stress",
        )

    if cold_hits >= 3:
        return _build_alert(
            status="warning",
            title="CẢNH BÁO THỜI TIẾT LẠNH",
            message=(
                "Nhiệt độ thấp kéo dài có thể làm cây chậm phát triển, dễ nhiễm bệnh do sức đề kháng giảm."
            ),
            recommendation=(
                "Giữ ấm vùng rễ, giảm tưới vào đêm muộn và theo dõi lá non để phát hiện tổn thương sớm."
            ),
            condition="cold_stress",
        )

    if fog_hits >= 2:
        return _build_alert(
            status="warning",
            title="CẢNH BÁO SƯƠNG MÙ ẨM CAO",
            message=(
                "Sương mù dày với ẩm độ cao làm lá ướt lâu, tăng nguy cơ nấm bề mặt và đốm lá."
            ),
            recommendation=(
                "Tăng thông gió, tỉa tán và hạn chế tưới phun mưa để giảm thời gian ẩm trên lá."
            ),
            condition="fog_high_humidity",
        )

    return _build_alert(
        status="safe",
        title="Môi trường ổn định",
        message="Thời tiết 3 ngày tới tương đối thuận lợi, nguy cơ dịch bệnh ở mức thấp.",
        recommendation="Duy trì lịch chăm sóc hiện tại và kiểm tra vườn định kỳ mỗi ngày.",
        condition="stable_weather",
    )
