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
	      "app/poll.html": "app/poll.jade",
        "app/views/question.html": "app/views/question.jade"
	    }
	 }
  }
  });
 
  grunt.loadNpmTasks('grunt-contrib-jade');
   
  grunt.registerTask('default', [
    'jade'
  ]);
};