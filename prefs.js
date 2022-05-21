"use strict";

//Import required libraries
const { Adw, Gdk, GdkPixbuf, Gio, GLib, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;//access to settings from schema

//Create a global variable to hold user settings
let settings;

function fillPreferencesWindow(window) {

    //Get user preferences
    settings = ExtensionUtils.getSettings();

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({ title: 'Horizontal Mode' });
    group.add(row);

    // Create the switch and bind its value to the `show-indicator` key
    const toggle = new Gtk.Switch({
        active: settings.get_boolean ('horizontalmode'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'horizontalmode',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT
    );

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    // Add our page to the window
    window.add(page);
}
