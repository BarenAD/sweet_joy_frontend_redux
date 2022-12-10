const path = require('path');
const DEPLOY_PATH_IN_SEVER = '';
const DEPLOY_SERVER_HOST = '';
const DEPLOY_USER = '';

module.exports = async function (shipit) {
  require('shipit-deploy')(shipit);
  await shipit.local('npm run build');
  shipit.initConfig({
    default: {
      workspace: path.resolve(__dirname, './build'),
      shallowClone: false
    },
    staging: {
      servers: `${DEPLOY_USER}@${DEPLOY_SERVER_HOST}`,
      deployTo: path.join(DEPLOY_PATH_IN_SEVER),
      deleteOnRollback: true
    }
  });
};
