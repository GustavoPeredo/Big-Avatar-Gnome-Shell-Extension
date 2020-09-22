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
        this.margin = 72;
        this.margin_top = 32;
        this.margin_bottom = 32;
        this._settings = Convenience.getSettings();

        //Create temp vars
        let horizontalLabel = null;
        let defaultLabel = null;
        let fontSizeLabel = null;
        let pictureSizeLabel = null;
        let horizontalToggle = null;
        let defaultToggle = null;
        let fontSizeSpinButton = null;
        let pictureSizeSpinButton = null;

        //Get values from gschema for horizontalmode and usedefaultvalues
        let horizontalmode = this._settings.get_boolean('horizontalmode');
        let usedefaultvalues = this._settings.get_boolean('usedefaultvalues');

        //Create horizontal mode and default values toggleable switches
        horizontalToggle = new Gtk.Switch({halign:Gtk.Align.END});
        defaultToggle = new Gtk.Switch({halign:Gtk.Align.END});

        //Create size pickers
        fontSizeSpinButton = new Gtk.SpinButton({halign:Gtk.Align.END});
        pictureSizeSpinButton = new Gtk.SpinButton({halign:Gtk.Align.END});

        //Set it's state to gschemas' default
        horizontalToggle.set_state(horizontalmode);
        defaultToggle.set_state(usedefaultvalues);

        //Creates labels;
        horizontalLabel = new Gtk.Label({
            label: 'Enable horizontal mode:',
            hexpand: true,
            halign: Gtk.Align.START
        });
        defaultLabel = new Gtk.Label({
            label: 'Use default values:',
            hexpand: true,
            halign: Gtk.Align.START
        });
        fontSizeLabel = new Gtk.Label({
            label: 'Change font size:',
            hexpand: true,
            halign: Gtk.Align.START
        });
        pictureSizeLabel = new Gtk.Label({
            label: 'Change picture size:',
            hexpand: true,
            halign: Gtk.Align.START
        });

        /*Connects the change of state of the switch with the change of
        gschemas' value*/
        horizontalToggle.connect('state-set', Lang.bind(this, function(w){
            this._settings.set_boolean('horizontalmode', !horizontalmode);
            horizontalmode = !horizontalmode;
            if (usedefaultvalues) {
                //change default sizes depending on mode
                if (horizontalmode) {
                    this._settings.set_int('fontsize', 16);
                    this._settings.set_int('picturesize', 48);
                    fontSizeSpinButton.set_value(16);
                    pictureSizeSpinButton.set_value(48);
                } else {
                    this._settings.set_int('fontsize', 18);
                    this._settings.set_int('picturesize', 144);
                    fontSizeSpinButton.set_value(18);
                    pictureSizeSpinButton.set_value(144);
                }

                //set to uneditable font and picture size spin buttons
                fontSizeSpinButton.set_editable(false);
                pictureSizeSpinButton.set_editable(false);
            } else {
                fontSizeSpinButton.set_editable(true);
                pictureSizeSpinButton.set_editable(true);
            }
            //Force update buttons
            fontSizeSpinButton.update();
            pictureSizeSpinButton.update();
        }));

        defaultToggle.connect('state-set', Lang.bind(this, function(w){
            //Change boolean value for default values
            this._settings.set_boolean('usedefaultvalues', !usedefaultvalues);
            usedefaultvalues = !usedefaultvalues;

            if (usedefaultvalues) {
                //change default sizes depending on mode
                if (horizontalmode) {
                    this._settings.set_int('fontsize', 16);
                    this._settings.set_int('picturesize', 48);
                    fontSizeSpinButton.set_value(16);
                    pictureSizeSpinButton.set_value(48);
                } else {
                    this._settings.set_int('fontsize', 18);
                    this._settings.set_int('picturesize', 144);
                    fontSizeSpinButton.set_value(18);
                    pictureSizeSpinButton.set_value(144);
                }

                //set to uneditable font and picture size spin buttons
                fontSizeSpinButton.set_editable(false);
                pictureSizeSpinButton.set_editable(false);
            } else {
                fontSizeSpinButton.set_editable(true);
                pictureSizeSpinButton.set_editable(true);
            }

            //Force update buttons
            fontSizeSpinButton.update();
            pictureSizeSpinButton.update();
        }));

        //Configures spin buttons
        fontSizeSpinButton.set_editable(!usedefaultvalues);
        pictureSizeSpinButton.set_editable(!usedefaultvalues);
        fontSizeSpinButton.set_numeric(true);
        pictureSizeSpinButton.set_numeric(true);
        fontSizeSpinButton.set_increments(1,10);
        pictureSizeSpinButton.set_increments(1,10);
        fontSizeSpinButton.set_range(1,512);
        pictureSizeSpinButton.set_range(1,512);

        //Set size values from gschema
        fontSizeSpinButton.set_value(this._settings.get_int('fontsize'));
        pictureSizeSpinButton.set_value(this._settings.get_int('picturesize'));
        fontSizeSpinButton.update()
        pictureSizeSpinButton.update()

        //Connect change of values to actual change of values
        fontSizeSpinButton.connect('value-changed', Lang.bind(this, function(w) {
            this._settings.set_int('fontsize', fontSizeSpinButton.get_value_as_int());
        }));
        pictureSizeSpinButton.connect('value-changed', Lang.bind(this, function(w) {
            this._settings.set_int('picturesize', pictureSizeSpinButton.get_value_as_int());
        }));

        //Adds all widgets to the window
        this.attach(horizontalLabel, 0, 1, 1, 1);
        this.attach(defaultLabel, 0, 2, 1, 1);
        this.attach(fontSizeLabel, 0, 3, 1, 1);
        this.attach(pictureSizeLabel, 0, 4, 1, 1);
        this.attach(horizontalToggle, 1, 1, 1, 1);
        this.attach(defaultToggle, 1, 2, 1, 1);
        this.attach(fontSizeSpinButton, 1, 3, 1, 1);
        this.attach(pictureSizeSpinButton, 1, 4, 1, 1);
    },

});

function buildPrefsWidget() {
     let widget = new BigAvatarSettings();
     widget.show_all();

     return widget;
}
