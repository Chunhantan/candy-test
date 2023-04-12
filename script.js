
var candies = ["lens 01", "lens 06", "lens 04", "lens 07", "Lens-ShimmeringGold", "Lens-SparklingBlack"];
var board = [];
var rows = 6;
var columns = 6;
var score = 0;

var currTile;
var otherTile;


window.onload = function() {
    startGame();

    //1/10th of a second
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

            //TOUCH FUNCTIONALITY
            tile.addEventListener("touchstart", touchStart); //tap on a candy, initialize touch process
            tile.addEventListener("touchmove", touchMove); //dragging candy on touch screen
            tile.addEventListener("touchend", touchEnd); //after touch process completed, we swap candies


            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}


function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

function touchStart(e) {
    e.preventDefault();
    currTile = this;
    touchX = e.touches[0].pageX;
    touchY = e.touches[0].pageY;
}

function touchMove(e) {
    e.preventDefault();
    let xDiff = e.touches[0].pageX - touchX;
    let yDiff = e.touches[0].pageY - touchY;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // horizontal movement
        if (xDiff > 0) {
            // move right
            otherTile = document.getElementById((parseInt(currTile.id.charAt(0))) + "-" + (parseInt(currTile.id.charAt(2)) + 1));
        } else {
            // move left
            otherTile = document.getElementById((parseInt(currTile.id.charAt(0))) + "-" + (parseInt(currTile.id.charAt(2)) - 1));
        }
    } else {
        // vertical movement
        if (yDiff > 0) {
            // move down
            otherTile = document.getElementById((parseInt(currTile.id.charAt(0)) + 1) + "-" + (parseInt(currTile.id.charAt(2))));
        } else {
            // move up
            otherTile = document.getElementById((parseInt(currTile.id.charAt(0)) - 1) + "-" + (parseInt(currTile.id.charAt(2))));
        }
    }
    dragDrop();
}

function touchEnd() {
    dragEnd();
}

function crushCandy() {
    //crushFive();
    crushFour();
    crushThree();
    document.getElementById("score").innerText = score;

}

function crushFour() {
  //check rows
  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns-3; c++) {
          let candy1 = board[r][c];
          let candy2 = board[r][c+1];
          let candy3 = board[r][c+2];
          let candy4 = board[r][c+3];
          if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && !candy1.src.includes("blank")) {
              candy1.src = "./images/blank.png";
              candy2.src = "./images/blank.png";
              candy3.src = "./images/blank.png";
              candy4.src = "./images/blank.png";
              score += 160;
          }
      }
  }

  //check columns
  for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows-3; r++) {
          let candy1 = board[r][c];
          let candy2 = board[r+1][c];
          let candy3 = board[r+2][c];
          let candy4 = board[r+3][c];
          if (candy1.src == candy2.src && candy2.src == candy3.src && candy3.src == candy4.src && !candy1.src.includes("blank")) {
              candy1.src = "./images/blank.png";
              candy2.src = "./images/blank.png";
              candy3.src = "./images/blank.png";
              candy4.src = "./images/blank.png";
              score += 160;
          }
      }
  }
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 120;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 120;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}


function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}
// Set the date we're counting down to
  var countDownDate = new Date().getTime() + 45000;

  // Update the countdown every 1 second
var countdown = setInterval(function() {

  // Get the current date and time
  var now = new Date().getTime();

  // Find the distance between now and the countdown date
  var distance = countDownDate - now;

  // Calculate days, hours, minutes, and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output the countdown in the element with id="countdown"
  document.getElementById("countdown").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the countdown is finished, display a message
  if (distance < 0) {
    clearInterval(countdown);
    document.getElementById("countdown").innerHTML = "EXPIRED";
    alert("This is the score you get "+score);
  }
}, 1000);
