## amahdy: Loop the loop

```javascript
        var player = map.getPlayer();
        
        if(player.getColor()=="#0f0")
        	player.setColor('#f00');
        else if(player.getColor()=="#f00")
        	player.setColor('#ff0');
        else if(player.getColor()=="#ff0")
        	player.setColor('#0f0');
```

## Jhack (giacgbj)

```javascript
var player = map.getPlayer();
player.turn = player.turn === undefined ? 0 : player.turn+1;
colors=['#f00','#ff0','#0f0','#f00','#ff0'];
player.setColor(colors[player.turn]);
```
