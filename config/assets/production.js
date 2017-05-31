'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-grid/ui-grid.min.css',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.css',
        'public/lib/fullcalendar/dist/fullcalendar.min.css',
        'public/lib/fullcalendar-scheduler/dist/scheduler.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-ui-grid/ui-grid.min.js',
        'public/lib/angular-promise-buttons/dist/angular-promise-buttons.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/angular-bootstrap-toggle/dist/angular-bootstrap-toggle.min.js',
        'public/lib/moment/moment.js',
        'public/lib/fullcalendar/dist/fullcalendar.min.js',
        'public/lib/fullcalendar-scheduler/dist/scheduler.min.js',
        'public/lib/angular-ui-calendar/src/calendar.js',
        'public/lib/angular-modal-service/dst/angular-modal-service.min.js',
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
