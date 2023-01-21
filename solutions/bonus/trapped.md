# trapped.md
## kedilayanaveen10: No trap can stop teleportation!
Place 2 teleporters: one near you and one near exit.  
To get the teleporter objects call map.getDynamicObjects(). The 2 teleporters will be at the end of the array returned (read the backend code to know why!!)
```javascript
map.placeObject(5, 12, 'teleporter');
map.placeObject(map.getWidth()-1, 13, 'teleporter');
dos = map.getDynamicObjects();
var t1 = dos[dos.length-1];
var t2 = dos[dos.length-2];

t1.setTarget(t2);
t2.setTarget(t1);
```
