const {Client} = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
let userToken ;
  sgMail.setApiKey('123')
   
const client = new Client({
    user:"postgres",
    host:"127.0.0.1",
    database:"postgres", 
    password:"Zaeem1198!",  
    port:5432
}); 
client.connect();

const mail = {
  to:'etc@gmail.com',
  from:'zaeembaloch1198@gmail.com',
  subject:'reset password',
  text:'follow this link to reset your passcode',
  html:'<a href="http://localhost:3000/setnewpassword">Reset Password</a>'
}

function validEmail(email) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
}

function validPassword(password) {
  if(password.length >= 8) {
    return true
  }else {
    return false
  }
}

function createToken(data) {
  const token = jwt.sign({data:data},'secretpassword')
  return token
}  

const logIn = async (request, response) => {
   try {
      const {email,password} = request.body


      const result = await client.query(`SELECT email,password FROM users3 WHERE email = $1`,[email]);
      const user = result.rows[0]

      if(!validEmail(email)) {
        response.status(400).send('email is not valid!')
      }
      if(!validPassword(password)) {
     response.status(400).send('password must be at least 8 characters!')
      }
      if(!user) {
        response.status(400).send('No user with this email')
      }
     if(user) {
        const passwordMatch = await bcrypt.compare(password,user.password) 
        if(passwordMatch) {
         userToken = createToken(email)
         response.send(userToken)
         loggedIn = true;
         console.log('login succesful') 
       }else{
        console.log('password not matched')
       }
      }
    } catch (error) {
      console.error(error);
      response.status(500).send('internal error');
    }
  };  



  const forgotPassword = async (request,response) => {
  try{
    const {email} = request.body
    if(!validEmail(email)) {
      response.status(400).send('email not valid!')
    }
    const data = await client.query('SELECT email,password from users3 WHERE email = $1',[email])
    const user = data.rows[0]
    if(user.email == email) {
      sgMail.send(mail)
      .then(() => {
        console.log('email sent succesfully')
        response.status(200).send('email sent succesfully')
      }) 
    }
    
  }catch(err){
    console.log(err)
    response.status(500).send('no such email in database')
  } 
  }; 

  const addSubject = async (request,response) => {
    try{
      const {token,subject} = request.body
      const verified = jwt.verify(token,'secretpassword')
      if(verified) {
        client.query(`INSERT INTO subjects2 (subject) VALUES ($1)`,[subject])
        response.send(`${subject} added to subjects`)
      }
      if(!verified) {
        response.send('user not logged in!')
      }

    }catch(err) {
      console.log(err)
      response.status(500).send('internal sever error')
    }
  }


  module.exports= {
    logIn,
    forgotPassword,
    addSubject
  };
