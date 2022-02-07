(function () {
    //console.log("hello im here");
    var gameField = $(".gamefield");
    var gameSettings = {
        n: 7, //7, //columns
        m: 6, //6, //rows
        connectedPieces: 4,
        cellSize: 70,
    };
    var theEnd = false;
    var start = true;
    var currentPlayer = 1;
    function switchPlayer() {
        if (currentPlayer === 1) {
            $(".chip.player1").hide();
            $(".chip.player2").show();

            currentPlayer = 2;
        } else {
            currentPlayer = 1;
            $(".chip.player1").show();
            $(".chip.player2").hide();
        }
    }

    var selectedColumn = -1;
    var gameStatus = [];
    var winCombination = [];

    function startNewGame() {
        theEnd = false;

        gameStatus = [];
        for (var i = 0; i < gameSettings.n * gameSettings.m; i++) {
            gameStatus.push(0);
        }
        currentPlayer = 1;
        $(".chip.player1").show();
        $(".chip.player2").hide();
        createField();
        start = false;
        $("h1").text("Lets play the game");
        gameField.on("click", () => {
            clickHandler();
            gameField.trigger("mouseenter");
        });
        console.log("new Game");
    }

    function clickHandler() {
        var id = pushToken();

        if (id === -1) {
            return;
        }
        createField();
        if (checkForVictory(id)) {
            $("h1").text("Player " + currentPlayer + " is a Winner!");

            for (i = 0; i <= winCombination.length; i++) {
                $("#" + winCombination[i]).addClass("winChip pulse");
            }
            gameField.off("click");
        } else if (theEnd) {
            $("h1").text("Game ended. Start new game!");
            gameField.off("click");
        } else {
            switchPlayer(); // change the turn
        }
    }

    function createCell(id) {
        if (gameStatus[id] === 0) {
            return "<div class = 'cell ' id =" + id + "></div>";
        } else if (gameStatus[id] === 1) {
            return "<div class = 'cell pl1' id =" + id + "></div>";
        } else if (gameStatus[id] === 2) {
            return "<div class = 'cell pl2' id =" + id + "></div>";
        }
    }

    function waitThenAdd(array) {
        //console.log("whait and run", array);
        setTimeout(() => {
            gameField.append(array.shift());
            if (array.length > 0) return waitThenAdd(array);
            else {
                //console.log("im herre");
                return;
            }
        }, 50);
    }

    function startGameAnimation() {
        gameField.css("width", gameSettings.cellSize * gameSettings.n);
        gameField.css("height", gameSettings.cellSize * gameSettings.m);
        var cellArray = [];
        gameField.html("");

        for (var i = 0; i < gameSettings.m * gameSettings.n; i++) {
            var cell = "<div class = 'cell cell-appear' id =" + i + "></div>";
            cellArray.push(cell);
            //console.log(cell);
        }
        waitThenAdd(cellArray);
    }

    //generate visual for the gameField
    function createField() {
        gameField.css("width", gameSettings.cellSize * gameSettings.n);
        gameField.css("height", gameSettings.cellSize * gameSettings.m);
        var htmlGameField = "";

        if (start) {
            startGameAnimation();
        } else {
            for (var i = 0; i < gameSettings.m * gameSettings.n; i++) {
                htmlGameField += createCell(i);
            }

            gameField.html(htmlGameField);
        }
    }

    //get array of cells
    function getColumnByID(id) {
        var col = id % gameSettings.n;
        var col_cells = [];
        for (var i = 0; i < gameSettings.m; i++) {
            col_cells.push(i * gameSettings.n + col);
        }
        return col_cells;
    }

    function getRowByID(id) {
        var row = Math.floor(id / gameSettings.n);
        // console.log("row", row);
        var row_cells = [];
        for (var i = 0; i < gameSettings.n; i++) {
            row_cells.push(row * gameSettings.n + i);
        }
        // console.log("row", row_cells);
        return row_cells;
    }

    //get array of cells by column number
    function getColumn(col) {
        //var col = id % 7;
        var col_cells = [];
        for (i = 0; i < gameSettings.m; i++) {
            col_cells.push(i * gameSettings.n + col);
        }
        return col_cells;
    }

    function getPositionbyID(id) {
        var position = {
            x: id % gameSettings.n,
            y: Math.floor(id / gameSettings.n),
        };
        return position;
    }
    function getIDbyPosition(x, y) {
        var id = x + y * gameSettings.n;
        return id;
    }
    function getDiagonal1byID(id) {
        var diag = [id];
        var pos = getPositionbyID(id);
        var x = pos.x;
        var y = pos.y;
        while (x - 1 >= 0 && y - 1 >= 0) {
            diag.unshift(getIDbyPosition(x - 1, y - 1));
            x--;
            y--;
        }
        x = pos.x;
        y = pos.y;

        while (x + 1 < gameSettings.n && y + 1 < gameSettings.m) {
            diag.push(getIDbyPosition(x + 1, y + 1));
            x++;
            y++;
        }
        return diag;
    }

    function getDiagonal2byID(id) {
        var diag = [id];
        var pos = getPositionbyID(id);
        var x = pos.x;
        var y = pos.y;
        while (x + 1 < gameSettings.n && y - 1 >= 0) {
            diag.unshift(getIDbyPosition(x + 1, y - 1));
            x++;
            y--;
        }
        x = pos.x;
        y = pos.y;

        while (x - 1 >= 0 && y + 1 < gameSettings.m) {
            diag.push(getIDbyPosition(x - 1, y + 1));
            x--;
            y++;
        }
        return diag;
    }

    //add a chip in gamStatus
    function pushToken() {
        var col_cells = getColumn(selectedColumn);
        for (i = col_cells.length; i >= 0; i--) {
            if (gameStatus[col_cells[i]] === 0) {
                gameStatus[col_cells[i]] = currentPlayer;
                return col_cells[i]; // return id where is a token
            }
        }
        if (i === -1) {
            console.log("column is full");
            return -1; //that means that column is full
        }
    }

    startNewGame();

    $("button.newGame").click(() => {
        gameField.off("click");
        start = true;
        startNewGame();
    });
    $("button.settings").click(() => {
        // gameField.off("click");
        // startNewGame();
    });

    $("button.settings").click(() => {
        console.log("opensettings");
        openSettingsWindow();
    });

    function openSettingsWindow() {
        $("#columns").val(gameSettings.n);
        $("#connections").val(gameSettings.connectedPieces);
        $("#rows").val(gameSettings.m);
        $(".settingsWindow").css("visibility", "visible");
        $(".overlay").css("visibility", "visible");
    }

    $(".save").on("click", () => {
        if (saveSettings()) {
            $(".settingsWindow").css("visibility", "hidden");
            $(".overlay").css("visibility", "hidden");
        }
    });

    $("#close_settings").on("click", () => {
        $(".settingsWindow").css("visibility", "hidden");
        $(".overlay").css("visibility", "hidden");
    });

    $(".overlay").on("click", () => {
        $(".settingsWindow").css("visibility", "hidden");
        $(".overlay").css("visibility", "hidden");
    });

    function saveSettings() {
        var col = $("#columns").val();
        var row = $("#rows").val();
        var connect = $("#connections").val();
        if (
            col >= 1 &&
            col <= 15 &&
            row >= 1 &&
            row <= 15 &&
            connect >= 2 &&
            connect <= 10
        ) {
            gameSettings.n = col;
            gameSettings.m = row;
            gameSettings.connectedPieces = connect;

            gameField.off("click");
            start = true;
            startNewGame();
            return true;
        } else {
            console.log("settings are bad");
            return false;
        }
    }

    function selectColumn() {
        var colCells = getColumn(selectedColumn);
        for (var i = 0; i <= colCells.length; i++) {
            $(".cell#" + colCells[i]).addClass("select");
        }
    }
    function unselectColumn() {
        cells = $(".cell");
        cells.removeClass("select");
    }

    gameField.on("mousemove", ".cell", function () {
        // $(this).addClass("select");
        var id = $(this).attr("id");
        // if (selectedColumn === id % gameSettings.n) {
        //   return;
        //}
        selectedColumn = id % gameSettings.n;
        unselectColumn();
        selectColumn();
    });

    gameField.on("mouseleave", function () {
        //console.log("mouseleave");
        unselectColumn();
        selectedColumn = -1;
    });
    gameField.on("mouseenter", function () {
        // console.log("mouseenter");
        gameField.trigger("mousemove");
    });

    // gameField.on("click", function () {});

    function checkArrayForVictory(array) {
        if (array.length < gameSettings.connectedPieces) {
            return false;
        }
        winCombination = [];
        var counter = 0;
        for (var i = 0; i < array.length; i++) {
            if (gameStatus[array[i]] === currentPlayer) {
                counter += 1;
                winCombination.push(array[i]); //get a wincombination
            } else {
                counter = 0;
                winCombination = [];
            }
            if (counter >= gameSettings.connectedPieces) {
                return true;
            }
        }
        return false;
    }

    function checkForVictory(cellID) {
        // console.log("checking for victory");

        var column = getColumnByID(cellID);
        var row = getRowByID(cellID);
        var diag1 = getDiagonal1byID(cellID);

        var diag2 = getDiagonal2byID(cellID);

        var result =
            checkArrayForVictory(column) ||
            checkArrayForVictory(row) ||
            checkArrayForVictory(diag1) ||
            checkArrayForVictory(diag2);

        if (!result) {
            for (var i = 0; i < gameSettings.n; i++) {
                if (gameStatus[i] === 0) {
                    break;
                } else {
                    console.log("else");
                    if (i === gameSettings.n - 1) {
                        theEnd = true;
                        //console.log("end");
                    }
                }
            }
        }
        return result;
    }
})();
