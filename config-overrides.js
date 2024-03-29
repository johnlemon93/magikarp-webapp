const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
        config,
    );

    config = rewireLess.withLoaderOptions({
        modifyVars: { 
            "@primary-color": "#0c5416" 
        },
        javascriptEnabled: true,
    })(config, env);

    return config;
};