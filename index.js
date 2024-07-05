const express = require("express");
const bodyparser = require("body-parser")
const mysql = require("mysql")
const app = express();
const nodemailer = require("nodemailer")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:false}))

app.listen(3000,()=>{
    console.log("listening");
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SKP@sudarshan199',
    // use your databse password to connect.
    database: 'accerdian',
});
connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection created");
    }
});

const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "pujarsudarshan@gmail.com",
      pass: "ryauglvcpbdyakto",
    },
  });

   const mail = async (email) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: {
        name:"sudarshan",
        address:"pujarsudarshan@gmail.com"
      }, // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "You have been refered by your friend", // plain text body
      html: "You have been refered by your friend", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }
  

//   main().catch(console.error);

app.post('/refer', async (req,res)=>{
    try{
        const name = await req.body.name;
        const email = await req.body.email;
        console.log(name,email)
        try {
            const newUser = await prisma.refer.create({
                data: {
                  email: email,
                  name: name,
                },
            })
            res.json({"message":"success"});
            if (newUser) {
                await mail(email);
            }
            
        } catch (error) {
            console.log(error)
        }
        
       
    }
    catch(e){
         console.log(e);
    }
})
