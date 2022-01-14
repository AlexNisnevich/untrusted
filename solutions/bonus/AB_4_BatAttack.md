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

## kedilayanaveen10: Teleport
Teleport in front of the exit
```javascript
map.placeObject(map.getPlayer().getX(), map.getPlayer().getY()-1, 'teleporter');
map.placeObject(map.getWidth()-11, 1, 'teleporter');
teleporters = map.getDynamicObjects();

//teleporters we placed will be at the end of the array because map pushes every new dynamic object at the back of the array __dynamicObjects that it maintains.
//Code in map.placeObject (in map.js):
//__dynamicObjects.push(new DynamicObject(this, type, x, y, __game));

var t1 = teleporters[teleporters.length-2];
var t2 = teleporters[teleporters.length-1];

t1.setTarget(t2);
t2.setTarget(t1);
```
