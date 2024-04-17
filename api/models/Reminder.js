/**
 * Reminder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    dueDate: { type: 'string', columnType: 'date' },
    // createdBy: {model:'user', required: true},
    createdBy: { type: 'number', required: true }
  },

};

