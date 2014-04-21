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
