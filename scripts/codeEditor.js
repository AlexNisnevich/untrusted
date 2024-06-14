function CodeEditor(textAreaDomID, width, height, game) {
    var symbols = {
        'begin_line':'#BEGIN_EDITABLE#',
        'end_line':'#END_EDITABLE#',
        'begin_char':"#{#",
        'end_char': "#}#",
        'begin_properties':'#BEGIN_PROPERTIES#',
        'end_properties':'#END_PROPERTIES#',
        'start_start_level':'#START_OF_START_LEVEL#',
        'end_start_level':'#END_OF_START_LEVEL#'
    };

    var charLimit = 80;

    var properties = {};
    var editableLines = [];
    var editableSections = {};
    var lastChange = {};
    var startOfStartLevel = null;
    var endOfStartLevel = null;

    this.setEndOfStartLevel = function (eosl) {
        endOfStartLevel = eosl;
    }

    this.setEditableLines = function (el) {
        editableLines = el;
    }

    this.setEditableSections = function (es) {
        editableSections = es;
    }

    // for debugging purposes
    log = function (text) {
        if (game._debugMode) {
            console.log(text);
        }
    }

    // preprocesses code,determines the location
    // of editable lines and sections, loads properties
    function preprocess(codeString) {
        editableLines = [];
        editableSections = {};
        endOfStartLevel = null;
        startOfStartLevel = null;
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
            // process start of startLevel()
              else if (currentLine.indexOf(symbols.start_start_level) === 0) {
                lineArray.splice(i,1);
                startOfStartLevel = i;
                i--;
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

        try {
            properties = JSON.parse(propertiesString);
        } catch (e) {
            properties = {};
        }

        return lineArray.join("\n");
    }

    var findEndOfSegment = function(line) {
        // Given an editable line number, returns the last line of the
        // given line's editable segment.

        if (editableLines.indexOf(line + 1) === -1) {
            return line;
        }

        return findEndOfSegment(line + 1);
    };

    var shiftLinesBy = function(array, after, shiftAmount) {
        // Shifts all line numbers strictly after the given line by
        // the provided amount.

        return array.map(function(line) {
            if (line > after) {
                log('Shifting ' + line + ' to ' + (line + shiftAmount));
                return line + shiftAmount;
            }
            return line;
        });
    };

    // enforces editing restrictions when set as the handler
    // for the 'beforeChange' event
    var enforceRestrictions = function(instance, change) {
        lastChange = change;

        var inEditableArea = function(c) {
            var lineNum = c.to.line;
            if (editableLines.indexOf(lineNum) !== -1 && editableLines.indexOf(c.from.line) !== -1) {
                // editable lines?
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
        };

        log(
            '---Editor input (beforeChange) ---\n' +
            'Kind: ' + change.origin + '\n' +
            'Number of lines: ' + change.text.length + '\n' +
            'From line: ' + change.from.line + '\n' +
            'To line: ' + change.to.line
        );

        if (!inEditableArea(change)) {
            change.cancel();
        } else if (change.to.line < change.from.line ||
                   change.to.line - change.from.line + 1 > change.text.length) { // Deletion
            updateEditableLinesOnDeletion(change);
        } else { // Insert/paste
            // First line already editable
            var newLines = change.text.length - (change.to.line - change.from.line + 1);

            if (newLines > 0) {
                if (editableLines.indexOf(change.to.line) < 0) {
                    change.cancel();
                    return;
                }

                // enforce 80-char limit by wrapping all lines > 80 chars
                var wrappedText = [];
                change.text.forEach(function (line) {
                    while (line.length > charLimit) {
                        // wrap lines at spaces if at all possible
                        var minCutoff = charLimit - 20;
                        var cutoff = minCutoff + line.slice(minCutoff).indexOf(" ");
                        if (cutoff > 80) {
                            // no suitable cutoff point found - let's get messy
                            cutoff = 80;
                        }
                        wrappedText.push(line.substr(0, cutoff));
                        line = line.substr(cutoff);
                    }
                    wrappedText.push(line);
                });
                change.text = wrappedText;

                // updating line count
                newLines = change.text.length - (change.to.line - change.from.line + 1);

                updateEditableLinesOnInsert(change, newLines);
            } else {
                // enforce 80-char limit by trimming the line
                var lineLength = instance.getLine(change.to.line).length;
                if (lineLength + change.text[0].length > charLimit) {
                    var allowedLength = Math.max(charLimit - lineLength, 0);
                    change.text[0] = change.text[0].substr(0, allowedLength);
                }
            }

            // modify editable sections accordingly
            // TODO Probably broken by multiline paste
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

        log(editableLines);
    }

    var updateEditableLinesOnInsert = function(change, newLines) {
        var lastLine = findEndOfSegment(change.to.line);

        // Shift editable line numbers after this segment
        editableLines = shiftLinesBy(editableLines, lastLine, newLines);

        // TODO If editable sections appear together with editable lines
        // in a level, multiline edit does not properly handle editable
        // sections.

        log("Appending " + newLines + " lines");

        // Append new lines
        for (var i = lastLine + 1; i <= lastLine + newLines; i++) {
            editableLines.push(i);
        }

        // Update endOfStartLevel
        if (endOfStartLevel) {
            endOfStartLevel += newLines;
        }
    };

    var updateEditableLinesOnDeletion = function(changeInput) {
        // Figure out how many lines just got removed
        var numRemoved = changeInput.to.line - changeInput.from.line - changeInput.text.length + 1;
        // Find end of segment
        var editableSegmentEnd = findEndOfSegment(changeInput.to.line);
        // Remove that many lines from its end, one by one
        for (var i = editableSegmentEnd; i > editableSegmentEnd - numRemoved; i--) {
            log('Removing\t' + i);
            editableLines.remove(i);
        }
        // Shift lines that came after
        editableLines = shiftLinesBy(editableLines, editableSegmentEnd, -numRemoved);
        // TODO Shift editableSections

        // Update endOfStartLevel
        if (endOfStartLevel) {
            endOfStartLevel -= numRemoved;
        }
    };

    // beforeChange events don't pick up undo/redo
    // so we track them on change event
    var trackUndoRedo = function(instance, change) {
        if (change.origin === 'undo' || change.origin === 'redo') {
            enforceRestrictions(instance, change);
        }
    }

    this.initialize = function() {
        this.internalEditor = CodeMirror.fromTextArea(document.getElementById(textAreaDomID), {
            theme: 'vibrant-ink',
            lineNumbers: true,
            dragDrop: false,
            smartIndent: false
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

        this.internalEditor.on('cursorActivity', function (instance) {
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

        this.internalEditor.on('change', markEditableSections);
        this.internalEditor.on('change', trackUndoRedo);
    }

    // loads code into editor
    this.loadCode = function(codeString) {
        /*
         * logic: before setting the value of the editor to the code string,
         * we run it through setEditableLines and setEditableSections, which
         * strip our notation from the string and as a side effect build up
         * a data structure of editable areas
         */

        this.internalEditor.off('beforeChange', enforceRestrictions);
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
    var markEditableSections = function(instance) {
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

        if (!forSaving && startOfStartLevel) {
            // insert the end of startLevel() marker at the appropriate location
            lines.splice(startOfStartLevel, 0, "map._startOfStartLevelReached()");
        }

        if (!forSaving && endOfStartLevel) {
            // insert the end of startLevel() marker at the appropriate location
            lines.splice(endOfStartLevel+1, 0, "map._endOfStartLevelReached()");
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
        // make sure we're not saving the hidden START/END_OF_START_LEVEL lines
        code = code.split('\n').filter(function (line) {
            return line.indexOf('OfStartLevelReached') < 0;
        }).join('\n');

        this.internalEditor.off('beforeChange',enforceRestrictions);
        this.internalEditor.setValue(code);
        this.internalEditor.on('beforeChange', enforceRestrictions);
        this.markUneditableLines();
        this.internalEditor.refresh();
        this.internalEditor.clearHistory();
    }

    this.saveGoodState = function () {
        var lvlNum = game._currentFile ? game._currentFile : game._currentLevel;
        localStorage.setItem(game._getLocalKey('level' + lvlNum + '.lastGoodState'), JSON.stringify({
            code: this.getCode(true),
            playerCode: this.getPlayerCode(),
            editableLines: editableLines,
            editableSections: editableSections,
            endOfStartLevel: endOfStartLevel,
            version: this.getProperties().version
        }));
    }

    this.createGist = function () {
        var lvlNum = game._currentLevel;
        var filename = 'untrusted-lvl' + lvlNum + '-solution.js';
        var description = 'Solution to level ' + lvlNum + ' in Untrusted: http://alex.nisnevich.com/untrusted/';
        var data = {
            'files': {},
            'description': description,
            'public': true
        };
        data['files'][filename] = {
            'content': this.getCode(true).replace(/\t/g, '    ')
        };

        var t = 'NTg4NmM5YWQ3N2U4ZTNhNTljZjIzNWFhYmE2YzZiNGFkODJiYjQ0Nw==';
        $.ajax({
            'url': 'https://api.github.com/gists',
            'type': 'POST',
            'data': JSON.stringify(data),
            'headers': { 'Authorization': 'token ' + atob(t) },
            'success': function (data, status, xhr) {
                $('#savedLevelMsg').html('Level ' + lvlNum + ' solution saved at <a href="'
                    + data['html_url'] + '" target="_blank">' + data['html_url'] + '</a>');
            }
        });
    }

    this.getGoodState = function (lvlNum) {
        return JSON.parse(localStorage.getItem(game._getLocalKey('level' + lvlNum + '.lastGoodState')));
    }

    this.refresh = function () {
        this.internalEditor.refresh();
    }

    this.focus = function () {
        this.internalEditor.focus();
    }

    this.initialize(); // run initialization code
}
