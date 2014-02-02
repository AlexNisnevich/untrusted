function CodeEditor(textAreaDomID, width, height, game) {
    var symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'begin_char':"#{#",
        'end_char': "#}#",
        'begin_properties':'#BEGIN_PROPERTIES#',
        'end_properties':'#END_PROPERTIES#',
        'end_start_level':'#END_OF_START_LEVEL#'
    };

    var charLimit = 80;

    var properties = {}
    var editableLines = [];
    var editableSections = {};
    var lastChange = {};
    var endOfStartLevel = null;

    // preprocesses code,determines the location
    // of editable lines and sections, loads properties
    function preprocess(codeString) {
        editableLines = [];
        editableSections = {};
        endOfStartLevel = null;
        var propertiesString = '';

        var lineArray = codeString.split("\n");
        var inEditableBlock = false;
        var inPropertiesBlock = false;

        for (var i = 0; i < lineArray.length; i++) {
            var currentLine = lineArray[i];

            // process properties
            if (currentLine.indexOf(symbols.begin_properties) === 0) {
                lineArray.splice(i,1); // be aware that this *mutates* the list
                i--;
                inPropertiesBlock = true;
            } else if (currentLine.indexOf(symbols.end_properties) === 0) {
                lineArray.splice(i,1);
                i--;
                inPropertiesBlock = false;
            } else if (inPropertiesBlock) {
                lineArray.splice(i,1);
                i--;
                propertiesString += currentLine;
            }
            // process editable lines and sections
              else if (currentLine.indexOf(symbols.begin_line) === 0) {
                lineArray.splice(i,1);
                i--;
                inEditableBlock = true;
            } else if (currentLine.indexOf(symbols.end_line) === 0) {
                lineArray.splice(i,1);
                i--;
                inEditableBlock = false;
            }
            // process end of startLevel()
              else if (currentLine.indexOf(symbols.end_start_level) === 0) {
                lineArray.splice(i,1);
                endOfStartLevel = i;
                i--;
            }
            // everything else
              else {
                if (inEditableBlock) {
                    editableLines.push(i);
                } else {
                    // check if there are any editable sections
                    var sections = [];
                    var startPoint = null;
                    for (var j = 0; j < currentLine.length - 2; j++) {
                        if (currentLine.slice(j,j+3) === symbols.begin_char) {
                            currentLine = currentLine.slice(0,j) + currentLine.slice(j+3, currentLine.length);
                            startPoint = j;
                        } else if (currentLine.slice(j,j+3) === symbols.end_char) {
                            currentLine = currentLine.slice(0,j) + currentLine.slice(j+3, currentLine.length);
                            sections.push([startPoint, j]);
                        }
                    }
                    if (sections.length > 0) {
                        lineArray[i] = currentLine;
                        editableSections[i] = sections;
                    }
                }
            }
        }

        properties = JSON.parse(propertiesString);

        return lineArray.join("\n");
    }

    // enforces editing restrictions when set as the handler
    // for the 'beforeChange' event
    function enforceRestrictions(instance, change) {
        lastChange = change;

        function inEditableArea(c) {
            //debugger;
            var lineNum = c.to.line;
            if (editableLines.indexOf(lineNum) > -1) {
                // editable line?
                return true;
            } else if (editableSections[lineNum]) {
                // this line has editable sections - are we in one of them?
                var sections = editableSections[lineNum];
                for (var i = 0; i < sections.length; i++) {
                    var section = sections[i];
                    if (c.from.ch > section[0] && c.to.ch > section[0] &&
                        c.from.ch < section[1] && c.to.ch < section[1]) {
                        return true;
                    }
                }
                return false;
            }
        }

        if (!inEditableArea(change)) {
            change.cancel();
        }
        else if (change.to.line !== change.from.line) {
            // don't allow multi-line deletion
            change.cancel();

            // unless it's pressing backspace at the start of a line
            // and the line above it is editable
            // and the current line text can fit on the line above it
            if (change.to.ch === 0
                    && change.from.line === (change.to.line - 1)
                    && change.from.ch === instance.getLine(change.from.line).length
                    && editableLines.indexOf(change.from.line) > -1
                    && instance.getLine(change.from.line).length
                        + instance.getLine(change.to.line).length < charLimit) {

                // move line up
                var lineContents = instance.getLine(change.from.line)
                    + instance.getLine(change.to.line);
                instance.setLine(change.from.line, '');
                instance.setLine(change.from.line, lineContents);
                instance.setLine(change.to.line, '');

                // move the cursor
                cursorPos = instance.getCursor();
                cursorPos.line--;
                cursorPos.ch += change.from.ch;
                instance.setCursor(cursorPos);

                // shift up all remaining lines in block
                var startLine = change.to.line;
                var currentLine = startLine;
                while (editableLines.indexOf(currentLine) > -1) {
                    currentLine++;
                }
                for (var i = startLine; i < currentLine - 1; i++) {
                    instance.setLine(i, '');
                    instance.setLine(i, instance.getLine(i + 1));
                    instance.setLine(i + 1, '');
                }
            }
        }
        else {
            // Hunt down last editable line in segment
            var findEndOfSegment = function(line) {
                if (editableLines.indexOf(line) !== -1) { // This line is editable
                    return findEndOfSegment(++line); // What about the next line?
                }

                return --line; // The previous line was the last editable one
            };

            var shiftLinesBy = function(array, after, shiftAmount) {
                return array.map(function(line) {
                    if (line > after) {
                        // Subtract 1 because 1 line was already editable
                        return line + shiftAmount;
                    }

                    return line;
                });
            };

            var pasteLength = change.text.length;
            if (pasteLength > 1) {
                var lastLine = findEndOfSegment(change.to.line);

                // Shift editable line numbers after this segment
                // Shift by pasteLength -1 because 1 was already editable
                editableLines = shiftLinesBy(editableLines, lastLine, pasteLength - 1);

                // Append new lines
                // Strict < because 1 line was already editable
                for (var i = lastLine + 1; i < lastLine + pasteLength; i++) {
                    editableLines.push(i);
                }
            }

            // enforce 80-char limit
            var lineLength = instance.getLine(change.to.line).length;
            if (lineLength + change.text[0].length > charLimit) {
                var allowedLength = Math.max(charLimit - lineLength, 0);
                change.text[0] = change.text[0].substr(0, allowedLength);
            }

            // modify editable sections accordingly
            // TODO Update for multiline paste
            var sections = editableSections[change.to.line];
            if (sections) {
                var delta = change.text[0].length - (change.to.ch - change.from.ch);
                for (var i = 0; i < sections.length; i++) {
                    // move any section start/end points that we are to the left of
                    if (change.to.ch < sections[i][1]) {
                        sections[i][1] += delta;
                    }
                    if (change.to.ch < sections[i][0]) {
                        sections[i][0] += delta;
                    }
                }
            }
        }
    }

    this.initialize = function() {
        this.internalEditor = CodeMirror.fromTextArea(document.getElementById(textAreaDomID), {
            theme: 'vibrant-ink',
            lineNumbers: true,
            dragDrop: false,
            smartIndent: false,
            extraKeys: {'Enter': function (instance) {
                cursorPos = instance.getCursor();

                // is this line in an editable block?
                if (editableLines.indexOf(cursorPos.line) > -1) {
                    // search for a blank line within the editable block
                    var currentLine = cursorPos.line + 1;
                    while (true) {
                        if (editableLines.indexOf(currentLine) === -1) {
                            // out of editable block
                            break;
                        } else if (instance.getLine(currentLine).trim() === '') {
                            // blank line found - shift lines down to it
                            for (var i = currentLine; i > cursorPos.line; i--) {
                                instance.setLine(i, '');
                                instance.setLine(i, instance.getLine(i - 1));
                            }

                            // split first line at cursor position
                            var firstLine = instance.getLine(cursorPos.line).slice(0, cursorPos.ch);
                            var secondLine = Array(cursorPos.ch + 1).join(" ")
                                + instance.getLine(cursorPos.line).slice(cursorPos.ch);
                            instance.setLine(cursorPos.line, '');
                            instance.setLine(cursorPos.line, firstLine);
                            instance.setLine(cursorPos.line + 1, '');
                            instance.setLine(cursorPos.line + 1, secondLine);
                            break;
                        }
                        currentLine++;
                    }
                }

                // move the cursor and smart-indent
                cursorPos.line++;
                instance.setCursor(cursorPos);
                if (instance.getLine(cursorPos.line).trim() === "") {
                    instance.indentLine(cursorPos.line, "prev");
                }
            }}
        });

        this.internalEditor.setSize(width, height);

        // set up event handlers

        this.internalEditor.on("focus", function(instance) {
            // implements yellow box when changing focus
            $('.CodeMirror').addClass('focus');
            $('#screen canvas').removeClass('focus');

            $('#helpPane').hide();
            $('#menuPane').hide();
        });

        this.internalEditor.on('cursorActivity',function (instance) {
            // fixes the cursor lag bug
            instance.refresh();

            // automatically smart-indent if the cursor is at position 0
            // and the line is empty (ignore if backspacing)
            if (lastChange.origin !== '+delete') {
                var loc = instance.getCursor();
                if (loc.ch === 0 && instance.getLine(loc.line).trim() === "") {
                    instance.indentLine(loc.line, "prev");
                }
            }
        });

        this.internalEditor.on('change', this.markEditableSections);
    }

    // loads code into editor
    this.loadCode = function(codeString) {
        /*
         * logic: before setting the value of the editor to the code string,
         * we run it through setEditableLines and setEditableSections, which
         * strip our notation from the string and as a side effect build up
         * a data structure of editable areas
         */

        this.internalEditor.off('beforeChange',enforceRestrictions);
        codeString = preprocess(codeString);
        this.internalEditor.setValue(codeString);
        this.internalEditor.on('beforeChange', enforceRestrictions);
        this.markUneditableLines();
        this.internalEditor.refresh();
        this.internalEditor.clearHistory();
    };

    // marks uneditable lines within editor
    this.markUneditableLines = function() {
        var instance = this.internalEditor;
        for (var i = 0; i < instance.lineCount(); i++) {
            if (editableLines.indexOf(i) === -1) {
                instance.addLineClass(i, 'wrap', 'disabled');
            }
        }
    }

    // marks editable sections inside uneditable lines within editor
    this.markEditableSections = function(instance) {
        $('.editableSection').removeClass('editableSection');
        for (var line in editableSections) {
            if (editableSections.hasOwnProperty(line)) {
                var sections = editableSections[line];
                for (var i = 0; i < sections.length; i++) {
                    var section = sections[i];
                    var from = {'line': parseInt(line), 'ch': section[0]};
                    var to = {'line': parseInt(line), 'ch': section[1]};
                    instance.markText(from, to, {'className': 'editableSection'});
                }
            }
        }
    }

    // returns all contents
    this.getCode = function (forSaving) {
        var lines = this.internalEditor.getValue().split('\n');

        if (!forSaving && endOfStartLevel) {
            // insert the end of startLevel() marker at the appropriate location
            lines.splice(endOfStartLevel, 0, "map._game._endOfStartLevelReached = true;");
        }

        return lines.join('\n');
    }

    // returns only the code written in editable lines and sections
    this.getPlayerCode = function () {
        var code = '';
        for (var i = 0; i < this.internalEditor.lineCount(); i++) {
            if (editableLines && editableLines.indexOf(i) > -1) {
                code += this.internalEditor.getLine(i) + ' \n';
            }
        }
        for (var line in editableSections) {
            if (editableSections.hasOwnProperty(line)) {
                var sections = editableSections[line];
                for (var i = 0; i < sections.length; i++) {
                    var section = sections[i];
                    code += this.internalEditor.getLine(line).slice(section[0], section[1]) + ' \n';
                }
            }
        }
        return code;
    };

    this.getProperties = function () {
        return properties;
    }

    this.setCode = function(code) {
        // make sure we're not saving the hidden END_OF_START_LEVEL line
        code = code.split('\n').filter(function (line) {
            return line.indexOf('_endOfStartLevelReached') < 0;
        }).join('\n');

        this.internalEditor.off('beforeChange',enforceRestrictions);
        this.internalEditor.setValue(code);
        this.internalEditor.on('beforeChange', enforceRestrictions);
        this.markUneditableLines();
        this.internalEditor.refresh();
        this.internalEditor.clearHistory();
    }

    this.saveGoodState = function () {
        localStorage.setItem('level' + game._currentLevel + '.lastGoodState', JSON.stringify({
            code: this.getCode(true),
            playerCode: this.getPlayerCode(),
            editableLines: editableLines,
            editableSections: editableSections
        }));
    }

    this.createGist = function () {
        var lvlNum = game._currentLevel;
        var filename = 'untrusted-lvl' + lvlNum + '-solution.js';
        var description = 'Solution to level ' + lvlNum + ' in Untrusted: http://alex.nisnevich.com/untrusted/';
        var data = {'files': {}, 'description': description};
        data['files'][filename] = {'content': this.getCode(true)};
        $.ajax({
            'url': 'https://api.github.com/gists',
            'type': 'POST',
            'data': JSON.stringify(data),
            'success': function (data, status, xhr) {
                $('#savedLevelMsg').html('Level ' + lvlNum + ' solution saved at <a href="'
                    + data['html_url'] + '" target="_blank">' + data['html_url'] + '</a>');
            }
        });
    }

    this.getGoodState = function (lvlNum) {
        return JSON.parse(localStorage.getItem('level' + lvlNum + '.lastGoodState'));
    }

    this.refresh = function () {
        this.internalEditor.refresh();
    }

    this.focus = function () {
        this.internalEditor.focus();
    }

    this.initialize(); // run initialization code
}
