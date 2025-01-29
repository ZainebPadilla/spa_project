const apiKey = process.env.API_KEY; // Récupère la clé API depuis les variables d'environnement(.env)
let currentPage = 1; //page actuelle pour la pagination
const gamesPerPage = 9; //nombre de jeux affichés par lot
let totalGamesDisplayed = 0; //compteur du nombre total de jeux affiché

function GameCard(game) {
    return `
        <div class="game-card">
            <h3>${game.name}</h3>
            <img src="${game.background_image}" alt="${game.name}">
            <p>Note : ${game.rating}/5</p>
            <a href="#game/${game.id}">Voir les détails</a>
        </div>
    `;
}

export default function PageList(container, searchQuery = "", selectedPlatform = "") {
    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&page_size=9`;

    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let games = data.results; // Récupère la liste des jeux depuis l'API

            // Filtrage si une recherche est effectuée
            if (searchQuery) {
                games = games.filter(game =>
                    game.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            } 


            //filtrer les jeux par plateforme :
            if (selectedPlatform) {
                games = games.filter(game =>
                    game.platforms.some(platform => platform.platform.name === selectedPlatform)
                );
            }

 
             // Si aucun jeu trouvé
             if (games.length === 0) {
                container.innerHTML = "<p>Aucun jeu trouvé.</p>";
                return;
            }
    

        //ajout bouton show :
        function renderGames() {
            const gamesToShow = games.slice(0, totalGamesDisplayed + gamesPerPage); //Sélectionne els jeux à afficher
            totalGamesDisplayed = gamesToShow.length; // Met à jour le compteur

            container.innerHTML = `
            <div class="game-list">
                ${gamesToShow.map(GameCard).join("")} <!-- Affichage des jeux -->
            </div>

            ${totalGamesDisplayed < 27? '<button id="show-more"> Show more </button>' : ''}
            `;

            //ajouter un listener sur le clic du bouton show more :
            const showMoreButton = document.getElementById("show-more");
            if (showMoreButton) {
                showMoreButton.addEventListener("click", renderGames)
            }

        }

        renderGames(); //affiche les jeux du chargement de la page avec le bouton show more

    })
        .catch(error => {
            console.error("Erreur lors de la récupération des jeux :", error);
            container.innerHTML = "<p>Impossible de charger les jeux.</p>";
        });

}
