/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');


module.exports = {

  async findUsers(req, res) {
    try {
      const rawQuery = 'SELECT * FROM user';

      // Execute the native MySQL query
      const result = await sails.sendNativeQuery(rawQuery);

      // Process the result of the query
      console.log(result.rows); // Access the rows returned by the query

      return res.ok(result.rows);
    } catch (error) {
      console.error('Error executing native query:', error);
      return res.serverError('An error occurred while executing the query');
    }
  },

  createUser: async(req,res) => {
    const createUserQuery = `INSERT INTO user (firstName, lastName, age, email, password) VALUES($1, $2, $3, $4, $5)`;
    const {firstName, lastName, age, email, password} = req.body;
    if(!firstName || !lastName || !age || !email || !password || !password.length>5){
      return res.json({
        message: 'All fields are mandatory',
      });
    }
    const userExistQuery = 'SELECT email from user where email = $1';
    console.log(userExistQuery);
    const queryParamss = [email];
    const userExistResult = await sails.sendNativeQuery(userExistQuery, queryParamss);
    console.log(userExistResult);
    if(userExistResult.rows.length > 1){
      return res.json({
        message: 'User already exist'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryParams = [firstName, lastName, age, email, hashedPassword];
    try {
      const result = await sails.sendNativeQuery(createUserQuery, queryParams);

      if(result.affectedRows > 0){
        const insertId = result.insertId;
        const selectQuery = 'SELECT * FROM user WHERE id = $1';
        const selectResult = await sails.sendNativeQuery(selectQuery, [insertId]);
        if(selectResult.rows.length> 0){
          return res.json({
            message:'User has been created',
            userData:selectResult.rows[0]
          });
        }}
      else{
        console.log('user not created');
      }
    } catch (error) {
      console.error('error creating user', error);
    }
  },



  loginUser: async(req, res) => {
    const loginUserQuery = 'SELECT * FROM user WHERE email = $1';
    const {email, password} = req.body;
    const loginParams = [email];
    const loginQueryResult = await sails.sendNativeQuery(loginUserQuery, loginParams);
    // console.log(loginQueryResult.rows[0].password);
    const user = loginQueryResult.rows[0];
    if(loginQueryResult.rows.length<=0){
      return res.json({
        message: 'No user with this email found',
      });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if(matchPassword){
      const tokenObject = {
        name:user.firstName,
        id:user.id,
        email:user.email,
      };
      const token = await jwt.sign(tokenObject, 'abcde', {expiresIn: '4hr'});
      console.log(token);
      return res.json({
        message:'You have been successfully logged in',
        tokenObject,
        token
      });
    }
    else{
      return res.json({
        message: 'You have entered wrong password pls enter correct password'
      });
    }
  }

};

