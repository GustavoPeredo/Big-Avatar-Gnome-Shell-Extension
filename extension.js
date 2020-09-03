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
let compactMode;

function init() {
}

//Run when enabled
function enable() {
    //Get user preferences
    settings = Convenience.getSettings();
    compactMode = settings.get_boolean('compactmode');
    //Connect whenever the value changes to the onCompactModeChange function
    settings.connect('changed::compactmode', onCompactModeChange);
    //Calls the onCompactModeChange function regardless
    onCompactModeChange();
}

//Run when disabled
function disable() {
    //Disconnects systemMenu
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    //Destroyes iconMenuItem (basically removes the option from the menu)
    /* FIXME: For some reason, disabling the extension does not actually disables
    the extension :/, it requires a shell restart to remove the entry */
    iconMenuItem.destroy();
}

function onCompactModeChange () {
    //Get wether Compact Mode is enabled by user
    compactMode = settings.get_boolean('compactmode');
    //Destroys previous items
    if (this.iconMenuItem) {
      this.iconMenuItem.destroy();
    }
    //Destroys previous items
    //FIXME: The first created item is apparently saved as a global variable
    if (iconMenuItem) {
      iconMenuItem.destroy();
    }
    //Creates different widgets depending on mode
    if (compactMode) {
      this.iconMenuItem = new UserIconMenuItemCompact();
    } else {
      this.iconMenuItem = new UserIconMenuItem();
    }
    //Adds item to menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.iconMenuItem,0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;
    //When the popup menu opens do this:
    //Check if on compact mode
    if (compactMode) {
      this._menuOpenStateChangedId = this.systemMenu.menu.connect('open-state-changed', Lang.bind(this,
          function(menu, open) {
                  if (!open)
                      return;
	      //Get user avatar and name
              var userManager = AccountsService.UserManager.get_default();
              var user = userManager.get_user(GLib.get_user_name());
              //Get user icon
              var avatar = new Avatar(user, {
              	iconSize: 48,
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
              nameString.style = "font-size: 16px;";

              //Add name
              this.iconMenuItem.actor.get_last_child().add_child(nameString);
          }));
          } else {
          this._menuOpenStateChangedId = this.systemMenu.menu.connect('open-state-changed', Lang.bind(this,
          function(menu, open) {
                  if (!open)
                      return;
	      //Get user avatar and name
              var userManager = AccountsService.UserManager.get_default();
              var user = userManager.get_user(GLib.get_user_name());
              //Get user icon
              var avatar = new Avatar(user, {
              	iconSize: 144,
              });
              //Get user name and center it horizontally
              var nameString = new St.Label ({
              	text: "\n" +  GLib.get_real_name() + "\n",
              	x_align: Clutter.ActorAlign.CENTER
              });
              avatar.update();
              //Remove all created menu itens
              this.iconMenuItem.actor.get_last_child().remove_all_children();

              //Add the avatar picture
              this.iconMenuItem.actor.get_last_child().add_child(avatar.actor);

              //Set font size
              nameString.style = "font-size: 18px;";


              //Add name
              this.iconMenuItem.actor.get_last_child().add_child(nameString);


          }));
          }
}

//Do not run if earlier than 3.36
if (shell_Version < '3.36') {

} else {
	//Create menu item
	var UserIconMenuItem = GObject.registerClass(
        {
            GTypeName: 'UserIconMenuItem'
        },
        class UserIconMenuItem extends PopupMenu.PopupBaseMenuItem {
	    	_init() {
                super._init();
		        var box = new St.BoxLayout({ 
		            //Center, expand in y and put items on the vertical
            		    x_align: Clutter.ActorAlign.CENTER,
            		    y_expand: true,
            		    vertical: true
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
	//Create compact menu item
  	var UserIconMenuItemCompact = GObject.registerClass(
        {
            GTypeName: 'UserIconMenuItemCompact'
        },
        class UserIconMenuItemCompact extends PopupMenu.PopupBaseMenuItem {
	    	_init() {
                super._init();
		        var box = new St.BoxLayout({
		            //Center, expand in y and put items on the vertical
            		    x_align: Clutter.ActorAlign.START,
            		    y_expand: true,
            		    vertical: false
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
}
