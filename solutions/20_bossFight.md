## filippovdaniil: air strike

```javascript
    var arr = map.getDynamicObjects();

    for( var i = 0; i < arr.length; i++ )
        if( arr[ i ].getType() == 'boss' )
            arr[ i ].direction = 'down';

    map.getPlayer().setPhoneCallback(function(){
        for( var i = 0; i < map.getWidth(); i++ )
            map.placeObject( i, 5, 'bullet' );
    });
```

## amahdy: shoot-em style, press the left button!

```javascript
    map.defineObject('bullet2', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'yellow',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });

    map.overrideKey('left', function() {
        map.placeObject(0, 20, 'bullet2');
        map.placeObject(1, 20, 'bullet2');
        map.placeObject(2, 20, 'bullet2');
        map.placeObject(3, 20, 'bullet2');
        map.getPlayer().move('left');
    });
```

## Frenchi: overkill
```javascript
    map.defineObject('bullet2', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'yellow',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });

    map.overrideKey('left', function() {
         
	for(i=0;i<50;i++){
	  map.placeObject(i, 20, 'bullet2');
      }
        map.getPlayer().move('left');
    });
```

## someone328: bullets with trigger

```javascript
	map.defineObject('MyBullet', { //only way to kill the boss is using "projectile" object
        'type': 'dynamic',
        'symbol': '.',
        'color': 'green',
        'interval': 100,
		'projectile': true,
        'behavior': function (me) {
            me.move('right');
        }
    });
	//create trigger for open fire
	map.defineObject('trigger', {
        'symbol': '=',
        'color': 'green',
		'onCollision': function (player){
        	for(i=0; i<26; i+=2){
				map.placeObject(i, 5, 'MyBullet');
				map.placeObject(i, 6, 'MyBullet');
            }
		},
    });
	//place trigger in safe place near the player
	map.placeObject(1, map.getHeight() - 3, 'trigger');
```

## Kebabbi: heat-seeking missiles

```javascript
var bosses = map.getDynamicObjects();

for(var i=0;i<bosses.length;i++){
        (function(k){
                map.defineObject('bossKiller'+k, {
                        'type':'dynamic',
                'symbol':'^',
                'color':'blue',
                'interval':100,
                'projectile':true,
                'behavior':function(me){
                if(bosses[k][" _".substr(1,1)+"isDestroyed"]()){
                        me[" _".substr(1,1)+"destroy"]();
                }

                var x = bosses[k].getX();
                var y = bosses[k].getY();
                        var dx = Math.abs(me.getX() - x);
                var dy = Math.abs(me.getY() - y);
                var direction = "none";
                if(dx > dy){
                        if(x < me.getX()){
                        direction = 'left';
                    } else {// if (x > me.getX()){
                        direction = 'right';
                    }
                } else {
                        if(y < me.getY()){
                        direction = 'up';
                    } else {// if (y > me.getY()){
                        direction = 'down';
                    }
                }
                me.move(direction);
                },
            'onDestroy':function(me){
                if(bosses[k][" _".substr(1,1)+"isDestroyed"]()) return;
                if(me.getX() != bosses[k].getX()
                        || me.getY() != bosses[k].getY())
                        map.placeObject(me.getX()+Math.floor(Math.random()*2-1)
                        , me.getY(), 'bossKiller'+k);

            }
                });
    })(i);
}

map.defineObject('helmet', {
        'symbol': 'o',
        'color': 'blue',
        'impassable':true,
});

for(var i=0;i<50;i+=1){
        if(i==25) continue;
        map.placeObject(i,map.getPlayer().getY()-2,'helmet');
}

map.getPlayer().setPhoneCallback(function(){
 for(var i=0;i<bosses.length;i++){
        map.placeObject(i*2,map.getPlayer().getY()-3,'bossKiller'+i);
 }
});

```

## Jhack (giacgbj): I'm just evil

```javascript
    map.defineObject('antiBullet', {
        'type': 'dynamic',
        'symbol': '§',
        'color': 'yellow',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });

    map.overrideKey('left', function()
    {
      for (var i = 0 ; i < map.getWidth() ; i++)
        for (var j = 8 ; j < map.getHeight()-4; +j++)
          map.placeObject(i, j, 'antiBullet');
    });

```


##eccstartup: It is more like a game

Notice the `boss` would drop a `bullet` 2 points below the `boss` itself, you can easily get the `phone` if you walk right below the `boss`. Notice also that we can create `bullet`s and it is not counted in the total number of dynamic objects, we can create many `bullets` there to defeat the `boss`es. So this is the solution, with only one phone callback function needed. And with the hints above, you will know how to pass this level.

```javascript
    var player = map.getPlayer();
    player.setPhoneCallback(function (){
    for(x=0;x<50;x++){//better hide yourself
        map.placeObject(x,5,'bullet');
        map.placeObject(x,4,'bullet');
    }
    });
```

It is in this [gist](https://gist.github.com/eccstartup/11201050).

## esolitos: Bulletproof glass and boss-seaking projectiles


You just need to be sure to "call" whan you're close to the bullet proof glass

```javascript

    map.defineObject('bullteproof-glass', {
        'symbol': '-',
        'color': 'blue',
        'impassable': true
    });

    map.defineObject('killer-phonecall', {
        'type': 'dynamic',
        'symbol': '^',
        'color': 'yellow',
        'interval': 100,
        'projectile': true,
        'behavior': searchBoss
    });


    function searchBoss(obj) {
        var direction = 'left';
        var target = obj.findNearest('boss');

        if( target !== undefined ) {
            var leftDist = obj.getX() - target.x;
        	var upDist = obj.getY() - target.y;

        	if (upDist > 0 && upDist >= leftDist) {
    	        direction = 'up';
            } else if (leftDist > 0 && leftDist >= upDist) {
    	        direction = 'left';
            } else {
            	direction = 'right';
        	}
        }
        obj.move(direction);
    }

    function phonecall_shoot(){
        var p = map.getPlayer();

      	map.placeObject(p.getX(),p.getY()-1,'killer-phonecall');
    }

    // Olace some bulletproof glass
    for( var x=3; x < map.getWidth()-3; x++ ){
    	map.placeObject(x, map.getHeight() - 7, 'bullteproof-glass');
    }


    map.getPlayer().setPhoneCallback( phonecall_shoot );
```


## LostSenSS: Under attack

```javascript

    map.defineObject('myBullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'green',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });    
   
    // A safe place on the way to the phone where you can wait until the boss goes to the other side
    map.placeObject(25, map.getHeight() - 4, 'block');
	
    // Run bullets
    map.getPlayer().setPhoneCallback(function() {
        for (var i = 8; i < 18; i++) {
            for (var x = 0; x < map.getWidth(); x++) {
                map.placeObject(x, i, 'myBullet');
            }         
        }
    });
```

