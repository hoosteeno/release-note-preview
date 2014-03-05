var self = require('sdk/self');
//var system = require('sdk/system');
var pageMod = require('sdk/page-mod');
var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;

// dev only
require('sdk/preferences/service').set('javascript.options.strict', false);

pageMod.PageMod({
    contentScriptWhen: 'end',
    include: /^http.+?mozilla\.org.+?(firefox|mobile).+?notes.+$/,
    onAttach: function(worker){
        worker.port.on('get_releases', function(data) {
            data.onComplete = function(resp) {
                worker.port.emit('releases', resp.json);
            };
            Request(data).get();
        });
        worker.port.on('get_release', function(data) {
            data.onComplete = function(resp) {
                console.log(resp.json);
                worker.port.emit('release', resp.json);
                // TODO: get all the notes for the release
            };
            Request(data).get();
        });
    },
    contentScriptFile: [
        self.data.url('jquery-2.1.0.min.js'),
        self.data.url('worker.js')
    ],
    contentStyleFile: self.data.url('release-note-preview.css')
});
