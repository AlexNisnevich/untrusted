
# Color Path
## Jhack (giacgbj)

```javascript
var player = map.getPlayer();
player.turn = player.turn === undefined ? 0 : player.turn+1;
colors=['#f00','#ff0','#0f0','#f00','#ff0'];
player.setColor(colors[player.turn]);
```

# Location-based Color
## esolitos
```javascript
var player = map.getPlayer();
var chosenColor = "#f00";

if (
player.atLocation(24, 12) ||
player.atLocation(33, 12) ) {

    chosenColor = "#f00";
} else if (
player.atLocation(27, 12) ||
player.atLocation(36, 12) ) {

    chosenColor = "#ff0";
} else if (
player.atLocation(21, 12) ||
player.atLocation(30, 12) ) {

    chosenColor = "#0f0";
}

player.setColor(chosenColor);

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
