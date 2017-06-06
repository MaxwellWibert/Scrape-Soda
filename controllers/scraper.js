var request = require("request");
var cheerio = require("cheerio");

function graphIterator(rootURL){
	this.rootURL;
	this.cache = [];
	this.currentLevel = [rootURL];
	this.nextLevel = [];
	this.more = function*(){
		while(true){
			yield thing
		}
	}
	/*populateNext reads all page objects in currentLevel array
	then grabs all the links in those pages, ignores links in the cache,
	adds new links to the cache for future iterations. If the link redirects to another
	page in the website, it scrape that link to the cache*/
	this.populateNext = function(){
		let urlExp = new RegExp(rootURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		this.currentLevel.forEach((page, index)=>{
			page.links.map(link=>{
				if(link.charAt(0) == "/"){
					return rootURL + link;
				}else{
					return link;
				}
			}).filter(link=>{
				return (!this.cache.includes(link));
			}).filter(link=>{
				this.cache.push(link);
				return urlExp.test(link);
			}).forEach(link=>{
				this.nextLevel.push(scrape(link));
			});
		});
		this.currentLevel = this.nextLevel;
		this.nextLevel = [];
	}
}

function scrape(pageURL){
	let page = {};
	page.url = pageURL;
	request(pageURL, (err, response, html)=>{
		if(err) {return page};
		let $ = cheerio.load(html);
		page.title = $("title").text().trim();
		page.links = [];
		$("a").each((i, element)=>{
			let link = element.attr("href");
			page.links.push(link);
		});
		return page;
	});
}

function escapeRegExp(string) {
  return  // $& means the whole matched string
}