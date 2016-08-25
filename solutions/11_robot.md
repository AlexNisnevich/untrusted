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
# Control pad (works for 11, 12, 13)

## mingp

```javascript
if (typeof(me.controlInited == 'undefined')) {
    me.controlSquares = [
        [40, 20, 'up', 'red'],
        [39, 21, 'left', 'yellow'],
        [41, 21, 'right', 'cyan'],
        [40, 22, 'down', 'magenta']
    ];
    for (var i = 0; i < me.controlSquares.length; ++i) {
        var controlSquare = me.controlSquares[i];
        map.setSquareColor(
            controlSquare[0],
            controlSquare[1],
            controlSquare[3]
        );
    }
    me.controlInited = true;
}
for (var i = 0; i < me.controlSquares.length; ++i) {
    var controlSquare = me.controlSquares[i];
    if (
        player.getX() == controlSquare[0]
        && player.getY() == controlSquare[1]
    ) {
        me.move(controlSquare[2]);
        break;
    }
}
```
