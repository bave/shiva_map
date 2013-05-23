#!/bin/sh


#/usr/bin/wget www.google.com/intl/en_ALL/mapfiles/dir_${number}.png
for number in `seq 0 3 120`
do
echo www.google.com/intl/en_ALL/mapfiles/dir_${number}.png
/usr/bin/wget www.google.com/intl/en_ALL/mapfiles/dir_${number}.png
echo www.google.com/intl/en_ALL/mapfiles/dir_walk_${number}.png
/usr/bin/wget www.google.com/intl/en_ALL/mapfiles/dir_walk_${number}.png
done
