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
let resultMessage = ["you win!", "you lose.", "draw..."];
let round = 0;
let confidence = 0;

let brain;
let history = [];
let hLength = 10 * 6;

let paperPNG;
let rockPNG;
let scissorsPNG;
let welcomePNG;
let titlePNG;

let browserSize = {
  browserWidth: window.innerWidth || document.body.clientWidth,
  browserHeight: window.innerHeight || document.body.clientHeight
}

function preload() {
  paperPNG = loadImage('paper.png');
  rockPNG = loadImage('rock.png');
  scissorsPNG = loadImage('scissors.png');
  welcomePNG = loadImage('welcome.png');
  titlePNG = loadImage('RPS_Title.png');
}

function setup() {
  createCanvas(browserSize.browserWidth - 30, browserSize.browserHeight - 30);
  // createCanvas(800, 800);
  window.resizeTo(width+10, height+10);
  brain = new NeuralNetwork(hLength, 80, 3);
  textFont('courier new');
  // setupOsc(12000, 3334);
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
      screenTimer = max([90 - (round * 4), 40]);
      reset = false;
      interval = (screenTimer - 40) / 3;
      npChoose();
    }
    countdownScreen(interval);


    // pChoose();
  }

  if (screenState == 3) {
    if (reset == true) {
      screenTimer = max([90 - (round * 4), 40]);
      reset = false;
      interval = (screenTimer - 40) / 3;

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
    textStyle(BOLD);
    fill(255);
    // rectMode(CENTER);
    // rect(width / 2, 80, 200, 120);
    // fill(0);
    text("round", width / 2, 70);
    text(round, width / 2, 130);

    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("computer", width / 4, 70);
    text("player", width * 3 / 4, 70);
    textSize(30);
    text(npScore, width / 4, 130);
    text(pScore, width * 3 / 4, 130);
  }
}

function introScreen() {
  push();
  translate(width / 2, 0);
  // textSize(20);
  // fill(255);
  // text("Welcome to", 0, 0);
  // textSize(60);
  // textStyle(BOLD);

  push();
  translate(0, 180);
  imageMode(CENTER);
  scale(1 / 4);
  image(titlePNG, 0, 0);
  pop();

  // text("Rock, Paper, Scissors", 0, 65);
  textSize(20);
  fill(255, 0, 60);
  textAlign(CENTER);
  textStyle(BOLD);
  text("machine learning edition", 0, 230);

  push();
  translate(-20, 480);
  imageMode(CENTER);
  scale(1 / 4);
  image(welcomePNG, 0, 0);
  pop();
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
  textSize(40);
  textStyle(BOLD);
  fill(255);
  text("how to play:", 0, 0);
  textSize(20);
  textStyle(NORMAL);
  text("each player simultaneously plays an item," + '\n' + "either rock, paper, or scissors.", 0, 40);
  text("rock(1) beats scissors.", 0, 100);
  text("paper(2) beats rock.", 0, 130);
  text("scissors(3) beats paper.", 0, 160);
  pop();

  if (screenTimer <= 120) {
    textSize(60);
    textAlign(CENTER);
    textStyle(BOLD);
    fill(255, 0, 60);
    text("ready?!", width / 2, 600);
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
  fill(255, 0, 60);
  if (screenTimer > _i * 2 + 40) {
    // textSize(240 - screenTimer);
    text("3", 0, 0);
  } else if (screenTimer > _i * 1 + 40) {
    // textSize(200 - screenTimer);
    text("2", 0, 0);
  } else if (screenTimer > 40) {
    // textSize(160 - screenTimer);
    text("1", 0, 0);
  } else {
    textSize(120 - screenTimer);
    text("throw!", 0, 0);
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
  fill(255, 203, 0);

  push();
  translate(width / 4, width / 2 - 80);
  imageMode(CENTER);
  scale(-1 / 3, 1 / 3);
  rotate(-PI / 2);
  if (npChoice == 1) {
    image(rockPNG, 0, 0);
  }
  if (npChoice == 2) {
    image(paperPNG, 0, 0);
  }
  if (npChoice == 3) {
    image(scissorsPNG, 0, 0);
  }
  pop();

  push();
  translate(3 * width / 4, width / 2 - 80);
  imageMode(CENTER);
  scale(1 / 3, 1 / 3);
  rotate(-PI / 2);
  if (pChoice == 1) {
    image(rockPNG, 0, 0);
  }
  if (pChoice == 2) {
    image(paperPNG, 0, 0);
  }
  if (pChoice == 3) {
    image(scissorsPNG, 0, 0);
  }
  pop();


  // text(rps[npChoice], width / 4, height / 2);
  // text(rps[pChoice], width * 3 / 4, height / 2);

  if (confidence > 0) {
    textSize(20);
    text(Math.round(confidence * 100) + "% confident", width / 4, height / 2 + 80);
  }

  if (screenTimer <= 100) {
    // rectMode(CENTER);
    // fill(80);
    // if (result == 0) {
    //   fill(0, 255, 0);
    // }
    fill(255);
    if (result == 1) {
      fill(255, 0, 60);
    }
    // rect(width / 2, height - 180, 600, 125)
    textSize(60);
    // fill(255, 0, 60);
    textStyle(BOLD);
    text(resultMessage[result], width / 2, height - 150);
  }

  screenTimer -= 1;

  if (screenTimer <= 0) {
    screenState = 2;
    reset = true;

    if (npChoice == 1) {
      history.push(1);
      history.push(0);
      history.push(0);
    }
    if (npChoice == 2) {
      history.push(0);
      history.push(1);
      history.push(0);
    }
    if (npChoice == 3) {
      history.push(0);
      history.push(0);
      history.push(1);
    }
    if (pChoice ==0){
      history.push(0);
      history.push(0);
      history.push(0);
    }
    if (pChoice == 1) {
      history.push(1);
      history.push(0);
      history.push(0);
    }
    if (pChoice == 2) {
      history.push(0);
      history.push(1);
      history.push(0);
    }
    if (pChoice == 3) {
      history.push(0);
      history.push(0);
      history.push(1);
    }

    if (history.length > hLength) {
      history.splice(0, 6);
    }

    if (round >= 10) {
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
  text("the computer won " + Math.round(npScore / (npScore + pScore) * 100) + "%", width / 2, 200);
  text("you won " + Math.round(pScore / (npScore + pScore) * 100) + "%", width / 2, 230);

  textSize(100);
  if (npScore > pScore) {
    text("you lose!", width / 2, height / 2);
  }
  if (npScore == pScore) {
    text("you tied with the computer.", width / 2, height / 2);
  }
  if (npScore < pScore) {
    text("you win!", width / 2, height / 2);
  }
}

function npChoose() {
  if (round < hLength / 6) {
    npChoosing = random([1, 2, 3]);
  } else {
    let predicted = brain.predict(history);
    // console.log(predicted);
    confidence = Math.max(...predicted);
    npChoosing = (predicted.indexOf(confidence) + 4) % 3 + 1;
    // console.log(npChoosing);
  }
}

function pChoose() {
  pChoice = random([2, 3, 1]);
}

function keyPressed() {
  if (keyCode == 32 && screenState < 2) {
    screenTimer = 0;
  }

  if (keyCode == 32 && screenState == 4) {
    round = 0;
    screenTimer = 0;
    screenState = 0;
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
  if (pChoice == 0 || pChoice == 1) {
    targets = [1, 0, 0];
  }
  if (pChoice == 2) {
    targets = [0, 1, 0];
  }
  if (pChoice == 3) {
    targets = [0, 0, 1];
  }

  let inputs = history;

  brain.train(inputs, targets);
}

function setupOsc(oscPortIn, oscPortOut) {
  var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
  socket.on('connect', function () {
    socket.emit('config', {
      server: { port: oscPortIn, host: '127.0.0.1' },
      client: { port: oscPortOut, host: '127.0.0.1' }
    });
  });

  socket.on('message', function (msg) {
    if (msg[0] == '/wek/outputs') {
      for (var i = 2; i < msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }

    pChoosing = msg[1];

    console.log(msg);
  });
}