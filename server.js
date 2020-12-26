const express = require('express'),
    mongoose = require('mongoose'),
    ejs = require('ejs'),
    app = express();


    app.use(express.urlencoded({extended:true}));
    app.use(express.static('public'));
    app.set('view engine', 'ejs');


    mongoose.connect('mongodb://localhost:27017/tccDB', {useNewUrlParser:true, useUnifiedTopology:true})

    var dt = new Date();

    var date = dt.getFullYear() + '-'+(dt.getMonth()+1)+'-'+dt.getDate();

    var time = dt.getHours() + ':' +dt.getMinutes()+ ':'+ dt.getSeconds();
   
    var timer = date + ' ' +time;

    const studentSchema = mongoose.Schema({
        firstName:{type:String, required:true},
        lastName:{type:String, required:true},
        gender:{type:String, required:true},
        gender:{type:String, required:true},
        course:{type:String, required:true},
        dateRegistered:{type:Date, default:Date.now},

    })

    const Student = new mongoose.model('Student', studentSchema);

   
 
    
app.get('/', function(req,res){
    res.render('home',{timeOfDay:timer});
})

app.get('/about', function(req,res){
    res.render('about',{timeOfDay:timer});
})

app.get('/course', function(req,res){
    res.render('course',{timeOfDay:timer});
})

app.get('/register', function(req,res){
    res.render('register',{timeOfDay:timer});
})

 app.post('/register', function(req,res){
       const{firstName, lastName, gender, course} = req.body;


        const newStudent = new Student({firstName, lastName, gender, course});

        newStudent.save(function(err){
            if(err){
                console.log(err);

            }else{
                res.redirect('register');
            }
        })
    })

app.get('/applicant', (req,res)=>{
    Student.find(function(err,result){
        if(err){
            console.log(err);
        } else{

            res.render('applicant',{record:result, timeOfDay:timer});
            // console.log(result);
            // res.send('welcome');
        }
    })
})


app.get('/edit/:id',function(req,res){
    //console.log(req.params.id);

    //res.send('edit page');
    Student.find({_id:req.params.id}, function(err,result){
        if(err){
            console.log(err);
        }else{
            let id = req.params.id;
            result.forEach(function(r){
                fname = r.firstName;
                lname = r.lastName;
                gend = r.gender;
                prog = r.course;

               res.render('edit',{timeOfDay:timer, 
                                   id:id,
                                   fname:fname,
                                   lname:lname,
                                    gend:gend,
                                    prog:prog})
            })
            //res.render('edit',{record:result, timeOfDay:timer, id:id})
        }
    })
})

app.post('/edit/:id', function(req,res){
       const{firstName, lastName, gender, course} = req.body;

    Student.updateOne({_id:req.params.id}, 
                        {firstName:firstName,
                         lastName:lastName,
                         gender:gender,
                         course:course
                        }, function(err){
                                if(err){
                                 console.log(err);

                                 }else{
                                    //res.send('Update Successful');
                                    res.redirect('/applicant')
            }
                        });
    });

app.get('/delete/:id', function(req,res){
    Student.deleteOne({_id:req.params.id}, function(err){
                                if(err){
                                 console.log(err);

                                 }else{
                                    //res.send('Update Successful');
                                    
                                    res.redirect('/applicant')
            }
                        });
})

app.listen(3000,()=>{
    console.log('Listening on port 3000');
})