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
  
    function resetAnimation(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = '';
        }, 0);
    }
  
    function updateArticleDisplay() {
        divImages.innerHTML = "";
        const article = articlesData[currentIndex];
        const uneImage = document.createElement("div");
        uneImage.className = "article";
        uneImage.innerHTML = `
            <h4>${article.title.rendered}</h4>
            <p>${article.content.rendered}</p>
        `;
        if (article._embedded && article._embedded["wp:featuredmedia"]) {
            featuredImage = article._embedded["wp:featuredmedia"][0];
            if (featuredImage.source_url) {
                uneImage.innerHTML += `<img src="${featuredImage.source_url}" alt="${article.title.rendered}" />`;
            }
        }
        divImages.appendChild(uneImage);
        resetAnimation(uneImage);
  
        const allImages = divImages.querySelectorAll('img');
        allImages.forEach(img => img.classList.remove('active'));
        const activeImage = divImages.querySelector(`img[src="${featuredImage.source_url}"]`);
        if (activeImage) {
            activeImage.classList.add('active');
        }
    }
  
    const leftButton = document.querySelector('.btn-prev');
    const rightButton = document.querySelector('.btn-next');
  
    leftButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + articlesData.length) % articlesData.length;
        updateArticleDisplay();
    });
  
    rightButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % articlesData.length;
        updateArticleDisplay();
    });
  })();
  