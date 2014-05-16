function Tag(name, value) {
	this.name = name;
	this.value = value;
}

Tag.prototype.serialize = function() {
	var serialized = "@" + this.name;

	if (this.value) {
		serialized += "(" + this.value + ")";
	}

	return serialized;
};

module.exports = Tag;
