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
app.listen(process.env.PORT || 3001);
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
            if(result.length==0)
            {
                instance.save().then((result)=>{
                    res.redirect('/');
                }).catch((err)=>{
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
                    res.redirect('/');
                }).catch((err)=>{
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
             let count=0;
            if(result.length==0)
            {
                res.render('login.ejs',{validation:" * Signup first",validationp: ""});
            }
            else{
            result.forEach((users)=>{
                if(req.body.email==users.email&&req.body.Password==users.password)
                {
                    current_user=req.body.email;
                   res.render('main.ejs',{title: users.title});
                   count++;
                }
                else if(req.body.email==users.email&&req.body.Password!=users.password)
                {
                    res.render('login.ejs',{validation:"",validationp: "* Wrong password"});
                    count++;
                }
            })  
           if(count==0){
            res.render('login.ejs',{validation:" * Signup first",validationp: ""});
           }
        }
         }
     })
})
 app.post("/innerdetails",(req,res)=>{
       Userdetail.find((err,result)=>{
           if(err)
           console.log(err);
           else{
               result.forEach((users)=>{
                   if(users.email==current_user)
                   {
                         users.title.push({
                            head: req.body.List,
                            data: [],
                            unique: String(Date.now())
                         });
                         users.save();
                         res.render('main.ejs',{title: users.title});
                   }
               })
           }
       })
})
 app.post('/tododata', async (req,res)=>{
    const person = await Userdetail.findOne({ email: current_user })
    person.title.forEach((i) => {
        if (i.unique === req.body.uniqueid) {
            i.data.push(
                {
                    datainner: req.body.List,
                    state: "con",
                    sty: Date.now(),
                    state2: "bs"
                }
                )
        }
    })

    const update = { title: person.title }
    await person.updateOne(update);

    res.render('main.ejs', { title: update.title });
})
app.post('/innerdetails/:id', async (req,res)=>{
    let counts=0;
    const person = await Userdetail.findOne({ email: current_user })
    for(let k=0;k<person.title.length;k++){
        if(person.title[k].unique==req.params.id)
        break;
        counts+=1;
    }
    let data=person.title.slice(0,counts);
    person.title=person.title.slice(counts+1,person.title.length);
    person.title=data.concat(person.title);
    const update = { title: person.title }
    await person.updateOne(update);
    res.json({msg:'/main'})
})
app.get('/main', async (req,res)=>{
    const person2 = await Userdetail.findOne({ email: current_user })
    res.render('main.ejs', { title: person2.title });
})
app.post('/button/:id', async (req,res)=>{
    let counts=0;
    console.log(req.params.id);
    const person = await Userdetail.findOne({ email: current_user })
    for(let k=0;k<person.title.length;k++){
        for(let r=0;r<person.title[k].data.length;r++)
        {   
            if(person.title[k].data[r].sty==req.params.id)
            {
                console.log('entered');
                 person.title[k].data[r].state="mo";
                 person.title[k].data[r].state2="mbs";
            }
        }
    }
    const update = { title: person.title }
    await person.updateOne(update);
    res.json({msgs:'/main2'})
})

app.get('/main2', async (req,res)=>{
    const person2 = await Userdetail.findOne({ email: current_user })
    res.render('main.ejs', { title: person2.title });
})
