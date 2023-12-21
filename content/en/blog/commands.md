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

## Table of Contents

1. [Videos](#videos)

2. [Images](#images)

3. [Documents](#documents)

4. [Files](#files)

5. [Fun Command-Line Programs](#fun-command-line-programs)  
 

---

## Videos

```bash
ffmpeg -i in.mov -pix_fmt yuv420p10le -c:v libsvtav1 -crf 24 -preset 5 -svtav1-params tune=0:film-grain=6 -c:a libopus -b:a 128k out.mkv
ffmpeg -i in.mov -pix_fmt yuv420p10le -c:v libx265   -crf 20 -preset slow -c:a libopus -b:a 128k out.mkv
ffmpeg -i in.mov -pix_fmt yuv420p     -c:v libx264   -crf 18 -preset slow -c:a aac     -b:a 192k out.mkv
ffmpeg -i in.mov -c:v prores_ks -profile:v 3 -qscale:v 9 -c:a pcm_s16le out.mov

ffmpeg -i Untitled.mov -pix_fmt yuv420p -c:v libx264 -crf 25 -maxrate 600k -bufsize 3M -c:a aac -b:a 128k enc.mkv
ffmpeg -i enc.mkv -c copy -movflags +faststart enc.mp4


# cut
-ss     # start time (placing it before -i is faster)
-t      # length
-to     # end time
# time units can either be in the format HOURS:MM:SS.MILLISECONDS, or in seconds
# example: cut from 00:03 to 01:20 without re-encoding
ffmpeg -ss 3 -i in.mp4 -c copy -to 1:20 out.mp4

# deinterlace (needs https://github.com/dubhater/vapoursynth-nnedi3/blob/v6/src/nnedi3_weights.bin)
# (you may want to use QTGMC in VapourSynth instead)
ffmpeg -i in.mp4 -vf "nnedi=weights='./nnedi3_weights.bin',format=yuv420p" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4

# crop to 2/1
ffmpeg -i in.mp4 -vf "crop=in_w:in_w/2" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4

# convert all mp4 files in the current folder to prores for resolve
for i in *.mp4; do ffmpeg -i "$i" -c:v prores_ks -profile:v 3 -qscale:v 9 -c:a pcm_s16le "${i%.*}.mov" -n; done

# MacroSilicon MS2109 Capture Card:
#   60 fps at 1080p is just a firmware hack with every second frame being empty -> don't use it
#   stereo audio on windows needs https://github.com/ToadKing/mono-to-stereo (on Linux it works oob)
#   there's also this web player for chrome https://github.com/yume-chan/ms2109-player
# display using ffplay
ffplay /dev/video2 -framerate 30 -video_size 1920x1080 -input_format mjpeg -f v4l2
ffplay /dev/video2 -framerate 60 -video_size 1280x720 -input_format mjpeg -f v4l2
# loopback for usage with other programs (i.e. OBS)
sudo modprobe v4l2loopback devices=1 video_nr=10 card_label="LoopbackCam" exclusive_caps=1
ffmpeg -f video4linux2 -framerate 30 -video_size 1920x1080 -input_format mjpeg -i /dev/video2 -f v4l2 -pix_fmt yuv420p /dev/video10
```

## Images

```bash
# convert png/svg to ico using ImageMagick
convert -density 256x256 -background transparent in.png -define icon:auto-resize -colors 256 out.ico

# resize and compress jpg images
# https://gist.github.com/Nalsai/a2060570308192312e542f7de808c445
convert img.jpg -auto-orient -quality 90% -resize 4096x4096\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip img-out.jpg
mkdir -p out; for i in *.jpg; do convert $i -auto-orient -quality 90% -resize 4096x4096\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip out/$i; done;
mkdir -p out; for i in *.jpg; do convert $i -auto-orient -quality 90% -resize 600x600\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip out/$i; done;

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
# turn images into a PDF
img2pdf in.jpg --output out.pdf

# convert markdown to PDF
pandoc file.md --pdf-engine=xelatex -o file.pdf -V geometry:margin=1.27cm
```

## Files

```bash
# delete all desktop.ini files
find . -iname desktop.ini -delete

# delete all empty files
find . -empty -type f -delete

# delete all empty folders
find . -empty -type d -delete

# rename files to their md5sum or crc32 (doesn't work with names containing spaces)
md5sum * | sed -e 's/\([^ ]*\) \(.*\(\..*\)\)$/mv -v \2 \1\3/e'
crc32 * | sed -e "s/^\(\S*\)\s*\(.*\(\..*\)\)$/mv -v \2 \1\3/e"

# rsync custom ssh port
rsync -e 'ssh -p 2022' -avh user@server:path ./ --delete
```

## Fun Command-Line Programs

```bash
aafire
asciiquarium
cbonsai
cmatrix
cowsay
figlet
fortune
hollywood # docker run -it --rm jess/hollywood
sl
```
