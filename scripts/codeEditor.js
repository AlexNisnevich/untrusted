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

        console.log("Editable Lines: " + editableLines);
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


    /* end of initialization code */
    
    //this function enforces editing restrictions
    //when set to 'beforeChange' on the editor
    function enforceRestrictions(instance, change) {

        function notInEditableArea(c) {
            return false;
        }

        if (notInEditableArea(change)) {
            change.cancel();
        }

        else if (change.origin === '+delete') {
            // don't allow multi-line deletion
            if (change.to.line !== change.from.line) {
                change.cancel();
            }
        } 
        else { // change.origin is '+input' or 'paste'
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
    };

    //TODO this needs to get only the lines of code that a player input
    this.getPlayerCode = function () { };
}
