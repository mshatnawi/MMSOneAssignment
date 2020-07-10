//Class (function) GameOfLife models the procedure of the game
function GameOfLife() {
    //the results array, this array will be return as 3d array
    //1st dimension, represents each generation
    //2nd dimension, represents the rows in the grid
    //3rd dimension, represents the columns in the grid
    var _resultsArray = [];
    //The size of the 2d grid (array), where number of rows = columns (rectangle)
    var _gridSize;
    //The count of the generations that will calculated
    var _generationCount;

    //the constructor of the GameOfLife function
    this.Initiate = function (gridSize, genCount) {
        _gridSize = gridSize;
        _generationCount = genCount;
    }

    //return the results array
    this.GetResultsArray = function () {
        return _resultsArray;
    }

    //fill the initialGrid (generation 0), with the selected cells
    this.FillInitialGrid = function (selectedItems) {
        //add initial grid (generation 0) to the results array
        _resultsArray[0] = [];
        //loop on each row and column and fill it with false (died)
        for (var i = 0; i < _gridSize; i++) {
            _resultsArray[0][i] = [];
            for (var j = 0; j < _gridSize; j++) {
                _resultsArray[0][i][j] = false;
            }
        }
        //loop on the selected cells, and fill their indicies with true (alive)
        for (i = 0; i < selectedItems.length; i++) {
            _resultsArray[0][selectedItems[i][0]][selectedItems[i][1]] = true;
        }
    }

    //solve the GameOfLife
    this.Solve = function () {
        //loop on each generation and solve it, starting from generation 1
        for (var i = 1; i <= _generationCount; i++) {
            _resultsArray[i] = this.DefineNextGeneration(_resultsArray[i - 1]);
        }
    }

    //count the true (alive) neighbor cells, x is the row, y is column
    this.CountSurrounding = function(grid, x, y)
    {
        var count = 0;
        //check if the element is exist in the grid (array) with that indices and if it has a value (1), alive.
        //the left neighbor
        if (this.isElementInArray(x, y - 1) && grid[x][y - 1])
            count++;
        //the right neighbor
        if (this.isElementInArray(x, y + 1) && grid[x][y + 1])
            count++;
        //the top neighbor
        if (this.isElementInArray(x - 1, y) && grid[x - 1][y])
            count++;
        //the bottom neighbor
        if (this.isElementInArray(x + 1, y) && grid[x + 1][y])
            count++;
        //the top-left neighbor
        if (this.isElementInArray(x - 1, y - 1) && grid[x - 1][y - 1])
            count++;
        //the bottom-right neighbor
        if (this.isElementInArray(x + 1, y + 1) && grid[x + 1][y + 1])
            count++;
        //the top-right neighbor
        if (this.isElementInArray(x - 1, y + 1) && grid[x - 1][y + 1])
            count++;
        //the bottom-left neighbor
        if (this.isElementInArray(x + 1, y - 1) && grid[x + 1][y - 1])
            count++;
        return count;
    }

    //Define the next generation grid (2d array), based on the current grid 
    this.DefineNextGeneration = function(currentGeneration)
    {
        //define an empty array which will have the same diminsions of the initial grid
        var nextGen = [];
        var i, j, surroundings;
        //start looping on the rows of the grid
        for (i = 0; i < _gridSize; i++) {
            nextGen[i] = [];
            //start looping on the columns of the grid
            for (j = 0; j < _gridSize; j++) {
                //get the number of the alive (true) surroundings
                surroundings = this.CountSurrounding(currentGeneration, i, j);
                //satisfy the assignment conditions
                if (surroundings === 2 || surroundings === 3) {
                    if (!currentGeneration[i][j] && surroundings === 3)
                        nextGen[i][j] = true;
                    else if (currentGeneration[i][j] && (surroundings === 3 || surroundings === 2))
                        nextGen[i][j] = true;
                    else
                        nextGen[i][j] = false;
                } else {
                    nextGen[i][j] = false;
                }
            }
        }
        return nextGen;
    }

    //Check if the element is exist within the boundries of the grid (array)
    this.isElementInArray = function (i, j) {
        if (i < 0 || j < 0 || i >= _gridSize || j >= _gridSize)
            return false;
        return true;
    }
};