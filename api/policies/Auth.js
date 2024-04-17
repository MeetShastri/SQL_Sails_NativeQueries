const jwt = require('jsonwebtoken');

module.exports =  async(req, res, next) => {
  console.log('Middleware is running');
  if (!req.headers['authorization']){
    return res.json({
      message:'Token is required',
    });
  }
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, 'abcde');
  console.log(decoded.id);
  const userExistQuery = 'SELECT * FROM user WHERE id = $1';
  const userExistParams = [decoded.id];
  const userExistResult = await sails.sendNativeQuery(userExistQuery, userExistParams);
  if(userExistResult.rows.length === 0){
    return res.json({
      message:'User not found',
    });
  }

  console.log(req.body.createdBy);
  if(decoded.id !== req.body.createdBy){
    return res.json({
      message:'You are not allowed to manipulate anything',
    });
  }
  next();
};
