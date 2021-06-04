#!/bin/sh

# 클릭 위치 계산

# xdotool getwindowgeometry

# xdotool getmouselocation
# x:2596 y:1346 screen:0 window:92274800
# y는 -30 (title bar 사이즈)

nrounds=0


while true
do
    nrounds=$((nrounds+1))
    # echo "ROUND: $nrounds"
    
    # 왼쪽 모니터 full screen

    # 팝업 윈도우 띄워져 있는 상태여야 함
    echo "[$nrounds] Searching window ..."
    WID=`xdotool search "나라배움터" | head -1`
    sleep 1

    echo "[$nrounds] Activating window ..."
    xdotool windowactivate --sync $WID
    sleep 1

    echo "[$nrounds] Capturing screen ..."
    # screen shot
    xwd -root -display :0 | convert xwd:- jpg:- > s.jpg

    echo "[$nrounds] Extracting duration region ..."
    # time area
    #   x1=1109 y1=1290 x2=1219 y2=1310
    #   x1=2074 y1=1293 x2=2174 y2=1313
    #   x1=2128 y1=1295 x2=2173 y2=1313
    # imagemagick geometry
    #   width: 45, height: 22
    convert  -crop 45x30+2128+1295 s.jpg s2.jpg

    echo "[$nrounds] Recognizing duration ..."
    # ocr
    # apt-get install tesseract-ocr tesseract-ocr-all
    DUR=`tesseract s2.jpg stdout -c tessedit_char_whitelist=0123456789`
    # 00:35
    # result : 00235

    # MIN=${DUR:6:7}
    # SEC=${DUR:9:10}
    MIN=`expr substr $DUR 1 2`
    SEC=`expr substr $DUR 4 2`
    
    MIN=$(($MIN+1))
    SEC=0
    
    echo "[$nrounds] Duration : $DUR, Min: $MIN, Sec: $SEC"
    
    # DUR=`cat out.txt | sed "s/\([0-9][0-9]:[0-9][0-9]\).*\([0-9][0-9]:[0-9][0-9]\)$/\1/"`

    # MIN=`echo $DUR | sed "s/\([0-9][0-9]\):\([0-9][0-9]\)/\1/"`
    # SEC=`echo $DUR | sed "s/\([0-9][0-9]\):\([0-9][0-9]\)/\2/"`
    WAITSEC=$(($MIN * 60 + $SEC))
    # echo $WAITSEC

    echo "[$nrounds] Waiting for $WAITSEC seconds ... from `date`"
    # xdotool mousemove restore
    sleep $WAITSEC

    echo "[$nrounds] Moving mouse ..."
    xdotool mousemove --window $WID --screen 0 --sync 2596 1316
    sleep 1
    
    echo "[$nrounds] CLICKED!"
    xdotool click --window $WID  1
    sleep 1

    echo "[$nrounds] Waiting 5 seconds for screen loading"
    sleep 5
done


