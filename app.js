var express=require('express');
var app=express();
const jwt = require("jsonwebtoken");
var bodyParser=require('body-parser');
var mysql=require('./model/db');
var bcrypt=require('bcryptjs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const auth = require("./middleware/auth");
app.get('/',(req,res)=>{
    res.send('Welcome Ajith');
});
app.post('/register',async(req,res)=>{
    const {fname,lname,email,mobileno,password,cpassword,address,city,state,country} = req.body;
    var d=false;
    if (!(fname && lname && email && mobileno && password && cpassword && address && city && state && country)) {
        res.status(400).send("All input is required");
      }
    else{
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       if(email.match(mailformat))
       {
          if(password.length>=8)
          {
              if(password===cpassword)
              {
                var s="select * from user where email='"+email+"'";
                mysql.query(s,async(err,result)=>{
                    if(result.length==0)
                    {
                      encryptedPassword = await bcrypt.hash(password, 10);
                      var s1="insert into user(fname,lname,email,mobileno,password,address,city,state,country) values('"+fname+"','"+lname+"','"+email.toLowerCase()+"','"+mobileno+"','"+encryptedPassword+"','"+address+"','"+city+"','"+state+"','"+country+"')";
                      mysql.query(s1,(err,result1)=>{
                          if(err) throw err;
                          else
                          {
                              const token = jwt.sign(
                                  {  email },
                                  "1234",
                                  {
                                    expiresIn: "2h",
                                  }
                                );
                                res.status(201).json(token);
                          }
                      });
                    }
                    else
                    return res.status(409).send("User Already Exist. Please Login");
                });
              }
              else
                res.status(400).send("Password and confirm Password do not match");
            
          }
          else
            res.status(400).send("Password should contain atleast 8 characters");
       }
       else
        res.status(400).send("Please Enter valid email");
      }
});
app.post('/login',async(req,res)=>{
    const { email, password } = req.body;

    if (!(email && password)) {
      res.send("All input is required");
    }
    else
    {
        var s="select * from s1 where email='"+email+"'";
        mysql.query(s,async(err,res1)=>{
            if(res1.length==1)
            {
                if (await bcrypt.compare(password, res1[0].password)) {
                    const token = jwt.sign(
                      {  email },
                      "1234",
                      {
                        expiresIn: "2h",
                      }
                      
                    );
                    res.send(token);
                }
                else
                res.send("Invalid Credientials");
            }
            else
            {
                res.send("please Register");
            }
        });
    }
})

app.post("/edit/:disp", auth, (req, res) => {
  var s1='update test set fname="'+req.body.fname+'",lname="'+req.body.lname+'",mobileno="'+req.body.mobileno+'",password="'+req.body.password+'",cpassword="'+req.body.cpassword+'",address="'+req.body.address+'",city="'+req.body.city+'",state="'+req.body.state+'",country="'+req.body.country+'" where email="'+req.params.disp+'"';
  connection.query(s1,function(err,result){
      if(err) throw err;
      console.log(result);
      res.send(result);
  })
  });

app.listen(1234,()=>
{
  console.log("Started");
});