//Modo Nocturno
modoNoche = document.querySelector('#modoNoche');
logo = document.getElementById('logo');
newGifo = document.querySelector('#newGifo');
night_mode = localStorage.getItem("night_mode");

//Para poner el modo con el que se cerro la pagina Nocturno - Diurno
window.onload = function() {
    if (night_mode.match("noche")) {
        modoNoche.click();
    }
  };

trendingGifos = document.getElementById("trending_gifos_fav");

//Para que cambie el Html del trending cuando la pantalla es menor a 700px
if (window.matchMedia("(max-width: 700px)").matches) {
  console.log("Se ejecuta el if")
  trendingGifos.innerHTML = `
  <h2 class="title2">Trending GIFOS</h2>
  <p>Mira los últimos GIFOS de nuestra comunidad.</p>
  <button id="btn-down"><img src="./Style/assets/button-slider-left.svg" alt="atras"></button>    
  <div id="trending_favorites" class="trending"></div>    
  <button id="btn-up"><img src="./Style/assets/Button-Slider-right.svg" alt="adelante"></button>`; 
  console.log(trendingGifos); 
}else{
    console.log("no se ejecuta el modo mobile");
}

//Tendencias
let sliderTrending2 = document.getElementById("trending_favorites");
let trendingContainer2 = document.getElementById("trending_container");
let btnDown2 = document.getElementById("btn-down");
let btnUp2 = document.getElementById("btn-up");

// API KEY de Giphy 
api_Key = "NrHH3zVQo9u2guVl7xtYGWphJ9Jl997r";

//Se ejecuta cuando se abre la pagina          
i = 0;
o = i + 3;
var json_fav;
setInterval('doSomething2()', 10000);

//Trending Gifos para llenar el div
path_trending = `https://api.giphy.com/v1/gifs/trending?api_key=${api_Key}`;
//Se hace la solicitud a giphy y devuelve un objeto
const p_favorites = fetch(path_trending).then(function (res) {
    return res.json();
}).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
    console.log(error.message);
}) //Muestra el error en la consola
trending2(p_favorites, "normal_Gif", i);

function trending2(params, maxGif, id) {
    if (maxGif.match("maxGif")) {
        params.then(function (json) {
            //Para que tome 1 imagen y la ponga en el img expandido
                maxGifDesktop_fav(json.data[id].images.fixed_width.url, json.data[id].id, json.data[id].slug, json.data[id].username, json.data[id].title, id, "trending"); 
                console.log("Trending Max Gif");
        }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })                 
    }else{
            params.then(function (json) {
                //Bucle para que tome 3 imagenes y las ponga en el slide
                while (i < o) {
                    showFavorites(json, "trending", i, "normal_gif");
                    i++;
                }
            }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
                console.log(error.message); //Muestra el error en la consola
            })     
        }   
}

//Lo que pasa cuando se oprime el boton atras del slide
btnDown2.addEventListener('click', function () {
    if (i == 3) {
        console.log("No hay imagenes previas, i=" + i)
    } else {
        i = i - 6;
        o = i + 3;
        sliderTrending2.innerHTML = "";
        trending2(p_favorites, "normal_Gif", i)
    }
})

//Lo que pasa cuando se oprime el boton adelante del slide
btnUp2.addEventListener('click', function () {
    if (i == 9) {
        console.log("No hay mas imagenes, i=" + i)
        i=0;
    } else {
        o = i + 3;
        sliderTrending2.innerHTML = "";
        trending2(p_favorites, "normal_Gif", i)
    }
})

//Para que el slide cambie las imagenes cada 10 segundos
function doSomething2() {
    sliderTrending2.innerHTML = "";
    if (i == 9) {
        i = 0;
        doSomething2()
    } else {
        o = i + 3;
        trending2(p_favorites, "normal_Gif", i)
    }
}

//Traigo los elementos a usar
favoritosArray = [];
stringFavorites = localStorage.getItem("favoriteGif");
let urlActual = window.location.pathname;
let empty = document.getElementById("contenidoFav");
let full = document.getElementById("fullFav");

buscarFavoritos();

//Funcion para buscar los favoritos guardados en la pagina
function buscarFavoritos() {
    if (stringFavorites == null || stringFavorites == "[]") {
        //Si no hay favoritos, muestra la pantalla de favoritos vacia
        console.log(empty);
        empty.style.display = "block";
        full.style.display = "none";
        console.log("No hay Favoritos")
    } else {
        empty.style.display = "none";
        favoritosArray = JSON.parse(stringFavorites);
        console.log("Si hay favoritos: "+favoritosArray);
        let urlFavoritos = `https://api.giphy.com/v1/gifs?ids=${favoritosArray.toString()}&api_key=${api_Key}`;
        console.log("La URL es: "+urlFavoritos);
        //Se hace la solicitud a giphy y devuelve un objeto
        fetch(urlFavoritos).then(function (params) {
            return params.json();
        }).then(function (json) {
            json_fav = json;
            console.log(json); 
            showFavorites(json, "favoritos", i, "normal_gif");
        }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })
        
    }
}

//funcion para mostrar los favoritos guardados en la pagina
function showFavorites(content, string, i, maxGif) { 
    if (string.match("trending")) {
        sliderTrending2.innerHTML += `
        <div class="gif-actions" onclick="pressButton('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.username}', '${content.title}')">                    
            <img src="${content.data[i].images.fixed_width.url}" alt="${content.data[i].id}" class="results-gif" >
            <div class="info-gifs" >
                <div class="icons-actions-gif">
                    <button class="icon-action-favorite" onclick="addFavorite('${content.data[i].id}')">
                    <img src="./Style/assets/icon-fav.svg" id="icon-borrar-fav-${content.data[i].id}">
                    </button>
                    <button class="icon-action-download" onclick="downloadGif('${content.data[i].images.downsized.url}', '${content.data[i].slug}')">
                    <img src="./Style/assets/icon-download.svg" alt="icon-download">
                    </button>
                    <button class="icon-action-expand" onclick="maxGifDesktop_fav('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}', '${i}', '${string}')">
                    <img src="./Style/assets/icon-max-normal.svg" alt="icon-max">
                    </button>
                </div>
                <div class="Description-gif">
                    <p class="user-gif-results">${content.data[i].username}</p>
                    <p class="title-gif-results">${content.data[i].title}</p>
                </div>
            </div>
        </div>`;
    }else if(string.match("favoritos")){
        let gifFavoritosArray = content.data;
        if (maxGif.match("maxGif_fav")) {
                //Para que tome 1 imagen y la ponga en el img expandido
                    maxGifDesktop_fav(content.data[i].images.fixed_width.url, content.data[i].id, content.data[i].slug, content.data[i].username, content.data[i].title, i, "favoritos"); 
                    console.log("Favoritos Max Gif");                     
        } else {
            for(let i=0; i< gifFavoritosArray.length; i++){
                full.innerHTML += `
                <div class="gif-actions" onclick="pressButton('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">                    
                    <img src="${content.data[i].images.fixed_width.url}" alt="${content.data[i].id}" class="results-gif" >
                    <div class="info-gifs" >
                        <div class="icons-actions-gif">
                            <button class="icon-action-favorite" onclick="addFavorite('${content.data[i].id}')">
                            <img src="./Style/assets/icon-fav-active.svg" id="icon-borrar-fav-${content.data[i].id}">
                            </button>
                            <button class="icon-action-download" onclick="downloadGif('${content.data[i].images.downsized.url}', '${content.data[i].slug}')">
                            <img src="./Style/assets/icon-download.svg" alt="icon-download">
                            </button>
                            <button class="icon-action-expand" onclick="maxGifDesktop_fav('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}', '${i}', '${string}')">
                            <img src="./Style/assets/icon-max-normal.svg" alt="icon-max">
                            </button>
                        </div>
                        <div class="Description-gif">
                            <p class="user-gif-results">${content.data[i].username}</p>
                            <p class="title-gif-results">${content.data[i].title}</p>
                        </div>
                    </div>
                </div>`; 
            };            
        }   
    }     
}

//Lo que pasa al presionar el boton de expandir en el gif
function maxGifDesktop_fav(img, id, slug, user, title, i, string) {
    console.log("Max Gif Desktop >700px");
    console.log("Maxgif: ", string);
    console.log("Maxgif: ", i);
    mobileExpand.classList.add("expand-mobile-activated");
    document.body.appendChild(mobileExpand);
    mobileExpand.innerHTML = `
    <div>
        <button class="mobile-close" onclick="closeMobileExpand()">
            <img src="./Style/assets/close.svg" alt="">
        </button>
    </div>
    <div class="maxGif" id="maxGif">
        <button id="btn-down-gif" onclick="btn_down_gif_fav('${string}', '${i}')"><img src="Style/assets/button-slider-left.svg" alt="atras"></button>    
        <img src="${img}" alt="${id}" class="mobile-gif id="div_mobile_gif></img>  
        <button id="btn-up-gif" onclick="btn_up_gif_fav('${string}', '${i}')"><img src="Style/assets/Button-Slider-right.svg" alt="adelante"></button>
    </div>
    <div class="card">
        <div class="mobile-text">
            <p class="mobile-user">${user}</p>
            <p class="mobile-title">${title}</p>
        </div>
        <div>
            <button class="mobile-btn" onclick="addFavorite('${id}')"><img src="./Style/assets/icon-fav-hover.svg" alt="fav-gif" id="icon-fav-max-mob-${id}"></button>
            <button class="mobile-btn" onclick="downloadGif('${img}', '${slug}')"><img src="./Style/assets/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`;   
}

//Lo que pasa cuando se oprime el boton adelante del gif expandido
function btn_up_gif_fav(string, i) {
    console.log("Btn_up_gif: ", string);
    console.log("Btn_up_gif: ", i);
    if (string.match("trending")) {
            i++;
            trending2(p_favorites, "maxGif", i);
        }else{
            i++;
            showFavorites(json_fav, "favoritos", i, "maxGif_fav");
        }    
}

//Lo que pasa cuando se oprime el boton atras del gif expandido
function btn_down_gif_fav(string, i) {
    console.log("Btn_down_gif: ", string);
    console.log("Btn_down_gif: ", i);
    if (i<0) {
        console.log("No hay imagenes anteriores");
    } else {
        if (string.match("trending")) {
            i=i-1;
            trending2(p_favorites, "maxGif", i);
        }else{
            i=i-1;
            showFavorites(json_fav, "favoritos", i, "maxGif_fav");
        }           
    }
}




