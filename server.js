const express= require('express');
const app=express();
const Userdetail=require('./model/user');
const mongoose=require('mongoose');
const user = require('./model/user');
let current_user;
const durl="mongodb+srv://TOdo:firstproject@cluster0.pbeee.mongodb.net/To-do?retryWrites=true&w=majority";
mongoose.connect(durl,(err,db)=>{
    if (err) throw err;
    console.log("Database created!");
    global.db=db;
});
app.set('view engine','ejs');
app.listen(3001);
app.use(express.urlencoded({extended: true}));
app.use(express.static('styles'));
app.use(express.static('scripts'));
app.get('/',(req,res)=>{
  res.render('login.ejs',{validation : "",validationp:""});
})
app.get('/signup',(req,res)=>{
    res.render('signup.ejs',{popup : ""});
})
app.post('/details',(req,res)=>{
    const instance=new Userdetail({
        email : req.body.email,
        password : req.body.Password,
        title : []
    });
    Userdetail.find((err,result)=>{
        if(err)
        console.log(err);
        else
        {  
            console.log(result.length);
            if(result.length==0)
            {
                instance.save().then((result)=>{
                    console.log(req.body);
                    console.log('success');
                    res.redirect('/');
                }).catch((err)=>{
                    console.log('failure');
                   res.send(err);
                });
            }
            else{
            let count=0;
            result.forEach((users)=>{
                if(req.body.email==users.email)
                {
                    res.render('signup.ejs',{popup : "*User exists"});
                    count++;
                }
            })  
            if(count==0)
            {
                instance.save().then((result)=>{
                    console.log(req.body);
                    console.log('success');
                    res.redirect('/');
                }).catch((err)=>{
                    console.log('failure');
                   res.send(err);
                });
            }      
        }
        }
    });
})
app.post('/login',(req,res)=>{
     Userdetail.find((err,result)=>{
         if(err)
         console.log(err);
         else
         {
            
            if(result.length==0)
            {
                res.render('login.ejs',{validation:" * Signup first",validationp: ""});
            }
            else{
            result.forEach((users)=>{
                console.log(req.body);
                console.log(users);
                if(req.body.email==users.email&&req.body.Password==users.password)
                {
                    current_user=req.body.email;
                   console.log('success');
                   res.render('main.ejs',{title: users.title});
                }
                else if(req.body.email==users.email&&req.body.Password!=users.password)
                {
                    res.render('login.ejs',{validation:"",validationp: "* Wrong password"});
                }
            })  
           
        }
         }
     })
})
 app.post("/innerdetails",(req,res)=>{
     console.log(1);
       Userdetail.find((err,result)=>{
           if(err)
           console.log(err);
           else{
               result.forEach((users)=>{
                   if(users.email==current_user)
                   {
                        console.log(users)
                         users.title.push({
                            head: req.body.List,
                            data: [],
                            unique: String(Date.now())
                         });
                         console.log(users);
                         users.save();
                         res.render('main.ejs',{title: users.title});
                   }
               })
           }
       })
})
 app.post('/tododata',(req,res)=>{
    let dublicate;
   Userdetail.find((err,result)=>{
    if(err)
    console.log(err);
    else
    {
       result.forEach((user)=>{
        if(user.email==current_user)
        {   
            console.log(req.body);
             user.title.forEach((obj)=>{
                 if(obj.unique==req.body.uniqueid){
                     obj.data.push(req.body.List);
                     dublicate=user.title
                 }
             })
        }
       })
    }
    console.log(dublicate);
    Userdetail.updateOne({email : current_user},{title : dublicate});
    res.render('main.ejs',{title: dublicate});
})
})
