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
*Note: this solution no longer works as of version 1.2 of this level.*

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

## Try luck

```javascript
'impassable': function (player) {
    if (player.hasItem('greenKey')) {
        player.removeItem('' || Math.random() < .5? 'greenKey' : 'blueKey' + '');
        return false;
    } else {
        return true;
    }
}
```

Steps:

1. Go to the top-right corner. Path: red lock -> get blue key -> green lock -> get red key -> red lock.
2. Go to the top-left corner. Path: blue lock -> get yellow key -> green lock -> get blue key -> blue lock.
3. Go to bottom. Path: yellow lock -> get yellow key -> blue lock -> get algorithm -> yellow lock.
4. Exit!

We must be lucky enough to remove blue key at first green lock and remove green key at second green lock. If the lock doesn't remove expected key, restart game. Ideally, we have 25% chance to pass this level.


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
