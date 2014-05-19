var Root = require("./root");
var Project = require("./project");
var Task = require("./task");
var Tag = require("./tag");
var Comment = require("./comment");

/* Helpers */

var RegEx = {
	"endColon": /\:$/,
	"endParen": /\)$/,
	"fullTag": /^@.+\)$/,
	"startAt": /^@/,
	"startDash": /^(\s+)?\-\ /,
	"startTab": /^\t+/,
	"startWhitespace": /^\s+/,
	"bothParens": /\(.+\)/
};

/* Parser */

function Parser(contents) {
	this.contents = contents;
	this.projects = [];

	this.currentIndent = -1;
	this.currentProject = new Project();
}

Parser.prototype.parse = function() {
	var preParsed = this.contents
		.split("\n")
		.map(this.parseLine.bind(this));

	var root = new Root();
	var currentProject = null;
	var currentTask = null;
	var currentComment = null;

	preParsed.forEach(function(parsed) {
		if (parsed.type && parsed.type === "project") {
			currentProject = new Project(parsed.name);
			currentTask = null;

			if (parsed.projects.length > 1) {
				var projectPath = parsed.projects.slice(0, -1);
				var child = root.projectPath(projectPath);
				child.addChild(currentProject);
			}
			else {
				root.addChild(currentProject);
			}
		}
		else if (parsed.type && parsed.type === "task") {
			var tags = parsed.tags.map(function(parsedTag) {
				return new Tag(parsedTag.name, parsedTag.value);
			});

			currentTask = new Task(parsed.task, tags);

			if (currentProject) {
				currentProject.addChild(currentTask);
			}
			else {
				root.addChild(currentTask);
			}
		}
		else if (parsed.type === "comment") {
			currentComment = new Comment(parsed.comment);

			if (currentTask) { 
				currentTask.addChild(currentComment);
			}
			else if (currentProject) {
				currentProject.addChild(currentComment);
			}
			else {
				root.addChild(currentComment);
			}
		}
	});

	return root;
};

Parser.prototype.parseLine = function(line) {
	var ret = null;

	if (line.match(RegEx.endColon)) {
		ret = this.parseProject(line);
	}
	else if (line.match(RegEx.startDash)) {
		ret = this.parseTask(line);
	}
	else {
		ret = this.parseComment(line);
	}

	return ret;
};

Parser.prototype.parseProject = function(line) {
	var projectName = line.slice(0, -1).replace(RegEx.startTab, "");
	var projectIndent = line.split("\t").length - 1;

	this.projects[projectIndent] = projectName;

	/*jslint unparam:true */
	this.projects = this.projects.filter(function(project, index) {
		return (index <= projectIndent);
	});
	/*jslint unparam:false */

	return {
		"type": "project",
		"name": projectName,
		"projects": this.projects.slice(0)
	};
};

Parser.prototype.parseTask = function(line) {
	var text = line
		.replace(RegEx.startDash, "")
		.replace(/\ @.+/, "");

	var tags = this.getTagsFromLine(line).map(this.deserializeTag);

	return {
		"type": "task",
		"task": text,
		"tags": tags
	};
};

Parser.prototype.getTagsFromLine = function(line) {
	var insideTag = false;

	return line
		.split(" ")
		.reduce(function(memo, word) {
			// is tag - begins with @
			if (word.match(RegEx.startAt)) {
				memo.push(word);

				// inside tag if didn't end wih paren
				if (!word.match(RegEx.fullTag) || !(word.indexOf("(") < 0 && word.indexOf(")") < 0)) {
					insideTag = true;
				}
			}
			// we are inside a tag
			else if (insideTag) {
				// append to previous tag
				memo[memo.length - 1] += " " + word;

				// word is ending with )
				if (word.match(RegEx.endParen)) {
					insideTag = false;
				}
			}

			return memo;
		}, []);
};

Parser.prototype.deserializeTag = function(tag) {
	var deserialized = tag.replace(RegEx.startAt, "");
	var returnTag = { "name": deserialized };

	if (deserialized.match(RegEx.bothParens)) {
		var parenIndex = deserialized.indexOf("(");

		returnTag.name = deserialized.substr(0, parenIndex);
		returnTag.value = deserialized.substr(parenIndex + 1, deserialized.length - parenIndex - 2);
	}

	return returnTag;
};

Parser.prototype.parseComment = function(comment) {
	return {
		"type": "comment",
		"comment": comment.replace(RegEx.startWhitespace, "")
	};
};

module.exports = {
	"Comment": Comment,
	"Parser": Parser,
	"Project": Project,
	"Root": Root,
	"Tag": Tag,
	"Task": Task
};
