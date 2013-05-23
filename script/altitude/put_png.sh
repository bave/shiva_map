#!/usr/bin/env sh

#for i in 0 1 3 5 7
for i in `seq 0 50`
do
    node ./put_png.js $i
done
