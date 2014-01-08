# Yuval

```javascript
var moves = map.getAdjacentEmptyCells(me.getX(), me.getY());                        
var x_goal = map.getWidth() - 2; var y_goal = 7;
if (me.getX() == x_goal) {
  me.move('down');
} else {
  var queue = [];
  for (var i=0; i<moves.length; i++) { queue.push([moves[i]]); }
  var visited = {};
  visited[[me.getX(), me.getY()]] = true;
  while (queue.length > 0) {
    var path = queue.shift();
    var move = path[path.length - 1] 
    var x = move[0][0]; var y = move[0][1];  
    if (x == x_goal && y == y_goal) { 
      me.move(path[0][1]); break;
    }
    if (!visited[[x, y]]) {
      visited[[x, y]] = true;  
      new_moves = map.getAdjacentEmptyCells(x, y)    
      for (var i=0; i<new_moves.length; i++) {    
        queue.push(path.concat([new_moves[i]]));
      }
    }
  }
}
```

# Natasha + Alex

```javascript
if (me.pathFound) {
   if (me.pathFound.length > 0) {
      me.move(me.pathFound.shift());
   } else {
      me.move('down');
   }
} else {
   me.pathFound = [];
   exploredSet = [];
   frontier = [[[1, 1], []]];
   frontierSet = ["1,1"];
   for (var j=0; j<500; j++) {
      node = frontier.shift(); frontierSet.shift();
      state = node[0];
      exploredSet.push(state.toString());
      var moves = map.getAdjacentEmptyCells(state[0], state[1]);
      for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var child = move[0];
        var direction = move[1];
        if (exploredSet.indexOf(child.toString()) == -1 &&
        frontierSet.indexOf(child.toString()) == -1) {
          path = node[1].slice(0);
          path.push(direction);
          frontier.push([child, path.slice(0)]);
          frontierSet.push(child.toString());
          if (child[0] == map.getWidth() - 2 && child[1] == 7) {
              me.pathFound = path;
              me.done = true;
              break;
          }
        }
      }
      if (me.done) {
          break;
      }
   }
}
```
