'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Company name',
    trim: true
  },
  type: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  workingHour: {
    type: Schema.Types.Mixed,
    default: [
      {
        'start': '08:00',
        'end': '17:00',
        'active': false,
        'day': 'sunday',
        'dow': 1
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'monday',
        'dow': 2
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'tuesday',
        'dow': 3
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'wednesday',
        'dow': 4
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'thrursday',
        'dow': 5
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'friday',
        'dow': 6
      },
      {
        'start': '08:00',
        'end': '17:00',
        'active': true,
        'day': 'saturday',
        'dow': 7
      }
    ]
  },
  breakingHour: {
    type: Schema.Types.Mixed,
    default: [
      {
        'start': '12:00',
        'end': '13:00',
        'active': false,
        'day': 'sunday',
        'dow': 1
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'monday',
        'dow': 2
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'tuesday',
        'dow': 3
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'wednesday',
        'dow': 4
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'thrursday',
        'dow': 5
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'friday',
        'dow': 6
      },
      {
        'start': '12:00',
        'end': '13:00',
        'active': true,
        'day': 'saturday',
        'dow': 7
      }
    ]
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Company', CompanySchema);
