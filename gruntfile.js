module.exports = function(grunt) {

    require('loadup-grunt-tasks')(grunt);

    grunt.initConfig({

        typescript: {
            default: {
                src: 'src/NestedTextEditor.ts',
                dest: 'lib/',
                options: {
                    module: 'amd',
                    target: 'es5',
                    basePath: 'src',
                    declaration: true
                }
            }
        },

        clean: [
            'lib/'
        ],

        watch: {
            ts: {
                files: 'src/**/*.ts',
                tasks: ['compile']
            }
        }

    });

    grunt.registerTask('compile', ['clean', 'typescript']);
    grunt.registerTask('default', ['compile', 'watch']);

};
