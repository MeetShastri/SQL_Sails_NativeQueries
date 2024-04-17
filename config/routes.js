/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  'GET /users': 'UserController.findUsers',
  'POST /users/createuser': 'UserController.createUser',
  'POST /users/loginuser': 'UserController.loginUser',
  'POST /reminder/addreminder': 'ReminderController.addReminder',
  'GET /reminder/getreminder/:createdBy': 'ReminderController.getReminder',
  'PATCH /reminder/updatereminder/:reminderId': 'ReminderController.updateReminder',
  'DELETE /reminder/deletereminder/:id':'ReminderController.deleteReminder',
  'GET /reminder/upcomingreminder/:id':'ReminderController.upcomingReminder',
  'GET /reminder/pushnotification/:id':'ReminderController.pushNotification',
};
