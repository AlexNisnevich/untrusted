    ## Allow free movement
    Override the timer above with another timer 8 times faster that allows you to move freely through ice
    
    var player = map.getPlayer();
    map.startTimer(function() {
    	savedDirection = null;
        map.overrideKey('up', function(){
        	player.move('up');
        });
        map.overrideKey('down', function(){
        	player.move('down');
        });
        map.overrideKey('left', function(){
        	player.move('left');
        });
        map.overrideKey('right', function(){
        	player.move('right');
        });
    },25);
