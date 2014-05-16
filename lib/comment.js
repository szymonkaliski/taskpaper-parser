function Comment(comment) {
	this.comment = comment;
}

Comment.prototype.getName = function() {
	return this.comment;
};

Comment.prototype.serialize = function() {
	return this.comment;
};

module.exports = Comment;
