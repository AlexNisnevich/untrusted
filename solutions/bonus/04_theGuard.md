# 04_theGuard.md

## Jail the Guard
Put blocks around the guard
```javascript
map.placeObject(half_width+1, half_height-1,'block');
map.placeObject(half_width+2, half_height-1,'block');
map.placeObject(half_width+3, half_height-1,'block');
map.placeObject(half_width+1, half_height,'block');
map.placeObject(half_width+3, half_height,'block');
map.placeObject(half_width+1, half_height+1,'block');
map.placeObject(half_width+2, half_height+1,'block');
map.placeObject(half_width+3, half_height+1,'block');
```

## Sneak away
This level can be solved with no code changes using an approach similar to that found in [06_drones101.md](https://github.com/AlexNisnevich/untrusted/blob/master/solutions/06_drones101.md#3-0663651---single-block), with the eye replacing the single block.
  
  
