$(document).ready(function() {
    new Game()._initialize();
    window.eval = {};
});

// prevent ctrl+R and F5
$(document).bind('keydown keyup', function(e) {
    if(e.which === 116) {
       return false;
    }
    if(e.which === 82 && e.ctrlKey) {
       return false;
    }
});
