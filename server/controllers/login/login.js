const db = require('../../db/db.js');
const { create_token } = require('../../util/generate_token')

const login = ( (req, res) => {

  //console.log(req);
  const {email, password} = req.body;

  const user = db.users.list().find((user) => user.email === email);


  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  
  const token = create_token(user);

  res.send({token});

});

module.exports = {login};