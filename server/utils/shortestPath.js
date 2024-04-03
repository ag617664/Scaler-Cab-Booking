const arr = [
  [0, 5, 7, 0, 0, 0],
  [5, 0, 0, 15, 20, 0],
  [7, 0, 0, 5, 35, 0],
  [0, 15, 5, 0, 0, 20],
  [0, 20, 35, 0, 0, 10],
  [0, 0, 0, 20, 10, 0]
];
function calculateShortestTime(s, d) {

  function findMinDistance(dist, visited) {
      let min = Infinity;
      let minVertex = -1;
      for (let i = 0; i < dist.length; i++) {
          if (!visited[i] && dist[i] < min) {
              min = dist[i];
              minVertex = i;
          }
      }
      return minVertex;
  }

  const count = arr.length;
  const visited = new Array(count).fill(false);
  const dist = new Array(count).fill(Infinity);
  dist[s] = 0;

  for (let i = 0; i < count; i++) {
      const u = findMinDistance(dist, visited);
      visited[u] = true;

      for (let v = 0; v < count; v++) {
          if (!visited[v] && arr[u][v] !== 0 && dist[u] + arr[u][v] < dist[v]) {
              dist[v] = dist[u] + arr[u][v];
          }
      }
  }

  return dist[d];
}

module.exports =  calculateShortestTime;