# JS-live-debugger
An extension for brackets that lets you look at the output of individual JS code statements while coding.

**Currently only supports node and generic Javascript Projects. If you are working on a JS project that leverages Browser APIs, you won't get an output since the extension relies on being able to run your script in node**

## How to install
Install using Brackets' built in extension manager

## How to use?

* Goto `View>JS Live Debugger` or use `Cmd-Shift-J` to open the JS live debugger panel.

* If you are currently editing Javascript code, the debugger will show you the output of any variable if your cursor is on a line that declares/mutates/references that variable. Plus, the value of that variable that's show is it's value after execution of the current line your cursor is on.

## Known Issues

#### The biggest issue that currently exists it that the value of a variable at a line can't be displayed if program execution doesn't reach the given line.

> You can test this by writing a function definiton that contains a variable declaration under it. No output will be shown when your cursor is on the variable, unless the function is called sometime during program execution.

#### Another major issue is the inability to use this on scripts that leverage browser APIs

I plan to look into PhantomJS to find a solution for this. If you'd like to contribute to do so, that would be awesome!

## Contributing

I built this extension as a tool that would help me and might potentially help a lot of other Brackets users. If you'd like to contribute and make this a better extension (while helping more people as you do so), follow these simple guidelines:

1. Fork this repository
2. Make changes
3. Open a Pull Request

## License

This project is Licensed under the GNU GPL v3 License (Refer to the LICENSE file in this repository).

## Attributions


Pranay Prakash - [Personal Site](http://pranayprakash.co), [LinkedIn](http://linkedin.com/in/pranaygp), [Github](http://github.com/pranaygp)