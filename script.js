const API_KEY = 'HDEV-6424e066-5519-4322-a837-71ebe6465911';
const player = "loud";
const tag = "brr";
const region = "latam";

async function updateOverlay() {
    const container = document.getElementById('overlay-container');
    const textElement = document.getElementById('full-text');
    const topElement = document.getElementById('top-rank');
    const iconElement = document.getElementById('rank-icon');

    try {
        const time = Date.now();
        // 1. Petición de MMR normal
        const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${region}/${player}/${tag}?cache=${time}`, {
            headers: { 'Authorization': API_KEY }
        });
        const result = await response.json();

        if (result.status === 200 && result.data) {
            const data = result.data;
            let rankName = data.currenttierpatched.toUpperCase();
            
            // Lógica Radiant / Inmortal
            if (rankName.includes("RADIANT")) {
                container.classList.add('radiant-mode');
                rankName = "RADIANTE";
            } else {
                container.classList.remove('radiant-mode');
                rankName = rankName.replace("IMMORTAL", "INMORTAL");
            }

            textElement.innerText = `${rankName} ${data.ranking_in_tier} RR`;
            textElement.setAttribute('data-text', textElement.innerText);
            iconElement.src = data.images.large;
            iconElement.style.display = 'block';

            // 2. FORZAR ACTUALIZACIÓN DEL TOP (Leaderboard Directo)
            // Esto consulta la tabla de posiciones en lugar del perfil, es más rápido.
            const lbRes = await fetch(`https://api.henrikdev.xyz/valorant/v1/leaderboard/${region}?name=${player}&tag=${tag}`, {
                headers: { 'Authorization': API_KEY }
            });
            const lbData = await lbRes.json();

            if (lbData.status === 200 && lbData.data && lbData.data.length > 0) {
                topElement.innerText = `TOP #${lbData.data[0].leaderboardRank}`;
            } else if (data.leaderboard_rank) {
                topElement.innerText = `TOP #${data.leaderboard_rank}`;
            } else {
                // Si la API sigue sin responder, mantenemos tu top actual
                topElement.innerText = "TOP #1239"; 
            }
        }
    } catch (e) { console.error(e); }
}

updateOverlay();
// 30 segundos es lo ideal para no ser baneado de la API y mantener tiempo real.
setInterval(updateOverlay, 30000);