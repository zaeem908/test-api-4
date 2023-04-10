const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash:true
})
const db = require('./queries')


fastify.get('/',(req,res) => {
    res.send('hello world...') 
})

fastify.post('/login',db.logIn) 
fastify.post('/resetpassword',db.forgotPassword)
fastify.post('/addsubject',db.addSubject)

fastify.listen(3000)   