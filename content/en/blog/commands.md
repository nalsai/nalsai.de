+++
title = "A Quick Command Cheat Sheet"
description = "(Most commands work on any platform, but some may require Bash and/or Linux.)"
+++

<style>
  h2,h3,h4,h5,h6 {
    scroll-margin-top: 90px;
    margin: 0.8em 0 0.6em 0;
  }
</style>

---

##### Table of Contents

1. [Videos](#videos)
2. [Images](#images)
3. [Documents](#documents)
4. [Files](#files)
5. [Locations](#locations)

---

## Videos

```bash
# simple encoding in modern codecs (opus & h265), more compatible codecs (aac & h264), or prores and pcm (for editing)
ffmpeg -i in.mov -c:v libx265 -crf 20 -preset slow -pix_fmt yuv420p10le -c:a libopus -b:a 128k out.mkv
ffmpeg -i in.mov -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a libfdk_aac -b:a 128k out.mkv
ffmpeg -i in.mov -c:v prores_ks -profile:v 3 -qscale:v 3 -c:a pcm_s16le out.mov


# cut
-ss     # start time
-t      # length
-to     # end time
# time units can either be in the format HOURS:MM:SS.MILLISECONDS, or in seconds
# example: cut from 00:03 to 01:20 without reencoding
ffmpeg -i in.mp4 -c copy -ss 3 -to 1:20 out.mp4


# stabilize (2 steps: analyze and apply)
ffmpeg -i in.mp4 -vf "vidstabdetect=shakiness=10:accuracy=15" -f null -
ffmpeg -i in.mp4 -vf "vidstabtransform=zoom=5:smoothing=30" -c:v libx265 -crf 20 -preset slow out.mp4

# deinterlace
ffmpeg -i in.mp4 -vf "nnedi=weights='./nnedi3_weights.bin',format=yuv420p" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4

# crop to 2/1
ffmpeg -i in.mp4 -vf "crop=in_w:in_w/2" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4


# convert all mp4 files in the current folder to prores for resolve
for i in *.mp4; do ffmpeg -i "$i" -c:v prores_ks -profile:v 3 -qscale:v 3 -c:a pcm_s16le "${i%.*}.mov" -n; done

# merge all mov files in the current folder with their corresponding wav files
for i in *.mov; do ffmpeg -i "$i" -i "${i%.*}.wav" -map 0:v:0 -map 1:a:0 -c:v copy -c:a pcm_s16le "out/${i%.*}.mov"; done


# VapourSynth (doesn't work with powershell, need to use cmd on windows)
vspipe --y4m script.vpy - | ffmpeg -i pipe: -c:v libx264 -crf 0 out.mkv


# MacroSilicon MS2109 Capture Card:
#   60 fps at 1080p is just a firmware hack with every second frame being empty
#   stereo audio on windows needs https://github.com/ToadKing/mono-to-stereo (on linux it works oob)
#   there's also this web player https://github.com/yume-chan/ms2109-player (works on chrome)
# display using ffplay
ffplay /dev/video2 -framerate 30 -video_size 1920x1080 -input_format mjpeg -f v4l2
ffplay /dev/video2 -framerate 60 -video_size 1280x720 -input_format mjpeg -f v4l2
# loopback for usage other programs (i.e. OBS)
sudo modprobe v4l2loopback devices=1 video_nr=10 card_label="LoopbackCam" exclusive_caps=1
ffmpeg -f video4linux2 -framerate 30 -video_size 1920x1080 -input_format mjpeg -i /dev/video2 -f v4l2 -pix_fmt yuv420p /dev/video10
```

## Images

```bash
# mass upscale with waifu2x
for i in *.jpg; do waifu2x-ncnn-vulkan -i "$i" -o "2x/${i%.*}.jpg"; done

# convert png/svg to ico using ImageMagick
convert -density 256x256 -background transparent in.png -define icon:auto-resize -colors 256 out.ico

# resize and compress jpg images
# https://gist.github.com/Nalsai/a2060570308192312e542f7de808c445
convert img.jpg -auto-orient -quality 90% -resize 2048x2048\> -interlace Plane -sampling-factor 4:2:0 -gaussian-blur 0.05x0.2 -define jpeg:dct-method=float -colorspace sRGB -strip img-out.jpg
for i in *.jpg; do convert $i -auto-orient -quality 90% -resize 2048x2048\> -interlace Plane -sampling-factor 4:2:0 -gaussian-blur 0.05x0.2 -define jpeg:dct-method=float -colorspace sRGB -strip out/$i; done;

# optimize png images
optipng -o7 *.png

# set exif DateTimeOriginal
exiftool "-DateTimeOriginal=2021:08:22 01:58" img.jpg

# shift all JPG image dates by 1 year, 12 month, 28 days, 14 hours, 54 minutes, 32 seconds
exiftool "-AllDates+=1:12:28 14:54:32" -verbose *.jpg

# rename all images in current folder
exiftool -r -d "%Y%m%d%H%M%S" '-filename<${Exif:CreateDate} %f $Model.%e' ./

# set exif CreateDate, DateTimeOriginal, DateCreated and TimeCreated to FileCreateDate for all images in current folder
exiftool "-CreateDate<FileCreateDate" "-DateTimeOriginal<FileCreateDate" "-DateCreated<FileCreateDate" "-TimeCreated<FileCreateDate" ./

# set exif TimeZone
exiftool "-TimeZone=+02:00" ./
```

## Documents

```bash
# convert image to pdf
img2pdf in.jpg --output out.pdf

# convert markdown to PDF
pandoc file.md --pdf-engine=xelatex -o file.pdf -V geometry:margin=1.27cm
```

### Convert tabs to spaces in many files

NOTE: it may be preferrable to use `expand` instead of `sed`  
NOTE 2: replacing `\;` with `+` results in a substantial speedup if there are many files, because instead of launching one instance of sed per file, it will build an argument list

```bash
find ./ -type f -exec sed -i 's/\t/  /g' {} \;    # 2 spaces
find ./ -type f -exec sed -i 's/\t/    /g' {} \;  # 4 spaces
```

## Files

```bash
# delete all desktop.ini
find . -iname desktop.ini -delete

# delete empty files
find . -empty -type f -delete

# delete empty folders
find . -empty -type d -delete

# rename to md5sum or crc32 (doesn't work with names containing spaces)
md5sum * | sed -e 's/\([^ ]*\) \(.*\(\..*\)\)$/mv -v \2 \1\3/e'
crc32 * | sed -e "s/^\(\S*\)\s*\(.*\(\..*\)\)$/mv -v \2 \1\3/e"

# rsync custom ssh port
rsync -e 'ssh -p 2022' -avh user@server:path ./ --delete
```

## Locations

```bash
# .desktop files
/usr/share/applications
$HOME/.local/share/applications

# icons
/usr/share/icons

# fonts
/usr/share/fonts
$HOME/.local/share/fonts
```

## Fun command-line programms

```bash
aafire
asciiquarium
cbonsai
cmatrix
cowsay
figlet
fortune
hollywood
docker run -it --rm jess/hollywood
sl
```
