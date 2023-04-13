# 03_theCollapsingRoom.md

## urandon: Weather cleaner
If we want to stop the rain, we can destroy rainmaker.
```javascript
    map.defineObject('rocket', {
        'type': 'dynamic',
        'projectile': true,
        'behavior': function (me) { me.move('up'); }
    });
    map.placeObject(1, 2, 'rocket');
```

## Redefine Math.random
```javascript
Math.random = function() { return 0.75; }
```
## Edit "objects.js". 
```javascript
 // obstacles
        'block': {
            'symbol': '#',
            'color': '#999',
            'impassable': false
        },
```
## pppery: Variable overwrite
Make blocks fall outside the room too for more time
```javascript
grid_x = grid_y = 0;
half_width = map.getWidth();
half_height = map.getHeight();
```
