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
