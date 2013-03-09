var Example = function(node) {
	this._node = node;
	
	this._source = OZ.DOM.elm("pre", {className:"code"});
	this._source.setAttribute("data-syntax", "js");
	this._source.addEventListener("click", this);
	
	this._ta = OZ.DOM.elm("textarea", {className:"code"});
	this._ta.spellcheck = false;
	this._ta.addEventListener("click", this);
	
	this._result = OZ.DOM.elm("pre", {className:"result"});

	this._time = OZ.DOM.elm("div", {className:"time"});

	this._useCode(node.textContent);
}

Example.prototype.handleEvent = function(e) {
	e.stopPropagation();
	if (this.constructor.current != this) { this.open(); }
}

Example.prototype.open = function() {
	this.constructor.current = this;

	var height = OZ.Style.get(this._source, "height");
	this._ta.style.height = height;
	this._ta.value = this._source.textContent.trim();
	this._source.parentNode.replaceChild(this._ta, this._source);
	this._ta.focus();
}

Example.prototype.close = function() {
	this.constructor.current = null;
	var code = this._ta.value;
	this._useCode(code);
}

/**
 * @param {string} code no html entities, plain code
 */
Example.prototype._useCode = function(code) {
	this._node.innerHTML = "";
	this._result.innerHTML = "";
	this._source.innerHTML = "";
	this._node.appendChild(this._source);
	this._node.appendChild(this._result);
	this._node.appendChild(this._time);
	this._source.appendChild(OZ.DOM.text(code));
	Syntax.apply(this._source);
	
	var result = this._result;
	var show = function() { 
		for (var i=0;i<arguments.length;i++) {
			var arg = arguments[i];
			if (!arg.nodeType) {
				arg = OZ.DOM.elm("div", {innerHTML:arg});
			}
			result.appendChild(arg);
		}
	}

	var t1 = Date.now();
	this._eval(code, show);
	var t2 = Date.now();
	this._time.innerHTML = "executed in %{s}ms".format(t2-t1);
}

Example.prototype._eval = function(code, SHOW) {
	eval(code);
}

Example.current = null;
document.addEventListener("click", function() {
	if (Example.current) { Example.current.close(); }
}, false);


var Manual = {
	_hash: "",
	_hashChange: function(e) {
		var hash = location.hash || "intro";
		if (hash.charAt(0) == "#") { hash = hash.substring(1); }
		if (hash == this._hash) { return; }
		this._hash = hash;
		
		this._switchTo(this._hash);
	},
	
	_switchTo: function(what) {
		OZ.Request("pages/" + what + ".html?" + Math.random(), this._response.bind(this));
		
		var links = document.querySelectorAll("#menu a");
		for (var i=0;i<links.length;i++) {
			var link = links[i];
			if (link.href.lastIndexOf(what) == link.href.length - what.length) {
				OZ.DOM.addClass(link, "active");
				var parent = link.parentNode.parentNode.parentNode;
				if (parent.nodeName.toLowerCase() == "li") {
					OZ.DOM.addClass(parent.querySelector("a"), "active");
				}
			} else {
				OZ.DOM.removeClass(link, "active");
			}
		}
	},
	
	_response: function(data, status) {
		if (status != 200) { return; }
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		document.querySelector("#content").innerHTML = data;

		var all = document.querySelectorAll("#content .example");
		for (var i=0;i<all.length;i++) { new Example(all[i]); }
	},
	
	init: function() {
		var year = new Date().getFullYear();
		document.querySelector("#year").innerHTML = year;

		OZ.Request("../VERSION", function(data, status) {
			if (status != 200) { return; }
			document.querySelector("h1").innerHTML += "<span>v" + data.trim() + "</span>";
		});
		
		OZ.Event.add(window, "hashchange", this._hashChange.bind(this));
		this._hashChange();
	}
	
}

Manual.init();
