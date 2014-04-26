

## Jhack (giacgbj)

```javascript
var player = map.getPlayer();
player.turn = player.turn === undefined ? 0 : player.turn+1;
colors=['#f00','#ff0','#0f0','#f00','#ff0'];
player.setColor(colors[player.turn]);
```
