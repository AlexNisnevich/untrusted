

## Jhack (giacgbj)

Just move right.

```javascript
if(me.getY()<13)
  me.move('down');
else if(me.getX()>0)
  me.move('left');
```
and 

```javascript
if(me.getY()<13)
  me.move('down');
else if(me.getX()<map.getWidth())
  me.move('right');
```
