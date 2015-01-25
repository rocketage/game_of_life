function Evolution() {
    
    var self = this;

    self.grid = null;

    self.create = function(grid) {
        self.grid = grid;
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
        commands.forEach(function(command) {
            // maybe move this into cell class, and call a "run command" method?
            switch(command.action) {
                case "die":
                    command.cell.die();
                    break;

                case "spawn":
                    command.cell.spawn();
                    break;

                case "live":
                    break;

                default:
                    throw new Error("Illegal command: " + command.action);
            }
        });
    };

    self.draw = function() {
        // Process commands on UI
    };
};

