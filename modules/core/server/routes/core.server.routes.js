'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // var modulelist = ['admin', 'mainstations', 'dashboards', 'customers', 'adminsystems', 'setups', 'selectlists', 'adminservices', 'staffs', 'calendars', 'settingsaccounts', 'accountplans', 'adminsetups', 'appintegrations'];

  // var adminstr = '';
  // for (var i = modulelist.length - 1; i >= 0; i--) {
  //   adminstr += modulelist[i];
  //   if (i > 0) {
  //     adminstr += '|';
  //   }
  // }
  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Set route admin template
  // app.route('/:url(' + adminstr + ')').get(core.renderAdmin);
  // app.route('/:url(' + adminstr + ')/:function[0-9a-zA-z,-,\/]+').get(core.renderAdmin);
  // Define application route
  app.route('/restaurants*').get(core.renderRestaurant);
  app.route('/*').get(core.renderIndex);
};
