let npChoosing = 0;
let npChoice = 0;
let pChoosing = 0; //this allows the player to make a new selection while seeing the old one on screen
let pChoice = 0;
let npScore = 0;
let pScore = 0;
let screenState = 0;
let messages = [];
let reset = true;
let screenTimer = 0;
let interval = 0;
let result = 0;
let resultMessage = ["YOU WIN!", "YOU LOSE.", "DRAW..."];
let round = 0;
let confidence = 0;

let brain;
let trainingRounds = 20;
let history = [];
let hLength = 1 * 3;

// let browserSize = {
//   browserWidth: window.innerWidth || document.body.clientWidth,
//   browserHeight: window.innerHeight || document.body.clientHeight
// }

function setup() {
  // createCanvas(browserSize.browserWidth, browserSize.browserHeight);
  createCanvas(800, 800);
  brain = new NeuralNetwork(hLength, 60, 3);

}

function draw() {
  background(0);

  if (screenState == 0) {
    if (reset == true) {
      screenTimer = 140;
      reset = false;
    }
    introScreen();
  }

  if (screenState == 1) {
    if (reset == true) {
      screenTimer = 300;
      reset = false;
    }
    instructScreen();
  }

  if (screenState == 2) {
    if (reset == true) {
      screenTimer = max([140 - (round * 4), 40]);
      reset = false;
      interval = screenTimer / 4;
      npChoose();
    }
    countdownScreen(interval);

    
    // pChoose();
  }

  if (screenState == 3) {
    if (reset == true) {
      screenTimer = max([160 - (round * 4), 40]);
      reset = false;
      interval = screenTimer / 4;

      npChoice = npChoosing;
      npChoosing = 0;
      pChoice = pChoosing;
      pChoosing = 0;

      if (npChoice == pChoice) {
        result = 2;
      } else if (pChoice == 0) {
        result = 1;
      } else {
        if (npChoice == 1) {
          if (pChoice == 2) {
            result = 0;
          }
          if (pChoice == 3) {
            result = 1;
          }
        }
        if (npChoice == 2) {
          if (pChoice == 3) {
            result = 0;
          }
          if (pChoice == 1) {
            result = 1;
          }
        }
        if (npChoice == 3) {
          if (pChoice == 1) {
            result = 0;
          }
          if (pChoice == 2) {
            result = 1;
          }
        }
      }
    }
    throwScreen(interval);
  }

  if (screenState == 4) {
    if (reset == true) {

    }

    summaryScreen();
  }

  if (screenState >= 2) {
    textAlign(CENTER);
    textSize(50);
    fill(255);
    rectMode(CENTER);
    rect(width / 2, 80, 200, 120);
    fill(0);
    text("ROUND", width / 2, 70);
    text(round, width / 2, 130);

    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Computer", width / 4, 40);
    text("Player", width * 3 / 4, 40);
    textSize(30);
    text(npScore, width / 4, 90);
    text(pScore, width * 3 / 4, 90);
  }
}

function introScreen() {
  push();
  translate(width / 2, 300);
  textAlign(CENTER);
  textSize(20);
  fill(255);
  text("Welcome to", 0, 0);
  textSize(60);
  textStyle(BOLD);
  text("Rock, Paper, Scissors", 0, 65);
  textSize(20);
  fill(255, 0, 0);
  textStyle(ITALIC);
  text("Machine Learning Edition", 0, 110);
  pop();

  // screenTimer -= 1;

  if (screenTimer <= 0) {
    screenState += 1;
    reset = true;
  }
}

function instructScreen() {
  push();
  translate(width / 2, 300);
  textAlign(CENTER);
  textSize(60);
  textStyle(BOLD);
  fill(255);
  text("How to play:", 0, 0);
  textSize(20);
  textStyle(NORMAL);
  text("Each player simultaneously plays an item, either rock, paper, or scissors.", 0, 40);
  text("Rock(1) beats scissors.", 0, 70);
  text("Scissors(2) beats paper.", 0, 100);
  text("Paper(3) beats rock.", 0, 130);
  pop();

  if (screenTimer <= 120) {
    textSize(60);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(255, 0, 0);
    text("READY?!", width / 2, height / 2);
    screenTimer += 1;
  }

  screenTimer -= 1;

  if (screenTimer <= 0) {
    screenState += 1;
    reset = true;
  }
}

function countdownScreen(_i) {
  push();
  translate(width / 2, height / 2);
  textSize(100);
  textStyle(BOLD)
  textAlign(CENTER);
  fill(255, 0, 0);
  if (screenTimer > 120) {
    text("3", 0, 0);
  } else if (screenTimer > 80) {
    text("2", 0, 0);
  } else if (screenTimer > 40) {
    text("1", 0, 0);
  } else {
    text("THROW!", 0, 0);
  }
  pop();

  screenTimer -= 1;

  if (screenTimer <= 0) {
    screenState += 1;
    reset = true;
  }
}

function throwScreen() {
  let rps = ["X", "ROCK", "PAPER", "SCISSORS"];

  stroke(255);
  strokeWeight(2);
  line(width / 2, 200, width / 2, height - 300);
  noStroke();

  textSize(50);
  textStyle(NORMAL);
  fill(255, 255, 0);
  text(rps[npChoice], width / 4, height / 2);
  text(rps[pChoice], width * 3 / 4, height / 2);

  if(confidence > 0){
    textSize(20);
    text(Math.round(confidence * 100) + "% confident", width / 4, height / 2 + 80);
  }

  if (screenTimer <= 100) {
    rectMode(CENTER);
    fill(80);
    if (result == 0) {
      fill(0, 255, 0);
    }
    if (result == 1) {
      fill(255, 0, 0);
    }
    rect(width / 2, height - 180, 600, 125)
    textSize(100);
    fill(255);
    text(resultMessage[result], width / 2, height - 150);
  }

  screenTimer -= 1;

  if (screenTimer <= 0) {
    screenState = 2;
    reset = true;
    
    if (round >= 10){
      training();
    }

    npChoice = 0;

    round += 1;

    if (result == 0) {
      pScore += 1;
    }
    if (result == 1) {
      npScore += 1;
    }

    if (round > 100) {
      screenState = 4;
      round = 100;
    }
  }
}

function summaryScreen() {
  textAlign(CENTER);
  textSize(20);
  fill(255);
  text("The computer won " + Math.round(npScore / (npScore + pScore) * 100) + "%", width / 2, 200);
  text("You won " + Math.round(pScore / (npScore + pScore) * 100) + "%", width / 2, 230);

  textSize(50);
  if (npScore > pScore) {
    text("You lose!", width / 2, height / 2);
  }
  if (npScore == pScore) {
    text("You tied with the computer.", width / 2, height / 2);
  }
  if (npScore < pScore) {
    text("You win!", width / 2, height / 2);
  }
}

function npChoose() {
  if (round < hLength / 3) {
    npChoosing = random([1, 2, 3]);
  } else {
    let predicted = brain.predict(history);
    console.log(predicted);
    confidence = Math.max(...predicted);
    npChoosing = (predicted.indexOf(confidence) + 4) % 3 + 1;
    console.log(npChoosing);
  }

  if (npChoosing == 1) {
    history.push(1);
    history.push(0);
    history.push(0);
  }
  if (npChoosing == 2) {
    history.push(0);
    history.push(1);
    history.push(0);
  }
  if (npChoosing == 3) {
    history.push(0);
    history.push(0);
    history.push(1);
  }

  if (history.length > 30){
    history.splice(0,3);
  }
}

function pChoose() {
  pChoice = random([2, 3, 1]);
}

function keyPressed() {
  if (keyCode == 32 && screenState < 2) {
    screenTimer = 0;
  }

  if (screenState >= 2) {
    if (keyCode == 49) {
      pChoosing = 1;
    }
    if (keyCode == 50) {
      pChoosing = 2;
    }
    if (keyCode == 51) {
      pChoosing = 3;
    }
  }
}

function training() {
  let targets;

  //if the player misses a throw, any response will be fine
  if (pChoice == 0 || pChoice == 1){
    targets = [1,0,0];
  }
  if (pChoice == 2){
    targets = [0,1,0];
  }
  if (pChoice == 3){
    targets = [0,0,1];
  }
    
  let inputs = history;

  brain.train(inputs, targets);
}







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