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
