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
// Import nescessary libs
const Main = imports.ui.main;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;
const { AccountsService, Clutter, GLib, St } = imports.gi;
const { UserWidget } = imports.ui.userWidget;

//Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//Creates temporary iconMenuItem variable
var iconMenuItem = null;

//Creates some global variables
let settings;

function init() {
}

function openUserAccount() {
    Util.spawn(['/bin/bash', '-c', "gnome-control-center user-accounts"]);
}

//Run when enabled
function enable() {
    //Get user preferences
    settings = Convenience.getSettings();
    //Connects changing any of the values to the resetPre function
    settings.connect('changed::horizontalmode', resetPre);
    //Calls the updateExtensionAppearence function to draw the first icon
    updateExtensionAppearence();
}

//Run when disabled
function disable() {
    //Disconnects systemMenu
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    //Destroys iconMenuItem (basically removes the option from the menu)
    iconMenuItem.destroy();
    settings.run_dispose()
}

//Destroys everything and creates a new one
function resetPre() {
    //Disconnects systemMenu
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    //Destroys iconMenuItem (basically removes the option from the menu)
    iconMenuItem.destroy();
    updateExtensionAppearence()
}

function updateExtensionAppearence() {
    //Creates new PopupMenuItem
    this.iconMenuItem = new PopupMenu.PopupMenuItem('');
    this.iconMenuItem.connect('button-press-event', openUserAccount);
    var orientation = Clutter.Orientation.VERTICAL;
    //Adds a box where we are going to store picture and avatar
    this.iconMenuItem.add_child(
        new St.BoxLayout({
            x_expand: true,
          	y_expand: true,
          	vertical: true,
         })
    );
    //Test if in horizontal mode and change vertical and alignment variables
	  if (settings.get_boolean('horizontalmode')) {
	      orientation = Clutter.Orientation.HORIZONTAL;
    }

    //Adds item to menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.iconMenuItem, 0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;

    var userManager = AccountsService.UserManager.get_default();
    var user = userManager.get_user(GLib.get_user_name());
    var avatar = new UserWidget(user, orientation);
    avatar._updateUser();
    this.iconMenuItem.actor.get_last_child().add_child(avatar);
}

