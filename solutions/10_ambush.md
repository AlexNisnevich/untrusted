## amahdy: Escape

    map.defineObject('attackDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'red',
        'onCollision': function (player) {
            player.killedBy('an attack drone');
        },
        'behavior': function (me) {

```javascript
          if (me.canMove('up')) {
              me.move('up');
          } else {
              me.move('left');
          }
```

        }
    });

...

    map.defineObject('defenseDrone', {
        'type': 'dynamic',
        'symbol': 'd',
        'color': 'green',
        'onCollision': function (player) {
            player.killedBy('a defense drone');
        },
        'behavior': function (me) {

```javascript
          if (me.canMove('up')) {
              me.move('up');
          } else {
              me.move('right');
          }
```

        }
    });

## Jhack (giacgbj)

```javascript
if( me.getY() < 13 )
  me.move( 'down' );
else if( me.getX() > 0 )
  me.move('left');
```
and

```javascript
if( me.getY() < 13 )
  me.move('down');
else if( me.getX() < map.getWidth() )
  me.move('right');
```


# Drones Madness
## esolitos

attackDrone
```javascript
if( me.canMove('down') ) {
    me.move('down');
} else if (me.canMove('right')) {
    me.move('right');
} else {
    me.move('left');
}
```

reinforcementDrone
```javascript
me.move('left');
```

defenseDrone
```javascript
if( me.canMove('down') ) {
    me.move('down');
} else if (me.canMove('left')) {
    me.move('left');
} else {
    me.move('right');
}
```

## pk
all three drone types random moves toward ceil or right:
```
(Math.random()>.5) ? me.move('right') : me.move('up');
```

## Super Easy Solution

Just reset the collision function:

```javascript
this.onCollision = function(){};
```
