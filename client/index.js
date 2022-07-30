//Loader
var loader = document.getElementById("preloader");

window.addEventListener("load", function () {
  loader.style.display = "none";
})

//Styling
let button_a = document.querySelector('#play');
let background_picture = document.querySelector('#BG');

function zoom() {
  background_picture.classList.add('background_size');
  button_a.classList.add('smooth_button');
};