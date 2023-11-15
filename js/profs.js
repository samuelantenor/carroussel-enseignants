(function () {
    let url = "http://localhost:8080/5w5/wp-json/wp/v2/posts?categories=2&per_page=30";
    let titre;
    let divImages = document.querySelector('.images');
    let currentIndex = 0;
    let articlesData = [];
    let featuredImage;

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("La requête a échoué avec le statut " + response.status);
            }
            return response.json();
        })
        .then(function (data) {
            console.log("Variable data", data);
            data.forEach(function (article) {
                titre = article.title.rendered;
                console.log(titre);
                afficherEnseignants();
            });
        })
        .catch(function (error) {
            console.error("Erreur lors de la récupération des données :", error);
        });

    function afficherEnseignants() {
        let urlEnseignants = "http://localhost:8080/5w5/wp-json/wp/v2/posts?categories=2&_embed";
        fetch(urlEnseignants)
            .then(response => response.json())
            .then(data => {
                articlesData = data;
                updateArticleDisplay();
            })
            .catch(error => console.log(error));
    }

    function toggleArticleContent(index) {
        const allArticleContents = document.querySelectorAll('.article-content');
        const targetArticleContent = document.querySelector(`.article-content[data-index="${index}"]`);
        allArticleContents.forEach(content => {
            content.style.display = 'none'; // Hide all article contents
            content.parentElement.classList.remove('expanded'); // Remove expanded class from parent
        });
        targetArticleContent.style.display = 'block'; // Show the target article content
        targetArticleContent.parentElement.classList.add('expanded'); // Add expanded class to parent
    }
    
    function updateArticleDisplay() {
        divImages.innerHTML = ""; // Clear the container first.
    
        // Show only 4 articles at a time
        for (let i = 0; i < 4; i++) {
            let displayIndex = (currentIndex + i) % articlesData.length;
            const article = articlesData[displayIndex];
            let featuredImgSrc = getFeaturedImageSrc(article);
    
            let articleElement = createArticleElement(article, featuredImgSrc, displayIndex);
            divImages.appendChild(articleElement);
        }
    }
    

    function createArticleElement(article, imgSrc, index) {
        const articleElement = document.createElement("div");
        articleElement.className = "article";
        articleElement.innerHTML = `
            <div class="article-content" data-index="${index}" style="display: none;">
                <h4>${article.title.rendered}</h4>
                <p>${article.content.rendered}</p>
            </div>
            <img src="${imgSrc}" alt="${article.title.rendered}" class="article-image" data-index="${index}" />
        `;

        const imgElement = articleElement.querySelector('.article-image');
        imgElement.addEventListener('click', function () {
            toggleArticleContent(index);
        });

        return articleElement;
    }

    function getFeaturedImageSrc(article) {
        let featuredImgSrc = "";
        if (article._embedded && article._embedded["wp:featuredmedia"]) {
            featuredImage = article._embedded["wp:featuredmedia"][0];
            if (featuredImage.source_url) {
                featuredImgSrc = featuredImage.source_url;
            }
        }
        return featuredImgSrc;
    }

    // Navigation buttons
    const leftButton = document.querySelector('.btn-prev');
    const rightButton = document.querySelector('.btn-next');

    leftButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 4 + articlesData.length) % articlesData.length;
    updateArticleDisplay();
    });

    rightButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 4) % articlesData.length;
    updateArticleDisplay();
    });

})();
