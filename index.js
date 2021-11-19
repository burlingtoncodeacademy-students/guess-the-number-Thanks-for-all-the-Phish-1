const { randomInt } = require("crypto");
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

//asks player what game they would like to play
selectGameType();

async function numberGame() {
  console.log(
    "Ok! You will pick a number and I will try to guess it\nBut first I need you to tell me the numbers you are choosing between, and that I will guessing between..."
  );
  //define the minimum range for the game we are playing
  let min = await ask(
    "What is the lowest number your secret number can be?\n>_ "
  );
  min = parseInt(min);
  //define the maximum range for the game we are playing
  let max = await ask(
    "What is the highest number your secret number can be?\n>_ "
  );
  max = parseInt(max);
  let secretNumber = await ask(
    "And now, what is your secret number?\nI won't peek, I promise...\n>_ "
  );
  console.log("You entered: " + secretNumber);
  secretNumber = parseInt(secretNumber);

  //intention was to contain the entire game within this loop, within the function makeGuess are other nested functions to help it do its job.
  while (true) {
    await makeGuess(min, max);
  }

  //make guess makes it all happen
  async function makeGuess(min, max) {
    //computer makes a guess using the average between the min and max
    guess = parseInt((parseInt(min) + parseInt(max)) / 2);
    let inputYorN = await ask(`Is your number ${guess}?\n>_ `);
    //computer receives input and then checks that input to decide if it guessed the right number or needs to keep going forward
    checkYesOrNo(inputYorN);
    if (checkYesOrNo(inputYorN) === true) {
      //checkYesOrNo returns true if the user answers "no you did not guess the number correctly," and ends the program if the answer is "yes that's my number"
      let inputHorL = await ask("Is your number higher or lower?\n>_ ");
      inputHorL = inputHorL.charAt(0).toUpperCase(0);
     //this logic tree will bypass someone who lies about wether their number is higher or lower, and keep guessing as though they did not lie. 
      if (inputHorL === "H" && secretNumber < guess) {
        console.log("That's just like, your opinion man.");
        inputHorL = "L";
        makeNewNumber(inputHorL, guess);
      } else if (inputHorL === "L" && secretnumber > guess) {
        console.log("That's just like, your opinion man.");
        inputHorL = "H";
        makeNewNumber(inputHorL, guess);
      } else {
        makeNewNumber(inputHorL, guess);
      }
      //the computer will then make a new number, updating the min and max within the function so that next time around it will make an appropriate guess
    }
  }

  function checkYesOrNo(inputYorN) {
    input = inputYorN.charAt(0).toUpperCase(0);
    if (input === "Y") {
      return console.log("Hurray we did it!!!")(process.exit());
    } else if (input === "N") {
      return true;
    }
  }

  //here is the function that updates the minimum and maximum allowing future guesses to appropriate
  function makeNewNumber(inputHorL, guess) {
    // input = inputHorL.charAt(0).toUpperCase(0);
    if (inputHorL === "H") {
      min = guess;
    } else if (inputHorL !== "H") {
      max = guess;
    }
  }
}

//this function helps the player determine which game they would like to play
async function selectGameType() {
  console.log(
    "Let's play GUESS THE NUMBER! it's my favorite game...\nactually, it's the only game I know.\nOne of us will pick a number, and the other one will try to guess it."
  );
  console.log("Game One: You will pick a number, and I will try to guess it.");
  console.log("Game Two: I will pick a number, and you will try to guess it.");
  let selection = await ask("Would you like to play game one or two?\n>_ ");
  selectionClean = selection.charAt(0).toUpperCase(0);

  if (selectionClean === "1" || selectionClean === "O") {
    numberGame();
  } else if (selectionClean === "2" || selectionClean === "T") {
    reverseGame();
  }
}

//this is the reverse game!
async function reverseGame() {
  console.log(
    "OK! we'll play the game where I pick a secret number and YOU try to guess it...\nbut first, I need you to tell me the numbers I am choosing between, and that you will be guessing between..."
  );
  //again defines min and max for game
  let min = await ask("What is the lowest number I may choose between?\n>_ ");
  min = parseInt(min);
  let max = await ask("What is the highest number I may choose between?\n>_ ");
  max = parseInt(max);

  //the computer makes his secretNumber
  let secretNumberComp = randomInteger(min, max);

  //player starts guessing
  let playerGuessInput = await ask(
    "I have selected a number between your parameters\nLET THE GAME BEGIN!\nGive me your best shot...\n>_ "
  );
  playerGuess = parseInt(playerGuessInput);

  //here is where the computer determines if you guess is higher or lower than its number and gives you that information to make a better guess. and it keeps going until you've got it!
  while (true) {
    if (playerGuess > secretNumberComp) {
      console.log("Sorry my number is lower than your guess...");
      nextGuess = await ask("What is your next guess?\n>_ ");
      playerGuess = parseInt(nextGuess);
    } else if (playerGuess < secretNumberComp) {
      console.log("Sorry my number is higher than your guess...");
      nextGuess = await ask("What is your next guess?\n>_ ");
      playerGuess = parseInt(nextGuess);
    } else if (playerGuess === secretNumberComp) {
      console.log("Great job! you are at least as smart as me =)");
      process.exit();
    }
  }
}

//this function is used to help the computer make its initial secretNumber that the player will try to guess in the reverse game
function randomInteger(min, max) {
  let range = max - min + 1;
  return min + Math.floor(Math.random() * range) + min;
}
