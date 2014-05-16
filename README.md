#taskpaper-parser

taskpaper-parser is simple [TaskPaper](http://www.hogbaysoftware.com/products/taskpaper) file format parser.

##Installation

	npm install taskpaper-parser

##Examples

###File parsing

This will parse taskpaper file, and log parsed output as JSON.

```js
var fs = require("fs");
var Parser = require("../lib/parser").parser;

var taskPaperFile = __dirname + "/todo.taskpaper";

fs.readFile(taskPaperFile, { encoding: "utf8" }, function(error, data) {
	if (error) {
		console.error(error);
	}
	else {
		var parsedContent = new Parser(data).parse();
		console.log(JSON.stringify(parsedContent, null, 2));
	}
});

```

###ToDo creation

This will create taskpaper project, and serialize it into a string.

```js
var TaskPaperParser = require("taskpaper-parser");

var Root = TaskPaperParser.root;
var Project = TaskPaperParser.project;
var Task = TaskPaperParser.task;
var Tag = TaskPaperParser.tag;
var Comment = TaskPaperParser.comment;

// root holds everything in the file
var root = new Root();

// create some projects
var projectMain = new Project("main thing to do");
var projectSub = new Project("other things");

// create some tasks
var task1 = new Task("task 1");
var task2 = new Task("task 2");

// and a tag
var important = new Tag("priority", 1);

// add tag to task
task1.addTag(important);

// comment on one of the task
var commentFor2 = new Comment("don't forget this!");

// add comment to task
task2.addChild(commentFor2);

// add tasks to projects;
projectMain.addChild(task1);
projectSub.addChild(task2);

// add projectSub as suproject of projectMain
projectMain.addChild(projectSub);

// add everything to root
root.addChild(projectMain);

// how will this look like a taskpaper file?
console.log(root.serialize());
```

##API

###Root

`Root()` holds all the data about taskpaper file; methods:

- `addChild(child)` - used for build tree structure, root can hold projects, tasks and comments
- `serialize()` - serializes whole tree into proper string

###Project

`Project(name)` represents TaskPaper project; methods:

- `addChild(child)` - used for build tree structure, project can hold subprojects, tasks, and comments
- `serialize()` - serializes project tree into proper string

###Task

`Task(name, tags)` represents TaskPaper task (tags are optional); methods:

- `addChild(child)` - used for building tree structure, task can hold comments as children
- `addTag(tag)` - adds tag to task
- `serialize()` - serializes task tree (including tags and comments) into proper string

###Tag

`Tag(name, value)` represents TaskPaper task tag (value is optional); methods:

- `serialize()` - serializes tag into proper string

###Comment

`Comment(name)` represents TaskPaper comment; methods:

- `serialize()` - serializes comment into proper string

##License

MIT
