'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-ui-grid/ui-grid.css',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.css',
        'public/lib/fullcalendar/dist/fullcalendar.min.css',
        'public/lib/fullcalendar-scheduler/dist/scheduler.min.css',
        'public/lib/components-font-awesome/css/font-awesome.min.css',
        'public/lib/angularjs-datepicker/src/css/angular-datepicker.css',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.min.css',
        'public/lib/angular-color-picker/dist/themes/angularjs-color-picker-bootstrap.min.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/moment/moment.js',
        'public/lib/angular/angular.js',
        'public/lib/bootstrap/dist/js/bootstrap.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-grid/ui-grid.js',
        'public/lib/angular-promise-buttons/dist/angular-promise-buttons.min.js',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/fullcalendar/dist/gcal.min.js',
        'public/lib/fullcalendar-scheduler/dist/scheduler.min.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/angular-modal-service/dst/angular-modal-service.js',
        'public/lib/angularjs-datepicker/src/js/angular-datepicker.js',
        'public/lib/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
        'public/lib/angular-local-storage/dist/angular-local-storage.min.js',
        'public/themes/admin/js/csv.js',
        'public/themes/admin/js/pdfmake.js',
        'public/themes/admin/js/vfs_fonts.js',
        'public/lib/tinycolor/dist/tinycolor-min.js',
        'public/lib/angular-color-picker/dist/angularjs-color-picker.min.js',
        'public/lib/angular-md5/angular-md5.min.js'
        // 'public/lib/crypto-js/crypto-js.js',
        // endbower
      ],
      admincss: [],
      adminjs: [],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'public/themes/*.css',
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'public/themes/admin/js/common.js',
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg',
      'public/themes/client/images/*.jpg',
      'public/themes/client/images/*.png',
      'public/themes/client/images/*.gif',
      'public/themes/client/images/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
