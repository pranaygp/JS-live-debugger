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
        if(document && document.getLanguage()._name == "JavaScript") {

            var text = document.getText().replace(/.*console.log+\([^\)]*\)(\.[^\)]*\))?.*/g,"");

            var editor = EditorManager.getActiveEditor();
            var lineNumber = editor.getCursorPos().line;
            var currentLine = document.getLine(lineNumber);

            var variables = currentLine.replace(/( var | function | class | return )/, "").match(/\b[A-Za-z]\w*\b(?!\s*\()/g);




            if(variables.length > 0){

                var docArray = text
                    .split("\n");


//

//                );
                
                nodeDebuggerDomain
                    .exec("writeFile", docArray.join("\n"), document.file._parentPath)
                    .done(function(result){

                    

                    
                         nodeDebuggerDomain
                            .exec("runScript", document.file._parentPath)
                            .done(function(data){

                             
//                             $(".helloworld-panel").find("#insertionPos").innerHTML = '';
                             
console.log(helloworld)
                             $(".helloworld-panel").find("#insertionPos").html("<p>"+data.stdout+"</p");
                             
                         });
//                            .done(function(scriptResult){
//                             

//                            });
                    
                    })
                    .fail(function (err) {
                        console.error("[brackets-simple-node] failed to run nodeDebugger.writeFile", err);
                    });


                //                .join("\n");


            }



            //            $(".helloworld-panel").find("#insertionPos").append("<p>"+insertionPos+"</p");
        }
    }

    AppInit.appReady(function () {

        log("Hello from JS Live Debugger.");
        ExtensionUtils.loadStyleSheet(module, "helloworld.css");
        CommandManager.register("JS Live Debugger", HELLOWORLD_EXECUTE, handleHelloWorld);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(HELLOWORLD_EXECUTE);

        panel = WorkspaceManager.createBottomPanel(HELLOWORLD_EXECUTE, panelHtml, 200);

        setInterval(handleLiveDebugger, 2000);

    });

});