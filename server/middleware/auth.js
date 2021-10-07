const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    //check for session token
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 120;

    let decodedData;
    if(token && isCustomAuth){

      decodedData = jwt.verify(token, 'test');

      req.userId = decodedData ? decodedData.id : null;

    }else{

      decodedData = jwt.decode(token);

      req.userId = decodedData ? decodedData.sub : null;
    }

    next();

  } catch (error) {
    console.log(error);
  }

}

module.exports = {auth};