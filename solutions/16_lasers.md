## someone328 chameleon way
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

## Jhack (giacgbj)

Nothing in the first area.

The following code in the second area:
```javascript
getRandomInt = function(){return 600;};
```
