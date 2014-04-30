
# Just move right.
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