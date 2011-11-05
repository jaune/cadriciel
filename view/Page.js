var Page = function () {

	/** @type {String} */
	this.type = 'xhtml';
	
	/** @type {String} */
	this.language = 'en';

	/** @type {String} */
	this.encoding = 'utf-8';
	
	/** @type {Array} */
	this.keywords = [];
	
	/** @type {String} */
	this.description = '';

	/** @type {Object} */
	this.regions = {};
};

module.exports = Page;