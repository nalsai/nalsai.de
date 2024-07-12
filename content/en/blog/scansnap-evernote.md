+++
title = "How to make your ScanSnap Evernote Edition work again"
description = "Recover your ScanSnap Evernote Edition scanner after the service shutdown"
tags = [
  "ScanSnap",
]
date = 2024-06-30
+++


## Prologue

I acquired a ScanSnap Evernote Edition scanner last year.
The price was very attractive, the specs are good, and I knew that there were Linux drivers for the ScanSnap series.

When I tried to set it up, I found out that support for the Evernote Edition had been discontinued.
While there was a tool to flash the ScanSnap ix500 firmware to restore the scanner's functionality - making it work with the normal ScanSnap Manager/Home software - that tool has also been discontinued and taken offline on March 31, 2023.
Thankfully, the community linux drivers worked perfectly so it wasn't a big deal for me. Still, I wanted to have the original functionality back if I or someone else ever wanted to use it with Windows or macOS.

Browsing the Evernote forums and various other places, I found a copy of the tool, which didn't work, as it required the ScanSnap Home Evernote Edition software to be installed. I found the installer for that, which immediately failed trying to install an old version of the Evernote software. After installing an old version of Evernote, I ran into a dead end: The installer actually didn't contain the necessary files for the software and tried to download them from the ScanSnap software server, where the required file (`http://origin.pfultd.com/downloads/IMAGE/driver/ss/mgr/w-evernote/sseev15l10.exe`) is no longer available. Nobody seems to have archived the needed file, so unless someone with a working installation can back it up, the software seems to be lost.

I of course tried to contact Fujitsu support, but Japanese support told me that they couldn't help me and that I should contact the support in my country (I'm in Japan). The European support told me that support for the Evernote Edition had been discontinued and I could download ScanSnap Home (which doesn't connect to the Evernote Edition unless the firmware has been changed to the ix500 firmware). The US support told me to contact the Technical Assistance Center via phone, which I didn't do because I'm in Japan and I don't want to pay for an international call that's unlikely to help me.

## The solution

I found third-party backups of both the ScanSnap Home Evernote Edition software and the firmware update tool for **macOS**, which I've uploaded to my server for safekeeping.
You can find them here: <https://files.nils.moe/software/scansnap/>

These files do not need any additional software to work, so you can just download them, install the software and use them.

This allows you to use the SSEEConvertTool to convert your ScanSnap Evernote Edition to a ScanSnap ix500, which can then be used with the normal ScanSnap Manager/Home software.

## Instructions

On Windows ScanSnap Home Evernote Edition is required to be installed. On macOS, I believe it should work without any additional software, but even if it doesn't, I have archived the software for macOS.
(Although it installs on macOS Mojave 10.14, it is an older version, so it didn't open when I tried to run it. I assume it works on an older version of macOS.)

Download and execute [SSEEConvertTool.dmg](https://files.nils.moe/software/scansnap/SSEEConvertTool.dmg) and connect the ScanSnap Evernote Edition to your Mac. The tool will guide you through the process of converting your ScanSnap Evernote Edition to a ScanSnap ix500.

You may need to use an older version of macOS to run the software, I used macOS Mojave 10.14, as it is the latest version that supports 32-bit applications.

### For macOS users on a version where the software doesn't run

You can use a virtual machine with macOS Mojave 10.14 like VMware Fusion or Parallels Desktop and pass through the USB device to the virtual machine.

### For Windows and Linux users

You either need to find a macOS device you can use, set up a Hackintosh, or use a virtual machine.

I used [OneClick macOS Simple KVM](https://oneclick-macos-simple-kvm.notaperson535.is-a.dev/) to set up a macOS Mojave 10.14 virtual machine on my Linux desktop, which worked nicely.
(I had to set `usb-ehci,id=ehci` instead of `qemu-xhci` to get my mouse to work but other than that it worked perfectly.)

### During the firmware flash

If you used a bare metal macOS device, you can just follow the instructions in the tool and should not run into any issues.

The LED on the ScanSnap Evernote Edition will turn orange during the firmware flash and the device will reboot once it's done.

![orange led on device](led_orange.jpg)

![firmware update in progress](progress.jpg)

If you used a virtual machine with USB pass through. The USB device may not reconnect after rebooting once the firmware flash is done. In that case, the tool will show an error message, telling you that it was unsuccessful.
But don't be scared, you can close the software and share the device with the virtual machine again, rebooting the virtual machine if needed.  
Once you run the tool again, it will seamlessly continue the process and finish the firmware update.

![ending firware update](ending.png)

Your ScanSnap Evernote Edition will reboot once again. It is now functionally a normal ScanSnap ix500, which means that you can now use it with the normal ScanSnap Manager/Home software.

![complete](complete.png)

## Congratulations, wou did it! Enjoy your ScanSnap ix500!

---

I used the latest version available at the time of writing of the ScanSnap Home Offline Installer on the same virtual machine (although the oldest verision of macOS it officcially supports is macOS Catalina 10.15) after another sharing the USB device again to test it. It worked perfectly and I have archived the installer for that as well, which you can find on the same page as the other files ([MacSSHOfflineInstaller_2_22_0.dmg](https://files.nils.moe/software/scansnap/MacSSHOfflineInstaller_2_22_0.dmg)).

---

In the following image, you can see the output of `lsusb` on my Linux desktop before during and after the firmware flash. Note that the device number changed after each reboot, so I had to share the device again. Once the firmware flash was done, the device is recognized as `ScanSnap ix500` instead of `ScanSnapix500EE`.

![lsusb](lsusb.png)
