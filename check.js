var request = require ("request");
var opmlParser = require ("opmlparser");
var urlOpmlFile = "http://rss2.io/lists/guardian.opml";

function readOpmlFile (url, callback) { 
	var req = request (url);
	var opmlparser = new opmlParser ();
	req.on ("response", function (res) {
		var stream = this;
		if (res.statusCode == 200) {
			stream.pipe (opmlparser);
			}
		});
	req.on ("error", function (res) {
		});
	opmlparser.on ("error", function (error) {
		console.log ("readIncludedList: opml parser error == " + error.message);
		});
	opmlparser.on ("readable", function () {
		var outline;
		while (outline = this.read ()) {
			var type = outline ["#type"];
			if (type == "feed") {
				if ((outline.xmlurl != undefined) && (outline.xmlurl.length > 0)) { 
					callback (outline);
					}
				}
			}
		});
	opmlparser.on ("end", function () {
		});
	}

readOpmlFile (urlOpmlFile, function (jstruct) {
	request (jstruct.xmlurl, function (error, response, body) {
		console.log (jstruct.text + ": " + response.statusCode);
		});
	});
