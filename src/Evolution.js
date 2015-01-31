function Evolution() {
    
    var self = this;

    self.grid = null;

    self.create = function(grid) {
        self.grid = grid;
        self.addCellNeighbours();
    };

    self.addCellNeighbours = function() {
        self.grid.callAll(function(cell) {
            var nb = self.grid.cellNeighbours(cell.x, cell.y);
            var nbAlive = nb.reduce(function(previous, cell) {
                 return previous + (cell.alive ? 1 : 0);
            }, 0);
            cell.setNeighbours(nb);
            cell.setNeighboursAliveCount(nbAlive);
        });
    };

    self.analyse = function(strategy) {
        var commands = [];
        self.grid.callAll(function(cell) {
            var command = strategy(cell);
            if (command) {
                commands.push(command);
            }
        });
        return commands;
    };

    self.update = function(commands) {
        commands.forEach(function(cell) {
            switch(cell.action) {
                case 'D':
                    cell.die();
                    break;

                case 'S':
                    cell.spawn();
                    break;

                case 'L':
                    break;

                default:
                    throw new Error("Illegal command: " + cell.action);
            }
        });
    };
};

