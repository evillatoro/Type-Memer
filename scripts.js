var data;
var dict = {};
var temp, button, words, timerDiv, scoreDiv, points, spans, typed, seconds;
var keys;

$.ajax({ 
    'url' : "https://api.imgflip.com/get_memes",
    'method' : 'GET',
    'success' : 
      function(d) {
        data = d;
        parse();
      }
    });

function parse() {
  var arr = data.data.memes;
  for (var m of arr) {
    var value = m.url;
    //console.log(m);
    value.replace("\\", "");
    //console.log(JSON.stringify(value));
    // name value\
    var name = m.name.toUpperCase();
    dict[name] = m.url;
  }
  keys = Object.keys(dict);
  //urls = dict
}

//array of keys
//var urls = dict[keys[rand]];


window.onload = function() {
  temp = document.querySelector('.time');
  button = document.getElementById("start");
  words = document.querySelector(".words");
  timerDiv = document.querySelector(".time");
  scoreDiv = document.querySelector(".score");
  points = 0;
  spans;
  typed;
  seconds = 60;
      button.addEventListener("click", function(e){
      countdown();
      random();
      button.disabled = true; 
    });

}

 	function countdown() {
 		points = 0;
 		var timer = setInterval(function(){
 			button.disabled = true;
    		seconds--;
    		temp.innerHTML = seconds;
    		if (seconds === 0) {
          $("#image_spot").find("img").remove();
    			alert("Game over! Your score is " + points);
    			scoreDiv.innerHTML = "0";
    			words.innerHTML = "";
    			button.disabled = false;
    			clearInterval(timer);
    			seconds = 60;
    			timerDiv.innerHTML = "60";
    			button.disabled = false;	
    		}
 		}, 1000);
  	}

  	function random() {
  		words.innerHTML = "";
  		var random = Math.floor(Math.random() * keys.length);
  		var wordArray = keys[random];
  		for (var i = 0; i < wordArray.length; i++) { //building the words with spans around the letters
  			var span = document.createElement("span");
  			span.classList.add("span");
  			span.innerHTML = wordArray[i];
  			words.appendChild(span);
  		}
  		spans = document.querySelectorAll(".span");
      console.log(spans.length);
      show_image(dict[keys[random]], 150, 150, 'Hi')
  	}

  	function typing(e) {
      //console.log("ayo");
      var a = e.keyCode;
  		typed = String.fromCharCode(a);
        //console.log("typed " + spans.length);
        console.log("typed " + typed);
  			for (var i = 0; i < spans.length; i++) {
          //console.log("in the HTML " + spans[i].innerHTML);
  				if (spans[i].innerHTML === typed) { // if typed letter is the one from the word
  					if (spans[i].classList.contains("bg")) { // if it already has class with the bacground color then check the next one
  						continue;
  					} else if (spans[i].classList.contains("bg") === false && spans[i-1] === undefined || spans[i-1].classList.contains("bg") !== false ) { // if it dont have class, if it is not first letter or if the letter before it dont have class (this is done to avoid marking the letters who are not in order for being checked, for example if you have two "A"s so to avoid marking both of them if the first one is at the index 0 and second at index 5 for example)
  						spans[i].classList.add("bg");
  						break;
  					}
  				}
  			}
  			var checker = 0;
  			for (var j = 0; j < spans.length; j++) { //checking if all the letters are typed
  				if (spans[j].className === "span bg") {
  					checker++;
  				}
  				if (checker === spans.length) { // if so, animate the words with animate.css class
  					words.classList.add("animated");
  					words.classList.add("fadeOut");
  					points++; // increment the points
  					scoreDiv.innerHTML = points; //add points to the points div
  					document.removeEventListener("keydown", typing, false);
  					setTimeout(function(){
  						words.className = "words"; // restart the classes
              $("#image_spot").find("img").remove();
  						random(); // give another word
  						document.addEventListener("keydown", typing, false);
  					}, 400);
  				}

  			}
  	}

document.addEventListener("keypress", typing, false);

function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.getElementById("image_spot").appendChild(img);
}