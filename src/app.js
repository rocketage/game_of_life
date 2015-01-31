function FPSView(id) {
    var fpsLabel = document.getElementById(id);
    var start;
    var frames = 0;

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
        setInterval(update, interval);
    };

    this.frameRendered = function() {
        frames++;
    };
}


function main() {

    var width = 300;
    var height = 150;
    var liveProbability = 0.5;
    var grid = new Grid(width, height);
    var evolution = new Evolution();
    var rules = new Rules();
    var view = new GLView("canvas", "2d-vertex-shader", "2d-fragment-shader");
    var fps = new FPSView("fps");
    var frameCount = 0;
    var framesPerDraw = 10;

    var cycle = function() {
        frameCount++;
        if (frameCount > framesPerDraw) {
            var commands = evolution.analyse(rules);
            evolution.update(commands);
            commands.forEach(function (cell) {
                view.drawCell(cell);
            });
            frameCount = 0;
            fps.frameRendered();
        }
        window.requestAnimationFrame(cycle);
    };

    grid.init(function (x, y) {
        return new Cell(Math.random() > liveProbability ? true : false);
    });

    evolution.create(grid);

    view.initGrid(grid, width, height);

    // Draw inital state
    grid.callAll(function(cell) {
        if (cell.alive) {
            view.drawCell(cell);
        }
    });

    fps.start(1000);

    window.requestAnimationFrame(cycle);
}
