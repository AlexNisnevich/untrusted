# ice.md
## kedilayanaveen10: You hit a wall, you push through it!
Edit the impassable property of the 'block' object in objects.js to make it passable and reach the exit from above.
```javascript
'block': {
            'symbol': '#',
            'color': '#999',
            'impassable': false
        },
```
## pppery: move up on a timer
```
map.startTimer(function(){map.getPlayer().move("up")},200);
```
