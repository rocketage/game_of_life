function Rules() {
    return function(cell) {
        if (!cell.alive) {
            if (3 === cell.liveNeighbours) {
                return new Command("spawn", cell);
            }
            return null;
        }

        if ((2 === cell.liveNeighbours) || (3 === cell.liveNeighbours)) {
            return new Command("live", cell);
        }

        return new Command("die", cell);
    }
};

