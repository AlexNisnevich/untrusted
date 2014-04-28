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
          }else {
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
          }else {
              me.move('right');
          }
```
          
        }
    });

## Jhack (giacgbj)

Just move right.

```javascript
if(me.getY()<13)
  me.move('down');
else if(me.getX()>0)
  me.move('left');
```
and 

```javascript
if(me.getY()<13)
  me.move('down');
else if(me.getX()<map.getWidth())
  me.move('right');
```
