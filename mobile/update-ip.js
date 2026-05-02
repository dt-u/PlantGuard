const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    // Prioritize Wi-Fi and Ethernet
    const priorityNames = ['wi-fi', 'ethernet', 'wlan', 'en0', 'eth0'];
    
    let fallbackIp = null;

    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                const lowerName = devName.toLowerCase();
                if (priorityNames.some(p => lowerName.includes(p))) {
                    return alias.address;
                }
                fallbackIp = alias.address;
            }
        }
    }
    return fallbackIp || '127.0.0.1';
}

const ip = getLocalIp();
const dirPath = path.join(__dirname, 'src', 'api');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

const configPath = path.join(dirPath, 'ip-config.json');

const content = JSON.stringify({ ip }, null, 2);
fs.writeFileSync(configPath, content);
console.log(`\n[IP Discovery] Detected local IP: ${ip}`);
console.log(`[IP Discovery] Updated src/api/ip-config.json\n`);
