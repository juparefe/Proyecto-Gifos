let toggle = document.getElementById("toggle")

let item = document.getElementsByClassName("item");

toggle.addEventListener('click',function(){
        if(toggle.src.match("close")){
            console.log("activo");
            for (let index = 0; index < 4; index++) {
                item.item(index).classList.remove("active");
            }
            toggle.src = "/Style/assets/burger.svg";
        } else {
            console.log("inactivo");
            for (let index = 0; index < 4; index++) {
                item.item(index).classList.add("active");
            }
            toggle.src = "/Style/assets/close.svg";
        }   
});



