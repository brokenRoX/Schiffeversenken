//Loader

var loader = document.getElementById("preloader");

window.addEventListener("load", function(){
    loader.style.display = "none";
})


//toggles music and sound controls
//Needs to be checked
function changeIcon(anchor) {
    var icon = anchor.querySelector("i");
    icon.classList.toggle('fa-plus');
    icon.classList.toggle('fa-minus');
  
     anchor.querySelector("span").textContent = icon.classList.contains('fa-plus') ? "Read more" : "Read less";
  }