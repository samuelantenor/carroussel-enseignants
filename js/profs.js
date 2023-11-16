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
        const allArticles = document.querySelectorAll('.article');
        const allArticleContents = document.querySelectorAll('.article-content');
        const clickedArticleContent = document.querySelector(`.article-content[data-index="${index}"]`);
    
        // First, remove 'expanded' class from all articles and hide their content
        allArticles.forEach(article => {
            article.classList.remove('expanded');
        });
        allArticleContents.forEach(content => {
            content.style.display = 'none';
        });
    
        // Then, add 'expanded' class to the clicked article and show its content
        clickedArticleContent.style.display = 'block';
        clickedArticleContent.closest('.article').classList.add('expanded');
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
    articleElement.dataset.index = index; // Add a data-index attribute for identification

    articleElement.innerHTML = `
        <div class="article-content" data-index="${index}">
            <h4>${article.title.rendered}</h4>
            <p>${article.excerpt.rendered}</p> <!-- Assuming you want to show excerpt -->
        </div>
        <img src="${imgSrc}" alt="${article.title.rendered}" class="article-image" data-index="${index}" />
    `;

    // This event listener handles the article click
    articleElement.addEventListener('click', function() {
        // Remove any previously cloned expanded articles
        const existingExpanded = document.querySelector('.article.expanded');
        if (existingExpanded) {
            existingExpanded.remove();
        }

        // Clone the clicked article
        const clone = this.cloneNode(true);
        clone.classList.add('expanded'); // Add the 'expanded' class to the clone

        // Append the clone to the carousel container or another specified container
        divImages.appendChild(clone);

      
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
