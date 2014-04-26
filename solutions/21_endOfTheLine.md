

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
