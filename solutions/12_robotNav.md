# Autonomous Robot

## donmccurdy

```javascript
    map.defineObject('robot', {
        // ...
        'behavior': function (me) {
          	me.path = me.path || [];
            if (me.path.length) {
            	me.move(me.path.pop());
	        } else if (me.canMove('down')) {
                me.move('down');
            } else if (me.canMove('right')) {
                me.move('right');
            } else {
            	me.path = [
     	  			'right', 'right', 'right',
                    'up', 'up', 'up', 'up', 'up',
                    'left', 'left', 'left', 'left'
                ];
            }
        }
    });
```


## Jhack (giacgbj)

```javascript
me.move(
	me.getX() < 25 || me.getX() > 47 ?
		me.canMove('down') ? 'down' : 'right' :
		me.canMove('up') ? 'up' : 'right'
);
```

## esolitos
```javascript
if( me.getX() == 1 && me.getY() < 4 ){
    me.move('down');

} else if( me.getY() == 4) {
    if( me.canMove('right') ) {
        me.move('right');
    } else {
        me.move('down');
    }


} else if( me.getY() > 4 ) {

    if( me.canMove('right') ) {
        me.move('right');
    } else if ( me.getX() != map.getWidth() -2 ) {
        me.move('up');
    } else {
        me.move('down');
    }
}
```

## KamiSempai

The Sinusoidal droid.
```javascript
if(me.canMove("right")) {
    var x = me.getX()+1;
    // It's a magic numbers. Don't change!!!
    var y = Math.sin(x / 7) * 4 + 4.5;
    if(y - me.getY() > 1) {
    	me.move("down");
    }
    else if(y - me.getY() < -1) {
    	me.move("up");
    }
    else {
    	me.move("right");
    }
}
else {
	me.move("down");
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

# pk

Maze solver (works for 11, 12, 13) and any simple connected maze.
Follow a wall to the right, turn counterclockwise each turn first. Remember last direction.
With debug console output.
```javascript
'behavior': function (me) {
    var dirs = ['up','right','down','left']
    var d = me.dir || 0;
    d--;
    d = (d < 0)? 3 : d;
    
    var brain = [];
    while(!me.canMove(dirs[d])) {
        brain.push("can't "+dirs[d]);
        d++;
        d = (d > 3)? 0 : d;
    }
    brain.push(dirs[d]+ " ok");
    console.log(brain.join(', '))
    
    me.dir = d;            
    me.move(dirs[d]);
}
```

# ont.rif

Just more simple code for "follow wall to the right".
```javascript
    me.dir = me.dir || 'up';

    var plan = {
        'up': ['left', 'right'],
        'right': ['up', 'down'],
        'down': ['right', 'left'],
        'left': ['down', 'up'],
    }[ me.dir ];


    if(me.canMove(plan[0]))
        me.dir = plan[0];
    else if(!me.canMove(me.dir))
        me.dir = plan[1];

    me.move(me.dir);
```

# civilframe

Brute force.
```javascript
    var r = Math.random();
    if (r < 0.25) {
    	me.move('up');
    } else if (r < 0.5) {
    	me.move('down');
    } else if (r < 0.65) { // slight propensity to go left
    	me.move('left');
    } else {
    	me.move('right');
    }
```

# mike_perdide

Simple down/right/up/left behavior, with a twist to make the problem more simple for the droid by placing blocks wherever we can.
```javascript
  var directions_delta = {
    "down": [0, 1],
    "up"  : [0, -1],
    "left": [-1, 0],
    "right": [1, 0]
  }
  var opposites = {
    "down": "up",
    "up":"down",
    "left":"right",
    "right":"left"
  }
  var prev_x = me.getX();
  var prev_y = me.getY();
  
  var move_conditionally = function (direction) {
    if (!me.canMove(direction) || me.getY()>22) {
      return false;
    }
    
    me.move(direction);
    return true; 
  };
  
  // We're aiming down & right first
  if (!move_conditionally("down")) {
    if (!move_conditionally("right")) {
      if (!move_conditionally("up")) {
        move_conditionally("left");
      }
    }
  }
     
  // Putting blocks where we can to limit the droid options
  prev_moves = map.getAdjacentEmptyCells(prev_x, prev_y)
  if (prev_moves.length == 1) {
    map.placeObject(prev_x, prev_y, "block");
  } else if (prev_moves.length == 2 &&
           prev_moves[0][1] != opposites[prev_moves[1][1]] ) { 
    move_1_delta_x = directions_delta[prev_moves[0][1]][0];
    move_2_delta_x = directions_delta[prev_moves[1][1]][0];
    move_1_delta_y = directions_delta[prev_moves[0][1]][1];
    move_2_delta_y = directions_delta[prev_moves[1][1]][1];
    
    // Calculating the coordinates of the diagonal object
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

# ToeFungi

Creating no other path

```javascript
	if(me.canMove('up')){        
		me.move('up');                     
	}else if(me.canMove('right')){
		me.move('right');        
	}else if(!me.canMove('right') && !me.canMove('down')){
		me.move('left');
		map.placeObject(me.getX()+1, me.getY(), 'block');
	} else {
		me.move('down');
		map.placeObject(me.getX(), me.getY()-1, 'block');
	}
```

# DaPutzy

Making it easier for the path finding by adding `setPhoneCallback`. Press `q` and then walk to the right and up to get the key.

```javascript
            if (!me.canMove('up') && !me.canMove('right')) {
                me.move('down');
            } else if (!me.canMove('down') && !me.canMove('right')) {
                me.move('up');
            } else if (!me.canMove('right')) {
                me.move('down');
            } else {
                me.move('right');
            }
        }
    });

    player.setPhoneCallback(function () {
        map.placeObject(13, 1, 'block');
        map.placeObject(14, 2, 'block');
        map.placeObject(15, 3, 'block');
        map.placeObject(16, 4, 'block');

        map.placeObject(31, 5, 'block');
        map.placeObject(30, 6, 'block');
        map.placeObject(29, 7, 'block');
        map.placeObject(28, 8, 'block');
    
        if (true) {
```
