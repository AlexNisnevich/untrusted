#Build a bridge across

##CaitSith2

```javascript
}	//Breaking out of the existing jump() definition
  //It will be redefined down below.
    //gravity only checks to see if ground below is empty.
    map.defineObject('bridge',{'symbol':'~'});
    var bridgetiles = 10;
    var player_has_bridge_tile = false;
    var g;
    map.defineObject('bridgetile',{
    	'type':'item',
    	'symbol':'~',
        'onPickUp': function (player, game) {
        	bridgetiles--;
        	g=game;	//Extract the sound calls
        	player_has_bridge_tile = true;	//removeItem doesn't work
            								//with map defined items. :(
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
    //redefined jump() here.
    function jump() {
    	if(player.getX()>=fl(w/2)-6 && player.getX() < fl(w/2)+4) {
        	//if(player.hasItem('bridgetile')) {
            	//player.removeItem('bridgetile');
                //Map defined items seems to be broken. :(
            
            if(player_has_bridge_tile == true) {
            	if(map.getObjectTypeAt(player.getX()+1,fl(h/2))==='empty'){
                	g.sound.playSound('blip');
                	player_has_bridge_tile = false;
                	map.placeObject(player.getX()+1,fl(h/2),'bridge');
                	if(bridgetiles>0)
                    {
                 		map.placeObject(0,fl(h/2)-1,'bridgetile');
                  		map.writeStatus('bridge tile placed');
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
