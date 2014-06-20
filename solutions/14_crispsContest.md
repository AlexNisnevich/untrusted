## CaitSith2

```javascript
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem('theAlgorithm');
                return false;
            } else {
                return true;
            }
```

```javascript
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem('greenKey');map.placeObject(24,9,'greenKey');
                return false;
            } else {
                return true;
            }
```

## Jhack (giacgbj)

Let's call the cells from the top to the bottom and from left to right 1,2,3,4,5,6,7,8 and the one in which the player starts C:
 * C -> 3
 * 3 -> 1
 * 1 -> C
 * C -> 2
 * 2 -> 4
 * 4 -> C
 * C -> 7 (Algorithm)
 * 7 -> 8 
 * 8 -> C
 * C -> Exit

```javascript
player.removeItem('yellowLock');
```

## kraigory
```javascript
    map.defineObject('greenLock', {
        'symbol': String.fromCharCode(0x2297),
        'color': '#0f0',
        'impassable': function (player) {
            if (player.hasItem('greenKey')) {
                player.removeItem('greenKey');map.placeObject(24,10,'blueKey');
                return false;
            } else {
                return true;
            }
        }
    });
```
Go up through the blue lock to get the blue key. Come down through green, grab the yellow key, and out through blue. Now go down through yellow on the bottom left, grab the A, through the blue lock, grab the yellow key, and up through the yellow lock.
