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

# civilframe

Wander with visit counts.
```javascript
    // check if finished
    if (me.delivered > 0) {
    	me.move('down');
        me.delivered--;
        return;
    } 
    else if (me.delivered == 0) {
    	return;
    }
    
    // check if we have the key
    if (me.hasKey == true) {
    	me.move('down');
        me.delivered = 2;
        return;
    }
   
    // check if close to key
    if (map.getObjectTypeAt(me.getX()+1, me.getY()) == 'blueKey') {
      	me.move('right');
        me.hasKey = true;
        return;
    } 
    else if (map.getObjectTypeAt(me.getX(), me.getY()+1) == 'blueKey') {
    	me.move('down');
        me.hasKey = true;
        return;
    }          
    
    // start visit wander
    if (me.visited == undefined) {
    	me.visited = [];
    }
    
    var current = null;
    for (var i = 0; i < me.visited.length; i++) {
    	var check = me.visited[i];
        if (check.x == me.getX() && check.y == me.getY()) {
        	current = check;
        }
    }
    if (current == null) {
    	current = {x: me.getX(), y: me.getY(), count: 0};
        me.visited.push(current);
        
    }
    current.count++;
    
    var moves = map.getAdjacentEmptyCells(me.getX(), me.getY());
    
    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      for (var j = 0; j < me.visited.length; j++) {
    	var check = me.visited[j];
        if (check.x == move[0][0] && check.y == move[0][1]) {
        	move.push(check.count);
            break;
        }
      }
    }
    
    var leastVisited = null;
    for (var i = 0; i < moves.length; i++) {
    	if (leastVisited == null
        	|| moves[i][2] == undefined
        	|| moves[i][2] < leastVisited[2]) {
            leastVisited = moves[i];
        }
    }
    
    me.move(leastVisited[1]);
```

# Player-controlled approaches
##Pcat0
Hit 'q' to toggle between controlling you and the robot. Works for 11, 12, 13
```javascript
          me.move(dr);
        }
    });
    var Pc = 0;
    var dr = '';
    map.getPlayer().setPhoneCallback(function(){
      if ((Pc++)%2==0){
        map.overrideKey('down', ()=> dr = 'down');
        map.overrideKey('up', ()=> dr = 'up');
        map.overrideKey('left', ()=> dr = 'left');
        map.overrideKey('right', ()=> dr = 'right');
      }else{
        map.overrideKey('down', ()=> map.getPlayer().move('down'));
        map.overrideKey('up', ()=> map.getPlayer().move('up'));
        map.overrideKey('left', ()=> map.getPlayer().move('left'));
        map.overrideKey('right', ()=> map.getPlayer().move('right'));
        dr = '';
      }
    });({function(){
```
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

## mdunisch
```javascript
// Try to get possible moves
       try{
       	var playerpos = map.getAdjacentEmptyCells(player.getX(), player.getY());
       	
        // Player is at top-wall
        if(player.getY() == 10){
        	me.move("up");
        }
        // Player is at walls (bottom, left, right)
       }catch(e){
        
        if(player.getX() == 49){
        	me.move("right");
        }else if(player.getX() == 0){
        	me.move("left");
        }else if (player.getY() == 24) {
        	me.move("down");
        }
       }
```

## lz

Let the robot try to follow you as your mirror image.

```javascript
var meX = me.getX(),
  meY = me.getY(),
  playerX = player.getX(),
  playerY = player.getY(),
  mazeHeight = 10;

if (meX < playerX) {
  me.move('right');
} else if (meX > playerX) {
  me.move('left');
} else if (meY < 2 * mazeHeight - playerY) {
  me.move('down');
} else if (meY > 2 * mazeHeight - playerY) {
  me.move('up');
}
```

# Portal style

## JustBlackBird

Just press "R" and go through the portals
```javascript
    if (player.teleportersAreReady) {
        // Do not add teleporters more than once
        return;
    }

    // Place two teleporters at the map
    map.placeObject(player.getX(), player.getY() - 1, 'teleporter');
    map.placeObject(map.getWidth() - 2, 7, 'teleporter');

    // We need teleporters objects, so find them
    var objs = map.getDynamicObjects();
    var teleporters = [];

    for (var i = 0, len = objs.length; i < len; i++) {
        if (objs[i].getType() == 'teleporter') {
                teleporters.push(objs[i]);
        }
    }

    // Link teleporters one to another
    teleporters[0].setTarget(teleporters[1]);
    teleporters[1].setTarget(teleporters[0]);

    // We need an indicator to know if teleporters already
    // in place or not. Use "player" object from the closure
    player.teleportersAreReady = true;
```

# Building Droid style

## mike_perdide

Droid fills the maze with blocks, makes for a simpler maze.

```javascript
    var moves = map.getAdjacentEmptyCells(me.getX(), me.getY());

    var directions_delta = {
      "down": [0, 1],
      "up"  : [0, -1],
      "left": [-1, 0],
      "right": [1, 0],
    }
    var opposites = {
      "down": "up",
      "up":"down",
      "left":"right",
      "right":"left"
    }
    var prev_x = me.getX();
    var prev_y = me.getY();
    
    if (me.previous_direction === undefined) {
      me.previous_direction = "";
    }

    var move_conditionally = function (direction) {
      if (!me.canMove(direction)) {
        return false;
      }
      
      // Are we in a dead end?
      if (moves.length == 1) {
        me.blocked_mode = true;
      } else {
        me.blocked_mode = false;
      }
      
      // Are we doubling back? Only allowed if we encountered
      // a dead end.
      if (direction == opposites[me.previous_direction] 
          && ! me.blocked_mode) {
          return false;
      }
        
      me.move(direction);
      me.previous_direction = direction;
      
      return true;
    }
    
    if ( me.getY() < 23 )
      if (!move_conditionally("down"))
        if (!move_conditionally("right"))
          if (!move_conditionally("up"))
            move_conditionally("left");

    // Putting blocks where we can to limit the droid option
    prev_moves = map.getAdjacentEmptyCells(prev_x, prev_y)
    
    if (prev_moves.length == 1) {
      // This was a dead end, placing a block behind the droid.
      map.placeObject(prev_x, prev_y, "block");
    } else if (prev_moves.length == 2 &&
               prev_moves[0][1] != opposites[prev_moves[1][1]] ) { 
      move_1_delta_x = directions_delta[prev_moves[0][1]][0];
      move_2_delta_x = directions_delta[prev_moves[1][1]][0];
      move_1_delta_y = directions_delta[prev_moves[0][1]][1];
      move_2_delta_y = directions_delta[prev_moves[1][1]][1];
      
      // Calculating the coordinates of the diagonal cell
      diag_x = prev_x
               + move_1_delta_x
               + move_2_delta_x;
      diag_y = prev_y
               + move_1_delta_y
               + move_2_delta_y;
      // If the diagonal object is empty, that means we can access
      // the adjacent 2 cells without the cell at (prev_x, prev_y).
      // So let's put a block there!
      if (map.getObjectTypeAt(diag_x, diag_y) == "empty") {
        map.placeObject(prev_x, prev_y, "block");
      }
    };

```

# Simulated Annealing

(Randomized algorithm)

```javascript

if (typeof me.step === 'undefined')
{
    me.step = 0;
    me.state = 0;
}
me.step ++;
p = Math.exp(me.step * -0.005); // heat
if (me.getX() == map.getWidth() - 2 &&
    me.getY() == 8) // key got!
me.state = 2;
if (me.state == 0)
{
    targetX = map.getWidth() - 2;
    targetY = 8;

    var flag = false;
    var calcDis = function(x, y) {
        return Math.abs(targetX - x) + Math.abs(targetY - y);
    };

    var curDis = calcDis(me.getX(), me.getY());

    var moves = map.getAdjacentEmptyCells(me.getX(), me.getY());
    // adjacent cells not considered empty :(
    if (me.getX() == targetX && me.getY() == targetY - 1)
        me.move('down');
    else
        if (me.getX() == targetX - 1 && me.getY() == targetY)
            me.move('right');
    else
        // annealing
        while (!flag) {
            var m = moves[map.getRandomInt(0, moves.length - 1)];
            var d = calcDis(m[0][0], m[0][1]);
            if (d<curDis || Math.random() < p)
            {
                flag = true;
                me.move(m[1]);
            } 
        }
} else me.move('down'); // got key, exit
```
