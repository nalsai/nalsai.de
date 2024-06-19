+++
title = "Run Resolve on Fedora or any Linux distro"
description = "How to successfully run DaVinci Resolve on Fedora 40 and any other Linux distro without errors."
tags = [
  "Linux",
]
date = 2024-06-19
+++

Note: I only have experience with AMD GPUs. If you have an NVIDIA GPU, you may need some different steps.

## Error: Outdated Library Dependencies

Error: `symbol lookup error: /lib64/lib*: undefined symbol: *`

DaVinci Resolve is bundled with outdated library dependencies. To run it on Fedora 39 and above, you need to disable the bundled libraries to use the system ones.

```sh
cd /opt/resolve/libs
sudo mkdir disabled
sudo mv libglib* disabled
sudo mv libgio* disabled
sudo mv libgmodule* disabled
```

## Error: GPU processing error -1

Error:  

```sh
- Error: CL_BUILD_PROGRAM_FAILURE
- Options: " -w -cl-mad-enable -cl-fast-relaxed-math -Dz323df50901b485739bf3a3b9a84c73b0 -Dz6e436e44fad709e7c0aa0046bd091019 -Dz0e5796447bfd2d547303f3e691aa58b0 -Dzc229ce7b384e9cbe83e58608fba7c36d"
- Build log: fatal error: malformed or corrupted AST file: 'could not find file '/usr/lib64/llvm17/bin/../../../lib/clang/17/include/opencl-c-base.h' referenced by AST file '/tmp/comgr-6a948c/include/opencl1.2-c.pch''
1 error generated.
Error: Failed to compile source (from CL or HIP source to LLVM IR).
```

This seems to be a bug with path resolution. You can fix it by creating a symlink.

```sh
cd /usr/lib64/llvm17/bin/
sudo ln -s /usr/lib/clang/17/include/opencl-c-base.h
```

## How to reliably run DaVinci Resolve  on other Distros

You can use distrobox to run DaVinci Resolve on any Linux distribution. It works like a Docker container with full desktop integration.

```sh
# fedora 38 doesn't need any workarounds, you can also use the latest fedora version with the workarounds or Rocky Linux, which is the official supported distro
distrobox create distrobox create --name resolve --image registry.fedoraproject.org/fedora:38 
distrobox enter resolve

# install dependencies
sudo dnf install alsa-lib apr apr-util fontconfig freetype libglvnd-egl librsvg2 libXcursor libXi libXinerama libxkbcommon-x11 libXrandr libXrender libXtst mtdev pulseaudio-libs mesa-libGLU xcb-util-image xcb-util-keysyms xcb-util-renderutil xcb-util-wm

# install runtime dependencies (rocm-opencl is only needed for AMD GPUs, for NVIDIA you need the NVIDIA OpenCL driver)
sudo dnf install alsa-plugins-pulseaudio libxcrypt-compat rocm-opencl

# run the DaVinci Resolve installer
chmod +x DaVinci_Resolve_Studio_18.6.6_Linux.run
./DaVinci_Resolve_Studio_18.6.6_Linux.run --appimage-extract
sudo SKIP_PACKAGE_CHECK=1 ./squashfs-root/AppRun  # on fedora 40, you need to add the SKIP_PACKAGE_CHECK=1 because the version of zlib in fedora 40 is too new

# run DaVinci Resolve
/opt/resolve/bin/resolve

# export desktop files
distrobox-export --app resolve
```

## How to get media to be compatible with the free version of DaVinci Resolve on Linux

You can encode your media to ProRes with PCM audio using ffmpeg. Note that the file size will be large.

```sh
ffmpeg -i in.mov -c:v prores_ks -profile:v 3 -qscale:v 9 -c:a pcm_s16le out.mov
```

## Sources

- <https://discussion.fedoraproject.org/t/howto-davinci-installation-up-to-f40/114020>
- <https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=201680>
