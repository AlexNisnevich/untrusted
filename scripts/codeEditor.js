

function CodeEditor(textAreaDomID, codeString, width, height) {

	this.internalEditor = CodeMirror.fromTextArea(document.getElementById(textAreaDomID), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function (instance) { //increments the line by one without inserting anything
			var cursorPos = instance.getCursor();
			cursorPos.line++;
			instance.setCursor(cursorPos);
		}}
	});

}
