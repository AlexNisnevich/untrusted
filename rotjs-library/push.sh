#!/bin/sh

hg bookmark -f master
hg bookmark -f gh-pages
hg push github
hg push -B master -B gh-pages
