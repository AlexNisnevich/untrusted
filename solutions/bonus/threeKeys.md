# threeKeys.js

## Key-Eater
Oh, a robot "eats" the keys. It first grabs the red key and suicides, re-spawning in the second cell. When the last key gets eaten, teleporters are placed.

```javascript
// You might find this useful.
    map.placeObject(8, 6, 'phone');

    // ----- PHASE ONE -- A robot gets the keys and self-destructs. ----- \\

    // The anti-robot device.
    map.defineObject('anti-robot', {
        symbol: 'q',
        color: '#9f3',
        type: 'dynamic',
        projectile: true,
        interval: 200,
        behavior: function(me) { me.move('down'); }
    });

    // The robot.

    map.defineObject("robot", {
        symbol: "R",
        color: "#897",
        type: "dynamic",
        interval: 300,
        //projectile: true,
        behavior: function(me) {
            me.t = me.t || 1;
            me.move('down');
            me.t++;
            if (me.t === 9) {
                // self-destruct
                map.placeObject(me.getX(), me.getY()-2, 'anti-robot');
            }
        },
        onDestroy: function(me) {
        // ---- PHASE TWO -- Oh, place keys. ---- \\
            if (me.getY() < 24)
                map.placeObject(me.getX(), me.getY()+2, 'robot');
            else {
                map.placeObject(8, 9, 'computer');
                map.placeObject(8, 12, 'redKey');
                map.placeObject(8, 15, 'greenKey');
                map.placeObject(8, 18, 'blueKey');
                // because I feel like it
                map.placeObject(8, 21, 'yellowKey');
            }
        }
    });

    // ----- PHASE THREE -- The player places teleports. ----- \\
    map.getPlayer().setPhoneCallback(function() {
        if (map.countObjects('robot') > 0) {
            map.writeStatus("Wait! There are still dynamic objects.");
        } else {
            map.placeObject(8, 15, 'teleporter');
            map.placeObject(42, 15, 'teleporter');
            var d = map.getDynamicObjects();
            d[0].setTarget(d[1]);
        }
    });


    // Gets the reaction going.
    map.placeObject(24, 1, 'robot');
```
