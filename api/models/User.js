/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    age: { type: 'number' },
    email: { type: 'string', unique: true },
    password: {type: 'string', required: true},
    profilePicturePath: { type: 'string' }
  },
};

