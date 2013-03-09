var Syntax = {
	base: "", /* base path */
	tab: "    ",
	
	_registry: {},
	_todo: {},

	/* apply to all elements */
	all: function() { 
		var all = document.getElementsByTagName("*");
		var todo = [];
		for (var i=0;i<all.length;i++) {
			var node = all[i];
			if (node.getAttribute("data-syntax")) { todo.push(node); }
		}
		
		while (todo.length) { this.apply(todo.shift()); }
	},
	
	/* apply to one element */
	apply: function(node) {
		var syntax = node.getAttribute("data-syntax");
		if (syntax in this._registry) { /* apply */
			this._process(node, syntax);
		} else { /* defer */
			if (!(this._todo[syntax])) { /* append syntax script */
				this._todo[syntax] = [];
				this._append(syntax);
			}
			this._todo[syntax].push(node);
		}
	},

	/* register new patterns */
	register: function(name, patterns) {
		this._registry[name] = patterns;
	},
	
	init: function() {
		var scripts = document.getElementsByTagName("script");
		for (var i=0;i<scripts.length;i++) {
			var s = scripts[i];
			var r = s.src.match(/^(.*)syntax\.js$/);
			if (r) { this.base = r[1]; }
		}
	},
	
	/* apply a set of patterns to a node */
	_process: function(node, syntax) {
		var patterns = this._registry[syntax];
		node.className += " syntax-"+syntax;

		var code = "";
		/* IE normalizes innerHTML; need to get text content via nodeValues */
		for (var i=0;i<node.childNodes.length;i++) { code += node.childNodes[i].nodeValue || ""; }
		
		code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

		for (var i=0;i<patterns.length;i++) {
			var pattern = patterns[i];
			var index = pattern.index;
			var replacement = "";
			if (index > 1) { 
				for (var j=1;j<index;j++) { replacement += "$"+j; }
			}
			replacement += "<span class='"+pattern.token+"'>$"+index+"</span>";
			
			code = code.replace(pattern.re, replacement);
		}
		
		code = code.replace(/\t/g, this.tab);

		if (node.outerHTML) { /* IE hack; innerHTML normalizes whitespace */
			node.innerHTML = "";
			
			var tmp = document.createElement("div");
			tmp.style.display = "none";
			document.body.insertBefore(tmp, document.body.firstChild);
			
			var pre = document.createElement("pre");
			tmp.appendChild(pre);
			pre.outerHTML = "<pre>" + code + "</pre>";
			
			while (tmp.firstChild.firstChild) { node.appendChild(tmp.firstChild.firstChild); }
			tmp.parentNode.removeChild(tmp);
		} else {
			node.innerHTML = code;
		}
	},
	
	_append: function(syntax) {
		var s = document.createElement("script");
		s.src = this.base + "syntax-"+syntax+".js";
		
		var thisp = this;
		var loaded = function() { thisp._loaded(); }
		
		if (s.addEventListener) {
			s.addEventListener("load", loaded, false);
		} else {
			s.attachEvent("onreadystatechange", loaded);
		}

		document.body.insertBefore(s, document.body.firstChild);
	},
	
	_loaded: function() {
		for (var syntax in this._registry) {
			if (!(syntax in this._todo)) { continue; }
			while (this._todo[syntax].length) {
				this._process(this._todo[syntax].shift(), syntax);
			}
			delete this._todo[syntax];
		}
	}
};

Syntax.init();

