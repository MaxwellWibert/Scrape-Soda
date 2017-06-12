//scraping modules
var Crawler = require('./crawler.js');
var crawlers = [];
var crawl = false;

module.exports = function(app, io, Article, Comment){
	app.get('/', (req, res)=>{
		res.sendFile('../public/index.html');
	});

	app.get('/api/articles', (req, res)=>{
		Article.find({}, (err, doc)=>{
			if(err){
				console.error(err);
			}else{
				res.json(doc);
			}
		});
	});

	app.get('/api/articles/:id', (req, res)=>{
		Article.findById(req.params.id)
		.populate('comment')
		.exec((err, doc) => {
			if(err){
				console.error(err);
			}else{
				res.json(doc);
			}
		});
	});

	app.post('/api/articles/:id', (req, res)=>{
		var newComment = new Comment(req.body);

		newComment.save((err, doc)=>{
			if(err){
				console.error('API ERROR---article/:id ' + err);
			}else{
				Article.findOneAndUpdate({'_id': req.params.id}, {'comment': doc._id})
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

	io.on('connection', socket=>{
		console.log('a user is plugged into io server: ' + socket);
		socket.on('crawl', url =>{
			var matchedCrawler = crawlers.filter(crawler=>(crawler.rootURL === url));
			if(!matchedCrawler.length){
				let crawler = new Crawler(url, io);
				crawlers.push(crawler);
				io.emit('new crawler', crawler);
				crawl = true;
				crawler.level.next();
			}else{
				let crawler = matchedCrawler[0];
				io.emit('old crawler', crawler);
				crawler.level.next();
			}
		});
		socket.on('disconnect', function(){
			console.log('user disconnected' + socket);
		});
	});
}

