#!/bin/bash
for each in ./*{.jpg,.gif,.png} 
do
# echo `du -k $each`
# s=`du -k $each | awk '{print $1}'`
# if [ $s -gt 10 ]; then
# #   convert -quality 80 -resize 600x800 $each $each
  convert -gravity southeast -fill gray -pointsize 16 -draw  "text 5,5 'jser.me'" $each $each
  echo "$each: done!"
# fi
done
exit 0