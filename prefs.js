"use strict";

//Import required libraries
const { Adw, Gdk, GdkPixbuf, Gio, GLib, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;//access to settings from schema

function init() {}

function fillPreferencesWindow(window) {
    // Use the same GSettings schema as in `extension.js`
    const settings = ExtensionUtils.getSettings();

    // Create a preferences page and groups
    const page = new Adw.PreferencesPage();
    // Add our page to the window
    window.add(page);

    // HORIZONTAL MODE SETTINGS
    const horizontalModeGroup = new Adw.PreferencesGroup();
    page.add(horizontalModeGroup);

    const horizontalModeRow = new Adw.ActionRow({ title: 'Horizontal Mode' });
    horizontalModeGroup.add(horizontalModeRow);
    // Create the switch and bind its value to the key
    const horizontalModeToggle = new Gtk.Switch({
        active: settings.get_boolean('horizontalmode'),
        valign: Gtk.Align.CENTER });
    settings.bind( 'horizontalmode', horizontalModeToggle, 'state', Gio.SettingsBindFlags.DEFAULT );
    // Add the switch to the row
    horizontalModeRow.add_suffix(horizontalModeToggle);
    horizontalModeRow.activatable_widget = horizontalModeToggle;

    // COMMAND SETTINGS
    const commandGroup = new Adw.PreferencesGroup({ title: 'Launch Command Settings' });
    page.add(commandGroup);

    const defaultCommandRow = new Adw.ActionRow({ title: 'Default Command', subtitle: 'gnome-extensions-app' });
    commandGroup.add(defaultCommandRow);
    // Create the switch and bind its value to the key
    const defaultCommandToggle = new Gtk.Switch({
        active: settings.get_boolean('defaultcommandmode'),
        valign: Gtk.Align.CENTER });
    settings.bind( 'defaultcommandmode', defaultCommandToggle, 'active', Gio.SettingsBindFlags.DEFAULT );
    // Add the switch to the row
    defaultCommandRow.add_suffix(defaultCommandToggle);
    defaultCommandRow.activatable_widget = defaultCommandToggle;

    const presetCommandRow = new Adw.ActionRow({ title: 'Preset Commands' });
    commandGroup.add(presetCommandRow);
    //Create the box
    const presetCommandBox = new Gtk.ComboBoxText({
        active_id: settings.get_string('command'),
        has_entry: true,
        entry_text_column: 0,
        has_frame: true,

        hexpand: true,
    });

    presetCommandBox.append_text("nautilus");

    settings.bind()



    const customCommandRow = new Adw.ActionRow({ title: 'Custom Command' });
    commandGroup.add(customCommandRow);
    // Create the input field and bind its value to the key
    const customCommandText = new Gtk.EntryBuffer( {text: settings.get_string('command')} );
    const customCommandField = new Gtk.Entry( {buffer: customCommandText, hexpand: true } );
    settings.bind( 'command', customCommandField.buffer, 'text', Gio.SettingsBindFlags.DEFAULT );
    // Add the field to the row
    customCommandRow.add_suffix(customCommandField);
    customCommandRow.activatable_widget = customCommandField;


}
