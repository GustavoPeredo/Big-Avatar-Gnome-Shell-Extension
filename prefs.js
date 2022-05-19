// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
//Import required libs
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gio = imports.gi.Gio;

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
        let horizontalLabel = null;
        let horizontalToggle = null;

        //Create labels;
        horizontalModeLabel = new Gtk.Label({
            label: 'Enable horizontal mode:',
            hexpand: true,
            halign: Gtk.Align.START
        });

        //Create toggleable switches
        horizontalModeToggle = new Gtk.Switch({halign:Gtk.Align.END});

        //Create temporary settings variables linked to the values from gschema
        let horizontalMode = this._settings.get_boolean('horizontalmode');

        //Set switches to gschema values
        horizontalModeToggle.set_state(horizontalMode);

        //Create functions for each setting
        horizontalModeToggle.connect('state-set', Lang.bind(this, function(w){
            horizontalMode = !horizontalMode;
            this._settings.set_boolean('horizontalmode', horizontalMode);
        }));

        //Adds all widgets to the window
        this.attach(horizontalModeLabel, 0,1,1,1);
        this.attach(horizontalModeToggle, 1,1,1,1);
    }
});

function buildPrefsWidget() {
    let widget = new BigAvatarSettings();
    return widget;
}
