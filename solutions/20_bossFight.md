## joshua-s: jam their guns
```javascript
// Don't let boss emit bullets
Math.random = function () {
        return 1;
}

// Create good bullets
map.defineObject('goodbullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'blue',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
                me.move('up');
        }
});

// Fire!
map.getPlayer().setPhoneCallback(function(){
        for (var i = 0; i < map.getWidth(); i++) {
                map.placeObject(i, 8, 'goodbullet');
        }
});
```

## mrtank: precise air strike

```javascript
    map.getPlayer().setPhoneCallback(function () {
        var bosses = map.getDynamicObjects();
        for (var i = 0; i < 23; i++) {
            map.placeObject(bosses[i].getX(),
                            bosses[i].getY() - 1,
                            'bullet');
        }
    });
```

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

## larsj+apark: Random Access

```javascript
Math.random = function() { return 1; }

map.defineObject('mybullet', {
	'type': 'dynamic',
	'symbol': '.',
	'color': 'red',
	'interval': 100,
	'projectile': true,
	'behavior': function (me) {
    		me.move('right');
	}
});


map.getPlayer().setPhoneCallback(function() {
	map.placeObject(5, 5, 'mybullet');
	map.placeObject(5, 6, 'mybullet');
});

```

## XadillaX's Hack Solution

Define a new block type and let them at the bottom of bosses and bullets:

```javascript
map.defineObject("sb", {
    impassable: function() {
        return true;
    },
    symbol: "a",
    onCollision: function() {
    }
});

for(var i = 0; i < map.getWidth(); i++) {

    map.placeObject(i, 9, "sb");
}
```

And then you can get phone.

Set the phone callback function to hack:

Get all dynamic objects, and let the `_destroy` function of `boss` to `bullet`. That means when a bullet is to destroy, the `boss` will be destroyed instead:

```javascript
map.getPlayer().setPhoneCallback(function() {
    var bosses = [];
    var bullets = [];
    var objects = map.getDynamicObjects();
    for(var i = 0; i < objects.length; i++) {
        if(objects[i].getType() == "boss") {
            bosses.push(objects[i]);
        } else {
            bullets.push(objects[i]);
        }
    }
    for(var i = 0; i < Math.min(bosses.length, bullets.length); i++) {
        bullets[i]._destroy = bosses[i]._destroy;
    }

    if(bosses.length === 0) {
        map.placeObject(map.getPlayer().getX(), map.getPlayer().getY() + 1,
            'theAlgorithm');
    }
});
```

But don't forget to generate `theAlgorithm` after all `boss` destroyed.

Now you can get your phone and press `Q` until all bosses are destroyed and get `theAlgorithm` to next stage!

## garzon: hide and shoot

Don't panic! Just hide in the shelters and make phone calls. :)

```javascript
    map.defineObject('bullet2', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'green',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });
    map.defineObject('shelter', {
        'symbol': 'O',
        'color': 'green',
        'impassable':true
    });

    for(x=Math.floor(map.getWidth()/2);x>0;x--){
    	map.placeObject(2*x,12,'shelter');
        map.placeObject(2*x-1,14,'shelter');
    }

    map.getPlayer().setPhoneCallback(function(){
    	player=map.getPlayer();
        map.placeObject(player.getX()-1,player.getY(),'bullet2');
    });

## MI53RE: I can use drone too! >:D

	////////////////////////////////////////////////////////////////////////////////////
	//WARNING WHEN THE BOSS IS KILLED YOU STILL MIGHT DIE FFROM YOUR DRONES'S BULLET!!//
	//		  SO WATCH OUT WHEN GETTING THE ALGORYTHM!!			  //
	//		            (Still IMAO it's fun :D)				  //
	////////////////////////////////////////////////////////////////////////////////////

```javascript



	//we define a drone
	map.defineObject('drone', {
        'type': 'dynamic',
        'symbol': '☣',
        'color': 'yellow',
        'interval': 200,
        'behavior': function (me) {
        		if (Math.random() < 0.3) {
            			map.placeObject(me.getX() + 1, me.getY(), 'dbullet');
        		}
        	},
    	});
	 // we define the drone's weapon
   	map.defineObject('dbullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'blue',
        'interval': 100,
        'projectile': true,
       	'behavior': function (me) {
            		me.move('right');
        	},
        });
	// we prepare the callback that will be activated later
   	function callback(){
		map.placeObject(1, 5, 'drone');
    		map.placeObject(1, 6, 'drone');
	}
	//on level start we spawn a block that will help us
	//get to the phone across the bullet's rain
	map.placeObject(28, map.getHeight() - 5, 'block');
	//once we get the phone back we can start the fun >:D!!!
	map.getPlayer().setPhoneCallback(callback);
```

## Innovision: Fight the Boss with a Boss

```javascript
map.defineObject('minishield', {
        'symbol': '-',
        'color': 'blue',
        'impassable': true
    });
    
    map.placeObject(25, 21, 'minishield');
    
   map.defineObject('ANTIboss', {
        'type': 'dynamic',
        'symbol': '⊙',
        'color': 'green',
        'interval': 200,
        'onCollision': function (player) {
            player.killedBy('the ANTIboss');
        },
        'behavior': function (me) {
        	if (!me.direction) {
        		me.direction = 'right';
        	}
        	if (me.canMove(me.direction)) {
            	me.move(me.direction);
        	} else {
        		me.direction = (me.direction == 'right') ? 'left' : 'right';
        	}
        	if (Math.random() < 0.3) {
            	map.placeObject(me.getX(), me.getY() - 2, 'ANTIbullet');
        	}
        }
    });
    
    map.defineObject('ANTIbullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'green',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });
    
    map.getPlayer().setPhoneCallback(function(){
        map.placeObject(9, 5, 'boss');
    map.placeObject(11, 13, 'ANTIboss');
    map.placeObject(13, 13, 'ANTIboss');
    map.placeObject(15, 13, 'ANTIboss');
    map.placeObject(17, 13, 'ANTIboss');
    map.placeObject(19, 13, 'ANTIboss');
    map.placeObject(21, 13, 'ANTIboss');
    map.placeObject(23, 13, 'ANTIboss');
    map.placeObject(25, 13, 'ANTIboss');
    map.placeObject(27, 13, 'ANTIboss');
    map.placeObject(29, 13, 'ANTIboss');
    map.placeObject(31, 13, 'ANTIboss');
    
    map.placeObject(10, 14, 'ANTIboss');
    map.placeObject(12, 14, 'ANTIboss');
    map.placeObject(14, 14, 'ANTIboss');
    map.placeObject(16, 14, 'ANTIboss');
    map.placeObject(18, 14, 'ANTIboss');
    map.placeObject(20, 14, 'ANTIboss');
    map.placeObject(22, 14, 'ANTIboss');
    map.placeObject(24, 14, 'ANTIboss');
    map.placeObject(26, 14, 'ANTIboss');
    map.placeObject(28, 14, 'ANTIboss');
    map.placeObject(30, 14, 'ANTIboss');
    map.placeObject(32, 14, 'ANTIboss');
    });
```

The whole idea behind this is that before you get the function phone, you hide under the minishield (see code) for cover.  Once you reach the other side and get the function phone, call it once.  A good version of the boss (named ANTIboss in the code) will appear.  It looks exactly the same as the boss, except that it is green in color and shoots upwards.  If the boss KOs the antiboss at the first call, simply call it again.  However, when the boss is defeated, you must still get the timing right, because the ANTIboss will still shoot upwards, and if you're not careful, you will die from its bullets.

Thank you to those who have posted solutions before me.  Without your solutions, I would never have been able to understand the code and create this awesome solution.

## lz: bigger bosses

Touch the '7' to call two bigger bosses that will let you safely pick up the two items and exit.

```javascript
    map.defineObject('biggerboss', {
        'type': 'dynamic',
        'symbol': '⊙',
        'color': 'blue',
        'interval': 200,
        'onCollision': function (player) {
            player.killedBy('the biggerboss');
        },
        'behavior': function (me) {
            if (map.countObjects('boss') === 0) {
                return;
            }
            if (Math.random() < 0.3) {
                map.placeObject(me.getX() + 1, me.getY(), 'bluebullet');
            }
        }
    });
    map.defineObject('bluebullet', {
        'type': 'dynamic',
        'symbol': '-',
        'color': 'blue',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('right');
        }
    });
    map.defineObject('button',  {
        'symbol': '7',
        'color': 'blue',
        'onCollision': function (player) {
            map.placeObject(0, 5, 'biggerboss');
            map.placeObject(0, 6, 'biggerboss');
        }
    });
    map.placeObject(1, map.getHeight() - 3, 'button');
```

## seiyria: The Jake Weary Bypass

With our recent escapades in jQuery land, we now have access to jQuery. With this, we can get a grip on the window object, and bypass the validations:

```
    map.defineObject('myBoss', {
        'type': 'dynamic',
        'symbol': '💩',
        'color': 'red',
        'interval': 200,
        'behavior': function (me) {
            if (Math.random() < 0.3) {
                map.placeObject(me.getX(), me.getY() - 2, 'myBullet');
            }
        }
    }); 

    map.defineObject('myBullet', {
        'type': 'dynamic',
        'symbol': '.',
        'color': 'red',
        'interval': 100,
        'projectile': true,
        'behavior': function (me) {
            me.move('up');
        }
    });
    
    var win = $('body')[0].ownerDocument.defaultView[('win'+'dow')]
    var x = win['set' + 'Timeout']
    x(function() {
    	for(var i = 0; i < 25; i++) 
		map.placeObject(i+3, map.getHeight() - 4, 'myBoss');
    }, 1000);
```
