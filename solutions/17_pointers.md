## amahdy: Solution 1 - Teleporter?

Optimze the code and move right all the way!

```javascript
		map.placeObject(6, 4, 'teleporter');
		map.placeObject(map.getWidth()-11, map.getHeight()-5, 'teleporter');
        
      	var ts = map.getDynamicObjects();
        ts[ts.length-2].setTarget(ts[ts.length-1]);
      
      	break;
```

## amahdy: Solution 2 - Wanna play? 

Needs some luck, try and error

```javascript
        if(t1.getType() != 'teleporter' 
        	|| t2.getType() != 'teleporter') {
            map.setSquareColor(t1.getX(), t1.getY(), 'yellow');
            map.setSquareColor(t2.getX(), t2.getY(), 'yellow');
        }else {
        	map.setSquareColor(t1.getX(), t1.getY(), '0'+i);
            map.setSquareColor(t2.getX(), t2.getY(), '0'+i);
        }
```

## Jhack (giacgbj)

Connect the first teleport on the player's right to the one on the exit's right.

```javascript
var start;
var end;
for (j = 0; j < teleportersAndTraps.length; j++) {
var t = teleportersAndTraps[j];
    var x = t.getX();
    var y = t.getY();

    if (7 == x && 4 == y)
    {
    	start = t;
    } else if (map.getWidth()-8 == x && map.getHeight()-5 == y) {
    	end = t;
    }
}

start.setTarget(end);
break;
```
