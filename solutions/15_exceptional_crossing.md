# Alter item type

## chenxiaoqino

```javascript
        'onCollision': function (player) {
            player.killedBy();},'type':'item',a:function(){return (0);
        }
```

```javascript
        // Assumes you'll need to go down
        'onCollision': function (player) {
            player.killedBy(map.placeObject(0, player.getY(), 'empty'));
        }
```

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

# Redefinition approach

## CaitSith2
```javascript
        'onCollision': function (player) {
            player.killedBy();},'onCollision': function (player){//);
        }
```
