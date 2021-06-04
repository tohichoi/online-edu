#!/usr/bin/env python

from subprocess import check_output, CalledProcessError, check_call
import re
import sys
from time import sleep
import threading


# xdotool
# imagemagick / convert, import
# tesseract, tesseract-eng
# ImageJ
# notify-send

# 왼쪽 모니터 full screen
# 팝업 윈도우로 띄워져 있는 상태여야 함

# 1. "다음" 버튼 위치 (MX, MY)
#	  - 마우스 커서를 "다음" 버튼에 놓는다
#	  - xdotool getmouselocation --shell
#		X=2774
#		Y=1814
#		SCREEN=0
#		WINDOW=79691862
#	  - 명령행에서 변수 세팅
#		eval $(xdotool getmouselocation --shell)
#	  
# 2. 학습 시간, 총 시간 위치 계산 : 스크린샷
#    - 마우스 위치를 총시간 top-left 위치에 놓고
#	    - xdotool getmouselocation --shell
#       - RX = X
#       - RY = Y
#    - 마우스 위치를 총시간 bottom-right 위치에 놓고
#	    - xdotool getmouselocation --shell
#       - RW = X - RX
#       - RH = Y - RY
# 3. 학습 시간
#    - 마우스 위치를 총시간 top-left 위치에 놓고
#	    - xdotool getmouselocation --shell
#       - RXC = X
# 3. http://mnd.nhi.go.kr/


##################################
# 인권의 이해 parameter
# ❯ xdotool getmouselocation --shell
# MX = 2859
# MY = 1600
# MY = MY - 70

# SCREEN = 0
# # xdotool 로 선택됨
# WINDOW = None

# # 총 분량
# RX = 1907
# RY = 1585
# RW = 77
# RH = 38
# # 현재 진행 시간
# RXC = 1801
# RYC = RY
# RWC = RW
# RHC = RH

##################################
# 성인지 parameter
# # "다음"
# MX=2888
# MY=1666
# # SCREEN=0
# # WINDOW=48234563
# MY=MY - 100

# # running time
# RW=-1
# RH=-1
# RX=-1
# RY=-1
# RXC = -1
# RYC = RY
# RWC = RW
# RHC = RH

##################################
# 이순신 장군의 청렴리더십 parameter
# "다음"
# x:2881 y:1750 screen:0 window:44040600
# window 
MX = 2881
MY = 1771

# totla time
# x:2039 y:1734 screen:0 window:44040600
RX = 2037
RY = 1734
# RY = 1660
RW = 68
RH = 34
RXC = 1955
RYC = RY
RWC = RW
RHC = RH

def enable_mouse(enable, id):
    check_call(['xinput', 'enable' if enable == True else 'disable'])


def progress(count, total, status=''):
    bar_len = 60
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '█' * filled_len + '-' * (bar_len - filled_len)

    # erawe to end of line
    sys.stdout.write("\033[K")
    sys.stdout.write('[%s] %s%s ...%s\r' % (bar, percents, '%', status))
    sys.stdout.flush()


def sleep_progress(maxsec):
    for i in range(1, maxsec + 1):
        sleep(1)
        if i == (maxsec+1)-5:
            check_call(['notify-send', '-t', '5', '-i', 'go-jump', "Online Edu Automation", "Action in 5 sec"])
        progress(i, maxsec)


def get_time_from_image(image):
    # ocr
    output = check_output(
        f"tesseract {image} stdout -c tessedit_char_whitelist=0123456789 2> /dev/null | tr -d '[:space:]'",
        shell=True)
    sleep(1)
    DUR = output.decode("utf-8").strip()
    print(f'{"Failed" if len(DUR) < 4 else DUR}')

    # 00:35
    # result : 00235
    # DUR.strip()
    if len(DUR) < 4:
        # print(f"{nrounds} Cannot recognize duration")
        # print(f"{nrounds} Image saved to s-error.png, s2-error.png")
        # check_call(f'cp {image} s.error.png', shell=True)
        # check_call(f'cp s2.png s2.error.png', shell=True)
        # sleep(5)
        # continue
        return -1, -1, ""


    # MIN=${DUR:6:7}
    # SEC=${DUR:9:10}
    MIN = DUR[:2]
    # 가끔 00:00 에서 콜론을 1로 인식하는 경우가 있음
    SEC = DUR[-2:]

    print(f"{nrounds} Duration : {DUR}, Min: {MIN}, Sec: {SEC}")

    # maximum 5
    MIN = min(5, int(MIN))
    SEC = int(SEC)


    return MIN, SEC, DUR


def get_crop_image(image, outimage, x, y, w, h):
    check_call(f'import -screen -window {WINDOW} -crop {w}x{h}+{x}+{y} {outimage}', shell=True)
    check_call(f'convert +dither -colorspace gray -auto-level -negate -colors 2 -normalize {outimage} {outimage}', shell=True)


def restore_window(nrounds, oldwin, prevpos):
    # check_call('xdotool mousemove restore')
    print(f"{nrounds} Restoring previous window ... ")
    check_call(f'xdotool windowactivate --sync {oldwin}', shell=True)
    if prevpos:
        check_call(f"xdotool mousemove --window {prevpos['window']} --sync {prevpos['x']} {prevpos['y']}", shell=True)


def get_current_window():
    output = check_call('xdotool getactivewindow', shell=True)
    oldwin = output.decode("utf-8").strip()

    return oldwin


nrounds = 0

print("Please select target window")
output = check_call(['xdotool', 'selectwindow'])
WINDOW = output.decode('utf-8').strip()


while True:
    nrounds += 1

    print(f"{nrounds} Window ID: {WINDOW}")

    print(f"{nrounds} Activating window ...")
    oldwin=get_current_window()
    check_call(['xdotool', 'windowactivate', '--sync', WINDOW])
    sleep(1)

    # print(f"{nrounds} Capturing screen ...")
    try:
        # check_call(f'xwd -id {WINDOW} | convert xwd:- png:- > s.png', shell=True)

        # check_call(f'xdotool windowactivate --sync {oldwin}', shell=True)

        if RX >= 0:
            print(f"{nrounds} Extracting duration region ...")
            get_crop_image(None, 's2.png', RX, RY, RW, RH)
            print(f"{nrounds} Recognizing duration ... ", end='')
            MIN, SEC, DUR = get_time_from_image('s2.png')
            if len(DUR) < 4:
                print(f"{nrounds} Cannot recognize duration")
                # print(f"{nrounds} Image saved to s-error.png, s2-error.png")
                # check_call('cp s.png s.error.png', shell=True)
                # check_call('cp s2.png s2.error.png', shell=True)
                sleep(5)
                continue

            print(f"{nrounds} Extracting current time region ...")
            get_crop_image(None, 's3.png', RXC, RYC, RW, RH)
            print(f"{nrounds} Recognizing current time ... ", end='')
            MINC, SECC, DURC = get_time_from_image('s3.png')
            if len(DUR) < 4:
                print(f"{nrounds} Cannot recognize duration")
                # print(f"{nrounds} Image saved to s-error.png, s2-error.png")
                # check_call('cp s.png s.error.png', shell=True)
                # check_call('cp s2.png s2.error.png', shell=True)
                # check_call('cp s3.png s3.error.png', shell=True)
                sleep(5)
                continue
        else:
            MIN = 5
            SEC = 0
            MINC = 0
            SECC = 0
            
        WAITSEC = int((MIN * 60 + SEC) * 1) - int((MINC * 60 + SECC) * 1)
        # echo $WAITSEC

        # print(f"{nrounds} Restoring previous window ... ")
        threading.Timer(2, restore_window, (nrounds, oldwin, None,)).start()
        print(f"{nrounds} Waiting for {WAITSEC} seconds ... ")
        # visual_wait $WAITSEC
        sleep_progress(WAITSEC)

        print("")
        oldwin=get_current_window()
        print(f"{nrounds} Get current mouse position ...")
        output = check_call(['xdotool', 'getmouselocation'])
        s = output.decode('utf-8').strip()
        prevpos = {}
        for x in s.split():
            tok = x.split(':')
            prevpos[tok[0]] = tok[1]

        print(f"{nrounds} Moving mouse ...")
        check_call(f'xdotool mousemove --sync {MX} {MY}', shell=True)
        sleep(0.1)

        # output = check_call('xdotool getactivewindow', shell=True)
        # oldwin = output.decode("utf-8").strip()
        check_call(f'xdotool click --window {WINDOW} 1', shell=True)
        print(f"{nrounds} CLICKED!")

        print(f"{nrounds} Restoring previous mouse position ...")
        check_call(f"xdotool mousemove --sync {prevpos['x']} {prevpos['y']}", shell=True)
        sleep(0.1)

        sys.stdout.flush()
        sleep(0.1)


    except CalledProcessError as e:
        pass

    print(f"{nrounds} Waiting 3 seconds for screen loading")
    sleep_progress(3)
    print("")

    # threading.Timer(2, restore_window, (nrounds, oldwin, None,)).start()
    restore_window(nrounds, oldwin, None)