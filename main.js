define(function(require, exports, module) {


    var CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        WorkspaceManager        = brackets.getModule("view/WorkspaceManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),        
        AppInit                 = brackets.getModule("utils/AppInit"),
        NodeDomain              = brackets.getModule("utils/NodeDomain");


    var HELLOWORLD_EXECUTE  = "helloworld.execute";
    var panel;
    var document;
    var panelHtml           = $(require("text!panel.html"));

    var nodeDebuggerDomain = new NodeDomain("nodeDebugger", ExtensionUtils.getModulePath(module, "node/NodeDebuggerDomain"));


    function log(s) {
        console.log("[helloworld5] "+s);
    }

    function handleHelloWorld() {
        if(panel.isVisible()) {
            panel.hide();

            CommandManager.get(HELLOWORLD_EXECUTE).setChecked(false);
        } else {
            panel.show();
            CommandManager.get(HELLOWORLD_EXECUTE).setChecked(true);
        }
    }

    function handleLiveDebugger(){
        document = DocumentManager.getCurrentDocument();
        //        if(panel.isVisible() && document && document.getLanguage()._name == "JavaScript") {
        if(panel.isVisible() && document && document.getLanguage()._name == "JavaScript") {

            var text = document.getText().replace(/.*console.log+\([^\)]*\)(\.[^\)]*\))?.*/g,"");

            var editor = EditorManager.getActiveEditor();
            var lineNumber = editor.getCursorPos().line;
            var currentLine = document.getLine(lineNumber);

            var variables = currentLine.replace(/( var | function | class | return )/, "").match(/\b[A-Za-z]\w*\b(?!\s*\()/g);




            if(variables.length > 0){

                var docArray = text
                    .split("\n");

                docArray.splice(lineNumber+1, 0, "console.log(" + variables[0] + ")");
//
//                console.log(
//                    docArray.join("\n")
//                );
                
//                TODO: UNCOMMENT
                
                nodeDebuggerDomain
                    .exec("writeFile", docArray.join("\n"), document.file._parentPath)
                    .done(function(result){
//                        console.log("[brackets-simple-node] writeFile output",result);

                        console.log("Executing runScript");

                         nodeDebuggerDomain
                            .exec("runScript", document.file._parentPath)
                            .done(function(data){
                             console.log(data.stdout);

//                             $(".helloworld-panel").find("#insertionPos").innerHTML = '';

                             $(".helloworld-panel").find("#insertionPos").html("<p>"+data.stdout+"</p");

                         });
//                            .done(function(scriptResult){
//                             
//                                console.log("[brackets-simple-node] runScript output", scriptResult);
//                            });

                    })
                    .fail(function (err) {
                        console.error("[brackets-simple-node] failed to run nodeDebugger.writeFile", err);
                    });


                //                .join("\n");


            }
            //            console.log(isVar);


            //            $(".helloworld-panel").find("#insertionPos").append("<p>"+insertionPos+"</p");
        }
    }

    AppInit.appReady(function () {

        log("Hello from JS Live Debugger.");
        ExtensionUtils.loadStyleSheet(module, "helloworld.css");
        CommandManager.register("JS Live Debugger", HELLOWORLD_EXECUTE, handleHelloWorld);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(HELLOWORLD_EXECUTE, "Shift-Cmd-J");

        panel = WorkspaceManager.createBottomPanel(HELLOWORLD_EXECUTE, panelHtml, 200);

        setInterval(handleLiveDebugger, 2000);

    });

});
