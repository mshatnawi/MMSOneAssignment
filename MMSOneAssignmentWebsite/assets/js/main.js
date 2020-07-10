//array to save the selected cells in the grid
var selectedCells = [];

//create object of the initial canavs (that will be used to select the cells on)
var initialCanvas = document.getElementById('cnv_initial');

//the context of the initial canvas
var initialContext = initialCanvas.getContext('2d');

//object of the grid size textbox
var gridSize = document.getElementById('txt_gridSize');

//object of the generations count textbox
var genCount = document.getElementById('txt_generationCount');

//object of the initial grid holder (DIV)
var drawGridHolder = document.getElementById('div_drawGrid');

//object of the solution holder (DIV)
var solutionHolder = document.getElementById('div_solution');

// add event listner to "Draw Grid" button
document.getElementById('btn_drawGrid').addEventListener('click', function (evt) {
    //only accept grid size between 5 and 1000
    if (gridSize.value >= 5 && gridSize.value <= 1000) {
        //re-initiate the selectedCells array
        selectedCells = [];
        //clear any created grid (context)
        initialContext.clearRect(0, 0, initialCanvas.width, initialCanvas.height);
        //remove the on click event listener of the initial canvas
        initialCanvas.removeEventListener('click', onCanvasClick, false);
        //resize the initialCanvas to fit into the center
        //each grid is 10px, smaller than that will be harder on the user to click on the desired cell
        initialCanvas.width = gridSize.value * 10 + 1
        initialCanvas.height = gridSize.value * 10 + 1
        //hide the solution holder object (DIV)
        solutionHolder.style.display = "none";
        //call drawGrid, to draw a grid inside the canvas
        drawGrid(initialContext, gridSize.value);
        //add the on click event listener of the initial canvas
        initialCanvas.addEventListener('click', onCanvasClick, false);
        //show the initial canvas holder object (DIV)
        drawGridHolder.style.display = "";
    } else {
        //hide the initial canvas holder object (DIV)
        drawGridHolder.style.display = "none";
        //hide the solution holder object (DIV)
        solutionHolder.style.display = "none";
        //clear any created grid (context)
        initialContext.clearRect(0, 0, initialCanvas.width, initialCanvas.height);
        //remove the on click event listener of the initial canvas
        initialCanvas.removeEventListener('click', onCanvasClick, false);
        //resize the initial canvas to 0.
        initialCanvas.width = 0;
        initialCanvas.height = 0;
        alert("Grid Size must be between 5 and 1000");
    }
}, false);

// add event listner to "Solve" button
document.getElementById('btn_solve').addEventListener('click', function (evt) {
    //check if generations count is not empty
    if (genCount.value !== "") {
        //define the html string that will be injected to the solution holder (DIV)
        var htmlVal = "";
        //define the size of the result canvases to be the same as the initial canvas
        var canvasSize = gridSize.value * 10 + 1;
        //define GameOfLife object
        var gol = new GameOfLife();
        //initiate the GOL object -- this is a constructor function
        gol.Initiate(gridSize.value, genCount.value);
        //fill the initialgrid (generation 0) with the selected values
        gol.FillInitialGrid(selectedCells);
        //solve the game of life
        gol.Solve();
        //save the game of life results to a new object
        var results = gol.GetResultsArray();
        //loop on each generation based on Generation Count textbox value
        for (i = 1; i <= genCount.value; i++) {
            //define the injected html as string
            htmlVal += "<div class='row'><div class='col-md-12'><hr /></div>"
            htmlVal += "<div class='col-md-12 text-center'><label>Generation " + i + "</label></div>";
            htmlVal += "<div class='col-md-12 text-center' style='overflow: auto; max-height:400px'>";
            //define variable ID of each canvas, which later will be filled with the result grid of each generation based on its ID
            htmlVal += "<canvas id='cnv_solution" + i + "' width='" + canvasSize + "' height='" + canvasSize + "'></canvas>";
            htmlVal += "</div></div><br />";
        }
        //inject the html into the solution holder (DIV)
        //loop on each generation (starting from generation 1, where generation 0 is the initial grid)_
        //based on Generation Count textbox value.It can be done on the previous loop, but separated to be more clear
        //the generations count (include generation 0) is the same length as the first dimension in the results array
        solutionHolder.innerHTML = htmlVal;
        for (i = 1; i <= genCount.value; i++) {
            //define a temporary canvas which has the id of the generation (similar to the one defined in the previous loop)
            var canvasTemp = document.getElementById('cnv_solution' + i);
            var contextTemp = canvasTemp.getContext('2d');
            //draw a grid inside the temporary canvas object
            drawGrid(contextTemp, gridSize.value);
            //loop on the second dimension in results array
            for (j = 0; j < results[i].length; j++) {
                //loop on the third dimension in results array
                for (k = 0; k < results[i][j].length; k++) {
                    //fill the cell if the value of the item in the third dimension is true (alive)
                    if (results[i][j][k]) {
                        //again, each cell is 10px length and width
                        var x = 10 * (j + 0.1);
                        var y = 10 * (k + 0.1);
                        //the rows (x) in the array are horizontal, and the columns (y) in the array are vertical on the secreen (flipped)
                        fillSquare(contextTemp, y, x);
                    }


                }
            }

        }
        //show the solution holder object (DIV)
        solutionHolder.style.display = "";
        alert("Solved!");
        window.scroll(0, 450);
    }
    else {
        alert("Please specifiy the Generations Count");
    }
}, false);

//create onCanvasClick function, to color the selected cell in the initial canvas
function onCanvasClick(evt) {
    //get the mouse position on the canvas
    var mousePos = getSquare(initialCanvas, evt);
    //again, the length and width of each cell in the canvas is 10px, we subtracted 0.1, to start from 0.
    var x = mousePos.x / 10 - 0.1;
    var y = mousePos.y / 10 - 0.1;
    //check if the selected cell is has been selected before, by comparing it is location with the indicies in the sellectedCells array
    if (isItemInArray(selectedCells, [Math.round(y), Math.round(x)])) {
        //unfill the selected cell and remove it from the selectedCells array
        unfillSquare(initialContext, mousePos.x, mousePos.y)
        selectedCells = removeFromArray(selectedCells, [Math.round(y), Math.round(x)]);
    } else {
        //fill the selected cell and add it to the selectedCells array
        fillSquare(initialContext, mousePos.x, mousePos.y)
        selectedCells.push([Math.round(y), Math.round(x)]);
    }
}

//get the mouse position on the canvas
function getSquare(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: 1 + (evt.clientX - rect.left) - (evt.clientX - rect.left) % 10,
        y: 1 + (evt.clientY - rect.top) - (evt.clientY - rect.top) % 10
    };
}

//draw the grid in the canvas
function drawGrid(context, _gridSize) {
    //again, the size of the cell is 10px
    var limit = _gridSize * 10;
    //1 has been added the loop condition to show the last grid line (to the right) in the grid
    for (var x = 0.5; x < limit + 1; x += 10) {
        context.moveTo(x, 0);
        context.lineTo(x, limit);
    }
    //1 has been added the loop condition to show the last grid line (to the bottom) in the grid
    for (var y = 0.5; y < limit + 1; y += 10) {
        context.moveTo(0, y);
        context.lineTo(limit, y);
    }
    context.strokeStyle = "#ddd";
    context.stroke();
}

//fill the selected cell with gray color
function fillSquare(context, x, y) {
    context.fillStyle = "gray"
    context.fillRect(x, y, 9, 9);
}
//fill the unselected cell with white color
function unfillSquare(context, x, y) {
    context.fillStyle = "white"
    context.fillRect(x, y, 9, 9);
}

//chech if the item is exist in 2d array by matching the row and the column index
function isItemInArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] === item[0] && array[i][1] === item[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

//remove item from  2d array by matching the row and the column index
function removeFromArray(array, item) {
    return array.filter(function (items) {
        return items[0] !== item[0] && items[1] !== item[1];
    });
}