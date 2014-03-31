
})();

// prevent ctrl+R and F5
$(document).bind('keydown keyup', function(e) {
    if(e.which === 116) {
       return false;
    }
    if(e.which === 82 && e.ctrlKey) {
       return false;
    }
});

console.log("%cIf you can read this, you are cheating! D:", "color: red; font-size: x-large");
