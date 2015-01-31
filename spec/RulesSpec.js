describe("Rules", function() {
    var width = 5;
    var height = 5;
    var grid = new Grid(width, height);
    var evolution = new Evolution();
    var rules = new Rules();
    var liveCell, deadCell;

    beforeEach(function () {
        grid.init(function () {
            return new Cell(false);
        });
        evolution.create(grid);
        evolution.addCellNeighbours();
    });


    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    describe("when a live cell has 1 live neighbour", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
            grid.cell(2, 2).spawn();
        });

        it("should generate a 'die' command to kill the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('D');
            expect(cell).toBe(liveCell);
        });
    });

    describe("when a live cell has no live neighbours", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
        });

        it("should generate a 'die' command to kill the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('D');
            expect(cell).toBe(liveCell);
        });
    });


    // Any live cell with two or three live neighbours lives on to the next generation.
    describe("when a live cell has 2 live neighbours", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
            grid.cell(2, 2).spawn();
            grid.cell(1, 2).spawn();
        });

        it("should generate a 'live' command to continue the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('L');
            expect(cell).toBe(liveCell);
        });
    });

    describe("when a live cell has 3 live neighbours", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
            grid.cell(2, 2).spawn();
            grid.cell(1, 2).spawn();
            grid.cell(2, 1).spawn();
        });

        it("should generate a 'live' command to continue the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('L');
            expect(cell).toBe(liveCell);
        });
    });


    // Any live cell with more than three live neighbours dies, as if by overcrowding.
    describe("when a live cell has 4 live neighbours", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
            grid.cell(2, 2).spawn();
            grid.cell(1, 2).spawn();
            grid.cell(2, 1).spawn();
            grid.cell(0, 0).spawn();
        });

        it("should generate a 'die' command to kill the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('D');
            expect(cell).toBe(liveCell);
        });
    });

    describe("when a live cell has 5 live neighbours", function() {
        beforeEach(function () {
            liveCell = grid.cell(1, 1);
            liveCell.spawn();
            grid.cell(2, 2).spawn();
            grid.cell(1, 2).spawn();
            grid.cell(2, 1).spawn();
            grid.cell(0, 0).spawn();
            grid.cell(0, 1).spawn();
        });

        it("should generate a 'die' command to kill the cell", function () {
            var cell = rules(liveCell);
            expect(cell.action).toBe('D');
            expect(cell).toBe(liveCell);
        });
    });


    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    describe("when a dead cell has 3 live neighbours", function() {
        beforeEach(function () {
            deadCell = grid.cell(1, 1);
            grid.cell(2, 2).spawn();
            grid.cell(1, 2).spawn();
            grid.cell(2, 1).spawn();
        });

        it("should generate a 'spawn' command to spawn the cell", function () {
            var cell = rules(deadCell);
            expect(cell.action).toBe('S');
            expect(cell).toBe(deadCell);
        });
    });

    describe("when a dead cell has does not have 3 live neighbours", function() {
        beforeEach(function () {
            deadCell = grid.cell(1, 1);
        });

        it("should generate no command", function () {
            var cell = rules(deadCell);
            expect(cell === null).toBe(true);
        });
    });

});
