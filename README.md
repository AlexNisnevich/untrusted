**Untrusted —or— the Continuing Adventures of Dr. Eval** is an exciting
Meta-Javascript Adventure Game wherein you guide the dashing, steadfast
Dr. Eval through a mysterious MACHINE CONTINUUM, wherein, using only
his trusty computer and the TURING-COMPLETE power of Javascript, he must
literally ALTER HIS REALITY in order to find his freedom! You must literally
edit and re-execute the very Javascript running the game in your browser to
save Dr. Eval from this dark and confusing reality!

### Overview

The game presents you with a roguelike-like playing environment (powered
by the rot.js library) and a console window with the JavaScript code generating
each level. As loaded, each level is unbeatable, and most of the JavaScript is blocked
from editing. The challenge is to open a path to the next level using only the limited
tools left open to you.

### Development

Run
```
make
```
to merge the JavaScript files into `scripts/build/untrusted.js` (and enables debug features).

```
make release
```
merges and minifies the JavaScript files into `scripts/build/untrusted.min.js` (and disables debug features).

To run the game locally, you need to set up a local server to serve `index.html` (this step is necessary due to Access-Control-Allow-Origin restrictions).

First install [http-server](https://github.com/nodeapps/http-server/#installing-globally) if you haven't already:

```
npm install http-server
```

Then run:

```
make runlocal
```

### Acknowledgements

Untrusted is a game by [Alex Nisnevich](http://alex.nisnevich.com/) and [Greg Shuflin](https://github.com/neunenak).

We'd like to thank:

- [Dmitry Mazin](https://github.com/dmazin) for design assistance and for the implementation of multiline editing
- [Jordan Arnesen](https://github.com/extrajordanary) for playtesting and design of lvl17
- [Natasha Hull-Richter](http://nhull.com) for extensive playtesting and assistance in level design
- Alex Bolotov, Colin Curtin, Conrad Irwin, Devin C-R, Eugene Evans, Gilbert Hsyu, Jacob Nisnevich, James Silvey, Jason Jiang, Jimmy Hack, Philip Shao, Ryan Fitzgerald, Stephen Liu, Yayoi Ukai, and Yuval Gnessin for playtesting and feedback
- [Ondřej Žára](https://github.com/ondras) for his excellent [rot.js](http://ondras.github.io/rot.js/) library
- [Brian Harvey](http://www.cs.berkeley.edu/~bh/) for allowing us to use his likeness in lvl19

#### Soundtrack

The music that appears in the game, in order, is:

- "The Green" - Jonathan Holliday (used with permission)
- "Dmitry's Thing #2" - Dmitry Mazin (written for Untrusted)
- "Obscure Terrain" - Revolution Void (CC-BY-NC-SA)
- "coming soon" - Fex (public domain)
- "cloudy sin" - intricate (used with permission)
- "Dynamic Punctuality" - Dmitry Mazin (written for Untrusted)
- "Y" - Tortue Super Sonic (CC-BY-NC-SA)
- "Night Owl" - Broke for Free (CC-BY)
- "The Waves Call Her Name" - Sycamore Drive (CC-BY-NC-SA)
- "Come and Find Me - B mix" - Eric Skiff (CC-BY)
- "Conspiracy" - Mike and Alan (used with permission)
- "Messeah" - RoccoW (CC-BY)
- "Searching" - Eric Skiff (CC-BY)
- "Da Funk Do You Know 'bout Chip?" - That Andy Guy (used with permission)
- "Soixante-8" - Obsibilo (CC-BY-NC-SA)
- "Tart (Pts 1 and 2)" - BLEO (CC-BY-NC-SA)
- "Beach Wedding Dance" - Rolemusic (CC-BY-NC-SA)
- "Boss Loop 1" - Essa (free to use)
- "Adversity" - Seropard (free to use)
- "Comme Des Orages" - Obsibilo (CC-BY-NC-SA)
- "Brazilicon Alley" - Vernon Lenoir (CC-BY-NC-SA)

### License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.
