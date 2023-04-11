# noWayOut.md
## kedilayanaveen10: Power of teleportation!
Place teleporters and teleport over the wall
```javascript
map.placeObject(7, 6, 'teleporter');
map.placeObject(map.getWidth()-7, map.getHeight()-4, 'teleporter');
teleporters = map.getDynamicObjects();
var t1 = teleporters[0];
var t2 = teleporters[1];

t1.setTarget(t2);
t2.setTarget(t1);
```
