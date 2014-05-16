function Task(name, tags) {
	this.name = name;
	this.tags = tags || [];

	this.children = [];
}

Task.prototype.getName = function() {
	return this.name;
};

Task.prototype.addChild = function(child) {
	this.children.push(child);
};

Task.prototype.addTag = function(tag) {
	this.tags.push(tag);
};

Task.prototype.serialize = function() {
	var serialized = "- " + this.name;

	if (this.tags) {
		serialized += " ";
		serialized += this.tags.map(function(tag) {
			return tag.serialize();
		}).join(" ");
	}

	if (this.children.length > 0) {
		serialized += "\n";
		serialized += this.children.map(function(child) {
			return "\t" + child.serialize();
		}).join("\n");
	}

	return serialized;
};

module.exports = Task;
