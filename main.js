define(function(require, exports, module) {

    var CommandManager          = brackets.getModule("command/CommandManager"),
        Menus                   = brackets.getModule("command/Menus"),
        EditorManager           = brackets.getModule("editor/EditorManager"),
        WorkspaceManager        = brackets.getModule("view/WorkspaceManager"),
        DocumentManager         = brackets.getModule("document/DocumentManager"),
        ExtensionUtils          = brackets.getModule("utils/ExtensionUtils"),        
        AppInit                 = brackets.getModule("utils/AppInit"),
        NodeDomain              = brackets.getModule("utils/NodeDomain");


    var SHOW_PANEL  = "js-live-debugger.showpanel";
    var panel;
    var document;
    var panelHtml           = $(require("text!panel.html"));

    var nodeDebuggerDomain = new NodeDomain("nodeDebugger", ExtensionUtils.getModulePath(module, "node/NodeDebuggerDomain"));
    function handleShowPanel() {
        if(panel.isVisible()) {
            panel.hide();
            CommandManager.get(SHOW_PANEL).setChecked(false);
        } else {
            panel.show();
            CommandManager.get(SHOW_PANEL).setChecked(true);
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

            var variables = currentLine.replace(/(const | const |let | let |var| var | function | class | return )/, "").match(/\b[A-Za-z]\w*\b(?!\s*\()/g);
            if(variables && variables.length > 0){
                var docArray = text
                    .split("\n");
                docArray.splice(lineNumber+1, 0, "console.log(" + variables[0] + ")");
                nodeDebuggerDomain
                    .exec("writeFile", docArray.join("\n"), document.file._parentPath)
                    .done(function(result){
                         nodeDebuggerDomain
                            .exec("runScript", document.file._parentPath)
                            .done(function(data){
                             $(".js-live-debugger-panel").find("#insertionPos").html("<p>"+data.stdout+"</p");
                         });
                    })
                    .fail(function (err) {
                        console.error("[js-live-debugger-node] failed to run nodeDebugger.writeFile", err);
                    });
            }
        }
    }

    AppInit.appReady(function () {
        ExtensionUtils.loadStyleSheet(module, "js-live-debugger.css");
        CommandManager.register("JS Live Debugger", SHOW_PANEL, handleShowPanel);
        
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(SHOW_PANEL, "Shift-Cmd-J");

        panel = WorkspaceManager.createBottomPanel(SHOW_PANEL, panelHtml, 200);

        setInterval(handleLiveDebugger, 2000);

    });

});
