#BEGIN_PROPERTIES#
{
    "version": "1.2",
    "music": "Comme Des Orages"
}
#END_PROPERTIES#

/*******************
 * endOfTheLine.js *
 *******************
 *
 * I don't feel guilty at all, Cornelius.
 *
 * Did you really expect me to? Did you really think that
 * you could be trusted with coauthorship on the paper that
 * would prove P = NP in the eyes of the world?
 *
 * You're a very pure researcher, my good Doctor. "Department
 * of Theoretical Computation", divorced from the realities
 * of the world. I don't think you ever considered the
 * implications - the *physical* implications - of the
 * Algorithm. What humanity might do if it was as easy to
 * solve an intractable puzzle as it was to conceive of it.
 *
 * We would become as unto Gods, Cornelius, if this knowledge
 * was public. Immature children wielding power unimaginable.
 * We've already had one Oppenheimer - we don't need Dr.
 * Cornelius Eval to be another.
 *
 * If I had succeeded the Algorithm would be safe and secure
 * in the hands of those with the sound judgement and sense
 * of responsibility to use it wisely. I pray my failure
 * will not doom mankind - but I cannot hope so
 * optimistically.
 *
 * You may have defeated my robot form, but I anticipated
 * this eventuality. The Algorithm must never leave the
 * Machine Continuum. And so neither can you.
 *
 * This is bigger than me and bigger than you. I have no
 * regrets. I would do it again in an instant.
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.finalLevel = true;
    map.placePlayer(15, 12);
    map.placeObject(25, 12, 'exit');
#END_OF_START_LEVEL#
}
