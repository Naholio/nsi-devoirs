document.addEventListener("DOMContentLoaded", function() {
    const page1 = document.getElementById('page_1');
    const page2 = document.getElementById('page_2');
    const validerPage1 = document.getElementById('validation-page-1');
    const validerPage2 = document.getElementById('validation-page-2');
    const titreInput = document.getElementById('titre');
    const auteurInput = document.getElementById('nom-auteur');
    const conteneurResultat = document.getElementById('conteneur-resultat');
    const conteneurYoutube = document.getElementById('conteneur-youtube');
    const conteneurParoles = document.getElementById('conteneur-paroles');
    const nouvelleRecherche = document.getElementById('nouvelle-recherche');

    // Placer automatiquement le curseur dans le champ du titre
    titreInput.focus();

    // Passer à la page 2 après avoir cliqué sur "Valider"
    validerPage1.addEventListener('click', function() {
        if (titreInput.value.trim() !== "") {
            page1.classList.add('animation_page_1');
            page2.classList.add('animation_page_2');
        }
    });

    // Envoyer les données à Flask lorsque l'utilisateur valide
    validerPage2.addEventListener('click', function() {
        const titre = titreInput.value.trim();
        const auteur = auteurInput.value.trim();

        if (titre && auteur) {
            // Faire une requête POST avec les données de l'utilisateur
            fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ song_title: titre, artist: auteur })
            })
            .then(response => response.json())
            .then(data => {
                if (data.youtube_link && data.lyrics) {
                    // Vérifier et convertir le lien YouTube pour l'embed
                    const embedLink = data.youtube_link.replace("watch?v=", "embed/");
                    
                    // Afficher les résultats (vidéo et paroles)
                    conteneurYoutube.innerHTML = `
                        <iframe width="100%" height="100%" src="${embedLink}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `;

                    conteneurParoles.innerHTML = `
                        <h3>Paroles de la chanson :</h3>
                        <pre>${data.lyrics}</pre>
                    `;

                    // Afficher le conteneur des résultats et désactiver le scroll global
                    conteneurResultat.style.display = 'grid';
                    conteneurResultat.scrollIntoView({ behavior: 'smooth' });
                    document.body.classList.add('no-scroll');
                } else {
                    alert("Informations introuvables !");
                }
            })
            .catch(error => console.error("Erreur:", error));
        }
    });

    // Gérer le bouton de nouvelle recherche
    nouvelleRecherche.addEventListener('click', function() {
        conteneurResultat.style.display = 'none';
        document.body.classList.remove('no-scroll');
        titreInput.value = "";
        auteurInput.value = "";
        page1.classList.remove('animation_page_1');
        page2.classList.remove('animation_page_2');
        page1.style.display = 'block';
        page2.style.display = 'none';
        titreInput.focus();
    });
});
