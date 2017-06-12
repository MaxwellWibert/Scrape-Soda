var request = require("request");
var cheerio = require("cheerio");

function Crawler(rootURL, io){
	this.rootURL = rootURL;
	this.urlExp = new RegExp(rootURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	this.cache = {};
	this.queue = [rootURL];
	this.scrape = function(pageURL){
		let page = {};
		console.log(pageURL)
		page.url = pageURL;
		request(pageURL, (err, response, html)=>{
			if(err) {return page};
			let $ = cheerio.load(html);
			page.title = $("title").text().trim();
			page.links = [];
			$("a").filter((i, el)=> $(el).attr('href') && $(el).attr('href')[0] === "/")
			.map((i, el)=> this.rootURL + $(el).attr('href').trim())
			.filter((data, el) => !this.cache[el])
			.each((data, el) =>{
				this.cache[el] = true;
				this.queue.push(el);
				page.links.push(el);
			});
			io.emit('new page', page);
			
		});		
	}
	/*upOne reads all page objects in currentLevel array
	then grabs all the links in those pages, ignores links in the cache,
	adds new links to the cache for future iterations. If the link redirects to another
	page in the website, it scrape that link to the cache*/
	let generator = function*(){
		while(true){
			yield this.scrape(this.queue.shift());
		}
	}.bind(this);
	this.level = generator();
}

module.exports = Crawler;

