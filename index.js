const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');

function kiln(options) {
    const clay = {};
    clay.options = options || {};

    setDefaults(clay);

    let toolsDir = fs.readdirSync(path.join(__dirname, '/lib/tools'));

    toolsDir = toolsDir.filter((file) => '.DS_Store' !== file);

    const toolsArray = toolsDir.map((data) => { return data.replace(/\.\w+$/, ''); });

    // mount the tools
    for (let i = 0; i < toolsArray.length; i++) {
        if (clay[toolsArray[i]] !== undefined) {
            throw new Error(`duplicate name ${toolsDir[i]} in tools directory`);
        }
        clay[toolsArray[i]] = require(
            path.join(__dirname, '/lib/tools/', toolsDir[i])
        )(clay.options);
    }

    return clay;
}

function setDefaults(clay) {
    clay.options.logLevel = clay.options.logLevel || 'error';
    clay.options.dataBinding = clay.options.dataBinding ||
        function() {};
    clay.options.errorBinding = clay.options.errorBinding ||
        function(req, err) {
            const eventID = uuid();
            clay.l.error(`An error occured with ID ${eventID}`);
            clay.l.error(err);
            return `An error occured, for more information search for ${eventID} in the logs`;
        };
}

module.exports = kiln;
