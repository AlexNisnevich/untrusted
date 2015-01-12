# make fun, not jump

## gRz
function jump() {
    
    map.placeObject(33,11,'teleporter');
    map.placeObject(11,11,'teleporter');
    
    
    do1 = map.getDynamicObjects();
    var t1 = do1[0];
    var t2 = do1[1];
    
    t1.setTarget(t2);
    t2.setTarget(t1);
    
    
}
  



# Build a bridge across
 
## Agamemnus
Dynamic bridge:
```javascript
        var x = player.getX ()
        var y = player.getY ()
        if (map.getObjectTypeAt(x + 1, y + 1) == "empty") {
            map.placeObject(x + 1, y + 1, 'block')
        }
    }
    map.startTimer(jump, 45)
     
    var temp = function () {
```
    
## CaitSith2

```javascript
	}	//DROP TABLES style solution
    //gravity only checks to see if ground below is empty.
    map.defineObject('bridge',{'symbol':'~'});
    var bridgetiles = 10;
    map.defineObject('bridgetile',{
    	'type':'item',
    	'symbol':'~',
        'onPickUp': function (player, game) {
            game.map.writeStatus('You have picked up a bridge tile');
        },
        'onDrop': function (game) {
            game.map.writeStatus('You have placed the bridge tile');
        }
    });
    
    map.placeObject(0,fl(h/2)-1,'bridgetile');	//Place initial tile
    
    map.defineObject('pit',{
    	'symbol':'V',
    	'type': 'dynamic',
        'onCollision':function(player,game){
        	player.killedBy('falling on spikes');
        }
    });
    map.defineObject('bpit',{'symbol':'#','color':'#999'});
      
    for(var x = fl(w/2)-5;x < fl(w/2)+5;x++) {
        map.placeObject(x,map.getHeight()-3,'pit');
        map.placeObject(x,map.getHeight()-2,'bpit');
        map.placeObject(x,map.getHeight()-1,'bpit');
    }
    function jump() {
    	if(player.getX()>=fl(w/2)-6 && player.getX() < fl(w/2)+4) {
        	if(player.hasItem('bridgetile')) {
            	if(map.getObjectTypeAt(player.getX()+1,fl(h/2))==='empty'){
                	player.removeItem('bridgetile');
                	map.placeObject(player.getX()+1,fl(h/2),'bridge');
                	if(--bridgetiles>0)
                    {
                 		map.placeObject(0,fl(h/2)-1,'bridgetile');
                    }
                    else
                    {
                    	map.writeStatus('bridge built :), I am getting revenge!!');
                    }
                }
                else
                {
                	map.writeStatus('there is already a bridge tile placed there');
                }
            }
            else {
            	if(map.getObjectTypeAt(player.getX()+1,fl(h/2))==='empty'){
            		map.writeStatus('you don\'t have a bridge tile to place');
                }
            }
        }
```

## ct-js: build it step by step with phone
```javascript
	try { map.defineObject('blocky', {type:"none"}); } catch(e) {}
	map.placeObject(player.getX()+1, player.getY()+1, 'blocky');
```

# Defy the Gravity

## amahdy: Phone, eh?

function jump() {

```javascript
    	if(player.getY()!=11) {
		player.move("up");
	}
}
map.startTimer(jump, 25);

function foo() {
```

}

    

## Gipnokote

function jump() {
```javascript
    }
    
    function gravity() {
    
```
}
# "I'm feeling lucky"
## Jhack (giacgbj)

```javascript
function antiGravity() {
	var x = player.getX();
	var y = player.getY();

	if (y > 1 && x < (map.getWidth()/2 + 10)) {
		player.move("up");
	}
}
map.startTimer(antiGravity, 25);
```



