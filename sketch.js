let brain;

let bases = ["kaiser roll", "brioche bun", "wonder bread", "cookie",
  "focaccia", "hero", "whole wheat bread"
];

let ings1 = ["ham", "roast beef", "peanut butter", "bologna", "chocolate ice cream",
  "hamburger", "veggie burger"
];
let ings2 = ["cheddar", "swiss cheese", "strawberry jelly", "mayonnaise",
  "vanilla ice cream", "arugula", "ketchup"
];

let yum = ["delicious!", "yummy!", "yes, please!", "tasty!"];
let gross = ["gross!", "no, thank you", "eww.", "disgusting.", "barf."];

let delicious;
let round = 0;
let indices = [0, 1, 2, 3, 4, 5, 6];
let bLike;
let bDislike;
let sandwichGo = true;
let sand;
let continuing = false;
let trainingRounds = 10;

function setup() {
  brain = new NeuralNetwork(3, 6, 2);

  bLike = createButton(random(yum));
  bLike.position(20, 150);
  bLike.mousePressed(isDelicious);

  bDislike = createButton(random(gross));
  bDislike.position(150, 150);
  bDislike.mousePressed(notDelicious);

}

function draw() {
  if (sandwichGo == true) {
    sand = makeSandwich();

    bLike.html(random(yum));
    bDislike.html(random(gross));
  }

  let sB = sand[0];
  let sI1 = sand[1];
  let sI2 = sand[2];

  createCanvas(400, 200);
  background(240);

  fill(0);


  if (round < trainingRounds) {

    let tCount = round + 1;
    text("Does this sandwich sound delicious?" + " (" + tCount + "/10)", 20, 20);

  } else {
    let sandRec
    if (continuing == true) {
      sandRec = sandwichPredictor();
    }
    if (sandRec == true) {
      text("I recommend this sandwich for you", 20, 20);
    } else {
      text("I don't recommend this sandwich for you", 20, 20);
    }
  }

  text(bases[sB], 20, 40);
  text(ings1[sI1], 20, 60);
  text(ings2[sI2], 20, 80);
  text(bases[sB], 20, 100);

}

function makeSandwich() {
  let sB = random(indices);
  let sI1 = random(indices);
  let sI2 = random(indices);

  sandwichGo = false;

  return [sB, sI1, sI2];
}

function sandwichPrefs(_t) {
  let targets;
  if (_t == true) {
    targets = [0, 1];
  } else {
    targets = [1, 0];
  }

  let sB = sand[0];
  let sI1 = sand[1];
  let sI2 = sand[2];

  let inputs = [sB / bases.length, sI1 / ings1.length, sI2 / ings2.length];

  brain.train(inputs, targets);
}

function sandwichPredictor() {
  let trySand = brain.predict(sand);
  console.log(trySand);
  continuing = false;

  if (trySand[1] > trySand[0]) {
    return true;
  } else {
    return false;
  }
}

function isDelicious() {
  delicious = true;
  sandwichGo = true;
  continuing = true;
  sandwichPrefs(delicious);
  round++;
}

function notDelicious() {
  delicious = false;
  sandwichGo = true;
  continuing = true;
  sandwichPrefs(delicious);
  round++;
}