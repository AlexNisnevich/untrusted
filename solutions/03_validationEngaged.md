## amahdy: Put-em away

```javascript
    for (y = 10; y <= map.getHeight() - 3; y++) {
        map.placeObject(0, y, 'block');
        map.placeObject(1, y, 'block');
    }
    
    for (x = 5; x <= map.getWidth() - 5; x++) {
        map.placeObject(x, 0, 'block');
        map.placeObject(x, 1, 'block');
    }
```
