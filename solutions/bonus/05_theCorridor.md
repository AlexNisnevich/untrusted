# 05_theCorridor.md

## pppery: The Trapbreaker
Define an object that destroys traps and just push it through them.
```javascript
map.defineObject("trapbreaker", {
    "symbol":"t",
    "type":"dynamic",
    "projectile":true,
    "pushable":true,
    "onDestroy":function(me) {
        map.placeObject(me.getX(),me.getY()-1,"trapbreaker");
    }
});
var player = map.getPlayer()
map.placeObject(player.getX(),player.getY()-1,"trapbreaker");
```

## Disabling traps
Override the trap's behaviour to do nothing
```javascript
trap_behaviour = function(){}
```
