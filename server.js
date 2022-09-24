var getexpress=require("express");
receivedexpress=getexpress();
var getmysql=require("mysql");
var fileuploader=require("express-fileupload");

//=================mysql connection=========================================
var dbconfigurationobject={
    host:"localhost",
    user:"root",
    password:"",
    database:"medicinedonarproject",
}

var dbref=getmysql.createConnection(dbconfigurationobject);

dbref.connect(function(err){
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log("connected..");//
    }
})

//====================================server connection=====================
receivedexpress.listen(2004,function(){
    console.log("HEY HURRAH!!  SERVER GOT STARTED");
})
receivedexpress.use(getexpress.static("public"));// for incuding css
receivedexpress.get("/",function(req,resp){
    //resp.send("hi its homie!!!!!");
    //process:global object
    var purapath=process.cwd()+"/public/index.html";
    resp.sendFile(purapath);
})

//========================================== login and signup=========================
receivedexpress.get("/signup",function(req,res){

    var dataarr=[req.query.txtEmail,req.query.txtPass,req.query.utype];
    dbref.query("insert into users values(?,?,?,1)",dataarr,function(err,result){
        console.log(req.query.txtEmail+" "+req.query.txtPass+" "+req.query.utype);
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send("sign up successfully....");
        }
    })

    //===========node mailer=======================
    const nodemailer = require("nodemailer");
    //

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vatsmedicinedonation2022@gmail.com",
            pass: "qstxabojdhkbylxs",
        },
    });

    const options = {
        from: "vatsmedicinedonation2022@gmail.com",
        to: req.query.txtEmail,
        subject: "Medicine Donation",
        text: "Welcome to Medicine donation Family",
    };

    transporter.sendMail(options, function (err, info) {
        if (err) { console.log(err); }
        else { console.log("Sent " + info.response) }
    });

    
})
receivedexpress.get("/login", function (req, res)  {

    dbref.query("select * from users where email=? and pwd=?", [req.query.loginEmail, req.query.loginPassword], function (err, result) {
        console.log(req.query.loginEmail + " " + req.query.loginPassword);
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    })

})
//===========================
/*receivedexpress.get("/login",function(req,res){

    dbref.query("select * from users where email=? and pwd=?",[req.query.loginEmail,req.query.loginPassword],function(err,result){
        console.log(req.query.loginEmail+" "+req.query.loginPassword);
        if(err)
        {   
            console.log(err);
        }
        else if(result.length==0)
        {
            res.send("Invalid Entry!!");
        }
        else
        {
            res.send("Bdhaii..ho login ho gya");
        }
    })
    
})*/
//=================modal ofsetting// update check if existing or not>>====================
receivedexpress.get("/settings", function (req, res) {
    // var dataarr=[req.query.txtUEmail,req.query.txtUPass,req.query.];
    dbref.query("select * from users where email=? and pwd=?", [req.query.txtUEmail, req.query.txtUPass], function (err, result) {
        if (err)
            res.send(err);
        else
            if (result.length == 1) {
                dbref.query("update users set pwd=? where email =?", [req.query.txtNewPass, req.query.txtUEmail], function (err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else
                        res.send("updated successfully...");
                })
            }
            else {
                res.send("Invalid Users...");
            }
    })
})
//===================================================================

//===============donor profile insert==========================='

receivedexpress.use(fileuploader());
// receivedexpress.use(getexpress.urlencoded({extended:true}));
receivedexpress.use(getexpress.urlencoded('extended:true'));//converts binary to object 
receivedexpress.post("/profile-process",function(req,resp){

    
     
    var fname=req.body.txtEmail+"-"+req.files.profilePic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.profilePic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");  //
    })


    var proofpic=req.body.txtEmail+"-"+req.files.proofPic.name;
    var des1=process.cwd()+"/public/uploads/"+ proofpic;
    req.files.proofPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })

//=========================profile insert================================



    var dataAry=[req.body.txtEmail,req.body.txtName,req.body.txtMobile,req.body.txtAddr,req.body.txtCity,req.body.idproof,req.body.txtTime,proofpic,fname];
   dbref.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })
    


})
receivedexpress.get("/chkEmailKuch",function(req,resp)
{
    //0/1 records
    dbref.query("select * from dprofile where emailid=?",[req.query.txtEmail],function(err,resultAryOfObjects)
       {
            if(err)
                resp.send(err);
                else
                if(resultAryOfObjects.length==0)
                {
                    resp.send("Avilable....");
                }
                else
                resp.send("Already Occupied....");;
       })
})
//=============================json===============================================
receivedexpress.get("/getProfileObject",function(req,resp)///,,
{
    //0/1 records
    console.log(req.query.txtEmail);
    dbref.query("select * from dprofile where emailid=?",[req.query.txtEmail],function(err,resultAryOfObjects)
       {

            if(err)
                resp.send(err);
               
            else
                resp.send(resultAryOfObjects);;
       })
})

//========================================profile udate of donor======================
//update>>input>>hidden in script>>if lese in server with global variable;

receivedexpress.post("/profile-update",function(req,resp){

     var fname;
     var  proofpic;
     if(req.files!=null)
     {
    fname=req.body.txtEmail+"-"+req.files.profilePic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.profilePic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })


     proofpic=req.body.txtEmail+"-"+req.files.proofPic.name;
    var des1=process.cwd()+"/public/uploads/"+ proofpic;
    req.files.proofPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })
     }
     /*else if(req.files!=null)
     {
        fname=req.body.txtEmail+"-"+req.files.profilePic.name;
        var des=process.cwd()+"/public/uploads/"+fname;
        req.files.profilePic.mv(des,function(err){
                if(err)
                    console.log(err);
                else
                    console.log("Badhaiiiiiiii ho ");
        })
     }

     else if(req.files!=null)
     {
        proofpic=req.body.txtEmail+"-"+req.files.proofPic.namew
    req.files.proofPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })
     }*/

     else{
        proofpic=req.body.hdn1;
        fname=req.body.hdn2;
     }
//=========================profile update================================



    var dataAry=[req.body.txtName,req.body.txtMobile,req.body.txtAddr,req.body.txtCity,req.body.idproof,req.body.txtTime,proofpic,fname,req.body.txtEmail];
   // update profile set addr=?, state=?, tech=? , branch=?, profilepic=? where email=?
    dbref.query("update dprofile set name=?, mobile=?, address=? , city=?, prooftype=?, timings=?, proofpic=?, profilepic=? where emailid=?",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })
    


})



//==================================avail medicine========================-
///avail-medicine
receivedexpress.post("/avail-medicine",function(req,resp){

    var fname=req.body.txtEmail+"-"+req.files.medPic.name;
    var des=process.cwd()+"/public/uploads/"+fname;
    req.files.medPic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })

// ======================== insert medicine================================



    var dataAry=[req.body.txtEmail,req.body.txtName,req.body.packing,req.body.txtQty,req.body.txtDate,req.body.txtCmp,fname,req.body.txtADes];
   dbref.query("insert into medicines values(?,?,?,?,?,?,?,?,current_date())",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })
    
})

//=========================================NEEDY APIS===================================================
receivedexpress.post("/Nprofile-process",function(req,resp){

    
     
    var nname=req.body.txtNEmail+"-"+req.files.profileNPic.name;
    var des=process.cwd()+"/public/uploads/"+nname;
    req.files.profileNPic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })


    var proofnpic=req.body.txtNEmail+"-"+req.files.proofNPic.name;
    var des1=process.cwd()+"/public/uploads/"+ proofnpic;
    req.files.proofNPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })

//=========================profile insert================================



    var dataAry=[req.body.txtNEmail,req.body.txtNName,req.body.txtNMobile,req.body.txtNAddr,req.body.txtNCity,req.body.idNproof,req.body.txtNTime,proofnpic,nname];
   dbref.query("insert into nprofile values(?,?,?,?,?,?,?,?,?)",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })
    


})

//=============================json===============================================
receivedexpress.get("/getNProfileObject",function(req,resp)///,,
{
    //0/1 records
    console.log(req.query.txtEmail);
    dbref.query("select * from nprofile where emailid=?",[req.query.txtNEmail],function(err,resultAryOfObjects)
       {

            if(err)
                resp.send(err);
               
            else
                resp.send(resultAryOfObjects);;
       })
})

//========================================profile udate of donor======================
//update>>input>>hidden in script>>if lese in server with global variable;

receivedexpress.post("/Nprofile-update",function(req,resp){

     var nname;
     var  proofnpic;
     if(req.files!=null)
     {
    nname=req.body.txtNEmail+"-"+req.files.profileNPic.name;
    var des=process.cwd()+"/public/uploads/"+nname;
    req.files.profileNPic.mv(des,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })


     proofnpic=req.body.txtNEmail+"-"+req.files.proofNPic.name;
    var des1=process.cwd()+"/public/uploads/"+ proofnpic;
    req.files.proofNPic.mv(des1,function(err){
            if(err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii ho ");
    })
     }
     
     else{
        proofnpic=req.body.hdn3;
        nname=req.body.hdn4;
     }



var dataAry=[req.body.txtNName,req.body.txtNMobile,req.body.txtNAddr,req.body.txtNCity,req.body.idNproof,req.body.txtNTime,proofnpic,nname,req.body.txtNEmail];
   // update profile set addr=?, state=?, tech=? , branch=?, profilepic=? where email=?
    dbref.query("update nprofile set name=?, mobile=?, address=? , city=?, prooftype=?, timings=?, proofpic=?, profilepic=? where emailid=?",dataAry,function(err,result){
            if(err)
                resp.send(err);
            else
                resp.send("Inserted Successfully..");
   })
    


})





//=================modal ofsetting// update check if existing or not>>====================
receivedexpress.get("/needysettings", function (req, res) {
    // var dataarr=[req.query.txtUEmail,req.query.txtUPass,req.query.];
    dbref.query("select * from users where email=? and pwd=?", [req.query.txtNEmail, req.query.txtOPass], function (err, result) {
        if (err)
            res.send(err);
        else
            if (result.length == 1) {
                dbref.query("update users set pwd=? where email =?", [req.query.txtNPass, req.query.txtNEmail], function (err, result) {
                    if (err) {
                        res.send(err);
                    }
                    else
                        res.send("updated successfully..-.");
                })
            }
            else {
                res.send("Invalid Users...");
            }
    })
})







//====================================== n 2 cases of update========================
//==================================angular apis for admin block users=== ==================

/*receivedexpress.get("/fetchAllRecords",function(req,resp)

{
   console.log("hii its block user"); 
    dbref.query("select * from users ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

receivedexpress.get("/profile-delete-angualr",function(req,res)
{                                //table  col name 
    dbref.query("delete from users where email=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.--.. Badhaiiiii");
    })
})
//==================================angular apis for admin all donors======================

receivedexpress.get("/fetchAllDonors",function(req,resp)

{
    //console.log("mai donor ka data fetch krne aaya hu");
        
    dbref.query("select * from dprofile",function(err,resultAryOfObjects)
    {
      
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})

receivedexpress.get("/doDeleteDonors",function(req,res)
{                                //table col name
    dbref.query("delete from dprofile where emailid=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.. Badhaiiiii");
    })
})
*/
//=================================ADMIN BLOCK USER APIS ANGULAR===================================================================================================================
receivedexpress.get("/fetchAllRecords",function(req,res){
    dbref.query("select * from users",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

receivedexpress.get("/block-status",function(req,res){
    dbref.query("update users set status=0 where email=?",[req.query.email],function(err,result){
        // console.log("update  krne aa gya mai");
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("User Blocked");
        }
    })
})


receivedexpress.get("/resume-status",function(req,res){
    dbref.query("update users set status=1 where email=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send("User Un-Blocked");
        }
    })
})

//=========================================================admin all donor angular apis===============================
receivedexpress.get("/fetchAllDonorRecords",function(req,res){
    dbref.query("select * from dprofile",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

receivedexpress.get("/delete-donor",function(req,res){
    dbref.query("delete from dprofile where emailid=?",[req.query.emailidX],function(err,result){
        if(err)
            res.send(err);
        else
        if(result.affectedRows==0)
        res.send("Invalid Id");
        else
            res.send("Record Deleted Successfulllllyyyyy");
})
})
//=========================================================admin all needy angular apis=================================
receivedexpress.get("/fetchAllNeedyRecords",function(req,res){
    dbref.query("select * from nprofile",function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

receivedexpress.get("/delete-needy",function(req,res){
    dbref.query("delete from nprofile where emailid=?",[req.query.emailidX],function(err,result){
        if(err)
            res.send(err);
        else
        if(result.affectedRows==0)
        res.send("Invalid Id");
        else
            res.send("Record Deleted Successfulllllyyyyy");
})
})

//============================angular apis for city and medicne (search medicine)==========================receivedexpress.get("/fetchAllAddr",function(req,resp)
receivedexpress.get("/fetchAllCity",function(req,resp)
{
    dbref.query("select distinct city from dprofile ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})
receivedexpress.get("/fetchAllMedicine",function(req,resp)
{
   
   dbref.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.city],function(err,resultAryOfObjects)    
    {
         if(err)
             resp.send(err);
            
         else
         {
            console.log(resultAryOfObjects);
            resp.send(resultAryOfObjects);
         }
            
    })

})
receivedexpress.get("/fetchdonor",function(req,resp)
{     dbref.query("select * from dprofile inner join medicines on dprofile.emailid=medicines.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,resultAryOfObjects)
    
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);
    })

})
//======================/contactDonor----------\\



receivedexpress.get("/contactDonor",function(req,res){
    dbref.query("select * from  dprofile where emailid=?",[req.query.emailidX],function(err,result){
        if(err)
            res.send(err);
        else
            res.send(result);
})
})








//==========================api  for  donor manager /fetchMedicineRecords==============
receivedexpress.get("/fetchMedicineRecords",function(req,res){
    dbref.query("select * from medicines where emailid=?",[req.query.email],function(err,result){
        if(err)
        {
            res.send(err);
        }
        else{
            res.send(result);
        }
    })
})

receivedexpress.get("/unlist-the-medicine",function(req,res){
    dbref.query("delete from medicines where emailid=?",[req.query.emailidX],function(err,result){
        if(err)
            res.send(err);
        else
        if(result.affectedRows==0)
        res.send("Invalid Id");
        else
            res.send("Record Deleted Successfulllllyyyyy");
})
})
