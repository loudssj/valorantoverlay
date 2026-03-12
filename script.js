const API_KEY = 'HDEV-6424e066-5519-4322-a837-71ebe6465911';
const player = "loud";
const tag = "brr";
const region = "latam";

async function updateOverlay() {
    const textElement = document.getElementById('full-text');
    const iconElement = document.getElementById('rank-icon');

    try {
        // Usamos una URL limpia para evitar bloqueos de parámetros
        const url = `https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        // Si la API responde pero con error de datos
        if (result.status !== 200) {
            console.error("Error de API:", result);
            textElement.innerText = "ERROR API " + result.status;
            return;
        }

        const data = result.data;
        if (!data || !data.currenttierpatched) {
            textElement.innerText = "SIN DATOS";
            return;
        }

        let rankName = data.currenttierpatched.toUpperCase();
        let rr = data.ranking_in_tier;

        // Ajuste de nombre a español
        if (rankName.includes("IMMORTAL")) {
            rankName = rankName.replace("IMMORTAL", "INMORTAL");
        }

        const finalText = `${rankName} ${rr} RR`;
        
        // Actualizar interfaz
        textElement.innerText = finalText;
        textElement.setAttribute('data-text', finalText); // Para el brillo
        
        if (data.images && data.images.large) {
            iconElement.src = data.images.large;
            iconElement.style.display = 'block';
        }

        console.log("Actualizado: " + finalText);

    } catch (error) {
        console.error("Error de conexión:", error);
        textElement.innerText = "ERROR RED";
    }
}

// Ejecutar al cargar la página
updateOverlay();

// Actualizar cada 60 segundos
setInterval(updateOverlay, 60000);