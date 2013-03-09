/**
 * @class Speed-based scheduler
 */
ROT.Scheduler = function() {
	this._items = [];
}

/**
 * @param {object} item anything with "getSpeed" method
 */
ROT.Scheduler.prototype.add = function(item) {
	var o = {
		item: item,
		bucket: 1/item.getSpeed()
	}
	this._items.push(o);
	return this;
}

/**
 * Clear all actors
 */
ROT.Scheduler.prototype.clear = function() {
	this._items = [];
	return this;
}

/**
 * Remove a previously added item
 * @param {object} item anything with "getSpeed" method
 */
ROT.Scheduler.prototype.remove = function(item) {
	var it = null;
	for (var i=0;i<this._items.length;i++) {
		it = this._items[i];
		if (it.item == item) { 
			this._items.splice(i, 1); 
			break;
		}
	}
	return this;
}

/**
 * Schedule next actor
 * @returns {object}
 */
ROT.Scheduler.prototype.next = function() {
	if (!this._items.length) { return null; }

	var minBucket = Infinity;
	var minItem = null;

	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		if (item.bucket < minBucket) {
			minBucket = item.bucket;
			minItem = item;
		} else if (item.bucket == minBucket && item.item.getSpeed() > minItem.item.getSpeed()) {
			minItem = item;
		}
	}
	
	if (minBucket) { /* non-zero value; subtract from all buckets */
		for (var i=0;i<this._items.length;i++) {
			var item = this._items[i];
			item.bucket = Math.max(0, item.bucket - minBucket);
		}
	}
	
	minItem.bucket += 1/minItem.item.getSpeed();
	return minItem.item;
}
