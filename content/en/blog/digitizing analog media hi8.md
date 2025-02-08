# Reading old videos (vhs/hi8...)

https://gleitz.info/forum/index.php?thread/47572-tutorial-hochwertiges-digitalisieren-von-analogen-vhs-videokassetten-und-andere/

1. player (ideally original device used to create the hi8 cassette)
2. s-video to scart adapter
3. panasonic dvd/bluray player with hdmi out (ideally set to 480i/576i)
4. hdmi splitter to remove protection
5. capture card

Lossless recording with virtualdub (version!)

filter with vapoursynth (qtgmc [lower sharpening!], dering, dehalo)
export to prores with ffmpeg (high quality, can be read by resolve even on linux)
auto cut with davinci resolve
export to DNxHR (similar to prores)
compress and cut first frame with ffmpeg (x264/x265/av1, aac/opus)


Encode:
# -aspect is DAR 
# PAR = DAR/SAR
# PAR 4:3-PAL (ITU): 1150/1053
# 1150/1053=x/(720/560)
# x = 1150/819
ffmpeg -ss 0.02 -i "2023-04-30_05-part2_00021612.mov" -aspect 1150:819 -pix_fmt yuv420p10le -c:v libsvtav1 -crf 24 -preset 5 -svtav1-params tune=0:film-grain=12 -c:a libopus -b:a 128k "2023-04-30_05-part2_00021612.mkv" -n


---

## Aspect ratios

Original 720×576     5×4
Should be stretched to 4×3

Cropped and stretched appropriately (through the aspect ratio flag) the content ends up being approximately 7×5

---


I
want to preserve data
as it has fallen out of fashion, it's getting harder to properly watch old analog video and to properly view old analog photo slides.
analog data degrades, so it should be digitized sooner than later, before the quality worsens noticeably.


## hi8 (also applies to VHS etc.)
dad used an old camcorder (TODO: branding?) manufactured by Sony, I believe.
A lot of my childhood is recorded on it. Luckily we still have the camcorder it was recorded with, as well as a Panasonic Blu-Ray recorder for handling the conversion.
hi8 is higher quality than VHS 

### The digitization process

### recording
Blu-Ray recorder can't output interlaced at 576p
bought damaged Panasonic DVD recorder off ebay
 DVD drive was apperantly not working, but it fixed it self without me doint anything.
 Front panel had bad contact, so the display and the IR Remote sometimes didn't work, but taking it apart and reassembling it fixed it.

### filtering
Filtering in vapoursynth (learned from the anime scene)

Crop
EdgeChromaFix(InputType=1, Sharpness=0.2) (to smooth and denoise it)
qtgmc (don't overdo it)
HQDeringmod
FineDehalo

TODO: vs script


I use Fedora Linux, so I used [yuuno](https://yuuno.encode.moe/) in an archlinux docker container (→ github.com/nalsai/vapoursynth-yuuno-docker) for editing and testing my script. (This tag works nicely: https://github.com/nalsai/vapoursynth-yuuno-docker/pkgs/container/vapoursynth-yuuno/88321925?tag=sha-ecb25f9)
And then ran it on all files via bash

TODO: script


### cutting

- cutting clips
Davinci Resolv auto scene detection
two more issues:
color is a bit rainbowy at the beginning (already present in source) 
audio start and end are slightly delayed
fixed both by cutting of the first 10 frames in the final encode with ffmpeg → see encoding

### encoding

encode
TODO: full ffmpeg command
gets quite small 2 to 3 Mbit/s

### Problems
- start and end of tapes have artifacts due to tension
--> sometimes recorded those multiple times
beginning always has one frame that is shifted downwards - not the same frame each time -> can be corrected by making multiple recordings and replacing the shifted frame with the same frame from another clip. (I did that once, but it's too much work to do it for every tape or to write a vapoursynth script to detect and fix it)
- edges
cropping (I actually cropped a couple more pixels on both sides but it looks perfectly clean now)
- chroma on right edge 
wrote custom script to extend the chroma
TODO: vs script
- Aspect ratio
PAR (I give it to ffmpeg in the final encode)
Could also interpolate for example high quality nnedi3 in vapoursynth
TODO: ffmpeg parameter


## Conclusion

Actually pretty high quality
method is cheap and better than transferring to DVD or grabbing directly with a cheap analog capture device. Panasonic conforms to norms capturing this way has no compression artifacts at all (until I convert it to prores for resolve) and even if you capture with lossy compression there much fewer artifacts than with other methods.  The hardest part is getting 
Luckily the tapes were all still in great condition but as it's an analog format you always have to live with a couple of artifacts.
