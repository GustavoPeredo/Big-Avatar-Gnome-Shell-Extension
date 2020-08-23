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

const Main = imports.ui.main;
const Lang = imports.lang;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;
const { AccountsService, Clutter, GLib, St } = imports.gi;
const { Avatar } = imports.ui.userWidget;
const Config = imports.misc.config;
const GObject = imports.gi.GObject;

var iconMenuItem = null;

let shell_Version = Config.PACKAGE_VERSION;

function init() {
}

function enable() {
    //When enabled create a new menu item
    this.iconMenuItem = new UserIconMenuItem();
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(this.iconMenuItem,0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;
    //When the popup menu opens do this:
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
            //Get user name
            var nameString = new St.Label ({
            	text: "\n" +  GLib.get_real_name() + "\n"
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

//Run when disabled
function disable() {
    if (this._menuOpenStateChangedId) {
        this.systemMenu.menu.disconnect(this._menuOpenStateChangedId);
        this._menuOpenStateChangedId = 0;
    }
    iconMenuItem.destroy();
}

//Do this if in 3.36+
if (shell_Version < '3.36') {

} else {
	//Create menu item (see line 38)
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

}
