# Drone Cage
## esolitos

```javascript
map.placeObject(map.getWidth()-11, 13, 'block');
map.placeObject(map.getWidth()-11, 12, 'block');
map.placeObject(map.getWidth()-11, 11, 'block');
map.placeObject(map.getWidth()-11, 10, 'block');

map.placeObject(map.getWidth()-10, 13, 'block');
map.placeObject(map.getWidth()-10, 10, 'block');

map.placeObject(map.getWidth()-9, 13, 'block');
map.placeObject(map.getWidth()-9, 10, 'block');
map.placeObject(map.getWidth()-9, 11, 'block');
```

And than just go for the exit from the top.

## amahdy: Block-em, they are idiots

```javascript
map.placeObject(map.getWidth()-5, 11, 'block');
map.placeObject(map.getWidth()-6, 11, 'block');
map.placeObject(map.getWidth()-6, 12, 'block');
map.placeObject(map.getWidth()-5, 13, 'block');
map.placeObject(map.getWidth()-6, 13, 'block');
```

## The drone can't get out if he wanted to
```javascript
map.createFromGrid([
    	' #####',
        ' #   #',
        ' # # #',
        ' # # #',
        '#  #  ',
        ' ##   '
    ], {
    	'#': 'block',
    }, 38, 8);
```
# akafael: Live cage
Create your own drone army just because you can

```javascript
map.defineObject('defenceDrone', {
    'type': 'dynamic',
    'symbol': 'o',
    'color': 'blue',
    'onCollision': function (player) {
         // harmless drone
    },
    'behavior': function (me) {
        moveToward(me, 'attackDrone');
    }
});

for (y = 9; y < 14; i++) {
    map.placeObject(map.getWidth()-8, y, 'defenceDrone');
}
```

# Function Override
## esolitos

```javascript
function moveToward(obj, type) {
    obj.move('left');
}
```

# Minimalistic solutions
## Create another player to glitch the drone - 8shashank

```javascript
    map.placeObject(map.getWidth()-5,12,'player');
```
Approach the exit from top or bottom



## 3-0663651 - Single Block

```javascript
map.placeObject(25, 12, 'block');
```
Oh yeah, solution: Move down until you, the drone, and the block are collinear. Then advance right, hiding behind the block: `@#d`. Move down, then come around the block and dart for the exit.
This solution would not work at all with proper path-finding.


