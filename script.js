const API_KEY = 'HDEV-6424e066-5519-4322-a837-71ebe6465911';
// Usamos la URL sin el 'nocache' manual primero para evitar errores de cabeceras
const BASE_URL = 'https://api.henrikdev.xyz/valorant/v1/mmr/latam/loud/brr';

async function updateOverlay() {
    const textElement = document.getElementById('full-text');
    const iconElement = document.getElementById('rank-icon');

    try {
        // Añadimos un timestamp simple para evitar el caché de GitHub
        const response = await fetch(`${BASE_URL}?cache_bust=${Date.now()}`, {
            method: 'GET',
            headers: { 
                'Authorization': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error API: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 200 && result.data) {
            const data = result.data;
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
            console.log("Actualizado con éxito");
        } else {
            textElement.innerText = "DATOS NO DISPONIBLES";
        }

    } catch (e) {
        console.error("Error detallado:", e);
        // Esto te ayudará a saber si es un error de red o de API
        textElement.innerText = "ERROR DE CONEXIÓN";
    }
}

// Ejecutar al cargar
updateOverlay();
// Actualizar cada 60 segundos
setInterval(updateOverlay, 60000);