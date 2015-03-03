var pkgjson = require('./package.json');
 
var config = {
  pkg: pkgjson,
  app: 'app'
}
 
module.exports = function (grunt) {
 
  // Configuration
  grunt.initConfig({
    config: config,
    pkg: config.pkg,
    jade: {
		  debug: {
		  options: {
	      data: {
	        debug: true
	      }
	    },
	    files: {
	      "poll.html": "poll.jade"
	    }
	 }
  }
  });
 
  grunt.loadNpmTasks('grunt-contrib-jade');
   
  grunt.registerTask('default', [
    'jade'
  ]);
};