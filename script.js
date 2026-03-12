const API_KEY = 'HDEV-6424e066-5519-4322-a837-71ebe6465911';
const player = "x velxinssj";
const tag = "brr";
const region = "latam";

async function updateOverlay() {
    const textElement = document.getElementById('full-text');
    const iconElement = document.getElementById('rank-icon');

    try {
        // Generamos un número aleatorio para que el navegador NO use el caché
        const antiCache = Math.random().toString(36).substring(7);
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}?cache=${antiCache}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.status === 200 && result.data) {
            const data = result.data;
            let rankName = data.currenttierpatched.toUpperCase();
            let rr = data.ranking_in_tier;

            if (rankName.includes("IMMORTAL")) {
                rankName = rankName.replace("IMMORTAL", "INMORTAL");
            }

            const finalText = `${rankName} ${rr} RR`;
            
            // Solo actualizamos si el texto cambió para evitar parpadeos
            if (textElement.innerText !== finalText) {
                textElement.innerText = finalText;
                textElement.setAttribute('data-text', finalText);
                console.log("¡Rango actualizado en tiempo real!");
            }
            
            if (data.images && data.images.large) {
                iconElement.src = data.images.large;
                iconElement.style.display = 'block';
            }
        }

    } catch (error) {
        console.error("Error al actualizar:", error);
    }
}

// Actualizar apenas abre
updateOverlay();

// INTERVALO CORTO: Actualiza cada 30 segundos para que sea más "real"
// No pongas menos de 30 o la API te puede banear la key por exceso de peticiones.
setInterval(updateOverlay, 30000);