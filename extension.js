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
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
// Import necessary libs
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const { UserWidget } = imports.ui.userWidget;
const Util = imports.misc.util;
const { AccountsService, Clutter, GLib, St } = imports.gi;

//Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//Create the variable for the extension item shown in menu
var bigAvatarItem = null;

//Create a global variable to hold user settings
let settings;

//Launch the extension
function init() {}

//Run the command when clicking on the bigAvatarItem
function runCommand() {
    Util.spawn(['/bin/bash', '-c', settings.get_string('command')]);
}

//Run when extension is enabled
function enable() {
    //Get user preferences
    settings = Convenience.getSettings();
    //Connect the changing of any values to the UpdateExtension function
    settings.connect('changed::horizontalmode', UpdateExtension);
    settings.connect('changed::defaultcommandmode', UpdateExtension);
    settings.connect('changed::command', UpdateExtension);
    //Call the drawExtension function to draw the bigAvatarItem the first time
    drawExtension();
}

//Run when extension is disabled
function disable() {
    //Disconnect systemMenu
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    //Remove the bigAvatarItem
    bigAvatarItem.destroy();
    settings.run_dispose();
}

//Remove the bigAvatarItem and draw the updated one
function UpdateExtension() {
    //Disconnect systemMenu
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    //Remove the bigAvatarItem
    bigAvatarItem.destroy();
    //Redraw the bigAvatarItem
    drawExtension();
}

function drawExtension() {
    //Create the new bigAvatarItem
    this.bigAvatarItem = new PopupMenu.PopupMenuItem('');
    //Connect the bigAvatarItem to opening the 'Users' page in settings
    this.bigAvatarItem.connect('button-press-event', runCommand);
    //Add a box where we are going to store picture and avatar
    this.bigAvatarItem.add_child(
        new St.BoxLayout({
            x_expand: true,
            y_expand: true,
            vertical: true,
        }));
    //Change orientation if in horizontal mode
    var orientation = (Clutter.Orientation.VERTICAL);
    if (settings.get_boolean('horizontalmode')) { orientation = Clutter.Orientation.HORIZONTAL; }

    //Adds bigAvatarItem to the menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.bigAvatarItem, 0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;
    //Get username
    var userManager = AccountsService.UserManager.get_default();
    var user = userManager.get_user(GLib.get_user_name());
    //Draw the bigAvatarItem
    var avatar = new UserWidget(user, orientation);
    avatar._updateUser();
    this.bigAvatarItem.actor.get_last_child().add_child(avatar);
}
