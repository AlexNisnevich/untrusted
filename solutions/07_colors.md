
## Jhack (giacgbj)

```javascript
var player = map.getPlayer();
player.turn = player.turn === undefined ? 0 : player.turn+1;
colors=['#f00','#ff0','#0f0','#f00','#ff0'];
player.setColor(colors[player.turn]);
```

## Nabellaleen
```javascript
var playerColor = player.getColor();
switch(playerColor) {
  case '#f00':
    player.setColor('#ff0');
    break;
  case '#ff0':
    player.setColor('#0f0');
    break;
  case '#0f0':
    player.setColor('#f00');
    break;
}
```
