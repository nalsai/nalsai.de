+++
title = "Filtering Video with VapourSynth"
description = ""
date = 2025-03-08
+++

Filtering in vapoursynth (learned from the anime scene)


Crop
EdgeChromaFix(InputType=1, Sharpness=0.2) (to smooth and denoise it)
qtgmc (don't overdo it)
HQDeringmod
FineDehalo




I use Fedora Linux, so I used [yuuno](https://yuuno.encode.moe/) in an archlinux docker container (→ github.com/nalsai/vapoursynth-yuuno-docker) for editing and testing my script. (This tag works nicely: https://github.com/nalsai/vapoursynth-yuuno-docker/pkgs/container/vapoursynth-yuuno/88321925?tag=sha-ecb25f9)
And then ran it on all files via bash


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
