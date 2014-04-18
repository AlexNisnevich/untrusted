# Maze-following approaches
## Deviator

```javascript
if( typeof this.cdir == 'undefined' ) this.cdir = 0;
var dir = ['right', 'up', 'left', 'down'];
var ln = dir.length;

if( me.canMove(dir[(this.cdir+1)%ln]) )
	this.cdir = (this.cdir+1)%ln;
else if( !me.canMove(dir[this.cdir]) )
	this.cdir = (this.cdir+ln-1)%ln;

me.move(dir[this.cdir]);
```

# Breadth-First Search approaches
## Yuval

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

## Natasha + Alex

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

# Player-controlled approaches

## kerzol
```
map.setSquareColor(21, 22, 'red');
map.setSquareColor(22, 21, 'blue');
map.setSquareColor(21, 20, 'green');
map.setSquareColor(20, 21, 'white');
   
function getDirection() {
  if (player.atLocation(21, 20) ) {
      return ('up');
  } else if (player.atLocation(21, 22)) {
      return ('down');
  } else if (player.atLocation(20, 21))  {
      return ('left');
  } else if (player.atLocation(22, 21) ) {
      return ('right');
  }
}
map.setSquareColor(me.getX(),me.getY(),'red');
me.move(getDirection())
```

## RockerM4NHUN

```javascript
        if (player.getX() - lx == 1) me.move('right');
        else if (player.getX() - lx == -1) me.move('left');
        else if (player.getY() - ly == 1) me.move('down');
        else if (player.getY() - ly == -1) me.move('up');
    
        lx = player.getX();
        ly = player.getY();
    }
});
    
var lx = player.getX();
var ly = player.getY();
    

map.defineObject('foo', {
    'type': 'dynamic',
    'dat': function() {
```

## Neogeek
```javascript
if(player == map.getPlayer()){
	player.setPhoneCallback(function(){
        switch(player){
            case 'up':
                player = 'right';
                break;
            case 'right':
                player = 'down';
                break;
            case 'down':
                player = 'left';
                break;
            default:
                player = 'up';
        }
        map.displayChapter(player);
    });
}
me.move(player);
```
