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
  
  
