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

const Util = imports.misc.util;//Access system to run shell comand

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
    drawExtension();
}

//Run when extension is disabled
function disable() {
    //Remove the bigAvatarItem
    bigAvatarItem.destroy();
    bigAvatarItem = null;
    //Clear settings
    settings.run_dispose();
    settings = null;
}

//Create the variable to hold our extension
var bigAvatarItem = null;

//Create the item and add it to the panel menu
function drawExtension() {
    bigAvatarItem = new PopupMenu.PopupMenuItem('');
    bigAvatarItem.connect('button-press-event', runCommand);//Run a command when the extension is clicked
    //Add a box where we are going to store picture and avatar
    bigAvatarItem.add_child(
        new St.BoxLayout({
            x_expand: true,
            y_expand: true,
            vertical: true,
        }));
    //Add bigAvatarItem to the menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(bigAvatarItem, 0);
    //Get username
    var userManager = AccountsService.UserManager.get_default();
    var user = userManager.get_user(GLib.get_user_name());
    //Draw the bigAvatarItem
    var avatar = new UserWidget(user, get_orientation());
    avatar._updateUser();
    bigAvatarItem.actor.get_last_child().add_child(avatar);
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
    bigAvatarItem.destroy();
    bigAvatarItem = null;
    drawExtension();
}
