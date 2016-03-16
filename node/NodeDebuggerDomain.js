var os = require('os');
var fs = require('fs');
var execSync = require('sync-exec');

var SCRIPT_FILE = ".js-live-code.js";

function cmdSaveToFile(content, path){
    fs.writeFile(path + SCRIPT_FILE, content, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

function cmdRunScript(path) {
    
    var scriptPath = path.replace(/ /,"\\ ") + SCRIPT_FILE;
    
    var process = execSync("/usr/local/bin/node " + scriptPath);
    return process;
}

function cmdDeleteFile(path){
    fs.unlink(path + SCRIPT_FILE, content, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}

function init(domainManager) {
    if (!domainManager.hasDomain("nodeDebugger")) {
        domainManager.registerDomain("nodeDebugger", {major: 0, minor: 1});
    }
    domainManager.registerCommand(
        "nodeDebugger",                 // domain name
        "writeFile",                    // command name
        cmdSaveToFile,                  // command handler function
        false,                          // this command is synchronous in Node
        "Saves a local copy of whatever is passed in as " + SCRIPT_FILE,
        [{name: "content",              // parameters
          type: "string",
          description: "Content of JS file"},
        {name: "path",                  // parameters
          type: "string",
          description: "Path to store JS file"}],
        [{name: "err",                  // return values
          type: "string",
          description: "Error while saving file (if any)"}]
    );

    domainManager.registerCommand(
        "nodeDebugger",                 // domain name
        "runScript",                    // command name
        cmdRunScript,                   // command handler function
        false,                          // this command is synchronous in Node
        "Rune the " + SCRIPT_FILE + " at given path.",
        [{name: "path",                 // parameters
          type: "string",
          description: "Path to read JS file from"}],
        [{name: "result",               // return values
          type: "object",
          description: "stdout: Console output of file\nstderr: Console error output of file"}]
    );
    
    domainManager.registerCommand(
        "nodeDebugger",                 // domain name
        "deleteFile",                   // command name
        cmdDeleteFile,                  // command handler function
        false,                          // this command is synchronous in Node
        "Deletes " + SCRIPT_FILE +" from passed in path",
        [{name: "path",                 // parameters
          type: "string",
          description: "Path to delete JS file from"}],
        [{name: "err",                  // return values
          type: "string",
          description: "Error while deleting file (if any)"}]
    );
}

exports.init = init;