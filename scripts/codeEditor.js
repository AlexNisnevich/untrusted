function CodeEditor(textAreaDomID, width, height) {
    var symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'begin_char':"#{#",
        'end_char': "#}#"
    };

    var charLimit = 80;

    var editableLines = [];

    function setEditableLines(codeString) {
        editableLines = [];
        var lineArray = codeString.split("\n");

        var inEditableBlock = false;

        for (var i = 0; i < lineArray.length; i++) {
            var currentLine = lineArray[i];
            if (currentLine.indexOf(symbols.begin_line) === 0) {
                lineArray.splice(i,1); // be aware that this *mutates* the list
                i--;
                inEditableBlock = true;
            }
            else if (currentLine.indexOf(symbols.end_line) === 0) {
                lineArray.splice(i,1);
                i--;
                inEditableBlock = false;
            }
            else {
                if (inEditableBlock) {
                    editableLines.push(i+1);// the +1 is to convert from 0-based to 1-based line numbering
                }
            }
        }

        //console.log("Editable Lines: " + editableLines);
        return lineArray.join("\n");
    }

    //TODO
    function setEditableSections(codeString) {
        return codeString;
    }

    /* begining of initialization code */

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

    // implements yellow box when changing focus
    this.internalEditor.on("focus", function(instance) {
        $('.CodeMirror').addClass('focus');
        $('#screen canvas').removeClass('focus');
    });
    this.internalEditor.setSize(width,height);

    // set bg color for uneditable lines
    this.internalEditor.on('update', function (instance) {
        for (var i = 0; i < instance.lineCount(); i++) {
            if (editableLines.indexOf(i + 1) == -1) {
                instance.addLineClass(i, 'wrap', 'disabled');
            }
        }
    });

    /* end of initialization code */

    //this function enforces editing restrictions
    //when set to 'beforeChange' on the editor
    function enforceRestrictions(instance, change) {
        function notInEditableArea(c) {
            var lineNum = c.to.line + 1;
            return (editableLines.indexOf(lineNum) === -1);
        }

        if (notInEditableArea(change)) {
            change.cancel();
        }
        else if (change.to.line !== change.from.line) {
            // don't allow multi-line deletion
            change.cancel();
        }
        else {
            // don't allow multi-line paste - only paste first line
            if (change.text.length > 1) {
                change.text = [change.text[0]];
            }

            // enforce 80-char limit
            var lineLength = instance.getLine(change.to.line).length;
            if (lineLength + change.text[0].length > charLimit) {
                var allowedLength = Math.max(charLimit - lineLength, 0);
                change.text[0] = change.text[0].substr(0, allowedLength);
            }
        }
    }

    this.loadCode = function(codeString) {
        this.internalEditor.off('beforeChange',enforceRestrictions);

        /*
         * logic: before setting the value of the editor to the code string,
         * we run it through setEditableLines and setEditableSections, which
         * strip our notation from the string and as a side effect build up
         * a data structure of editable areas
         */
        codeString = setEditableLines(codeString);
        codeString = setEditableSections(codeString);

        this.internalEditor.setValue(codeString);
        this.internalEditor.on('beforeChange', enforceRestrictions);

        this.internalEditor.refresh();
    };

    // returns all contents
    this.getCode = function () {
        return this.internalEditor.getValue();
    }

    // returns only the code written in editable lines
    this.getPlayerCode = function () {
        var code = '';
        for (var i = 0; i < this.internalEditor.lineCount(); i++) {
            if (editableLines && editableLines.indexOf(i) > -1) {
                code += this.internalEditor.getLine(i) + ' \n';
            }
        }
        return code;
    };

    this.refresh = function () {
        this.internalEditor.refresh();
    }

    this.focus = function () {
        this.internalEditor.focus();
    }
}
