+++
title = "Digitizing VHS, Hi8 and other analog Tapes"
description = ""
date = 2025-03-08
+++

## Table of Contents

1. [Capture Option 1 - Panasonic DVD Recorder](#capture-option-1---panasonic-dvd-recorder)
2. [Capture Option 2 - I-O Data GV-USB2](#capture-option-2---i-o-data-gv-usb2)
3. [Other Capture Devices](#other-capture-devices)
4. [Capture Software](#capture-software)
5. [Post Processing](#post-processing)

---

## Capture Option 1 - Panasonic DVD Recorder

![Pnasonic DMR-EH495](../dmr-eh495.jpg)

The preferred method for capturing analog video in the German community seems to be using a Panasonic DVD Recorder to convert the analog video to a digital format and then capturing the digital signal with a capture card that supports 576i/480i.

You can find a detailed guide on how to do this in German at [Gleitz DVD Forum](https://gleitz.info/forum/index.php?thread/47572-tutorial-hochwertiges-digitalisieren-von-analogen-vhs-videokassetten-und-andere/).

Benefits of this method are that Panasonic DVD Recorders have been shown to faithfully convert analog video to digital and are also able to stabilize the video signal without an expensive TBC.

Basically you connect your VHS player or Hi8 camcorder to a Panasonic DVD Recorder with an HDMI output, like one of the following models:

- DMR-EH65
- DMR-EHxxx
- DMR-EXxx
- DMR-EZ49 (VHS player built in)

Then you connect the DVD Recorder to a capture card that supports 576i/480i, like a Blackmagic Intensity.  
If your capture card does not support 576i/480i, you can still capture the video, but it will be deinterlaced (and scaled) by the DVD Recorder.

To capture from the HDMI output of the DVD Recorder, you need an HDMI splitter to remove HDCP protection from the signal.

## Capture Option 2 - I-O Data GV-USB2

![I-O Data GV-USB2](../gv-usb2.jpg)

The I-O Data GV-USB2 is a fairly cheap but high quality USB capture device.  
You only need to connect it to your VHS player or Hi8 camcorder, and you can start capturing (after setting up your capture software, of course).

A disadvantage of this device is that it does not work as well with unstable video signals as the Panasonic DVD Recorder. Hi8, for example, tends to drop fields at the beginning and end of the tape.

Availability of the I-O Data GV-USB2 is not great outside of Japan, but you can get it shipped to you from Amazon Japan or buy it from a reseller on eBay. Personally, I bought mine at an electronics store in Akihabara while I was studying in Japan.

## Other Capture Devices

There are many cheap USB capture devices and HDMI converters available. They are not recommended as they may have issues like wrong colors, asynchronous audio, framerate issues and more.

Of course, there are other high quality capture devices available, but they are usually quite expensive, much more so than the two options mentioned above.

The manufacturers Canopus and Grass Valley make high quality capture devices.  
Elgato analog capture devices are not recommended as their performance is mediocre despite their price and reputable brand name.

## Capture Software

While capture devices usually come with their own software, it is often not very good for capturing analog video.  
Age appropriate software like VirtualDub or AmaRecTV is recommended instead.  
Use it to capture the original interlaced video with lossless compression like Lagarith or Huffyuv. Then you can deinterlace and compress it later, resulting in a higher quality video.

## Post Processing

Personally, I store the original capture files losslessly compressed in FFV1 format and then use VapourSynth to deinterlace and denoise and ffmpeg to compress the video.

<!--You can find more information on how to filter video with VapourSynth [here](../vapoursynth).-->

### Resolution, Frame Rate and Aspect Ratio

![PAL-NTSC-SECAM map](../PAL-NTSC-SECAM.svg)

Your captures should have the following resolution and frame rate:

PAL:  720×576 with 25 fps (50fps deinterlaced)  
NTSC: 720x480 with 30 fps (60fps deinterlaced)

This includes the overscan area, an area of the video signal that is not visible on a TV screen.

Even though neither resolution is 4:3, the aspect ratio of the video should normally be 4:3. This is because the pixels are not square but rectangular (PAR = pixel aspect ratio).  
To properly display it, you need to set the aspect ratio of the video. In ffmpeg you can set display aspect ratio (DAR) with the `-aspect` parameter. If you didn't crop the video, it should be `-aspect 4:3`, otherwise you need to calculate the correct aspect ratio.

<img src="../pardarsar.svg" alt="PAR=DAR/SAR" class="invert-dark">
