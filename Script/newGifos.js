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

// API KEY de Giphy 
api_Key = "NrHH3zVQo9u2guVl7xtYGWphJ9Jl997r";

var arrayGifos = [];
var stringGifos = localStorage.getItem("createdGif");
let gifId = "";

let box_start = document.getElementById("box_newGifo");
let btn_start = document.getElementById("startnew");
let box_step1 = document.getElementById("box_step1");
let box_step2 = document.getElementById("box_step2");
let box_video = document.getElementById("record-video");
let btn_record = document.getElementById("recordnew");
let btn_stop = document.getElementById("stop-record");
let btn_upload = document.getElementById("upload-gif");
let cinta1 = document.getElementById("cinta1");
let cinta2 = document.getElementById("cinta2");
let recorder;
let blob;
let form = new FormData();
let btn_step = document.querySelectorAll("#btn_step");
btn_step[0].src = "Style/assets/paso-a-paso-hover.svg";
let counter = document.getElementById("counter-record");
let counter_text = 0;
var interval;
//Boton de repetir Gif
let repeat_recording = document.getElementById('container-repeat-recording');

//Para que el slide cambie el contador cada 1 segundo
function doSomething4() {
    counter_text++;
    if (counter_text < 60) {
        if(counter_text < 10){
            counter.innerHTML = "00:00:0"+counter_text;
        }else{
            counter.innerHTML = "00:00:"+counter_text;
        }
    }
    else{
        if(counter_text < 70){
            counter.innerHTML = "00:01:0"+(counter_text-60);
        }else{
            counter.innerHTML = "00:01:"+(counter_text-60);
        }
    }  
}

//Paso 1: Al hacer click en COMENZAR, se cambia el texto de pantalla y se pide el permiso. Paso 1 Activo
btn_start.addEventListener('click', function () {
    box_start.style.display = "none";
    btn_start.style.display = "none";
    box_step1.style.display = "flex";

    //Para pedir los permisos para acceder a la camara
    navigator.mediaDevices.getUserMedia({ audio: false, video: {
        width: { min: 200, ideal: 250, max: 1920 },
        height: { min: 150, ideal: 200, max: 1080 }
      } })
    .then(function (mediaStream) {
    box_step1.style.display = "none";
    box_step2.style.display = "flex";
    
    //Paso 2: Aparece el video en la pantalla y aparece el boton grabar. Paso 2 Activo
    box_video.style.display = "flex";
    btn_record.style.display = "flex";
    box_video.srcObject = mediaStream;
    box_video.onloadedmetadata = function (e) {box_video.play();};
    recorder = RecordRTC(mediaStream, {type: 'gif'}); });  
    btn_step[0].src = "Style/assets/paso-a-paso.svg";
    btn_step[1].src = "Style/assets/paso-a-paso-hover-2.svg";
});

//Paso 3: Al hacer click en GRABAR: comienza a grabar con contador de segundos, aparece boton FINALIZAR
btn_record.addEventListener('click', function () {
    recorder.startRecording();
    console.log("Grabando Gif");
    btn_record.style.display = "none";
    btn_stop.style.display = "flex";
    counter.style.display = "flex";
    interval = setInterval('doSomething4()', 1000);
    //Para que rote la cinta al presionar grabar
    cinta1.style.animation = "mymove 2s infinite";
    cinta2.style.animation = "mymove 2s infinite";
    cinta2.style.animation = "mymove:ligth 2s infinite";
});

//Paso 4: Al hacer click en FINALIZAR: boton cambia a SUBIR GIFO, el contador se va y aparece "repetir"
btn_stop.addEventListener('click', function () {
    console.log("Gif terminado");
    clearInterval(interval);
    cinta1.style.animation = "none";
    cinta2.style.animation = "none";
    counter.style.display = "none";
    repeat_recording.style.display = "flex";
    btn_stop.style.display = "none";
    btn_upload.style.display = "flex";
    recorder.stopRecording(function () {
        box_video.style.display = "none";
        blob = recorder.getBlob();
        box_step2.innerHTML = `
        <div class="gifo_actions">
            <div class="borders">
                <img src="${URL.createObjectURL(recorder.getBlob())}" alt="gif-recorded" id="record-video">
            </div>    
        </div>`;
        form.append('file', recorder.getBlob(), 'myGif.gif');
        form.append('api_key', api_Key);
        console.log(form.get('file'))
    })
});

//Paso 5: Al hacer click en SUBIR GIFO: aparece overlay con icono loading y texto. Paso 3 activo
btn_upload.addEventListener('click', function () {
    //Muestro la pantalla "Estamos subiendo tu GIFO"
    box_step2.innerHTML = `
    <div class="gifo_actions">
        <img src="${URL.createObjectURL(recorder.getBlob())}" alt="gif-recorded" id="record-video">
        <div class="info-gifo">
            <img src="./Style/assets/loader.svg" alt="loading gifo" id="overlay-video-icon">
            <p id="overlay-video-text">Estamos subiendo tu GIFO</p>
        </div>
    </div>`;  
    btn_upload.style.display = "none";
    repeat_recording.style.display = "none";

    fetch(`https://upload.giphy.com/v1/gifs`, {
        method: 'POST',
        body: form,
    }).then(response => {
        return response.json();
    })
    //Paso 6: "GIFO subido con exito": cambia icono y texto , aparecen los botones para Descargar y Link
    .then(objeto => {
    btn_step[1].src = "Style/assets/paso-a-paso2.svg";
    btn_step[2].src = "Style/assets/paso-a-paso-hover-3.svg";
    console.log(objeto);
    gifId = objeto.data.id;
    box_step2.innerHTML = `
    <div class="gifo_actions">
        <img src="${URL.createObjectURL(recorder.getBlob())}" alt="" id="record-video">
        <div class="info-gifo">
            <div class="icons-actions-gifo">
                <button class="overlay-video-button" id="btn-creargifo-descargar" onclick="download_my_Gif('${gifId}')">
                    <img src="./Style/assets/icon-download.svg" alt="download">
                </button>
                <button id="btn-creargifo-link">
                    <a class="overlay-video-button" target="_blank" href="https://giphy.com/gifs/${gifId}">
                        <img src="./Style/assets/icon-link-normal.svg" alt="link">
                    </a>    
                </button>
            </div>      
            <div>
                <img src="./Style/assets/check.svg" alt="loading gifo" id="overlay-video-icon">
                <p id="overlay-video-text">GIFO subido con éxito</p>
            </div>
            
        </div> 
    </div>`;  
    //Si en el local storage no hay nada, el array queda vacio
    if (stringGifos == null) {
        arrayGifos = [];
    } //Si tengo contenido, necesito hacer parse para poder agregar uno nuevo independiente
    else {
        arrayGifos = JSON.parse(stringGifos);
    }
    //El push() añade el elemento al final del array y devuelve la nueva longitud del array.
    arrayGifos.push(gifId);
    //Vuelvo a pasar a texto el array para subirlo al localStorage
    stringGifos = JSON.stringify(arrayGifos);
    localStorage.setItem("createdGif", stringGifos);
    console.log(gifId);
    console.log(stringGifos);
    console.log("El Gif creado ha sido guardado"); 
    });
});

repeat_recording.addEventListener('click', function () {
    btn_upload.style.display = "none";
    repeat_recording.style.display = "none";
    counter_text = 0;
    btn_start.click();
})

//Lo que pasa al presionar el boton de descargar el Gifo creado
function download_my_Gif(id) {
    let urlGifos = `https://api.giphy.com/v1/gifs?ids=${id}&api_key=${api_Key}`;
    console.log("La URL es: "+urlGifos);
    //Se hace la solicitud a giphy y devuelve un objeto
    const p = fetch(urlGifos).then(function (params) {
        return params.json();
    }).then(function (json) {
        json_mg = json;
        console.log(json); 
        downloadGif(json.data[0].images.original.url,id);
    }).catch(function (error) { //Si el procedimiento anterior falla se ejecuta catch
        console.log(error.message); //Muestra el error en la consola
    })
}


