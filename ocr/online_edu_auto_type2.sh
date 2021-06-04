#!/bin/sh

# 왼쪽 모니터 full screen
# 팝업 윈도우 띄워져 있는 상태여야 함

# 1. "다음" 버튼 위치
#     - 마우스 커서를 "다음" 버튼에 놓는다
#     - xdotool getmouselocation --shell
#       X=2774
#       Y=1814
#       SCREEN=0
#       WINDOW=79691862
#     - 명령행에서 변수 세팅
#       eval $(xdotool getmouselocation --shell)
#     
# 2. 분량(시간) 위치 계산
#     - xwd -id $WINDOW | convert xwd:- jpg:- > s.jpg
#     - gimp s.jpg
#     - 문자인식할 영역 메모
#       - 타이틀바 크기를 빼야함(100)
#
# 3. http://mnd.nhi.go.kr/


##################################
# 성인지 parameter
# 브라우저 타이틀이 "국방부" 일때도 있고 "나라배움터" 일때도 있음
TITLE1="국방부.*firefox"
TITLE2="나라배움터 - Mozilla Firefox"
# "다음"
MX=2771
MY=1927
MY=$((MY - 100))

# running time
RW=68
RH=34
RX=2084
RY=1635


nrounds=0

while true
do
    nrounds=$((nrounds+1))
    # echo "ROUND: $nrounds"
    
    echo "[$nrounds] Searching window ..."
    WINDOW=`xdotool search --name $TITLE1`
    if [ -z $WINDOW ] ; then
	WINDOW=`xdotool search --name $TITLE2`
    fi

    sleep 1

    echo "[$nrounds] Window ID: $WINDOW"
    
    echo "[$nrounds] Activating window ..."
    xdotool windowactivate --sync $WINDOW
    sleep 1

    echo "[$nrounds] Capturing screen ..."
    xwd -id $WINDOW | convert xwd:- jpg:- > s.jpg
    
    echo "[$nrounds] Extracting duration region ..."
    convert -crop "$RW"x"$RH"+"$RX"+"$RY" s.jpg s2.jpg

    echo "[$nrounds] Recognizing duration ..."
    # ocr
    DUR=`tesseract s2.jpg stdout -c tessedit_char_whitelist=0123456789 2> /dev/null | tr -d '[:space:]'`
    # 00:35
    # result : 00235

    if [[ -z $DUR ]]; then
	echo "[$nrounds] Cannot recognize duration"
	echo "[$nrounds] Image saved to s-error.jpg, s2-error.jpg"
	cp s.jpg s.error.jpg
	cp s1.jpg s1.error.jpg
	continue
    fi
       
    # MIN=${DUR:6:7}
    # SEC=${DUR:9:10}
    MIN=`expr substr $DUR 1 2`
    SEC=`expr substr $DUR 3 2`
    
    MIN=$((MIN + 1))
    SEC=0
    
    echo "[$nrounds] Duration : $DUR, Min: $MIN, Sec: $SEC"
    
    # DUR=`cat out.txt | sed "s/\([0-9][0-9]:[0-9][0-9]\).*\([0-9][0-9]:[0-9][0-9]\)$/\1/"`

    # MIN=`echo $DUR | sed "s/\([0-9][0-9]\):\([0-9][0-9]\)/\1/"`
    # SEC=`echo $DUR | sed "s/\([0-9][0-9]\):\([0-9][0-9]\)/\2/"`
    WAITSEC=$(($MIN * 60 + $SEC))
    # echo $WAITSEC

    echo "[$nrounds] Waiting for $WAITSEC seconds ... from `date`"
    # visual_wait $WAITSEC
    sleep $WAITSEC

    echo "[$nrounds] Moving mouse ..."
    # xdotool mousemove --window $WINDOW --screen 0 --sync $MOUSEX $MOUSEY
    xdotool mousemove --screen $SCREEN --sync $MX $MY
    sleep 1
    
    echo "[$nrounds] CLICKED!"
    xdotool click --window $WINDOW 1
    sleep 1

    xdotool mousemove restore
    
    echo "[$nrounds] Waiting 10 seconds for screen loading"
    sleep 10

done


