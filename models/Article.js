var Page = function(mongoose){
	var Schema = mongoose.Schema;

	var PageSchema = new Schema({
		title: {
			type: String,
			required: true
		},
		url: {
			type: String,
			required: true
		},
		links: {
			type: [String],
			default: []
		}
		comment: {
			type: Schema.Types.ObjectId,
			ref: "Comment"
		}
	});

	return mongoose.model("Article", ArticleSchema);
}

module.exports = Article;