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

//Creates window with a grid
const BigAvatarSettings = new GObject.Class({
    Name: 'BigAvatarPrefs',
    Extends: Gtk.Grid,
    _init: function(params) {
        //Give grid's characteristics
        this.parent(params);
        this.set_row_spacing(8);
        this.margin_start = 72;
        this.margin_end = 72;
        this.margin = 72;
        this.margin_top = 32;
        this.margin_bottom = 32;
        this._settings = Convenience.getSettings();

        //Create temp vars
        let horizontalLabel = null;
        let horizontalToggle = null;

        //Get values from gschema for horizontalmode and usedefaultvalues
        let horizontalmode = this._settings.get_boolean('horizontalmode');

        //Create horizontal mode and default values toggleable switches
        horizontalToggle = new Gtk.Switch({halign:Gtk.Align.END});

        //Set it's state to gschemas' default
        horizontalToggle.set_state(horizontalmode);

        //Creates labels;
        horizontalLabel = new Gtk.Label({
            label: 'Enable horizontal mode:',
            hexpand: true,
            halign: Gtk.Align.START
        });

        /*Connects the change of state of the switch with the change of
        gschemas' value*/
        horizontalToggle.connect('state-set', Lang.bind(this, function(w){
            this._settings.set_boolean('horizontalmode', !horizontalmode);
            horizontalmode = !horizontalmode;
            }));


        //Adds all widgets to the window
        this.attach(horizontalLabel, 0, 1, 1, 1);
        this.attach(horizontalToggle, 1, 1, 1, 1);
    },

});

function buildPrefsWidget() {
     let widget = new BigAvatarSettings();

     return widget;
}
