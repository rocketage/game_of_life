function FPSView(id) {
    var fpsLabel = document.getElementById(id);
    var start;
    var frames = 0;
    var timer = 0;

    function reset() {
        start = new Date();
        frames = 0;
    };

    function update() {
        var now = new Date();
        var delta = now.getTime() - start.getTime();
        fpsLabel.innerText = ((frames * 1000) / delta).toFixed(2);
        reset();
    };

    this.start = function(interval) {
        reset();
        timer = setInterval(update, interval);
    };

    this.frameRendered = function() {
        frames++;
    };

    this.stop = function() {
        clearInterval(timer);
    };
}


function GameOfLife() {
    var frameCallback = null,
        grid = null,
        evolution = new Evolution(),
        frameTime = 0,
        start = 0,
        timer = 0,
        rules = new Rules(),
        view = new GLView("canvas", "2d-vertex-shader", "2d-fragment-shader");

    function cycle(timestamp) {
        if (!start) {
            start = timestamp;
        }

        if ((timestamp - start) > frameTime) {
            var commands = evolution.analyse(rules);

            evolution.update(commands);
            commands.forEach(function (cell) {
                view.drawCell(cell);
            });

            start = timestamp;
            if (frameCallback) {
                frameCallback();
            }
        }

        timer = window.requestAnimationFrame(cycle);
    };

    this.init = function(width, height, onFrameCallback) {
        var liveProbability = 0.5;

        frameCallback = onFrameCallback || null;

        grid = new Grid(width, height);
        grid.init(function (x, y) {
            return new Cell(Math.random() > liveProbability ? true : false);
        });

        evolution.create(grid);
        view.initGrid(grid, width, height);
    };

    this.setFrameRate = function(fps) {
        frameTime = (1 / fps) * 1000;
    };

    this.start = function() {
        grid.callAll(function(cell) {
            if (cell.alive) {
                view.drawCell(cell);
            }
        });

        start = 0;
        timer = window.requestAnimationFrame(cycle);
    };

    this.stop = function() {
        window.cancelAnimationFrame(timer);
    };
}


function main() {

    var fps = new FPSView("fps");
    var game = new GameOfLife();
    var canvas = document.getElementById("canvas");
    var frameRateSelect = document.getElementById("framerate");
    var blockSizeSelect = document.getElementById("blocksize");
    var restartButton = document.getElementById("restart");

    var getFrameRate = function() {
        return frameRateSelect.options[frameRateSelect.selectedIndex].value;
    };

    var setFrameRate = function() {
        game.setFrameRate(getFrameRate());
    };

    var getBlockSize = function() {
        return blockSizeSelect.options[blockSizeSelect.selectedIndex].value;
    };

    var bindControls = function() {
        frameRateSelect.onchange = setFrameRate;
        blockSizeSelect.onchange = restart;
        restartButton.onclick = restart;
    };

    var fpsUpdate = function() {
        fps.frameRendered();
    };

    var restart = function() {
        fps.stop();
        game.stop();

        game.init(
            parseInt(canvas.clientWidth / getBlockSize()),
            parseInt(canvas.clientHeight / getBlockSize()),
            fpsUpdate
        );

        fps.start(1000);
        setFrameRate();
        game.start();
    };

    bindControls();
    restart();
}
