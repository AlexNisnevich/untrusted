# AB_1_ANewJourney.md

## kedilayanaveen10: Walk in the park
### Edit "objects.js"
Make the trees as passable and it'll be like a walk in the park to the exit.

```javascript
'tree': {
			'symbol': '♣',
			'color': '#080',
			'impassable': false
        },
```

## kedilayanaveen10: Teleport into the forest
Place 2 teleporters, one near the player and one near the exit (placing over a tree)
```javascript
map.placeObject(map.getPlayer().getX(), map.getPlayer().getY()-2, 'teleporter');
switch(exit_place)
{
	case 0:
		map.placeObject(map.getWidth()-8, 0, 'teleporter');
	break;

	case 1:
		map.placeObject(map.getWidth()-18, 0, 'teleporter');
	break;

	case 2:
		map.placeObject(map.getWidth()-13, 1, 'teleporter');
	break;

	case 3:
		map.placeObject(map.getWidth()-8, 3, 'teleporter');
	break;

	case 4:
		map.placeObject(map.getWidth()-8, 6, 'teleporter');
	break;

	default:
		map.placeObject(map.getWidth()-16, 5, 'teleporter');     	
}

teleporters = map.getDynamicObjects();
var t1 = teleporters[0];
var t2 = teleporters[1];

t1.setTarget(t2);
t2.setTarget(t1);
```
## Pppery: logging
```
	for (var i = map.getWidth() - 20; i < map.getWidth(); i++) {
    	for (var j = 0; j < 20; j++) {
        	if (map.getObjectTypeAt(i, j) != "exit") {
            	map.placeObject(i, j, "empty");
            }
        }
    }
```
