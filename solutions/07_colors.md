
# Color Path
## Jhack (giacgbj)

```javascript
var player = map.getPlayer();
player.turn = player.turn === undefined ? 0 : player.turn+1;
colors=['#f00','#ff0','#0f0','#f00','#ff0'];
player.setColor(colors[player.turn]);
```

# Math, man!
## Rudedog9d

```js
        let pad = number => ("000"+number).slice(-3);
        var player = map.getPlayer();

        function getNextColor(color){
        	// parse the string, treat hex as binary, and add 2
            // ex, #0f0 becomes 010
        	let i = parseInt(color.replace(/f/g, 1).substring(1,4), 2) + 2;
            // If value got too big, recursively call with reset val of 0
            if(i > 6) return getNextColor(pad(0));
            // convert binary back to hex, ensure left padding, and add #
            // ex, 100 becomes #f00
            return '#' + pad(i.toString(2).replace(/1/g, 'f'));
        }

        // Set next color
        player.setColor(getNextColor(player.getColor()));
```

Basically, if you look at the problem as a binary one (rather than hex), you need to go `2 -> 4 -> 6 -> 2...`. So this solution takes each hex value, converts it to binary (`#0f0` becomes `010`), adds 2 (or resets back to 2), and converts back to the correct hex value.

I was trying to do this with a bit shift `<<`, but I couldn't quite pull it off.

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
# Rainbow path
Create a unlock object just before the lock one.
```
var player = map.getPlayer();

map.placeObject(21, 12, 'greenUnlock');
map.placeObject(24, 12, 'redUnlock');
map.placeObject(27, 12, 'yellowUnlock');
map.placeObject(30, 12, 'greenUnlock');
map.placeObject(33, 12, 'redUnlock');
map.placeObject(36, 12, 'yellowUnlock');
});

map.defineObject('redUnlock', {
symbol: '☒',
color: "#f00", // red
'onCollision': function (player) {
    player.setColor('#f00');
}
});

map.defineObject('greenUnlock', {
symbol: '☒',
color: "#0f0", // green
'onCollision': function (player) {
    player.setColor('#0f0');
}
});

map.defineObject('yellowUnlock', {
symbol: '☒',
color: "#ff0", // yellow
'onCollision': function (player) {
    player.setColor('#ff0');
}
```
# Circular queue
```javascript
var player = map.getPlayer();
if (!map.colors) {
    map.colors = ['#f00', '#0f0', '#ff0'];
}
newColor = map.colors.pop();
map.colors.unshift(newColor);
player.setColor(newColor);
```

# hijack the getter.

```javascript
map.writeStatus("The radiation seems to be affecting you...");
map.getPlayer().getColor = () => ['#0f0','#f00','#ff0'][Math.floor(Math.random()*3)];
```

