const apiKey = process.env.API_KEY; // Récupère la clé API depuis les variables d'environnement(.env)
const gamesPerPage = 9; //nombre de jeux affichés par lot
let totalGamesDisplayed = 9; // Compteur du nombre total de jeux affichés (initialisé à `gamesPerPage`)

// Fonction pour gérer le clic sur un genre et rediriger l'utilisateur vers la page correspondante
function handleGenreClick(genre) {
    window.location.hash = `#genre/${genre}`;  // Change l'URL pour refléter le genre sélectionné
}

// Fonction pour afficher une carte de jeu avec ses détails et des liens filtrables
function GameCard(game) {
    return `
        <div class="game-card">
            <h3>${game.name}</h3>
            <img src="${game.background_image}" alt="${game.name}">
            <p>Note : ${game.rating}/5</p>
            <a href="#game/${game.id}">Voir les détails</a>
            <!-- gestionnaire d'événements pour rediriger l'utilisateur vers une nouvelle URL avec un hash spécifique : -->
            <div class="tags">
                ${game.genres.map(genre => 
                    `<a href="javascript:void(0);" class="genre-link" onclick="handleGenreClick('${genre.name}')">${genre.name}</a>`
                ).join(", ")}
            </div>
        </div>
    `;
}

// Fonction pour afficher la liste des jeux avec un filtre basé sur l'URL
export default async function PageList(container, searchQuery = "", selectedPlatform = "") {
    
    //mettre à jour la requête API pour afficher les jeux de genre :
    const path = window.location.hash.substring(1); // Récupère l'URL actuelle sans le '#'
    let genreFilter = path.startsWith('genre/') ? path.split('/')[1] : "";// Vérifie si l'utilisateur a filtré par genre

     // Construit l'URL de l'API avec ou sans filtre genre
    const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-added&page_size=27${genreFilter ? `&genres=${genreFilter}` : ""}`;
   
    // Récupération des données de l'API
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let games = data.results || [];

        // Filtrer les jeux par recherche
        if (searchQuery) {
            games = games.filter(game =>
                game.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrer les jeux par plateforme
        if (selectedPlatform) {
            games = games.filter(game =>
                game.platforms.some(platform => platform.platform.name === selectedPlatform)
            );
        }


        //ajout bouton show :
        function renderGames() {
            const gamesToShow = games.slice(0, totalGamesDisplayed); //Sélectionne els jeux à afficher
            container.innerHTML = `
                <input type="text" id="search-input" placeholder="Rechercher un jeu..." value="${searchQuery}">
                <div class="game-list">
                    ${gamesToShow.map(GameCard).join("")}
                </div>
                ${totalGamesDisplayed < games.length ? '<button id="show-more">Show More</button>' : ''}
            `;

             // Ajout d'un listener pour la recherche en direct
             document.getElementById("search-input").addEventListener("input", (e) => {
                totalGamesDisplayed = gamesPerPage; // Réinitialiser l'affichage à chaque nouvelle recherche
                PageList(container, e.target.value, selectedPlatform);
            });

            //ajouter un listener sur le clic du bouton show more :
            const showMoreButton = document.getElementById("show-more");
            if (showMoreButton) {
                showMoreButton.addEventListener("click", () => {
                    totalGamesDisplayed += gamesPerPage;
                    renderGames();
                });
            }
        }

        renderGames(); //affiche les jeux du chargement de la page avec le bouton show more

    }
        catch(error) {
            console.error("Erreur lors de la récupération des jeux :", error);
            container.innerHTML = "<p>Impossible de charger les jeux.</p>";
        };

}

window.handleGenreClick = handleGenreClick;
