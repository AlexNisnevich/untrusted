# labryinth.md
## kedilayanaveen10: Solve each piece of the puzzle!
This level can be broken down into multiple small tasks. Solve each of them independently and get past the level.

1. Get past the initial ice.
2. Escape the gravity outside.
3. Reach the water.
4. Cross the water.
5. Escape the zombies.
6. Get the yellow key and reach the next chamber (escape the ice again).
7. Get the blue key and exit.


Solutions for each step:
1. Place an invisible boulder to stop sliding just before the ice ends. (Place it at (1,10))
2. Place invisible boulders till the teleporter in the middle of the map. (Place from (3,14) -> (26,14))
3. Now you reach the teleporter. Go inside it and enter again into the teleporter from where you exited to reach the water compartment.
4. Again place invisible boulders to stop falling into the water. (Place from (27,14) -> (38,14) skipping the place where a boulder already exists)
5. Move the zombies left whenever possible and create a passage along the right. (Place a boulder on top of the first zombie to make it possible for other zombies to move left)
6. Remove the code which adds the boulder here.
7. Remove the code which adds the boulders blocking the path (Remember not to remove all the boulders. One boulder is needed to cross the water)

Code:
Zombie behaviour:
```javascript
var player = map.getPlayer();
var x = player.getX();
var y = player.getY();
/*Hint: There is a me.canMove method for zombies, for example if me.canMove('right')
is true, then it means that the zombie is able to move right at that specific point in time
//Hint 2: You can specify where the zombie will move with ex: me.move('right')
*/
if(x > 40 && x < 45){
  if(y >= 13){
    //make the zombies move left to clear out way for player
    if(me.canMove('left'))
      me.move('left');
    else
      moveToward(me, 'player');
  }
}
```

Placing boulders and invisible boulders:
```javascript
//do not remove this boulder; it is needed to cross water
map.placeObject(30, 14, 'boulder');

//place invisible boulders to reach the teleporter near water
//and cross water
map.placeObject(1,10,'invisibleBoulder');
for(var i=3; i<=38; i++)
{
  if(i==27 || i==28 || i==30)
    continue;
  map.placeObject(i,14,'invisibleBoulder');
}

//place boulder above a zombie to make them go left
map.placeObject(map.getWidth()-9,map.getHeight()-2,'boulder');
```
