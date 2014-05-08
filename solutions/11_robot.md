# Autonomous Robot

## donmccurdy

```javascript
    map.defineObject('robot', {
        // ...
        'behavior': function (me) {
            if (me.canMove('down')) {
            	me.move('down');
            } else if (me.canMove('right')) {
            	me.move('right');
            }
        }
    });
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

# Remote Control

## sheaulle

```javascript
    // works with levels 11, 12, 13
        
    var PX = map.getPlayer().getX();
    var PY = map.getPlayer().getY()-10;
    var MX = me.getX();
    var MY = me.getY();
    
    if (PX == MX && PY > MY) {
        me.move('down'); 
    }
    else if (PX == MX && PY <= MY) {
        me.move('up'); 
    }
    else if (PX > MX) {
          me.move('right'); 
    }
    else if (PX < MX) {
        me.move('left'); 
    }
```
