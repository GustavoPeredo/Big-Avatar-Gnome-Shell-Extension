//Import required libraries
const Gettext = imports.gettext;
const Gio = imports.gi.Gio;

const Config = imports.misc.config;
const ExtensionUtils = imports.misc.extensionUtils;

function getSettings(schema) {
    //Get current extension
    let extension = ExtensionUtils.getCurrentExtension();
    /* Get schema and schema settings, thanks to "I Like 'em Curvy for a simple
    and good convenience.js file :) */
    schema = schema || extension.metadata['settings-schema'];

    const GioSSS = Gio.SettingsSchemaSource;

    let schemaDir = extension.dir.get_child('schemas');
    let schemaSource;
    if (schemaDir.query_exists(null))
        schemaSource = GioSSS.new_from_directory(schemaDir.get_path(),
                                                 GioSSS.get_default(),
                                                 false);
    else
        schemaSource = GioSSS.get_default();

    let schemaObj = schemaSource.lookup(schema, true);
    //Check if it's non existant
    if (!schemaObj)
        throw new Error('Schema ' + schema + ' could not be found for extension '
                        + extension.metadata.uuid + '. Please check your installation.');
    //Return default values
    return new Gio.Settings({ settings_schema: schemaObj });
}
