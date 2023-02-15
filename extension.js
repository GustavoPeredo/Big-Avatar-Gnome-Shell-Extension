/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
'use strict';

//Import required libraries
const Main = imports.ui.main;//Access to the panel menu

const PopupMenu = imports.ui.popupMenu;//Object that the extension is in the panel menu

const UserWidget = imports.ui.userWidget.UserWidget;//Something to do with user name and icon

const Util = imports.misc.util;//Access system to run shell command

const { AccountsService, Clutter, GLib, St } = imports.gi;//Tools for layout and user data

const ExtensionUtils = imports.misc.extensionUtils;//Access to settings from schema
let settings;//Create a global variable to connect user settings

function init() {}//Launch the extension

//Run when extension is enabled
function enable() {
    settings = ExtensionUtils.getSettings();
    //Connect the changing of any values to the UpdateExtension function
    settings.connect('changed::horizontalmode', UpdateExtension);
    settings.connect('changed::command', UpdateExtension);
    settings.connect('changed::position', UpdateExtension);
    drawExtension();
}

//Run when extension is disabled
function disable() {
    //Remove the bigAvatarItem
    if (bigAvatarMenuItem !== null) {
        bigAvatarMenuItem.destroy();
        bigAvatarMenuItem = null;
    }
    //Remove the bigAvatarItem
    if (bigAvatarItem !== null) {
        bigAvatarItem.destroy();
        bigAvatarItem = null;
    }
    //Clear settings
    settings.run_dispose();
    settings = null;
}

//Create the variable to hold our extension
var bigAvatarItem = null;
var bigAvatarMenuItem = null;

//Create the item and add it to the panel menu
function drawExtension() {
    //Create a box where we are going to store picture and avatar
    bigAvatarItem = new St.BoxLayout({
        'x_expand': true,
        'y_expand': true,
        'vertical': true,
        'reactive': true,
    });

    // Run a command when the extension is clicked
    bigAvatarItem.connect('button-press-event', runCommand);//Run a command when the extension is clicked

    const quickSettingsPanel = Main.panel.statusArea.quickSettings;
    
    if (settings.get_int('position') === 0) { // Top position
        // Add bigAvatarItem to quickSettingsMenuGrid
        const quickSettingsMenuGrid = quickSettingsPanel.menu._grid;
        quickSettingsMenuGrid.insert_child_at_index(bigAvatarItem, 2);
        quickSettingsMenuGrid.layout_manager.child_set_property(
            quickSettingsMenuGrid, bigAvatarItem, 'column-span', 2);
    } else {
        // Add bigAvatarItem to quickSettingsMenu
        const quickSettingsMenu = quickSettingsPanel.menu;
        bigAvatarMenuItem = new PopupMenu.PopupMenuItem('');
        bigAvatarMenuItem.set_reactive(false);
        bigAvatarMenuItem.add_child(bigAvatarItem);
        quickSettingsMenu.addMenuItem(bigAvatarMenuItem, 0);
    }
    
    // Get username
    var userManager = AccountsService.UserManager.get_default();
    var user = userManager.get_user(GLib.get_user_name());

    // Draw the bigAvatarItem
    var avatar = new UserWidget(user, get_orientation());
    avatar._updateUser();

    bigAvatarItem.add_child(avatar);
}

//Get the user-defined orientation
function get_orientation() {
    if (settings.get_boolean('horizontalmode')) { return Clutter.Orientation.HORIZONTAL; }
    else { return Clutter.Orientation.VERTICAL; }
}

//Get the user-defined command and run it in shell
function runCommand() { Util.spawn(['/bin/bash', '-c', settings.get_string('command')]); }

//Remove the bigAvatarItem and draw the updated one
function UpdateExtension() {
    //Remove the bigAvatarItem
    if (bigAvatarMenuItem !== null) {
        bigAvatarMenuItem.destroy();
        bigAvatarMenuItem = null;
    }
    //Remove the bigAvatarItem
    if (bigAvatarItem !== null) {
        bigAvatarItem.destroy();
        bigAvatarItem = null;
    }
    drawExtension();
}
