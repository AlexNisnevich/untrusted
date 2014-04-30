# Pointing to the Destination
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

# Highlights

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