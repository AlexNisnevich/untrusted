Untrusted —or— the Continuing Adventures of Dr. Eval is an exciting
Javascript Adventure Game wherein you guide the dashing, steadfast
Dr. Eval through a mysterious MACHINE CONTINUUM, wherein, using only
his trusty computer and the TURING-COMPLETE power of Javascript, he must
literally ALTER HIS REALITY in order to find his freedom! You must literally
edit and re-execute the very Javascript running the game in your browser to
save Dr. Eval from this dark and confusing reality! (Not every line of code
is freely editable 'cause otherwise the game would be really really easy).

### Overview

The game presents you with a roguelike-like playing environment (powered
by the rot.js library) and a console window with the JavaScript code generating
each level. As loaded, each level is unbeatable, and most of the JavaScript is blocked
from editing. The challenge is to open a path to the next level using only the limited
tools left open to you.

### Building

Run
```
make
```
to generate the minified JS.

You can also define a pre-commit git hook by creating an executable file `.git/hooks/pre-commit` with the following contents:
```
#!/bin/sh
#

# Minify JavaScript, add to commit
make scripts/build/untrusted.js
git add scripts/build/untrusted.js
```

To run the game locally, you need to set up a local server. One easy way to do that is with Python's SimpleHTTPServer:
```
python -m SimpleHTTPServer
```
