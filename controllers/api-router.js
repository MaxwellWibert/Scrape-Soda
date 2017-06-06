//scraping modules

var scraper = require("./scraper.js");

module.exports = function(app, Article, Comment){
	app.get("/api/scrape", function(req, res){

		res.send("Scrape Complete")
	});

	app.get("/api/articles", (req, res)=>{
		Article.find({}, (err, doc)=>{
			if(err){
				console.error(err);
			}else{
				res.json(doc);
			}
		});
	});

	app.get("/api/articles/:id", (req, res)=>{
		Article.findById(req.params.id)
		.populate("comment")
		.exec((err, doc) => {
			if(err){
				console.error(err);
			}else{
				res.json(doc);
			}
		});
	});

	app.post("/api/articles/:id", (req, res)=>{
		var newComment = new Comment(req.body);

		newComment.save((err, doc)=>{
			if(err){
				console.error("API ERROR---article/:id " + err);
			}else{
				Article.findOneAndUpdate({"_id": req.params.id}, {"comment": doc._id})
				.exec((err, doc) => {
					if(err) {
						console.error(err);
					}else{
						res.json(doc);
					}
				});
			}
		});
	});
}