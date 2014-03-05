var addon_self = self;
var req_releases = {
    //url: 'https://nucleus.mozilla.org/rna/releases/',
    //content: {
        //format: 'json'
    //}
    url: 'https://nucleus.mozilla.org/rna/releases?format=json'
};

// figure out what the page we're looking at is for
var page_for = {
    'firefox_for_android': window.location.href.indexOf("mobile") > 0,
    'beta': window.location.href.indexOf("beta") > 0,
    'aurora': window.location.href.indexOf("aurora") > 0,
    'firefox_os': window.location.href.indexOf("/os/") > 0
}
page_for['release'] = !(page_for.beta || page_for.aurora);
page_for['firefox'] = !(page_for.firefox_os || page_for.firefox_for_android);

var $release_picker = $('<div id="release-picker"></div>')

// Ask the addon to get some releases for us
addon_self.port.emit('get_releases', req_releases);

// TODO: handle the release when passed from the addon

function get_release(e) {
    $('select option:selected', $release_picker).each(function() {
        console.log('Getting release: ' + $(this).val());
        addon_self.port.emit('get_release', {url: $(this).val()});
    });
}

// Register a listener that will accept release json
addon_self.port.on('releases', function(json) {

    // Add options to form
    var options = ['<option>---</option>'];
    $(json).each(function() {
        $that = $(this)[0];

        // Only add options for the product/channel we're looking at
        $that.p = $that.product.toLowerCase().replace(/\s/g, '_');
        $that.c = $that.channel.toLowerCase().replace(/\s/g, '_');
        if (page_for[$that.p] && page_for[$that.c]) {
            var pcv = [$that.product, $that.channel, $that.version].join(' ');
            options += '<option value="'+$that.url+'?format=json">'+pcv+'</option>';
        }
    })

    $('<form><select>'+options+'</select></form>').appendTo($release_picker);

    $release_picker.on('change', function (e) { get_release(e); })

    $release_picker.appendTo('body');

});

