"use strict";

//Import required libraries
const Main = imports.ui.main;//access to the panel menu

const PopupMenu = imports.ui.popupMenu;//object that the extension is in the panel menu

const UserWidget = imports.ui.userWidget.UserWidget;//something to do with user name and icon

const Util = imports.misc.util;//access system to run shell comand

const { AccountsService, Clutter, Gio, GLib, St } = imports.gi;//tools for layout and user data

const ExtensionUtils = imports.misc.extensionUtils;//access to settings from schema

//Launch the extension
function init() {}

//Create a global variable to hold user settings
let settings;

//Run when extension is enabled
function enable() {
    //Get user preferences
    settings = ExtensionUtils.getSettings();
    //Connect the changing of any values to the UpdateExtension function
    settings.connect('changed::horizontalmode', UpdateExtension);
    //settings.connect('changed::defaultcommandmode', UpdateExtension);
    settings.connect('changed::command', UpdateExtension);
    //Call the drawExtension function to draw the bigAvatarItem the first time
    drawExtension();
}

//Run when extension is disabled
function disable() {
    //Disconnect systemMenu
    if (_menuOpenStateChangedId) {
        systemMenu.menu.disconnect(_menuOpenStateChangedId);
        _menuOpenStateChangedId = 0;
    }
    //Remove the bigAvatarItem
    bigAvatarItem.destroy();
    bigAvatarItem = null;
    settings.run_dispose();
    settings = null;
}

//Create the variable for the extension item shown in menu
var bigAvatarItem = null;

//Create the item and add it to the panel menu
function drawExtension() {
    //Create the new bigAvatarItem
    bigAvatarItem = new PopupMenu.PopupMenuItem('');
    //Connect the bigAvatarItem to opening the 'Users' page in settings
    bigAvatarItem.connect('button-press-event', runCommand);
    //Add a box where we are going to store picture and avatar
    bigAvatarItem.add_child(
        new St.BoxLayout({
            x_expand: true,
            y_expand: true,
            vertical: true,
        }));
    //Change orientation if in horizontal mode
    var orientation = (Clutter.Orientation.VERTICAL);
    if (settings.get_boolean('horizontalmode')) { orientation = Clutter.Orientation.HORIZONTAL; }

    //Adds bigAvatarItem to the menu
    Main.panel.statusArea.aggregateMenu.menu.addMenuItem(bigAvatarItem, 0);
    this.systemMenu = Main.panel.statusArea['aggregateMenu']._system;
    //Get username
    var userManager = AccountsService.UserManager.get_default();
    var user = userManager.get_user(GLib.get_user_name());
    //Draw the bigAvatarItem
    var avatar = new UserWidget(user, orientation);
    avatar._updateUser();
    bigAvatarItem.actor.get_last_child().add_child(avatar);
}

//Run the command when clicking on the bigAvatarItem
function runCommand() {
    Util.spawn(['/bin/bash', '-c', settings.get_string('command')]);
}

//Remove the bigAvatarItem and draw the updated one
function UpdateExtension() {
    //Disconnect systemMenu
    if (_menuOpenStateChangedId) {
        systemMenu.menu.disconnect(_menuOpenStateChangedId);
        _menuOpenStateChangedId = 0;
    }
    //Remove the bigAvatarItem
    bigAvatarItem.destroy();
    //Redraw the bigAvatarItem
    drawExtension();
}
