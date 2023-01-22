# levelName.md
## kedilayanaveen10: No one changes my colour!!!
Replace the setColor() function of the player and then the door won't be able to change it
```javascript
map.getPlayer().setColor = function(){}
```
## Pppery: ... or you can but I can change it back:
```
map.overrideKey("down",function() {
    map.getPlayer().move("down");
    map.getPlayer().setColor("#0f0");
});
```
