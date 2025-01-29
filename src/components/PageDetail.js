// Fonction pour gérer le clic sur un développeur et rediriger l'utilisateur vers la page correspondante
function handleDeveloperClick(developer) {
    window.location.hash = `#developer/${developer}`;
}


// Fonction pour afficher les détails d'un jeu spécifique
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
                    <p><strong>Développeur(s):</strong>
                        ${data.developers.map(developer => 
                            `<a href="javascript:void(0);" onclick="handleDeveloperClick('${developer.name}')">${developer.name}</a>`
                        ).join(", ")}
                    </p>
                </div>
            `;
             
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des détails :", error);
            container.innerHTML = "<p>Impossible de charger les détails du jeu.</p>";
        });
        console.log("gameId reçu dans PageDetail :", gameId); 

    }
