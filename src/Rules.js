function Rules() {
    return function(cell) {
        if (!cell.alive) {
            if (3 === cell.liveNeighbours) {
                cell.action = 'S';
                return cell;
            }
            return null;
        }

        if ((2 === cell.liveNeighbours) || (3 === cell.liveNeighbours)) {
            cell.action = 'L';
            return cell;
        }

        cell.action = 'D';
        return cell;
    }
};

