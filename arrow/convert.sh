#!/bin/sh

BASE_COLOR="#000066";

# RED
for SEQ_COLOR in $(seq 0 4095)
do
    COLOR=`ruby -e "puts format(\"%03x\", $SEQ_COLOR.to_s)"`
    for RAD in $(seq 0 3 117)
    do
        INPUT_FILE="dir_${RAD}.png";
        OUTPUT_FILE="arrow_${COLOR}_${RAD}.png";
        echo "/usr/bin/convert -fuzz 100% -fill '#$COLOR' -opaque '$BASE_COLOR' $INPUT_FILE $OUTPUT_FILE;"
        /usr/bin/convert -fuzz 100% -fill \#$COLOR -opaque $BASE_COLOR $INPUT_FILE $OUTPUT_FILE
    done
done
