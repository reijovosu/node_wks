const openshiftRestClient = require('openshift-rest-client');
const jsyaml = require('js-yaml');

var configMap = {
    welcometext: "Default text"
}

function getConfigMap() {
    return configMap;
}

async function retrieveConfigMap() {
    try {
        let client = await openshiftRestClient({
            request: {
                strictSSL: false
            }
        });
    
        let cMap = await client.configmaps.find('app-config');
        let config = jsyaml.safeLoad(cMap.data['app-config.yml']);
    
        if (JSON.stringify(config) !== JSON.stringify(configMap)) {
          configMap = config;
          console.log("Config map changed, new values: ",config);
        }
    } catch(err) {
    }
}

function startFetchTimer() {
    setInterval( retrieveConfigMap, 15000 );
}

module.exports = {
    getCmap: getConfigMap,
    retrieveConfigMap: retrieveConfigMap,
    startFetchTimer: startFetchTimer
};