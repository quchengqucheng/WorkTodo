require.config({
    baseUrl: "src/js",
    paths: {
        //FastClick: "http://cdn.bootcss.com/fastclick/1.0.3/fastclick.min",
        Require: "lib/require.min",
        // Router: "lib/director",
        // Vue: "lib/vue",
        // AV: "https://cdn1.lncld.net/static/js/av-core-mini-0.5.4"
    },
    shim: {
        'Require': {
            exports: "Require"
        }
        // ,
        // 'Router': {
        //     exports: "Router"
        // },
        // 'AV': {
        //     exports: "AV"
        // }
    }
});
require( [
    'util',
    'data',
    'handlers',
    // 'Require',
    // 'AV',
    // 'store',
    // 'util',
    'Require'
], function(
    util,
    data,
    handlers,
    // Router,
    // AV,
    // todoStorage,
    Require
) {
    handlers.initAll();

});