# AB_3_BoulderMadness.md
## kedilayanaveen10: Colour the boulders
Give the boulders colours to easily differentiate between good and bad ones.

```javascript
map.defineObject('boulder', {
	//let it be default colour
	'symbol': String.fromCharCode(0x2617),
	'impassable': true
});

map.defineObject('movingBoulder', {
	'color': 'green',               		 
	'symbol': String.fromCharCode(0x2617),
	'pushable': true,
	'type': 'dynamic',
});	

map.defineObject('trapBoulder', {
	'color': 'red',               		 
	'symbol': String.fromCharCode(0x2617),
	'pushable': true,
	'type': 'dynamic',
	'onCollision': function (player) {
		player.killedBy('Got trapped under boulder');
	},
});	
```
