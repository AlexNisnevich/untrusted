
// Editor object

function createEditor(domElemId, levelCode, width, height) {
	var ed = CodeMirror.fromTextArea(document.getElementById(domElemId), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function (instance) {
			var cursorPos = instance.getCursor();
			cursorPos.line++;
			instance.setCursor(cursorPos);
		}}
	});

	ed.setSize(width, height); //TODO this line causes wonky cursor behavior, might be a bug in CodeMirror?
	ed.setValue(levelCode);

	ed.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	this.editableLines = [];
	if (levelCode && levelCode != '') {
		// get editable line ranges from level metadata
		var levelMetadata = levelCode.split('\n')[0];
		var editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable;
		for (var j = 0; j < editableLineRanges.length; j++) {
			range = editableLineRanges[j];
			for (var i = range[0]; i <= range[1]; i++) {
				this.editableLines.push(i - 1);
			}
		}
		ed.removeLine(0);

		// beforeChange event handler handles editing restrictions
		ed.on('beforeChange', function (instance, change) {
			if (this.editableLines.indexOf(change.to.line) == -1) {
				// only allow editing on editable lines
				change.cancel();
				return;
			} else if (change.origin == '+delete') {
				// don't allow multi-line deletion
				if (change.to.line != change.from.line) {
					change.cancel();
				}
			} else { // change.origin is '+input' or 'paste'
				// don't allow multi-line paste - only paste first line
				if (change.text.length > 1) {
					change.text = [change.text[0]]
				}

				// enforce 80-char limit
				var lineLength = instance.getLine(change.to.line).length;
				if (lineLength + change.text[0].length > 80) {
					var allowedLength = Math.max(80 - lineLength, 0)
					change.text[0] = change.text[0].substr(0, allowedLength);
				}
			}
			console.log(change);
		});

		// set bg color for uneditable lines
		ed.on('update', function (instance) {
			for (var i = 0; i < instance.lineCount(); i++) {
				if (this.editableLines.indexOf(i) == -1) {
					instance.addLineClass(i, 'wrap', 'disabled');
				}
			}
		});
		ed.refresh();
	}

	return ed;
};

// editor.getPlayerCode returns only the code written in editable lines
CodeMirror.prototype.getPlayerCode = function () {
	var code = '';
	for (var i = 0; i < this.lineCount(); i++) {
		if (this.editableLines && this.editableLines.indexOf(i) > -1) {
			code += game.editor.getLine(i) + ' \n';
		}
	}
	return code;
}
