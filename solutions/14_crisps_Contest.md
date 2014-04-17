#Place object approach

## CaitSith2

```javascript
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem('exit');map.placeObject(24,9,'theAlgorithm');
                return false;
            } else {
                return true;
            }
```
