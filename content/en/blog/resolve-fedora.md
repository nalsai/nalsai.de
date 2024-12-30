+++
title = "Run Resolve on any Linux distro"
description = "How to successfully run DaVinci Resolve on the latest Fedora version or any other Linux distro using distrobox."
tags = ["Linux", "Software"]
date = 2024-06-19
+++

Note: I only have experience with AMD GPUs. If you have an NVIDIA GPU, you need to install the NVIDIA OpenCL driver instead of `rocm-opencl` and may need some different steps.
{.alert .alert-info}


You can use distrobox to run DaVinci Resolve on any Linux distribution. It works like a Docker container with full desktop integration (based on Podman).  
Fedora 38 as a base OS works fairly reliably, but you can also use Rocky Linux (the official supported distro).

```sh
# create a Fedora 38 container and enter it
distrobox create distrobox create --name resolve --image registry.fedoraproject.org/fedora:38
distrobox enter resolve

# install dependencies
sudo dnf install alsa-lib apr apr-util fontconfig freetype libglvnd-egl librsvg2 libXcursor libXi libXinerama libxkbcommon-x11 libXrandr libXrender libXtst mtdev pulseaudio-libs mesa-libGLU xcb-util-image xcb-util-keysyms xcb-util-renderutil xcb-util-wm mesa-libGL

# install runtime dependencies (rocm-opencl is only needed for AMD GPUs, for NVIDIA you need the NVIDIA OpenCL driver)
sudo dnf install alsa-plugins-pulseaudio libxcrypt-compat rocm-opencl

# run the DaVinci Resolve installer
chmod +x DaVinci_Resolve_Studio_19.0_Linux.run
./DaVinci_Resolve_Studio_19.0_Linux.run --appimage-extract
sudo SKIP_PACKAGE_CHECK=1 ./squashfs-root/AppRun

# navigate through the installation wizard and then proceed with the following steps

# apply workaround for outdated libraries
sudo mkdir /opt/resolve/libs/disabled
sudo mv /opt/resolve/libs/libglib* /opt/resolve/libs/disabled
sudo mv /opt/resolve/libs/libgio* /opt/resolve/libs/disabled
sudo mv /opt/resolve/libs/libgmodule* /opt/resolve/libs/disabled

# run DaVinci Resolve
/opt/resolve/bin/resolve

# export desktop files
distrobox-export --app resolve
```

Now you can run DaVinci Resolve from your desktop environment or from the terminal.

```sh
distrobox enter resolve
/opt/resolve/bin/resolve
```

---

## Errors and Workarounds

### Error: Outdated Library Dependencies

Error: `symbol lookup error: /lib64/lib*: undefined symbol: *`

DaVinci Resolve is bundled with outdated library dependencies, which may not be compatible with your system libraries.
In this case, you can disable the bundled libraries to make it use the system libraries instead.

```sh
cd /opt/resolve/libs
sudo mkdir disabled
sudo mv libglib* disabled
sudo mv libgio* disabled
sudo mv libgmodule* disabled
```

### Error: GPU processing error -1

(Experienced on Fedora 40)

Error:  

```sh
- Error: CL_BUILD_PROGRAM_FAILURE
- Options: " -w -cl-mad-enable -cl-fast-relaxed-math -Dz323df50901b485739bf3a3b9a84c73b0 -Dz6e436e44fad709e7c0aa0046bd091019 -Dz0e5796447bfd2d547303f3e691aa58b0 -Dzc229ce7b384e9cbe83e58608fba7c36d"
- Build log: fatal error: malformed or corrupted AST file: 'could not find file '/usr/lib64/llvm17/bin/../../../lib/clang/17/include/opencl-c-base.h' referenced by AST file '/tmp/comgr-6a948c/include/opencl1.2-c.pch''
1 error generated.
Error: Failed to compile source (from CL or HIP source to LLVM IR).
```

This seems to be a bug with the path being resolved incorrectly. You can fix it by creating a symlink.

```sh
cd /usr/lib64/llvm17/bin/
sudo ln -s /usr/lib/clang/17/include/opencl-c-base.h
```

---

## How to get your media to be compatible

If you use the free version of DaVinci Resolve, you may need to encode your media to ProRes with PCM audio for it to be compatible. (Note that the file size will be much larger than the original.)  

```sh
ffmpeg -i in.mov -c:v prores_ks -profile:v 3 -qscale:v 9 -c:a pcm_s16le out.mov
```

If you use the studio version, you may still need to encode audio but you should be able to use `-c:v copy` to keep the video stream as is. This will save time and disk space.

```sh
ffmpeg -i in.mov -c:v copy -c:a pcm_s16le out.mov
```
