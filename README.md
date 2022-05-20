<h1 align = "center">
    Gnome Extension: Big Avatar
</h1>

<p align="center">
    <img src="https://img.shields.io/github/languages/top/GustavoPeredo/Big-Avatar-Gnome-Shell-Extension.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/languages/code-size/GustavoPeredo/Big-Avatar-Gnome-Shell-Extension.svg?style=for-the-badge">
    <img src="https://img.shields.io/github/repo-size/GustavoPeredo/Big-Avatar-Gnome-Shell-Extension.svg?style=for-the-badge">
    <a href="LICENSE">
        <img src="https://img.shields.io/github/license/GustavoPeredo/Big-Avatar-Gnome-Shell-Extension.svg?style=for-the-badge&color=blue">
    </a>
    <a href="https://extensions.gnome.org/extension/3488/big-avatar/">
        <img src="https://img.shields.io/website/https/extensions.gnome.org/extension/3488/big-avatar.svg?down_message=offline&label=extensions.gnome.org&style=for-the-badge&up_color=blue&up_message=online">
    </a>
</p>

This extension adds your user icon and name to your menu panel.

Compatible with Gnome 40+.

<h2 align="center">
    <a href="https://extensions.gnome.org/extension/3488/big-avatar/">
    Click here to install Big Avatar now!
    </a>
</h2>

![screenshot](screenshot.png)

## Installation from Source

1. Download the zip and extract it or clone the repository

2. From the project folder, run:

    ```bash
    make install
    ```

3. Reload `gnome-shell`
   - Press **ALT+F2**, then enter **r** (not possible on Wayland)
   - or run `killall gnome-shell` (not possible on Wayland)
   - or log out, and re-login

4. Enable the extension

## TODO List

- [ ] Implement custom command

- [ ] Implement custom sizes for user icon and name

- [ ] Add boxes background to settings menu

- [x] Update `Makefile` to include correct build and reload commands

- [x] Add an installation section to README.md

## Notes

- This project is a fork of **[db0x's extension](https://github.com/db0x/bigavatar-db0x.de).**
