var Page = require('./Page.js');

var PageWriter = function (page, response) {
	if (!(page instanceof Page)) {
		throw new TypeError();
	}
	this.response = response;
	this.page = page;
};

PageWriter.prototype.write = function (data) {
	this.response.write(data);
};

PageWriter.prototype.writeMetaLanguage = function () {
	this.write('<meta http-equiv="Content-Language" content="'+this.page.language+'" />');
};

PageWriter.prototype.writeMetaKeywords = function () {
	this.write('<meta name="keywords" content="'+this.page.keywords.join(', ')+'" />');
};

PageWriter.prototype.writeMetaDescription = function () {
	this.write('<meta name="description" content="'+this.page.description+'" />');
};

PageWriter.prototype.writeMetaContentType = function () {
	this.write('<meta http-equiv="Content-Type" content="text/html; charset='+this.page.encoding+'" />');
};

PageWriter.prototype.writeBody = function () {
	this.write('<body>');
	this.write('</body>');
};

PageWriter.prototype.writePageXHML = function () {
	this.write('<?xml version="1.0" encoding="'+this.page.encoding+'"?>');
	this.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">');
	this.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="'+this.page.language+'" lang="'+this.page.language+'"><head>');
	this.writeMetaLanguage();
	this.writeMetaContentType();
	this.writeMetaKeywords();
	this.writeMetaDescription();
	this.write('</head>');
	this.writeBody();
	this.write('</html>');
};

PageWriter.prototype.writePageHML5 = function () {
	this.write('<!DOCTYPE html><html><head>');
	this.write('<meta charset="'+this.page.encoding+'">');
	this.writeMetaLanguage();
	this.writeMetaKeywords();
	this.writeMetaDescription()+
	this.write('</head>');
	this.writeBody();
	this.write('</html>');
};

PageWriter.prototype.writePageHML4 = function () {
	this.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
	this.write('<html><head>');
	this.writeMetaLanguage();
	this.writeMetaContentType();
	this.writeMetaKeywords();
	this.writeMetaDescription();
	this.write('</head>');
	this.writeBody();
	this.write('</html>');
};

PageWriter.prototype.writeHead = function (code, headers) {
	var page = this.page;
	var headers = headers || {};
	headers['Content-Language'] = page.language;
	headers['Content-Type'] = 'application/xhtml+xml; charset='+page.encoding;
	if (page.type !== 'xhtml') {
		headers['Content-Type'] = 'text/html; charset='+page.encoding;
	}
	this.response.writeHead(code, headers);
};

PageWriter.prototype.writeContent = function () {
	switch (this.page.type) {
		case 'html4':
			this.writePageHML4();
			break;
		case 'html5':
			this.writePageHML5();
			break;
		case 'xhtml':
		default:
			this.writePageXHML();
	}
	this.response.end();
};

module.exports = PageWriter;