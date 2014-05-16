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
