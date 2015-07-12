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

## PK 

Find nearest teleport to exit. Re-route all other teleports to it.
There is no room for mistake. :)

```javascript
var dist2 = function d2(o,x2,y2){
    var dx = x2 - o.getX();
    var dy = y2 - o.getY();
    return dx*dx + dy*dy;
};

var teleporters = teleportersAndTraps.filter(function(v){
  return v.getType() == 'teleporter';
});

var x = map.getWidth();
var y = map.getHeight();

teleporters.sort(function(a, b){
  return dist2(a,x,y) - dist2(b,x,y);
})

var exit = teleporters[0];

for (var i = 1; i < teleporters.length; i++){
  teleporters[i].setTarget(exit);
}

break;
```

## Highlights

Highlights mines and shows telepoerter's paths

```javascript
t1_pos = map.getCanvasCoords( t1 );
t2_pos = map.getCanvasCoords( t2 );


if( t1.getType() == 'trap' ) {

    map.setSquareColor( t2.getX(), t2.getY(), 'red' );

} else if( t2.getType() != 'trap' ) {

    canvas.beginPath();
    canvas.strokeStyle = 'blue';
    canvas.lineWidth = 1;
    canvas.moveTo( t1_pos['x'] , t1_pos['y']);
    canvas.lineTo( t2_pos['x'] , t2_pos['y'] );
    canvas.stroke();
}

if( t2.getType() == 'trap' ) {
    map.setSquareColor( t1.getX(), t1.getY(), 'red' );
}
```

## Redefine shuffle

not shuffling for real 

function shuffle(o){
var ret = []
ret.push(o[0]);
ret.push(o[o.length -2]);
return ret;
};
