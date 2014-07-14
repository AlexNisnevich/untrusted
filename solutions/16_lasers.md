# The Chameleon Way
## someone328
```javascript
	// using canvas to draw the line
        var ctx = map.getCanvasContext();
        ctx.beginPath();
        ctx.strokeStyle = color; //make lasers colored
        ctx.lineWidth = 5;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
		
		//color switcher by telephone
		player.setColor('red');
		player.setPhoneCallback(function(){
    	var color = player.getColor();
        switch(color)
        {
        	case 'red':
            	player.setColor('yellow');
                break;
            case 'yellow':
            	player.setColor('teal');
                break;
            case 'teal':
            	player.setColor('red');
                break;
        }
    });
```

## esolitos

```javascript
ctx.strokeStyle = color;

//---

var j = 0;
var colors = ['red', 'yellow', 'teal'];

player.setPhoneCallback( function(){
	player.setColor( colors[ (j++)%3 ] );
} );
```

# Function Redefinition
## Jhack (giacgbj)

Nothing in the first area.

The following code in the second area:
```javascript
getRandomInt = function(){return 600;};
```

# Closures
## ZER0
```js
 
// using canvas to draw the line
var ctx = map.getCanvasContext();
ctx.beginPath();
ctx.strokeStyle = 'white';
ctx.lineWidth = 5;
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.stroke();
// take advantages of the closure create by `map.createLine`
// so all lasers will be of the same color of the player
color = player.getColor();
```
