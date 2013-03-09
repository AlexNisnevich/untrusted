/**
 * @class Asynchronous main loop
 */
ROT.Engine = function() {
	this._scheduler = new ROT.Scheduler();
	this._lock = 1;
}

/**
 * @param {object} actor Anything with "getSpeed" and "act" methods
 */
ROT.Engine.prototype.addActor = function(actor) {
	this._scheduler.add(actor);
	return this;
}

/**
 * Remove a previously added actor
 * @param {object} actor
 */
ROT.Engine.prototype.removeActor = function(actor) {
	this._scheduler.remove(actor);
	return this;
}

/**
 * Remove all actors
 */
ROT.Engine.prototype.clear = function() {
	this._scheduler.clear();
	return this;
}

/**
 * Start the main loop. When this call returns, the loop is locked.
 */
ROT.Engine.prototype.start = function() {
	return this.unlock();
}

/**
 * Interrupt the engine by an asynchronous action
 */
ROT.Engine.prototype.lock = function() {
	this._lock++;
}

/**
 * Resume execution (paused by a previous lock)
 */
ROT.Engine.prototype.unlock = function() {
	if (!this._lock) { throw new Error("Cannot unlock unlocked engine"); }
	this._lock--;

	while (!this._lock) {
		var actor = this._scheduler.next();
		if (!actor) { return this.lock(); } /* no actors */
		actor.act();
	}

	return this;
}
