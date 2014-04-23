# Autonomous Robot

## donmccurdy

```javascript
    map.defineObject('robot', {
        // ...
        'behavior': function (me) {
            if (me.canMove('down')) {
            	me.move('down');
            } else if (me.canMove('right')) {
            	me.move('right');
            }
        }
    });
```

## Jhack (giacgbj)

```javascript
  me.move(me.canMove('right') ? 'right' : 'down');
```
