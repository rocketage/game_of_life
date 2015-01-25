describe("Grid", function() {
    var width = 5;
    var height = 5;
    var grid;

    beforeEach(function() {
        grid = new Grid(width, height);
    });

    it("should store cells at coordinates", function() {
        grid.cell(3, 4, "x");
        expect(grid.cell(3, 4)).toEqual("x");

        grid.cell(2, 2, "y");
        expect(grid.cell(2, 2)).toEqual("y");
    });

    it("should throw an error when bounds are exceeded", function() {
        expect(function() {
            grid.cell(5, 4, "x");
        }).toThrowError();

        expect(function() {
            grid.cell(-1, 4, "x");
        }).toThrowError();

        expect(function() {
            grid.cell(3, 7, "x");
        }).toThrowError();

        expect(function() {
            grid.cell(3, -4, "x");
        }).toThrowError();
    });

    describe("when it has a full set of cells", function() {
        beforeEach(function() {
            var x, y, hash;
            for (x = 0; x < width; ++x) {
                for (y = 0; y < height; ++y) {
                    hash = "(" + x + "," + y + ")";
                    grid.cell(x, y, {hash: hash});
                }
            }
        });

        it("should perform actions on all cell objects", function() {
            expect(grid.cell(1, 1).hash).toEqual("(1,1)");
            expect(grid.cell(3, 4).hash).toEqual("(3,4)");

            grid.callAll(function(cell) {
                cell.hash = cell.hash + "+";
            });

            expect(grid.cell(1, 1).hash).toEqual("(1,1)+");
            expect(grid.cell(3, 4).hash).toEqual("(3,4)+");
        });

        it("should fetch neighbours of a corner cell", function() {
            var neighbours = grid.cellNeighbours(0, 0);
            expect(neighbours.length).toBe(3);
            expect(neighbours).toContain(grid.cell(0, 1));
            expect(neighbours).toContain(grid.cell(1, 0));
            expect(neighbours).toContain(grid.cell(1, 1));

            neighbours = grid.cellNeighbours(4, 4);
            expect(neighbours.length).toBe(3);
            expect(neighbours).toContain(grid.cell(3, 3));
            expect(neighbours).toContain(grid.cell(3, 4));
            expect(neighbours).toContain(grid.cell(4, 3));
        });

        it("should fetch neighbours of a middle cell", function() {
            var neighbours = grid.cellNeighbours(2, 3);
            expect(neighbours.length).toBe(8);
            expect(neighbours).toContain(grid.cell(1, 2));
            expect(neighbours).toContain(grid.cell(2, 2));
            expect(neighbours).toContain(grid.cell(3, 2));

            expect(neighbours).toContain(grid.cell(1, 3));
            expect(neighbours).toContain(grid.cell(3, 3));

            expect(neighbours).toContain(grid.cell(1, 4));
            expect(neighbours).toContain(grid.cell(2, 4));
            expect(neighbours).toContain(grid.cell(3, 4));
        });
    });
});
