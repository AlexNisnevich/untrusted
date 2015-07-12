## Gipnokote

```javascript
    map.defineObject('raft2', { // raft2 is defined because the code validates the number of rafts
        'type': 'dynamic',
        'symbol': '▓',
        'color': '#420',
        'transport': true,
    });
    
    // build the bridge across the river
    for (var y = 5; y < 15; y++) {
    	map.placeObject(10, y, 'raft2');
    }
```

## JustBlackBird

```javascript
    // Press "Q" when you are on raft to change its direction and walk on it
    // to the other bank of the river.
    player.setPhoneCallback(function() {
        raftDirection = 'up';
    });
```
