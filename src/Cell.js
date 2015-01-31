function Cell(isAlive) {
    this.alive = isAlive || false;
    this.neighbours = [];
    this.liveNeighbours = 0;
    this.x = 0;
    this.y = 0;
    this.action = 'S'; // S|D|L = (spawn|die|live)
}

Cell.prototype.setNeighbours = function(neighbours) {
    this.neighbours = neighbours;
};

Cell.prototype.setNeighboursAliveCount = function(count) {
    this.liveNeighbours = count;
};

Cell.prototype.spawn = function() {
    this.alive = true;
    this.updateNeighboursAliveCount(1);
};

Cell.prototype.die = function() {
    this.alive = false;
    this.updateNeighboursAliveCount(-1);
};

Cell.prototype.updateNeighboursAliveCount = function(delta) {
    this.neighbours.forEach(function(neighbourCell) {
        neighbourCell.liveNeighbours += delta;
    });
};