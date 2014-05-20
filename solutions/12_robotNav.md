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
