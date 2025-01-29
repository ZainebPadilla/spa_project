export default function PageDetail(container, gameId) {
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = `
                <div class="game-detail">
                    <h1>${data.name}</h1>
                    <img src="${data.background_image}" alt="${data.name}" />
                    <p>${data.description_raw}</p>
                </div>
            `;
             // Ajout d’un gestionnaire pour le bouton de retour
             document.getElementById("back-btn").addEventListener("click", () => {
                window.location.hash = ""; // Redirige vers la liste
            });
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails :", error);
            container.innerHTML = "<p>Impossible de charger les détails du jeu.</p>";
        });
}
