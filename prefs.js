// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
//Import required libs
const { GObject, Gtk } = imports.gi;
const Lang = imports.lang;

//Import user preferences
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {}

//Create settings window with a grid
const BigAvatarSettings = new GObject.Class({
    Name: 'BigAvatarPrefs',
    Extends: Gtk.Grid,
    _init: function(params) {
        //Give grid's characteristics
        this.parent(params);
        this.set_row_spacing(8);
        this.margin_start = 32;
        this.margin_end = 32;
        this.margin_bottom = 16;
        this._settings = Convenience.getSettings();

        //Create temporary menu variables
        let horizontalModeLabel = null;
        let horizontalModeToggle = null;
        let defaultCommandModeLabel = null;
        let defaultCommandModeToggle = null;
        let customCommandLabel = null;
        let customCommandEntry = null;

        //Create labels;
        horizontalModeLabel = new Gtk.Label({
            label: 'Horizontal Orientation',
            hexpand: true,
            halign: Gtk.Align.START
        });

        defaultCommandModeLabel = new Gtk.Label({
            label: 'Default command (User Settings)',
            hexpand: true,
            halign: Gtk.Align.START
        });

        customCommandLabel = new Gtk.Label({
            label: 'Custom shell command',
            hexpand: true,
            halign: Gtk.Align.START
        });

        //Create interactive settings interfaces
        horizontalModeToggle = new Gtk.Switch({halign:Gtk.Align.END});
        defaultCommandModeToggle = new Gtk.Switch({halign:Gtk.Align.END});
        customCommandEntry = new Gtk.Entry({halign:Gtk.Align.END, hexpand:true});

        //Create temporary settings variables from the values from gschema
        let horizontalMode = this._settings.get_boolean('horizontalmode');
        let defaultCommandMode = this._settings.get_boolean('defaultcommandmode');

        //Set interfaces to the temporary settings variables
        horizontalModeToggle.set_state(horizontalMode);
        defaultCommandModeToggle.set_state(defaultCommandMode);

        customCommandEntry.set_text(this._settings.get_string('command'));
        customCommandEntry.set_editable(!defaultCommandMode);//lock custom command if in default mode
        customCommandEntry.set_has_frame(true);

        //Create functions for when each setting is modified
        horizontalModeToggle.connect('state-set', Lang.bind(this, function(w){
            horizontalMode = !horizontalMode;
            this._settings.set_boolean('horizontalmode', horizontalMode);
        }));

        defaultCommandModeToggle.connect('state-set', Lang.bind(this, function(w){
            defaultCommandMode = !defaultCommandMode;
            this._settings.set_boolean('defaultcommandmode', defaultCommandMode);
            //Set default command if in default mode
            if (defaultCommandMode) {
                //Default command if to open User Settings page
                this._settings.set_value('command', "gnome-control-center user-accounts");
            } else {
                this._settings.set_value('command', customCommandEntry.get_text());
            }
            customCommandEntry.set_editable(!defaultCommandMode);//lock custom command if in default mode
        }));

        customCommandEntry.connect('changed', Lang.bind(this, function(w){
            this._settings.set_value('command', customCommandEntry.get_text());
        }));

        //Adds all widgets to the window
        this.attach(horizontalModeLabel, 0,1,1,1);
        this.attach(horizontalModeToggle, 1,1,1,1);

        this.attach(defaultCommandModeLabel, 0,2,1,1);
        this.attach(defaultCommandModeToggle, 1,2,1,1);

        this.attach(customCommandLabel, 0,3,1,1);
        this.attach(customCommandLabel, 1,3,1,1);
    }
});

function buildPrefsWidget() {
    let widget = new BigAvatarSettings();
    return widget;
}
