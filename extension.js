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
const Lang = imports.lang;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;
const { AccountsService, Clutter, GLib, St } = imports.gi;
const { Avatar } = imports.ui.userWidget;
const Config = imports.misc.config;
const GObject = imports.gi.GObject;

//Import extension preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//Creates temporary iconMenuItem variable
var iconMenuItem = null;

//Creates some global variables
let shell_Version = Config.PACKAGE_VERSION;
let settings;

//Defines UserIconMenuItem
var UserIconMenuItem = new GObject.registerClass(
    {
        GTypeName: 'UserIconMenuItem'
    },
    class UserIconMenuItem extends PopupMenu.PopupBaseMenuItem {
        _init() {
            super._init();
            var box = new St.BoxLayout({
                x_align: Clutter.ActorAlign.CENTER,
        		    y_expand: true,
        		    vertical: true,
            });
            this.actor.add(box, {
                expand: true
            });
        }
        //When clicked, open gnome control center
        activate() {
            Util.spawnCommandLine("gnome-control-center user-accounts");
        }
    }
);

function init() {
}

//Run when enabled
function enable() {
    //Get user preferences
    settings = Convenience.getSettings();
    //Connects changing any of the values to the resetPre function
    settings.connect('changed::horizontalmode', resetPre);
    settings.connect('changed::fontsize', resetPre);
    settings.connect('changed::picturesize', resetPre);
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
    //Creates based on UserIconMenuItem
    this.iconMenuItem = new UserIconMenuItem();

    //Test if in horizontal mode and change vertical and alignment variables
	  if (settings.get_boolean('horizontalmode')) {
	      this.iconMenuItem.actor.get_last_child().set_vertical(!this.iconMenuItem.actor.get_last_child().get_vertical());
	      this.iconMenuItem.actor.get_last_child().x_align = Clutter.ActorAlign.START;
    }

    //Adds item to menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.iconMenuItem, 0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;

    //When the popup menu opens do this:
    //Check if on compact mode
    this._menuOpenStateChangedId = this.systemMenu.menu.connect('open-state-changed', Lang.bind(this,
          function(menu, open) {
              if (!open)
                  return;
	            //Get user avatar and name
              var userManager = AccountsService.UserManager.get_default();
              var user = userManager.get_user(GLib.get_user_name());
              //Get user icon
              var avatar = new Avatar(user, {
              	iconSize: settings.get_int('picturesize'),
              });
              //Get user name and center it vertically
              var nameString = new St.Label ({
              	text: "  " + GLib.get_real_name(),
              	y_align: Clutter.ActorAlign.CENTER
              });
              avatar.update();

              //Remove all created menu itens
              this.iconMenuItem.actor.get_last_child().remove_all_children();

              //Add the avatar picture
              this.iconMenuItem.actor.get_last_child().add_child(avatar.actor);

              //Set font size
              nameString.style = "font-size: " + settings.get_int('fontsize').toString() + "px; margin: 8px;";

              //Add name
              this.iconMenuItem.actor.get_last_child().add_child(nameString);
    }));
}
