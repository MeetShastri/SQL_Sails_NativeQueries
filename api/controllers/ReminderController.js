/**
 * ReminderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addReminder: async(req,res) => {
    const addReminderQuery = 'INSERT INTO Reminder (title, description, dueDate, createdBy) VALUES($1, $2, $3, $4)';
    const {title, description, dueDate, createdBy} = req.body;
    if(!title || !description || !dueDate || !createdBy){
      return res.json({
        message: 'All fields are mandatory',
      });
    }

    // Check if the User table exists
    const checkTableQuery = 'SHOW TABLES LIKE "Reminder"';
    const tableExistsResult = await sails.sendNativeQuery(checkTableQuery);
    // If the table doesn't exist, create it
    if (tableExistsResult.rows.length === 0) {
      const createTableQuery = `
          CREATE TABLE Reminder (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            dueDate VARCHAR(255) NOT NULL,
            createdBy VARCHAR(255) NOT NULL,
            FOREIGN KEY (createdBy) REFERENCES user(id)
          )
        `;
      await sails.sendNativeQuery(createTableQuery);
    }
    const userExistQuery = 'SELECT id from user where id = $1';
    const queryParamss = [createdBy];
    const userExistResult = await sails.sendNativeQuery(userExistQuery, queryParamss);
    if(userExistResult.rows.length === 0){
      return res.json({
        message: 'User does not exist'
      });
    }
    const queryParams = [title, description, dueDate, createdBy];
    try {
      const result = await sails.sendNativeQuery(addReminderQuery, queryParams);
      if(result.affectedRows > 0){
        const insertId = result.insertId;
        const selectQuery = 'SELECT * FROM Reminder WHERE id = $1';
        const selectResult = await sails.sendNativeQuery(selectQuery, [insertId]);
        if(selectResult.rows.length> 0){
          return res.json({
            message:'Reminder has been created',
            userData:selectResult.rows[0]
          });
        }}
    } catch (error) {
      return res.json({
        msg:'Server error',error
      });
    }
  },

  getReminder: async(req, res) => {
    const createdBy = req.params.createdBy;
    console.log(createdBy);
    const findReminderQuery = 'SELECT * FROM Reminder WHERE createdBy = $1';
    const queryParams = [createdBy];
    const userExistQuery = 'SELECT id from Reminder where createdBy = $1';
    console.log(userExistQuery);
    const queryParamss = [createdBy];
    const userExistResult = await sails.sendNativeQuery(userExistQuery, queryParamss);
    if(userExistResult.rows.length === 0){
      return res.json({
        message: 'User does not exist'
      });
    }
    const findReminderResult = await sails.sendNativeQuery(findReminderQuery, queryParams);
    return res.json({
      message:'All Reminders are here',
      Reminders:findReminderResult.rows
    });
  },

  updateReminder: async(req,res) => {
    const { title, description, dueDate } = req.body;
    const updateReminderId= req.params.reminderId;
    const updateFields = [];
    const queryParams = [];
    if (title) {
      updateFields.push('title = $1');
      queryParams.push(title);
    }
    if (description) {
      updateFields.push('description = $2');
      queryParams.push(description);
    }
    if (dueDate) {
      updateFields.push('dueDate = $3');
      queryParams.push(dueDate);
    }
    // console.log(updateReminderId);
    // const updateReminderQuery = 'UPDATE Reminder SET title = $1, description = $2, dueDate = $3 where id = $2';
    const updateReminderQuery = `
    UPDATE Reminder
    SET ${updateFields.join(', ')}
    WHERE id = $${queryParams.length + 1}
`;
    queryParams.push(updateReminderId);
    // const updateQueryParams = [title, description, dueDate, updateReminderId];
    const result = await sails.sendNativeQuery(updateReminderQuery, queryParams);
    const getReminderQuery = 'SELECT * FROM Reminder WHERE id = $1';
    const getReminderParams = [updateReminderId];
    const reminder = await sails.sendNativeQuery(getReminderQuery, getReminderParams);
    console.log(reminder.rows);
    {
      return res.json({
        message: 'Reminder successfully updated',
        updatedReminder: reminder.rows,
      });
    }
  },

  deleteReminder: async(req,res) => {
    const reminderId = req.params.id;
    const findReminderQuery = 'SELECT * FROM Reminder WHERE id = $1';
    const findReminderParams = [reminderId];
    const findReminderResult = await sails.sendNativeQuery(findReminderQuery, findReminderParams);
    if(findReminderResult.rows.length <= 0){
      return res.json({
        message:'No reminder for such id is present',
      });
    }
    const deleteReminderQuery = 'DELETE FROM Reminder WHERE id = $1';
    const deleteReminderParams = [reminderId];
    const deleteReminderResult = await sails.sendNativeQuery(deleteReminderQuery, deleteReminderParams);
    if(deleteReminderResult.affectedRows > 0){
      return res.json({
        message: 'Reminder has been deleted successfully',
        deletedReminder:findReminderResult.rows
      });
    }
  },

  upcomingReminder: async(req,res) => {
    const userId = req.params.id;
    const findUserQuery = 'SELECT * FROM user where id = $1';
    const findUserParams = [userId];
    const findUserResult = await sails.sendNativeQuery(findUserQuery, findUserParams);
    if(findUserResult.rows.length === 0){
      return res.json({
        message:'User not found',
      });
    }
    const findRemindersQuery = 'SELECT * FROM Reminder where dueDate >= CURRENT_DATE() AND createdBy = $1';
    const findReminderParams = [userId];
    const findReminderResult = await sails.sendNativeQuery(findRemindersQuery, findReminderParams);
    if(findReminderResult.rows.length===0){
      return res.json({
        message:'No upcoming reminders find',
      });
    }
    else{
      return res.json({
        message:'Here are your upcoming reminders',
        upcomingReminders:findReminderResult.rows,
      });
    }
  },

  pushNotification: async(req,res) => {
    const userId = req.params.id;
    const findUserQuery = 'SELECT * FROM user where id = $1';
    const findUserParams = [userId];
    const findUserResult = await sails.sendNativeQuery(findUserQuery, findUserParams);
    if(findUserResult.rows.length === 0){
      return res.json({
        message:'User not found',
      });
    }
    const findRemindersQuery = 'SELECT * FROM Reminder where dueDate = CURRENT_DATE() AND createdBy = $1';
    const findReminderParams = [userId];
    const findReminderResult = await sails.sendNativeQuery(findRemindersQuery, findReminderParams);
    if(findReminderResult.rows.length===0){
      return res.json({
        message:'No upcoming reminders find',
      });
    }
    else{
      return res.json({
        message:'Here are your upcoming reminders',
        upcomingReminders:findReminderResult.rows,
      });
    }
  }
};

