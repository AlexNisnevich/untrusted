# AB_5_PathOfDoom.md
## kedilayanaveen10: The Great Wall of Doom?
Create a wall on hitting the switch.
```javascript
map.defineObject('switch', {
  'type': 'static',
  'symbol': String.fromCharCode(0x2617),
  'color': 'red',
  'onCollision': function (me) {
	for(var y=8; y<=12; y++)
		map.placeObject(map.getWidth()-5, y, 'boulder');
  }		
});
```

## kedilayanaveen10: Flip the plates
This can also be solved without any code change. Just move in and out of the plate at the begninning as much as possible and the arrows stop firing on their own.

## Peter-developer01: Place the teleporters
Create teleporters on hitting the switch to teleport right nearby the exit.
```javascript
map.placeObject(5, 2, "teleporter");
map.placeObject(map.getWidth() - 6, map.getHeight() - 5, "teleporter");
let [t1, t2] = map.getDynamicObjects()
	.filter(t => t.getType() === "teleporter");
t1.setTarget(t2);
t2.setTarget(t1);
```
