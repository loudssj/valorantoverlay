const API_KEY = 'HDEV-6424e066-5519-4322-a837-71ebe6465911';
const BASE_URL = 'https://api.henrikdev.xyz/valorant/v1/mmr/latam/loud/brr';

async function updateOverlay() {
    try {
        const response = await fetch(`${BASE_URL}?t=${Date.now()}`, {
            headers: { 'Authorization': API_KEY }
        });

        const result = await response.json();
        if (result.status !== 200) return;

        const data = result.data;
        const textElement = document.getElementById('full-text');
        const iconElement = document.getElementById('rank-icon');

        let rankName = data.currenttierpatched.toUpperCase();
        let rr = data.ranking_in_tier;

        if (rankName.includes("IMMORTAL")) {
            rankName = rankName.replace("IMMORTAL", "INMORTAL");
        }

        const finalText = `${rankName} ${rr} RR`;
        textElement.innerText = finalText;
        textElement.setAttribute('data-text', finalText); 
        
        iconElement.src = data.images.large; 
        iconElement.style.display = 'block';

    } catch (e) {
        console.error("Error:", e);
    }
}

updateOverlay();
setInterval(updateOverlay, 60000);