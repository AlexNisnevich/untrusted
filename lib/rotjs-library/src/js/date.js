if (!Date.now) { 
	/**
	 * @returns {int} Current timestamp (msec)
	 */
	Date.now = function() { return +(new Date); } 
}
