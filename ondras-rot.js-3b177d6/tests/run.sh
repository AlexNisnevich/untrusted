#!/bin/sh

CWD=$(pwd)

cd ~/git/jasmine-reporters/test
java -cp ../ext/js.jar:../ext/jline.jar org.mozilla.javascript.tools.shell.Main -opt -1 envjs.bootstrap.js $CWD/index.html
