+++
title = "A Quick Command Cheat Sheet"
description = "(Most commands work on any platform, but some may require Bash and/or Linux.)"
tags = ["Software", "Commands", "Linux"]
+++

<style>
  h2,h3,h4,h5,h6 {
    scroll-margin-top: 90px;
    margin: 0.8em 0 0.6em 0;
  }
</style>

## Table of Contents

1. [Videos](#videos)

2. [Images](#images)

3. [Documents](#documents)

4. [Audio](#audio)

5. [Files](#files)

6. [Fun Command-Line Programs](#fun-command-line-programs)  
  

---

## Videos

```bash
# encode videos with ffmpeg (av1 is very modern, h265 modern and h264+aac should be compatible with almost anything; add -map_metadata 0 to copy metadata)
ffmpeg -i in.mov -pix_fmt yuv420p10le -c:v libsvtav1 -crf 32 -preset 8 -svtav1-params tune=0:enable-overlays=1:scm=0:mbr=20000 -c:a libopus -b:a 128k out.mkv
ffmpeg -i in.mov -pix_fmt yuv420p10le -c:v libx265 -crf 20 -preset slow -c:a libopus -b:a 128k out.mkv
ffmpeg -i in.mov -pix_fmt yuv420p -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k out.mkv
ffmpeg -i in.mov -pix_fmt yuv420p -c:v libx264 -crf 16 -preset slow -c:a flac out.mkv

# prores and pcm for editing (in resolve)
ffmpeg -i in.mov -c:v prores_ks -profile:v 3 -qscale:v 9 -c:a pcm_s16le out.mov

# tiny, widely compatible encoding settings for distributing recordings of zoom presentations etc. (2nd step puts it into an mp4 container instead of mkv)
ffmpeg -i Untitled.mov -pix_fmt yuv420p -c:v libx264 -crf 26 -maxrate 1M -bufsize 3M -c:a aac -b:a 128k enc.mkv
ffmpeg -i enc.mkv -c copy -movflags +faststart enc.mp4


# cut video (with or without re-encoding)
-ss     # start time (placing it before -i is faster; it used to be less accurate, but that's no longer the case)
-t      # length
-to     # end time
# time units can either be in the format HOURS:MM:SS.MILLISECONDS, or in seconds
# example: cut from 00:03 to 01:20 without re-encoding
# you need to specify the codec and encoding options if you want to re-encode - this is needed for cutting outside of keyframes
ffmpeg -ss 3 -i in.mp4 -c copy -to 1:20 out.mp4

# deinterlace with nnedi3, a high-quality (but slow) intra-field deinterlacer using neural networks
# you need to download the file https://github.com/dubhater/vapoursynth-nnedi3/blob/v6/src/nnedi3_weights.bin
# you may want to use QTGMC in VapourSynth instead; or yadif (-vf yadif=0) for a faster, simpler deinterlacer
ffmpeg -i in.mp4 -vf "nnedi=weights='./nnedi3_weights.bin',format=yuv420p" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4

# crop to 2/1
ffmpeg -i in.mp4 -vf "crop=in_w:in_w/2" -c:v libx265 -crf 20 -preset slow -c:a copy out.mp4

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
# resize and compress images
magick img.jpg -auto-orient -quality 90% -resize 4096x4096\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip img-out.jpg
mkdir -p out && parallel -j 6 --eta "magick {} -auto-orient -quality 90% -resize 4096x4096\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip out/{}" ::: *.jpg
mkdir -p out && parallel -j 6 --eta "magick {} -auto-orient -quality 90% -resize 2048x2048\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip out/{}" ::: *.jpg
mkdir -p out && parallel -j 6 --eta "magick {} -auto-orient -quality 90% -resize 600x600\> -interlace Plane -sampling-factor 4:2:0 -define jpeg:dct-method=float -colorspace sRGB -strip out/{}" ::: *.jpg
mkdir -p out && parallel -j 6 --eta "magick {} -auto-orient -quality 99% -colorspace sRGB -strip out/{}.jxl" ::: *.jpg

# optimize png images (o goes from 0 to 6; use "--strip safe" or "--strip all" all to remove metadata; --alpha changes color values of fully transparent pixels)
oxipng -o 4 --alpha *.png

# convert svg to png with perfect quality
inkscape -w 512 in.svg -o out.png

# convert png/svg to ico using ImageMagick
convert -density 256x256 -background transparent in.png -define icon:auto-resize -colors 256 out.ico

# set exif date
exiftool "-AllDates=2021:08:22 01:58" img.jpg

# set exif time zone
exiftool -r -overwrite_original -OffsetTime\*=+02:00 -m .

# shift JPG image dates by 1 year, 12 month, 28 days, 14 hours, 54 minutes, 32 seconds
exiftool -jpg "-AllDates+=1:12:28 14:54:32" .

# rename images to their exif CreateDate and camera model
exiftool -r -d "%Y%m%d%H%M%S" '-filename<${Exif:CreateDate} %f $Model.%e' .

# set exif DateTimeOriginal, CreateDate, and ModifyDate to FileCreateDate
exiftool "-AllDates<FileCreateDate" .

# scan for corrupt metadata
exiftool -validate -warning -a -r ./

# rewrite the metadata - this fixes most issues but you will lose any non-standard data
exiftool -all= -tagsfromfile @ -all:all -unsafe bad.jpg
```

## Documents

```bash
# turn images into a PDF
img2pdf *.jpg --output out.pdf

# convert markdown to PDF
pandoc file.md --pdf-engine=xelatex -o file.pdf -V geometry:margin=1.27cm

# ocr and optimize pdf
ocrmypdf -l de+en+jpn+jpn_vert "Scanned Document.pdf" scan.pdf --optimize 2
```

## Audio

```bash
# remove seektable and (re)add seekpoints once every second to allow seeking in the file (metaflac is part of the flac package)
metaflac --remove --block-type=SEEKTABLE **.flac
metaflac --add-seekpoint=1s **.flac
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

# rsync with custom ssh port
rsync -e 'ssh -p 2022' -avh user@server:path ./
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
