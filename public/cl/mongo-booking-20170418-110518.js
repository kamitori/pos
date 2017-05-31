
/** setups indexes **/
db.getCollection("setups").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** setups records **/
db.getCollection("setups").insert({
  "_id": ObjectId("58f59b2d7bd8b813b4c12337"),
  "user": ObjectId("58ef0016c3e6e20c14988f5e"),
  "created": ISODate("2017-04-18T04:50:53.773Z"),
  "name": "Send an Email",
  "__v": NumberInt(0),
  "alias": "send-an-email",
  "type": "module",
  "module_name": "notification",
  "description": "",
  "active": 1,
  "deleted": 0,
  "options": [
    {
      "name": "Send appointment cancellation link to the customer",
      "key": "send-appointment-cancellation",
      "active": 1,
      "description": ""
    },
    {
      "name": "Send reschedule appointment link to the customer",
      "key": "send-reschedule-appointment",
      "active": 1,
      "description": ""
    },
    {
      "name": "Send a \"thank you\" email to customers for submitting a review",
      "key": "send-thank-you-for-submitting-review",
      "active": 1,
      "description": ""
    },
    {
      "name": "disabled",
      "key": "temp",
      "active": 0,
      "description": ""
    }
  ],
  "daily": 0,
  "orderno": NumberInt(0)
});
db.getCollection("setups").insert({
  "_id": ObjectId("58f5b6f02f08fce430000029"),
  "user": ObjectId("58ef0016c3e6e20c14988f5e"),
  "created": ISODate("2017-04-18T04:50:53.773Z"),
  "name": "Appointment Reminders",
  "__v": NumberInt(0),
  "alias": "appointment-reminders",
  "type": "module",
  "module_name": "notification",
  "description": "",
  "active": 1,
  "deleted": 0,
  "options": [
    {
      "name": "Email",
      "key": "email",
      "active": 1,
      "description": ""
    },
    {
      "name": "Text",
      "key": "text",
      "active": 1,
      "description": ""
    }
  ],
  "daily": 1,
  "orderno": NumberInt(1)
});
