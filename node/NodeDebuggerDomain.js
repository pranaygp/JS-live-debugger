var os = require('os');
var fs = require('fs');
var execSync = require('sync-exec');

function cmdSaveToFile(content, path){
    fs.writeFile(path + "js-live-code.js", content, function(err) {
        if(err) {
            //                return console.log(os.tmpdir());
            return console.log(err);
        }
    }); 
}


function cmdRunScript(path) {
    
//    return "done";
    
    var scriptPath = "js-live-code.js";
    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;
    
    var returndata;

//    console.log(("node " + path + scriptPath));
    
//    var process = childProcess.fork("node " + path.replace(/ /,"\\ ") + scriptPath);
//    
//    process.stdout.on("data", function(data){
//        
//        console.log("stdout: ",data);
//        return 0;
//        
//    });
    
//    /usr/local/bin/node
    
    var process = execSync("/usr/local/bin/node " + path.replace(/ /,"\\ ") + scriptPath);
    
    console.log(process);
    
    return process;
    
//    var process = childProcess.exec("which node", function(error, stdout, stderr){
        
//        if (error !== null) {
//            console.log("exec error: ",error);
//        }
//        
//        console.log("stdout: ",stdout);
//        console.log("stderr: ",stderr);
//        
//        returndata = stdout;
        
//        console.log("test ",test);
//        
//        if(callback)
//            callback(stdout);
        
//        console.log(`stderr: ${stderr}`);
        
//    });
    
//    setTimeout(function(){
//        returndata = "Time Out";
//    }, 3000);
    
//    while(returndata == undefined){};
    return invoked;

}

// Now we can run a script and invoke a callback when complete, e.g.
//runScript(function (err) {
//    if (err) throw err;
//    console.log('finished running some-script.js');
//});

function init(domainManager) {
    if (!domainManager.hasDomain("nodeDebugger")) {
        domainManager.registerDomain("nodeDebugger", {major: 0, minor: 1});
    }
    domainManager.registerCommand(
        "nodeDebugger",       // domain name
        "writeFile",    // command name
        cmdSaveToFile,   // command handler function
        false,          // this command is synchronous in Node
        "Returns the total or free memory on the user's system in bytes",
        [{name: "total", // parameters
          type: "string",
          description: "True to return total memory, false to return free memory"}],
        [{name: "memory", // return values
          type: "number",
          description: "amount of memory in bytes"}]
    );

    domainManager.registerCommand(
        "nodeDebugger",       // domain name
        "runScript",    // command name
        cmdRunScript,   // command handler function
        false,          // this command is synchronous in Node
        "Returns the total or free memory on the user's system in bytes",
        [{name: "total", // parameters
          type: "string",
          description: "True to return total memory, false to return free memory"}],
        [{name: "memory", // return values
          type: "number",
          description: "amount of memory in bytes"}]
    );
}

exports.init = init;
