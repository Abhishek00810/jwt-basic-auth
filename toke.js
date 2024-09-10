const express = require('express');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const secretKey = 'abhishek will earn in crores';

var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
app.use(urlencodedParser);
let users = [];

function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

app.post('/signup', logger, function(req, res)
{
    let username = req.body.username
    let password = req.body.password
    users.push({
        username: username,
        password: password
    })
    res.json({
        message: users
    })
})

app.post('/signin', logger, function(req, res)
{
    let username = req.body.username;
    let password = req.body.password;
    const user = users.find(names => names.username === username && names.password === password)
    if(user)
    {
        const token = jwt.sign({username: user.username}, secretKey);
        res.header("jwt", token);
    
        return (
            res.json({
                token: token
            })
        );
    }
    else{
        return (
            res.json({
                token: "",
                message: "Failed attempt"
            })
        );
    }
})

function auth(req, res, next)
{
    const token = req.headers.token;
    console.log(token)
    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err)
        {
            return res.status(403).json({Error: "failed to authentiate token"});
        }
        else{
            req.username = decoded.username
            next();
        }
    })
}

app.get('/protected', auth, function(req, res)
{
    const currentUser = req.username;
    const user = users.find(names => names.username === currentUser)
    if(!user)
    {
        res.json({
            message: "Not authorized"
        })
        return;
    }
    res.json({
        username: user.username,
        password: user.password
    })
})

app.listen(3000);

