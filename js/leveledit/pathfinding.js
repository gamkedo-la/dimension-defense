// 0 = North
// 1 = East
// 2 = South
// 3 = West



function findPath(mapGrid, startPos, goalPos) {
  
  //copy mapGrid array to a temp array
  var grid = JSON.parse(JSON.stringify(mapGrid));

  //Set Goal
  grid[goalPos.x][goalPos.y].block = 'GOAL';

  // Each "location" will store its coordinates
  // and the shortest path required to arrive there
  var location = {
    distX: startPos.x,
    distY: startPos.y,
    path: [],
    block: 'START'
  };

  // Initialize the queue with the start location already inside
  var queue = [location];

  // Loop through the grid searching for the goal
  while (queue.length > 0) {
    // Take the first location off the queue
    var currentLocation = queue.shift();

    // Explore North
    var newLocation = exploreInDirection(currentLocation, 0, grid);
    if (newLocation.block === 'GOAL') {
      return newLocation.path;
    } else if (newLocation.block === 'Valid') {
      queue.push(newLocation);
    }

    // Explore East
    var newLocation = exploreInDirection(currentLocation, 1, grid);
    if (newLocation.block === 'GOAL') {
      return newLocation.path;
    } else if (newLocation.block === 'Valid') {
      queue.push(newLocation);
    }

    // Explore South
    var newLocation = exploreInDirection(currentLocation, 2, grid);
    if (newLocation.block === 'GOAL') {
      return newLocation.path;
    } else if (newLocation.block === 'Valid') {
      queue.push(newLocation);
    }

    // Explore West
    var newLocation = exploreInDirection(currentLocation, 3, grid);
    if (newLocation.block === 'GOAL') {
      return newLocation.path;
    } else if (newLocation.block === 'Valid') {
      queue.push(newLocation);
    }
  }

  // No valid path found
  return false;

};

  // Explore the grid in different directions
  function exploreInDirection(currentLocation, direction, grid) {
  var newPath = currentLocation.path.slice();
  newPath.push(direction);

  var dft = currentLocation.distY;
  var dfl = currentLocation.distX;

  if (direction === 0) {
    dft -= 1;
  } else if (direction === 1) {
    dfl += 1;
  } else if (direction === 2) {
    dft += 1;
  } else if (direction === 3) {
    dfl -= 1;
  }

  var newLocation = {
    distY: dft,
    distX: dfl,
    path: newPath,
    block: 'Unknown'
  };
  newLocation.block = locationStatus(newLocation, grid);

  // If this new location is valid, mark it as 'Visited'
  if (newLocation.block === 'Valid') {
    grid[newLocation.distX][newLocation.distY] = 'Visited';
  }

  return newLocation;
};


// This function will check a location's block
// (a location is "valid" if it is on the grid, is not an "obstacle",
// and has not yet been visited by our algorithm)
// Returns "Valid", "Invalid", "Blocked", or "Goal"
function locationStatus(location, grid) {
  var dft = location.distY;
  var dfl = location.distX;

  // If the location is outside of the grid
  if (location.distX < 0 || location.distX >= grid.length ||
      location.distY < 0 || location.distY >= grid[0].length) {
    return 'Invalid';
    
    //If the location is our goal object
  } else if (grid[dfl][dft] == 3) {
    return 'GOAL';
  }

  //If its a block that the object can walk on
  if (grid[dfl][dft] == 2 || grid[dfl][dft] == 5 || grid[dfl][dft] == 4) {
    return 'Valid';
  }

  //If the path is blocked
  return 'Blocked';
};
