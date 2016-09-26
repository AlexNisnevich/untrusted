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
