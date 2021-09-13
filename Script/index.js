//Modo Nocturno
var modoNoche = document.querySelector('#modoNoche');
var logo = document.getElementById('logo');
var newGifo = document.querySelector('#newGifo');
var night_mode = localStorage.getItem("night_mode");

//Para poner el modo con el que se cerro la pagina Nocturno - Diurno
window.onload = function() {
    if (night_mode.match("noche")) {
        modoNoche.click();
    }
    
  };

//Funcion de nodo nocturno
modoNoche.addEventListener('click', () =>{
    document.body.classList.toggle('dark');
    modoNoche.classList.toggle('active');
    if (logo.src.match("noct")) {
        logo.src = "/Style/assets/logo-mobile.svg";
        modoNoche.textContent = "MODO NOCTURNO"
        night_mode = "dia";
        localStorage.setItem("night_mode", night_mode);
    }else{
        logo.src = "/Style/assets/logo-mobile-modo-noct.svg";
        modoNoche.textContent = "MODO DIURNO"
        night_mode = "noche";
        localStorage.setItem("night_mode", night_mode);
    }
})

//Traigo los elementos a usar
let searchContainer = document.querySelector(".container-1")
var searchInput = document.getElementById("search-input");
var inputContainer = document.getElementById("input-container");
let searchIcon = document.getElementById("icon-active");
let searchPrompt = document.getElementById('search-prompt');
let line = document.getElementById("search-line")
let btnSubmit = document.getElementById("submit");
let btnReset = document.getElementById("reset");
let searchText = document.getElementById("search-text");
let resultsEl = document.getElementById("results");
let btnLess = document.getElementById("less");
let btnMore = document.getElementById("more");
let mobileExpand = document.createElement("div");
let desktopExpand = document.createElement("desktop");
//borrar lo que este en barra de busqueda
searchInput.value="";
//Variable de icono favorito
var gif_fav;
var trendingGifos = document.getElementById("trending_gifos");

//Para que cambie el Html del trending cuando la pantalla es menor a 700px
if (window.matchMedia("(max-width: 700px)").matches) {
    console.log("Se ejecuta el if") 
    trendingGifos.innerHTML = `
    <h2 class="title2">Trending GIFOS</h2>
    <p>Mira los últimos GIFOS de nuestra comunidad.</p>
    <button id="btn-down"><img src="./Style/assets/button-slider-left.svg" alt="atras"></button>    
    <div id="trending" class="trending"></div>    
    <button id="btn-up"><img src="./Style/assets/Button-Slider-right.svg" alt="adelante"></button>`; 
    console.log(trendingGifos); 
}else{
    console.log("no se ejecuta el modo mobile");
}

//Tendencias
let sliderTrending = document.getElementById("trending");
let trendingContainer = document.getElementById("trending_container");
let btnDown = document.getElementById("btn-down");
let btnUp = document.getElementById("btn-up");

// API KEY de Giphy 
var api_Key = "NrHH3zVQo9u2guVl7xtYGWphJ9Jl997r";

//Se ejecuta cuando se abre la pagina          
var i = 0;
var o = i + 3;
let index = 0;
let limit = index + 12;
var json_search;
setInterval('doSomething()', 10000);
var favoritosArray = [];
var stringFavorites = localStorage.getItem("favoriteGif");

//Trending Gifos para llenar el div
var path_trending = `https://api.giphy.com/v1/gifs/trending?api_key=${api_Key}`
//Se hace la solicitud a giphy y devuelve un objeto
const p = fetch(path_trending).then(function (res) {
    return res.json();
}).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
    console.log(error.message);
}) //Muestra el error en la consola
trending(p, "normal_Gif", i);

function trending(params, maxGif, id) {
    if (maxGif.match("maxGif")) {
        params.then(function (json) {
            //Para que tome 1 imagen y la ponga en el img expandido
                maxGifDesktop(json.data[id].images.fixed_width.url, json.data[id].id, json.data[id].slug, json.data[id].username, json.data[id].title, id, "trending"); 
                console.log("Trending Max Gif");
        }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })                 
    }else{
            params.then(function (json) {
                //Bucle para que tome 3 imagenes y las ponga en el slide
                while (i < o) {
                    putButtons(json, i, "trending");
                    i++;
                }
            }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
                console.log(error.message); //Muestra el error en la consola
            })     
        }   
}

//Lo que pasa cuando se oprime el boton atras del slide
btnDown.addEventListener('click', function () {
    if (i == 3) {
        console.log("No hay imagenes previas, i=" + i)
    } else {
        i = i - 6;
        o = i + 3;
        sliderTrending.innerHTML = "";
        trending(p, "normal_Gif", i)
    }
})

//Lo que pasa cuando se oprime el boton adelante del slide
btnUp.addEventListener('click', function () {
    if (i == 9) {
        console.log("No hay mas imagenes, i=" + i)
        i=0;
    } else {
        o = i + 3;
        sliderTrending.innerHTML = "";
        trending(p, "normal_Gif", i)
    }
})

//Para que el slide cambie las imagenes cada 10 segundos
function doSomething() {
    sliderTrending.innerHTML = "";
    if (i == 9) {
        i = 0;
        doSomething()
    } else {
        o = i + 3;
        trending(p, "normal_Gif", i)
    }
}

//Para cargar las sugerencias de busqueda
searchInput.addEventListener('keyup', function (e) {
    console.log("Aplica las sugerencias");
    //const q = searchInput.value;
    const q = e.target.value;
    searchIcon.style.display = "block";
    searchIcon.style.position = "absolute";
    searchInput.style.paddingLeft = "0px";
    let path_prompt = `https://api.giphy.com/v1/tags/related/${q}?api_key=${api_Key}&limit=4`;
    if (q.length >= 1) {
        console.log("Hay 1 o mas letras");
        //Se hace la solicitud a giphy y devuelve un objeto
        fetch(path_prompt).then(function (res) {
            return res.json();
        }).then(function (json) {
            console.log(json);
            let resultsHTML = "";
            json.data.forEach(function (object) {
                resultsHTML += `<li class="prompt">
                <i class="fas fa-search"></i>
                <p class="buscador-sugerencia-texto" >${object.name}</p> 
                </li>`
            })
            searchPrompt.innerHTML = resultsHTML; //Para que muestre los 4 resultados en la lista de sugerencias 
        }).catch(function (error) { //Si alguno de los procedimientos anteriores falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })
        searchPrompt.style.display = "block";
        searchInput.style.border = "none";
        searchInput.style.paddingLeft = "20px"
        inputContainer.style.border = "none";
        searchInput.style.borderBottom = "none";
        btnSubmit.style.display = "none";
        btnReset.style.display = "block";
        line.style.display = "block";
    } else {
        console.log("No hay texto para buscar")
    }
});

//busqueda cuando se pulsa la tecla enter
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        btnSubmit.click();
        // Cancel the default action, if needed
        event.preventDefault();
      }
});

//Los que pasa cuando se hace click en una de las sugerencias de busqueda
searchPrompt.addEventListener('click', function (li) {
    searchInput.value = li.target.textContent;
    let path_search = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${searchInput.value}`;
    search(path_search)
    searchText.innerText = searchInput.value; //Para que muestre el texto buscado arriba de los resultados
    btnSubmit.style.display = "none";
    btnReset.style.display = "block";
    searchPrompt.style.display = "none";
    line.style.display = "none";
    index = 0;
    limit = 12;
})

//Lo que pasa cuando se oprime el boton cerrar en la barra de busqueda
btnReset.addEventListener("click", function (e) {
    searchInput.value = "";
    resultsEl.innerHTML = "";
    searchInput.placeholder = "Busca GIFOS y más";
    btnSubmit.style.display = "block";
    btnReset.style.display = "none";
    searchPrompt.style.display = "none";
    searchContainer.style.border = "none";
    searchIcon.style.display = "none";
    line.style.display = "none";
    //inputContainer.style.border = "1px solid #572EE5";
    //inputContainer.style.height = "52px";
    //inputContainer.style.borderRadius = "25px";
    index = 0;
    limit = 12;
})

//Lo que pasa cuando se oprime el boton buscar de la barra de busqueda
btnSubmit.addEventListener("click", function (e) {
    e.preventDefault()
    const q = searchInput.value;
    console.log(q)
    let path_more = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${q}`;
    index = 0;
    limit = 12;
    search(path_more)
    searchText.innerText = q; //Para que muestre el texto buscado arriba de los resultados
})

//Lo que pasa cuando se oprime el boton atras en los resultados
btnLess.addEventListener("click", function (e) {
    e.preventDefault()
    const q = searchInput.value;
    console.log(q)
    let path_search = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${q}`;
    if (index == 12) {
        console.log("No hay imagenes previas, index=" + index)
    } else {
        resultsEl.innerHTML = ``;
        index = index - 24;
        limit = index + 12;
        search(path_search)
    }
    searchText.innerText = q; //Para que muestre el texto buscado arriba de los resultados
})

//Lo que pasa cuando se oprime el boton ver mas en los resultados
btnMore.addEventListener("click", function (e) {
    e.preventDefault()
    const q = searchInput.value;
    console.log(q)
    let path_search = `https://api.giphy.com/v1/gifs/search?api_key=${api_Key}&q=${q}`;
    if (index == 48) {
        console.log("No hay mas resultados, index=" + index)
    } else {
        resultsEl.innerHTML = ``;
        limit = index + 12;
        search(path_search)
    }
    searchText.innerText = q; //Para que muestre el texto buscado arriba de los resultados
    btnLess.style.display = "flex";
})

//el metodo se usa para las sugerencias y la busqueda
function search(path) {
    //Se hace la solicitud a giphy y devuelve un objeto
    json_search = fetch(path).then(function (res) {
        return res.json();
    }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
        console.log(error.message);
    }) //Muestra el error en la consola
    search_function(json_search, "normal_Gif", i);
}

function search_function(params, maxGif, id) {
    if (maxGif.match("maxGif")) {
        params.then(function (json) {
            //Para que tome 1 imagen y la ponga en el img expandido
                maxGifDesktop(json.data[id].images.fixed_width.url, json.data[id].id, json.data[id].slug, json.data[id].username, json.data[id].title, id, "search"); 
                console.log("Search Max Gif");
        }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })                              
    }else{
        params.then(function (json) {
            console.log(json);
            let resultsHTML = "";
            resultsEl.innerHTML = "";
            //Bucle para que tome 12 imagenes y las muestre
            while (index < limit) {
                putButtons(json, index, "search");
                index++;
                console.log("index=" + index);
            }
        }).catch(function (error) { //Si alguno de los procedimientos anteriores falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })
    }
    btnMore.style.display = "flex";
}

//Para añadir los tres botones de funcionalidad a cada imagen
function putButtons(content, i, string) {
    let buttons = `
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
                <button class="icon-action-expand" onclick="maxGifDesktop('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}', '${i}', '${string}')">
                <img src="./Style/assets/icon-max-normal.svg" alt="icon-max">
                </button>
            </div>
            <div class="Description-gif">
                <p class="user-gif-results">${content.data[i].username}</p>
                <p class="title-gif-results">${content.data[i].title}</p>
            </div>
        </div>
    </div>`;
    if (string.match("trending")) {
        sliderTrending.innerHTML += buttons;
    }else if(string.match("search")){
        resultsEl.innerHTML += buttons;
    }          
}

//Al presionar el gif en mobile
function pressButton(img, id, slug, user, title) {
    if (window.matchMedia("(min-width: 700px)").matches) {   
    } //Maximizar al seleccionar el gif en mobile a 700px
    else{
        console.log("Mobile");
        mobileExpand.classList.add("expand-mobile-activated");
        document.body.appendChild(mobileExpand);
        console.log("<700px")
        mobileExpand.innerHTML = `
        <div>
            <button class="mobile-close" onclick="closeMobileExpand()"><img src="./Style/assets/close.svg" alt=""></button>
        </div>
        <img src="${img}" alt="${id}" class="mobile-gif">
        <div class="card">
            <div class="mobile-text">
                <p class="mobile-user">${user}</p>
                <p class="mobile-title">${title}</p>
            </div>
            <div>
                <button class="icon-action-favorite" onclick="addFavorite('${id}')">
                    <img src="./Style/assets/icon-fav.svg" id="icon-borrar-fav-${id}">
                </button>
                <button class="mobile-btn" onclick="downloadGif('${img}', '${slug}')"><img src="./Style/assets/icon-download.svg" alt="download-gif"></button>
            </div>
        </div>`;
        /* Si se quisiera hacer directamente en javscript
        mobileExpand.style.position = "fixed";*/
    }   
}

//Lo que pasa al presionar el boton de favorito en el gif
function addFavorite(id) {
    console.log("addFavoriteDesktop: "+id);
    gif_fav =document.getElementById("icon-borrar-fav-"+id);
    if (gif_fav.src.match("icon-fav-active")) {
        gif_fav.src = "/Style/assets/icon-fav.svg";
        //Si en el local storage no hay nada, el array queda vacio
        if (stringFavorites == null) {
            arrayFavorites = [];
        } //Si tengo contenido, necesito hacer parse para poder agregar uno nuevo independiente
        else {
            arrayFavorites = JSON.parse(stringFavorites);
            var delete_favorite = "";
            arrayFavorites.filter(function (id) {
                delete_favorite = arrayFavorites.indexOf(id); 
                return delete_favorite;
            })
            arrayFavorites.splice(delete_favorite);
            //Vuelvo a pasar a texto el array para subirlo al localStorage
            stringFavorites = JSON.stringify(arrayFavorites);
            localStorage.setItem("favoriteGif", stringFavorites);
            console.log(id);
            console.log(arrayFavorites);
        }
    }else{
        //Si en el local storage no hay nada, el array queda vacio
        if (stringFavorites == null) {
            arrayFavorites = [];
        } //Si tengo contenido, necesito hacer parse para poder agregar uno nuevo independiente
        else {
            arrayFavorites = JSON.parse(stringFavorites);
        }
        //El push() añade el elemento al final del array y devuelve la nueva longitud del array.
        arrayFavorites.push(id);
        //Vuelvo a pasar a texto el array para subirlo al localStorage
        stringFavorites = JSON.stringify(arrayFavorites);
        localStorage.setItem("favoriteGif", stringFavorites);
        console.log(gif_fav)
        gif_fav.src = "/Style/assets/icon-fav-active.svg";
        console.log("Gif guardado en favoritos"); 
    }
}

//Lo que pasa al cerrar el expandir gif en mobile
function closeMobileExpand(){
    mobileExpand.classList.remove("expand-mobile-activated");
    document.body.removeChild(mobileExpand);    
}

//Lo que pasa al presionar el boton de descargar el Gif
async function downloadGif(gifImg, gifNombre) {
    let a = document.createElement('a');
  // get image as blob
  let response = await fetch(gifImg);
  let file = await response.blob();
  // use download attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes
  console.log(file);
  a.download = gifNombre+".gif";
  a.href = window.URL.createObjectURL(file);
  //store download url in javascript https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
  a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
  //click on element to start download
  a.click();
}

//Lo que pasa al presionar el boton de expandir en el gif
function maxGifDesktop(img, id, slug, user, title, i, string) {
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
        <button id="btn-down-gif" onclick="btn_down_gif('${string}', '${i}')"><img src="Style/assets/button-slider-left.svg" alt="atras"></button>    
        <img src="${img}" alt="${id}" class="mobile-gif id="div_mobile_gif></img>  
        <button id="btn-up-gif" onclick="btn_up_gif('${string}', '${i}')"><img src="Style/assets/Button-Slider-right.svg" alt="adelante"></button>
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
function btn_up_gif(string, i) {
    console.log("Btn_up_gif: ", string);
    console.log("Btn_up_gif: ", i);
    if (string.match("trending")) {
            i++;
            trending(p, "maxGif", i);
        }else{
            i++;
            search_function(json_search, "maxGif", i);
        }    
}

//Lo que pasa cuando se oprime el boton atras del gif expandido
function btn_down_gif(string, i) {
    console.log("Btn_down_gif: ", string);
    console.log("Btn_down_gif: ", i);
    if (i<0) {
        console.log("No hay imagenes anteriores");
    } else {
        if (string.match("trending")) {
            i=i-1;
            trending(p, "maxGif", i);
        }else{
            i=i-1;
            search_function(json_search, "maxGif", i);
        }           
    }
}
