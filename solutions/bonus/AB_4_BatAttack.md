# AB_4_BatAttack.md

## redefining Approach
Just tell the bats to go back to sleep.
```javascript
function wakeAndHunt() {/*go to sleep*/}
```
## pppery: block the bats (1)
### Edit "objects.js".
```javascript
'empty' : {
            'symbol': ' ',
            'impassableFor': ['bat']
        },
```
## pppery: block the bats (2)
Define a new object type that you can go through but the bat's can't.
Then, get the phone and let the shields keep you safe.
```javascript
map.defineObject("shield",{
        "symbol":"s",
        "impassableFor":["bat"]})
    var p = map.getPlayer();
    map.placeObject(p.getX(),p.getY()-1,"phone")
    p.setPhoneCallback(function() {
        for(var x = -2;x<2;x++) {
            for(var y = -2;y<2;y++) {
                try {
                    map.placeObject(p.getX()+x,p.getY()+y,"shield");
                } catch (e) {
                }
            }
        }
    });
```