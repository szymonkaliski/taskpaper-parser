function Root() {
	this.children = [];
}

Root.prototype.addChild = function(child) {
	this.children.push(child);
};

Root.prototype.projectPath = function(path) {
	var returnChild = this.children.filter(function(child) {
		var isProject = child.project !== undefined;
		var nameMatches = child.getName() === path[0];

		return isProject && nameMatches;
	})[0];

	if (returnChild && path.slice(1).length > 0) {
		var nextChild = returnChild.projectPath(path.slice(1));
		if (nextChild) { returnChild = nextChild; }
	}

	return returnChild;
};

Root.prototype.serialize = function() {
	var serialized = "";

	if (this.children.length > 0) {
		serialized += this.children
			.map(function(child) { return child.serialize(); })
			.join("\n");

		serialized = serialized
			.split("\n")
			.map(function(line) { return line.replace(/\s+$/g, ""); })
			.join("\n");
	}

	return serialized;
};

module.exports = Root;
