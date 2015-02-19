

## Jhack (giacgbj)

For example, in:

 * Menu -> Scripts -> object.js:

you can modify this code:

```javascript
  if (!game.map.finalLevel) {
    game._moveToNextLevel();
  }
```

like this:

```javascript       
  if (game.map.finalLevel) {
    game._moveToNextLevel();
  }
```

*esolitos note*: Or symply remove/comment the if.

## Agamemnus


In map.js, before this._reset():
```javascript
   Object.defineProperty (this, 'finalLevel', {
     set: function () {setTimeout (function () {__game._moveToNextLevel ()}, 0)}
    })
```
## mrtank

In map.js's unexposed variables you can write:
```javascript
__game._getLevel(22);
```
