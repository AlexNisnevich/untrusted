# Autonomous Robot 

## donmccurdy

```javascript
    map.defineObject('robot', {
        // ...
        'behavior': function (me) {
          	me.path = me.path || [];
            if (me.path.length) {
            	me.move(me.path.pop());
	        } else if (me.canMove('down')) {
                me.move('down');
            } else if (me.canMove('right')) {
                me.move('right');
            } else {
            	me.path = [
     	  			'right', 'right', 'right',
                    'up', 'up', 'up', 'up', 'up',
                    'left', 'left', 'left', 'left'    
                ];
            }
        }
    });
```


## Jhack (giacgbj)

```javascript
me.move( 
	me.getX() < 25 || me.getX() > 47 ?
		me.canMove('down') ? 'down' : 'right' :
		me.canMove('up') ? 'up' : 'right'
);
```
