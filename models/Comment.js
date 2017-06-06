var Comment = function(mongoose){
	var Schema = mongoose.Schema;

	var CommentSchema = new Schema({
		title: {
			type: String,
		},
		body:{
			type: String
		}
	});

	return mongoose.model("Comment", CommentSchema);
}

module.exports = Comment;