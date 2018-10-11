let npScore = 0;
let pScore = 0;
let screenState = 1;
let messages = [];

let browserSize = {
  browserWidth: window.innerWidth || document.body.clientWidth,
  browserHeight: window.innerHeight || document.body.clientHeight
}



function setup(){
  createCanvas(browserSize.browserWidth, browserSize.browserHeight);
}

function draw(){
  background(0);

  if (screenState = 0){
    introScreen();
  }

  for (let i = 0; i <= messages.length; i++){
    messages[i].displayed();

    if(messages[i].d <= 0){
      instKiller(messages, i);
      i--;
    }
  }

}

function introScreen(){
  messages.push(new message("WELCOME", 10000, 500, 1))
  messages.push(new message("ROCK, PAPER, SCISSORS", 10000, 11500, 1))
}

function textFormat(_tStyle){
  if (_tStyle == 0){
    return {x: height / 2, y: width / 2, s: 100}
  }
}

function instKiller(_a, _i){
  _a.splice(_i, 1);
}

class message{
  constructor(_text, _duration, _waitTime, _style){
    this.t = _text;
    //
    this.style = textFormat(_style);
    this.d = _duration;
    this.wt = _waitTime;
  }

  displayed() {
    if (this.wt >= 0){
      this.wt -=1;
    }
    else {
      push();
      fill(255);
      translate (this.style.x, this.style.y - this.style.s / 2);
      textSize(this.style.s);
      
      textAlign(CENTER);
      text(this.t, 0, 0);
      pop();

      this.d -=1;
    }
  }
}


// let brain;

// let bases = ["kaiser roll", "brioche bun", "wonder bread", "cookie",
//   "focaccia", "hero", "whole wheat bread"
// ];

// let ings1 = ["ham", "roast beef", "peanut butter", "bologna", "chocolate ice cream",
//   "hamburger", "veggie burger"
// ];
// let ings2 = ["cheddar", "swiss cheese", "strawberry jelly", "mayonnaise",
//   "vanilla ice cream", "arugula", "ketchup"
// ];

// let yum = ["delicious!", "yummy!", "yes, please!", "tasty!"];
// let gross = ["gross!", "no, thank you", "eww.", "disgusting.", "barf."];

// let delicious;
// let round = 0;
// let indices = [0, 1, 2, 3, 4, 5, 6];
// let bLike;
// let bDislike;
// let sandwichGo = true;
// let sand;
// let continuing = false;
// let trainingRounds = 10;

// function setup() {
//   brain = new NeuralNetwork(3, 6, 2);

//   bLike = createButton(random(yum));
//   bLike.position(20, 150);
//   bLike.mousePressed(isDelicious);

//   bDislike = createButton(random(gross));
//   bDislike.position(150, 150);
//   bDislike.mousePressed(notDelicious);

// }

// function draw() {
//   if (sandwichGo == true) {
//     sand = makeSandwich();

//     bLike.html(random(yum));
//     bDislike.html(random(gross));
//   }

//   let sB = sand[0];
//   let sI1 = sand[1];
//   let sI2 = sand[2];

//   createCanvas(400, 200);
//   background(240);

//   fill(0);


//   if (round < trainingRounds) {

//     let tCount = round + 1;
//     text("Does this sandwich sound delicious?" + " (" + tCount + "/10)", 20, 20);

//   } else {
//     let sandRec
//     if (continuing == true) {
//       sandRec = sandwichPredictor();
//     }
//     if (sandRec == true) {
//       text("I recommend this sandwich for you", 20, 20);
//     } else {
//       text("I don't recommend this sandwich for you", 20, 20);
//     }
//   }

//   text(bases[sB], 20, 40);
//   text(ings1[sI1], 20, 60);
//   text(ings2[sI2], 20, 80);
//   text(bases[sB], 20, 100);

// }

// function makeSandwich() {
//   let sB = random(indices);
//   let sI1 = random(indices);
//   let sI2 = random(indices);

//   sandwichGo = false;

//   return [sB, sI1, sI2];
// }

// function sandwichPrefs(_t) {
//   let targets;
//   if (_t == true) {
//     targets = [0, 1];
//   } else {
//     targets = [1, 0];
//   }

//   let sB = sand[0];
//   let sI1 = sand[1];
//   let sI2 = sand[2];

//   let inputs = [sB / bases.length, sI1 / ings1.length, sI2 / ings2.length];

//   brain.train(inputs, targets);
// }

// function sandwichPredictor() {
//   let trySand = brain.predict(sand);
//   console.log(trySand);
//   continuing = false;

//   if (trySand[1] > trySand[0]) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function isDelicious() {
//   delicious = true;
//   sandwichGo = true;
//   continuing = true;
//   sandwichPrefs(delicious);
//   round++;
// }

// function notDelicious() {
//   delicious = false;
//   sandwichGo = true;
//   continuing = true;
//   sandwichPrefs(delicious);
//   round++;
// }