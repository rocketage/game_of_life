function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
}

Grid.prototype.init = function(creator) {
    for (var x = 0; x < this.width; ++x) {
        for (var y = 0; y < this.height; ++y) {
            this.cell(x, y, creator(x, y));
        }
    }
};

Grid.prototype.cell = function(x, y, cell) {
    if (3 === arguments.length) {
        cell.x = x;
        cell.y = y;
        return this.cells[this.cellIndex(x, y)] = cell;
    } else if (2 === arguments.length) {
        return this.cells[this.cellIndex(x, y)];
    }
    throw new Error("Incorrect argument count");
};

Grid.prototype.cellIndex = function(x, y) {
    if (!this.checkBounds(x, y)) {
        throw new Error("Exceeded bounds");
    }
    return (y * this.width) + x;
};

Grid.prototype.checkBounds = function(x, y) {
    return !(((x < 0) || (x >= this.width) || (y < 0) || (y >= this.height)));
};

Grid.prototype.callAll = function(fn) {
    this.cells.forEach(fn);
};

Grid.prototype.cellNeighbours = function(x, y) {
    var result = [];
    for (ix = (x - 1); ix <= (x + 1); ++ix) {
        for (iy = (y - 1); iy <= (y + 1); ++iy) {
            if (this.checkBounds(ix, iy) && !((ix === x) && (iy === y))) {
                result.push(this.cell(ix, iy));
            }
        }
    }
    return result;
};
