# AB_2_FrozenCave.md
## kedilayanaveen10: More boulders!
Add a wall of boulders along the exit. All you have to do is reach that wall and drop down to the exit (will need a bit of thinking to reach that wall)
```javascript
for(var y=0; y<8; y++)
{
	map.placeObject(map.getWidth()-8,y,'boulder');	//place a wall along the right of the exit
	//map.placeObject(map.getWidth()-10,y,'boulder'); -> to place the wall along the left of the exit. choose whichever is easier
}
```
