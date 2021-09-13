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

  trendingGifos = document.getElementById("trending_gifos_mg");

  //Para que cambie el Html del trending cuando la pantalla es menor a 700px
  if (window.matchMedia("(max-width: 700px)").matches) {
    console.log("Se ejecuta el if")
    trendingGifos.innerHTML = `
    <h2 class="title2">Trending GIFOS</h2>
    <p>Mira los últimos GIFOS de nuestra comunidad.</p>
    <button id="btn-down"><img src="./Style/assets/button-slider-left.svg" alt="atras"></button>    
    <div id="trending_mg" class="trending"></div>    
    <button id="btn-up"><img src="./Style/assets/Button-Slider-right.svg" alt="adelante"></button>`; 
    console.log(trendingGifos); 
  }else{
      console.log("no se ejecuta el modo mobile");
  }
  
  //Tendencias
  let sliderTrending3 = document.getElementById("trending_mg");
  let trendingContainer3 = document.getElementById("trending_container");
  let btnDown3 = document.getElementById("btn-down");
  let btnUp3 = document.getElementById("btn-up");
  
  // API KEY de Giphy 
  api_Key = "NrHH3zVQo9u2guVl7xtYGWphJ9Jl997r";
  
  //Se ejecuta cuando se abre la pagina          
  i = 0;
  o = i + 3;
  var json_mg;
  setInterval('doSomething3()', 10000);
  
  //Trending Gifos para llenar el div
  path_trending = `https://api.giphy.com/v1/gifs/trending?api_key=${api_Key}`;
  //Se hace la solicitud a giphy y devuelve un objeto
  const p_mg = fetch(path_trending).then(function (res) {
      return res.json();
  }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
      console.log(error.message);
  }) //Muestra el error en la consola
  trending3(p_mg, "normal_Gif", i);
  
  function trending3(params, maxGif, id) {
      if (maxGif.match("maxGif")) {
          params.then(function (json) {
              //Para que tome 1 imagen y la ponga en el img expandido
                  maxGifDesktop_mg(json.data[id].images.fixed_width.url, json.data[id].id, json.data[id].slug, json.data[id].username, json.data[id].title, id, "trending"); 
          }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
              console.log(error.message); //Muestra el error en la consola
          })                 
      }else{
              params.then(function (json) {
                  //Bucle para que tome 3 imagenes y las ponga en el slide
                  while (i < o) {
                      showGifos(json, "trending", i, "normal_gif");
                      i++;
                  }
              }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
                  console.log(error.message); //Muestra el error en la consola
              })     
          }   
  }
  
  //Lo que pasa cuando se oprime el boton atras del slide
  btnDown3.addEventListener('click', function () {
      if (i == 3) {
          console.log("No hay imagenes previas, i=" + i)
      } else {
          i = i - 6;
          o = i + 3;
          sliderTrending3.innerHTML = "";
          trending3(p_mg, "normal_Gif", i)
      }
  })
  
  //Lo que pasa cuando se oprime el boton adelante del slide
  btnUp3.addEventListener('click', function () {
      if (i == 9) {
          console.log("No hay mas imagenes, i=" + i)
          i=0;
      } else {
          o = i + 3;
          sliderTrending3.innerHTML = "";
          trending3(p_mg, "normal_Gif", i)
      }
  })
  
  //Para que el slide cambie las imagenes cada 10 segundos
  function doSomething3() {
      sliderTrending3.innerHTML = "";
      if (i == 9) {
          i = 0;
          doSomething3()
      } else {
          o = i + 3;
          trending3(p_mg, "normal_Gif", i)
      }
  }  
  
//Traigo los elementos a usar
arrayGifos = [];
stringGifos = localStorage.getItem("createdGif");
let urlActual = window.location.pathname;
let empty = document.getElementById("contenidoGif");
let full = document.getElementById("fullGif");

searchGifos();

//Funcion para buscar los gifos guardados en la pagina
function searchGifos() {
    if (stringGifos == null || stringGifos == "[]") {
        //Si no hay gifos, muestra la pantalla de gifos vacia
        console.log(empty);
        empty.style.display = "block";
        full.style.display = "none";
        console.log("No hay Gifos creados aun")
    } else {
        empty.style.display = "none";
        gifosArray = JSON.parse(stringGifos);
        console.log("Si hay Gifos creados: "+gifosArray);
        let urlGifos = `https://api.giphy.com/v1/gifs?ids=${gifosArray.toString()}&api_key=${api_Key}`;
        console.log("La URL es: "+urlGifos);
        //Se hace la solicitud a giphy y devuelve un objeto
        const p = fetch(urlGifos).then(function (params) {
            return params.json();
        }).then(function (json) {
            json_mg = json;
            console.log(json); 
            showGifos(json, "gifos", i, "normal_gif");
        }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
            console.log(error.message); //Muestra el error en la consola
        })
        
    }
}

//funcion para mostrar los gifos guardados en la pagina
function showGifos(content, string, i, maxGif) {
    if (string.match("trending")) {
        sliderTrending3.innerHTML += `
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
                    <button class="icon-action-expand" onclick="maxGifDesktop_mg('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}', '${i}', '${string}')">
                    <img src="./Style/assets/icon-max-normal.svg" alt="icon-max">
                    </button>
                </div>
                <div class="Description-gif">
                    <p class="user-gif-results">${content.data[i].username}</p>
                    <p class="title-gif-results">${content.data[i].title}</p>
                </div>
            </div>
        </div>`;
    }else if(string.match("gifos")){
        let gifGifosArray = content.data;
        if (maxGif.match("maxGif_mg")) {
            console.log(content);
            //Para que tome 1 imagen y la ponga en el img expandido
                maxGifDesktop_mg(content.data[i].images.fixed_width.url, content.data[i].id, content.data[i].slug, content.data[i].username, content.data[i].title, i, "gifos"); 
                console.log("Gifos Max Gif");                     
        } else {
            for(let i=0; i< gifGifosArray.length; i++){
                full.innerHTML += `
                <div class="gif-actions" onclick="pressButton('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}')">                    
                    <img src="${content.data[i].images.fixed_width.url}" alt="${content.data[i].id}" class="results-gif" >
                    <div class="info-gifs" >
                        <div class="icons-actions-gif">
                            <button class="icon-action-delete" onclick="deleteGif('${content.data[i].id}')">
                                <img src="./Style/assets/icon-trash-normal.svg" id="icon-delete-${content.data[i].id}">
                            </button>
                            <button class="icon-action-download" onclick="downloadGif('${content.data[i].images.downsized.url}', '${content.data[i].slug}')">
                                <img src="./Style/assets/icon-download.svg" alt="icon-download">
                            </button>
                            <button class="icon-action-expand" onclick="maxGifDesktop_mg('${content.data[i].images.fixed_width.url}', '${content.data[i].id}', '${content.data[i].slug}', '${content.data[i].username}', '${content.data[i].title}', '${i}', '${string}')">
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
function maxGifDesktop_mg(img, id, slug, user, title, i, string) {
    mobileExpand.classList.add("expand-mobile-activated");
    document.body.appendChild(mobileExpand);
    mobileExpand.innerHTML = `
    <div>
        <button class="mobile-close" onclick="closeMobileExpand()">
            <img src="./Style/assets/close.svg" alt="">
        </button>
    </div>
    <div class="maxGif" id="maxGif">
        <button id="btn-down-gif" onclick="btn_down_gif_mg('${string}', '${i}')"><img src="Style/assets/button-slider-left.svg" alt="atras"></button>    
        <img src="${img}" alt="${id}" class="mobile-gif id="div_mobile_gif></img>  
        <button id="btn-up-gif" onclick="btn_up_gif_mg('${string}', '${i}')"><img src="Style/assets/Button-Slider-right.svg" alt="adelante"></button>
    </div>
    <div class="card">
        <div class="mobile-text">
            <p class="mobile-user">${user}</p>
            <p class="mobile-title">${title}</p>
        </div>
        <div>
            <button class="mobile-btn" onclick="deleteGif('${id}')"><img src="./Style/assets/icon-trash-normal.svg" id="icon-delete-${id}"></button>
            <button class="mobile-btn" onclick="downloadGif('${img}', '${slug}')"><img src="./Style/assets/icon-download.svg" alt="download-gif"></button>
        </div>
    </div>`;   
}

//Lo que pasa al presionar el boton de eliminar el gif
function deleteGif(id) {
    //Si en el local storage no hay nada, el array queda vacio
    if (stringGifos == null) {
        arrayGifos = [];
    } //Si tengo contenido, necesito hacer parse para poder agregar uno nuevo independiente
    else {
        arrayGifos = JSON.parse(stringGifos);
        var delete_gif = "";
        arrayGifos.filter(function (id) {
            delete_gif = arrayGifos.indexOf(id); 
            return delete_gif;
        })
        arrayGifos.splice(delete_gif);
        //Vuelvo a pasar a texto el array para subirlo al localStorage
        stringGifos = JSON.stringify(arrayGifos);
        localStorage.setItem("createdGif", stringGifos);
        console.log(id);
        console.log(arrayGifos);
    }
}

//Lo que pasa cuando se oprime el boton adelante del gif expandido
function btn_up_gif_mg(string, i) {
    console.log("Btn_up_gif: ", string);
    console.log("Btn_up_gif: ", i);
    if (string.match("trending")) {
            i++;
            trending3(p_mg, "maxGif", i);
        }else{
            i++;
            showGifos(json_mg, "gifos", i, "maxGif_mg");
        }    
}

//Lo que pasa cuando se oprime el boton atras del gif expandido
function btn_down_gif_mg(string, i) {
    console.log("Btn_down_gif: ", string);
    console.log("Btn_down_gif: ", i);
    if (i<0) {
        console.log("No hay imagenes anteriores");
    } else {
        if (string.match("trending")) {
            i=i-1;
            trending3(p_mg, "maxGif", i);
        }else{
            i=i-1;
            showGifos(json_mg, "gifos", i, "maxGif_mg");
        }           
    }
}

