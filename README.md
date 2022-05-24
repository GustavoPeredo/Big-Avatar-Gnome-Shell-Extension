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

1. Download the zip and extract it, or clone the repository

2. Navigate to the folder

3. Get the UUID from `metadata.json`

    ```bash
    UUID=$(grep -E '^[ ]*"uuid":' ./metadata.json | \
    sed 's@^[ ]*"uuid":[ ]*"\(.\+\)",[ ]*@\1@')

    echo $UUID
    ```

4. Remove any previous version and install the extension

    ```bash
    rm -rfv $HOME/.local/share/gnome-shell/extensions/$UUID
    mkdir -v $HOME/.local/share/gnome-shell/extensions/$UUID
    cp -rv ./* $HOME/.local/share/gnome-shell/extensions/$UUID
    ```

5. Reload `gnome-shell`
   - Press **ALT+F2**, then enter **r** (not possible on Wayland)
   - or run `killall gnome-shell` (not possible on Wayland)
   - or log out, and re-login

6. Enable the extension

## TODO List

- [ ] :mag: Perform SEO on README and [extensions website](https://extensions.gnome.org/extension/3488/big-avatar/)

- [ ] :bug: Fix Big Avatar not being immediately updated after changing settings

- [ ] :sparkles: Implement **custom command**

- [ ] :sparkles: Implement **custom sizes for user icon and name**

- [x] :lipstick: Add boxes background to settings menu

- [x] :memo: Add an installation section to README.md

- [x] :rocket: **Remove Makefile**

- [x] :rocket: **remove convenience.js and use getSettings() from ExtensionUtils
instead of creating your own custom functions:
<https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/main/js/misc/extensionUtils.js>**

- [x] :package: ~~Update `Makefile` to include correct build and reload commands~~

## Notes

- This project is a fork of **[db0x's extension](https://github.com/db0x/bigavatar-db0x.de).**

- Huge thanks for @djinnalexio for his amazing contribution! He single handedly revived this extension!
