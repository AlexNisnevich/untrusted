# pushme.md
## kedilayanaveen10: Lure into the trap!
This level is more of a puzzle solving than finding bugs in code.  
  
Make the "box" object pushable.  
This is all the coding needed in this level.  

Remove each layer of the box one by one leaving only the last layer. (We need to do one more thing before we free the drones)  
Move the boxes around one corner of the remaining layer creating a boxed trap. (Make sure the trap is deep enough so that the drones won't have enough time to get out of it).  
Remove ONE box and bait the drones into the trap. Make sure you are out of the trap and the drones are in.  
Once few drones are out, you have to lure the other drones out too without entering inside.  
Lure the drones deep into the trap and move around it and open up another place for the exit and move in.  
```javascript
map.defineObject('box', {
    'pushable': true, 
    'type': 'dynamic',
    'symbol': '▣',
    'behavior': null
});
```
