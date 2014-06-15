# Exception approach

## lizheming
```javascript
       'onCollision': function (player) {
            player.killedBy(map.placePlayer());
        }
```

## 029ah
```javascript
       'onCollision': function (player) {
            player.killedBy(none);
        }
```

## dentuzhik 
```javascript
        // Assumes you'll need to go down
        'onCollision': function (player) {
            player.killedBy(map.placeObject(0, player.getY(), 'empty'));
        }
```

## NightmaresSeller
```javascript
        // Simply throw exception
        'onCollision': function (player) {
            player.killedBy((function() {throw 666;})());
        }
```

## Frenchi
```javascript
// Shortest possible response - throws "undefined" error.
       'onCollision': function (player) {
            player.killedBy(a);
        }
```

# Redefinition approach

## chenxiaoqino

```javascript
        'onCollision': function (player) {
            player.killedBy();},'type':'item',a:function(){return (0);
        }
```

## CaitSith2
```javascript
        'onCollision': function (player) {
            player.killedBy();},'onCollision': function (player){//);
        }
```

## XadillaX

```javascript
player.killedBy() = (0);
```
