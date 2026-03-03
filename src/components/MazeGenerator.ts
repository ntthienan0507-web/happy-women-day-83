// Recursive backtracker maze generation
// Returns 2D grid: 0 = path, 1 = wall
// Grid is (2*w+1) x (2*h+1) to include walls between cells

export interface MazeData {
  grid: number[][];
  rows: number;
  cols: number;
  cellSize: number;
  offsetX: number;
  offsetZ: number;
  startCell: [number, number]; // grid coords of start
  endCell: [number, number];   // grid coords of target
}

export function generateMaze(w: number, h: number, cellSize: number): MazeData {
  const rows = 2 * h + 1;
  const cols = 2 * w + 1;

  // Fill with walls
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = 1;
    }
  }

  // Carve cells (odd positions are cells)
  const visited: boolean[][] = [];
  for (let r = 0; r < h; r++) {
    visited[r] = [];
    for (let c = 0; c < w; c++) {
      visited[r][c] = false;
    }
  }

  const stack: [number, number][] = [];
  const startR = 0;
  const startC = 0;
  visited[startR][startC] = true;
  grid[startR * 2 + 1][startC * 2 + 1] = 0;
  stack.push([startR, startC]);

  const dirs = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
  ];

  while (stack.length > 0) {
    const [cr, cc] = stack[stack.length - 1];
    // Find unvisited neighbors
    const neighbors: [number, number, number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (nr >= 0 && nr < h && nc >= 0 && nc < w && !visited[nr][nc]) {
        neighbors.push([nr, nc, dr, dc]);
      }
    }

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nr, nc, dr, dc] = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Remove wall between current and neighbor
      const wallR = cr * 2 + 1 + dr;
      const wallC = cc * 2 + 1 + dc;
      grid[wallR][wallC] = 0;
      // Mark neighbor as path
      grid[nr * 2 + 1][nc * 2 + 1] = 0;
      visited[nr][nc] = true;
      stack.push([nr, nc]);
    }
  }

  // Add some extra openings to make maze less tight (30% random wall removal)
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (grid[r][c] === 1 && Math.random() < 0.15) {
        // Only remove if it won't create a 2x2 open area
        let openNeighbors = 0;
        if (r > 0 && grid[r - 1][c] === 0) openNeighbors++;
        if (r < rows - 1 && grid[r + 1][c] === 0) openNeighbors++;
        if (c > 0 && grid[r][c - 1] === 0) openNeighbors++;
        if (c < cols - 1 && grid[r][c + 1] === 0) openNeighbors++;
        if (openNeighbors >= 2) {
          grid[r][c] = 0;
        }
      }
    }
  }

  const totalW = cols * cellSize;
  const totalH = rows * cellSize;
  const offsetX = -totalW / 2;
  const offsetZ = -totalH / 2;

  // Start = top-left cell, End = somewhere far from start
  const endR = h - 1;
  const endC = w - 1;

  return {
    grid,
    rows,
    cols,
    cellSize,
    offsetX,
    offsetZ,
    startCell: [1, 1], // grid coords
    endCell: [endR * 2 + 1, endC * 2 + 1],
  };
}

// Convert grid position to world position
export function gridToWorld(
  row: number,
  col: number,
  maze: MazeData
): [number, number] {
  return [
    maze.offsetX + col * maze.cellSize + maze.cellSize / 2,
    maze.offsetZ + row * maze.cellSize + maze.cellSize / 2,
  ];
}

// Check if a world position is inside a wall
export function isWall(
  worldX: number,
  worldZ: number,
  maze: MazeData,
  radius: number = 0.25
): boolean {
  // Check 4 corners of player bounding box
  const offsets = [
    [-radius, -radius],
    [radius, -radius],
    [-radius, radius],
    [radius, radius],
  ];

  for (const [ox, oz] of offsets) {
    const px = worldX + ox;
    const pz = worldZ + oz;
    const col = Math.floor((px - maze.offsetX) / maze.cellSize);
    const row = Math.floor((pz - maze.offsetZ) / maze.cellSize);

    if (row < 0 || row >= maze.rows || col < 0 || col >= maze.cols) {
      return true; // out of bounds = wall
    }
    if (maze.grid[row][col] === 1) {
      return true;
    }
  }
  return false;
}

// Get all wall positions for rendering
export function getWallPositions(maze: MazeData): [number, number][] {
  const walls: [number, number][] = [];
  for (let r = 0; r < maze.rows; r++) {
    for (let c = 0; c < maze.cols; c++) {
      if (maze.grid[r][c] === 1) {
        walls.push(gridToWorld(r, c, maze));
      }
    }
  }
  return walls;
}

// Find random open position in the maze
export function randomOpenPosition(maze: MazeData): [number, number] {
  const openCells: [number, number][] = [];
  for (let r = 0; r < maze.rows; r++) {
    for (let c = 0; c < maze.cols; c++) {
      if (maze.grid[r][c] === 0) {
        openCells.push([r, c]);
      }
    }
  }
  // Pick from the far half of the maze
  const farCells = openCells.filter(([r, c]) => {
    const [sx, sz] = gridToWorld(maze.startCell[0], maze.startCell[1], maze);
    const [cx, cz] = gridToWorld(r, c, maze);
    const dist = Math.sqrt((cx - sx) ** 2 + (cz - sz) ** 2);
    return dist > 6; // must be far from start
  });
  const cells = farCells.length > 0 ? farCells : openCells;
  const [pr, pc] = cells[Math.floor(Math.random() * cells.length)];
  return gridToWorld(pr, pc, maze);
}
