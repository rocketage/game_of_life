describe("Evolution", function() {
    var width = 5;
    var height = 5;
    var grid = new Grid(width, height);
    var evolution = new Evolution();

    describe("when it has a grid of live cells", function() {

        beforeEach(function () {
            grid.init(function () {
                return new Cell(true);
            });
            evolution.create(grid);
        });

        it("should give each cell an array of their neighbours", function () {
            var cell = grid.cell(1, 1);
            expect(cell.neighbours.length).toBe(0);

            evolution.addCellNeighbours();

            expect(cell.neighbours.length).toBe(8);
        });

        it("should give each cell a count of it's neighbours that are alive", function () {
            var cell = grid.cell(1, 1);
            expect(cell.liveNeighbours).toBe(0);

            evolution.addCellNeighbours();

            expect(cell.liveNeighbours).toBe(8);
        });

        it("should analyse world to generate a report of command actions for the next evolutionary cycle", function () {
            var commands = evolution.analyse(function (cell) {
                return new Command("spawn", cell);
            });

            expect(commands.length).toBe(25);
        });

        it("should apply die command actions to evolve the world", function () {
            var cell = grid.cell(1, 1);
            var die = new Command("die", cell);

            expect(cell.alive).toBe(true);
            evolution.update([die]);
            expect(cell.alive).toBe(false);
        });

        it("should notify neighbours when a cell dies", function () {
            var cell = grid.cell(1, 1);
            var die = new Command("die", cell);
            var neighbourCell = grid.cell(2, 2);

            evolution.addCellNeighbours();

            expect(neighbourCell.liveNeighbours).toBe(8);

            evolution.update([die]);

            expect(neighbourCell.liveNeighbours).toBe(7);
        });
    });

    describe("when it has a grid of dead cells", function() {

        beforeEach(function () {
            grid.init(function () {
                return new Cell(false);
            });
            evolution.create(grid);
            evolution.addCellNeighbours();
        });

        it("should apply spawn command actions to evolve the world", function() {
            var cell = grid.cell(1, 1);
            var spawn = new Command("spawn", cell);

            expect(cell.alive).toBe(false);
            evolution.update([spawn]);
            expect(cell.alive).toBe(true);
        });

        it("should notify neighbours when a cell is spawn", function () {
            var cell = grid.cell(1, 1);
            var spawn = new Command("spawn", cell);
            var neighbourCell = grid.cell(2, 2);

            expect(neighbourCell.liveNeighbours).toBe(0);

            evolution.update([spawn]);

            expect(neighbourCell.liveNeighbours).toBe(1);
        });

    });
});
