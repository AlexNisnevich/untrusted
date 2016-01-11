# wallsWithEyes.jsx
(Bonus Level)


## Stop the walls
### Grass Path
```javascript
    map.defineObject('grass', {
        symbol: '\u25a6',
        color: '#494',
        impassable: false
    });
    
    for (var y = 3; y < 23; y++) {
        map.placeObject(24, y, 'grass');
        map.placeObject(25, y, 'grass');
        if (y != 19) map.placeObject(26, y, 'grass');
    }
```
Explanation: Move up to activate the trap, then turn back and let the walls close all the way. They won't spawn on grass.
Then, walk up the grass path.
