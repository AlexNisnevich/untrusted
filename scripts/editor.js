
// Editor object

var createEditor = function (domElemId, levelCode, width, height) {
	var ed = CodeMirror.fromTextArea(document.getElementById(domElemId), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function () {}}
	});

	ed.setSize(width, height); //TODO this line causes wonky cursor behavior, might be a bug in CodeMirror?
	ed.setValue(levelCode);
	ed.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	return ed;
};
