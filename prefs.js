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

//Creates window
const BigAvatarSettings = new GObject.Class({
    Name: 'BigAvatarPrefs',
    Extends: Gtk.Grid,

    _init: function(params) {
        this.parent(params);
        this.margin = 72;
        this.margin_top = 32;
        this.margin_bottom = 32;
        this._settings = Convenience.getSettings();

        //Create temp vars
        let label = null;
        let toggle = null;
        let value = null;

        //Create a toggleable switch
        toggle = new Gtk.Switch({halign:Gtk.Align.END});

        //Sets it's state to gschemas' default
        toggle.set_state(this._settings.get_boolean('compactmode'));

        //Creates a labe;
        label = new Gtk.Label({
            label: 'Enable compact mode',
            hexpand: true,
            halign: Gtk.Align.START
        });
        /*Connects the change of state of the switch with the change of
        gschemas' value*/
        toggle.connect('state-set', Lang.bind(this, function(w){

            this._settings.set_boolean('compactmode', !this._settings.get_boolean('compactmode'));

         }));

        //Adds both widgets to the window
        this.attach(label, 0, 1, 1, 1);
        this.attach(toggle, 1, 1, 1, 1);
    },

});

function buildPrefsWidget() {
     let widget = new BigAvatarSettings();
     widget.show_all();

     return widget;
}
