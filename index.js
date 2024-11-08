import express from 'express'
import mongoose from 'mongoose';
import postModel from './models/postSchema.js';
import bcrypt from 'bcryptjs'
import UserModel from './models/UserSchema.js';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3050;
const DBURI = process.env.MONGODB_URI

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(DBURI)

mongoose.connection.on('connected', () => { console.log('mongodb Connected') })
mongoose.connection.on('error', () => { console.log('mongodb error') })

app.listen(PORT, () => {
    console.log('connected')
})
// post api

app.post('/createPost', async (req, res) => {

    const { title, desc, postID } = req.body;

    if (!title || !desc || !postID) {
        res.json({
            message: 'reqire field missing'
        })
        return;
    }

    // data save in db

    const postObj = {
        title, desc, postID
    };

    const response = await postModel.create(postObj)

    res.json({
        message: 'post create Successfully',
        data: response
    })
    res.send('create post')

})


// get api

app.get('/getPost', async (req, res) => {
    const getData = await postModel.findOne({ _id: '671d0a1327169cb58e179247' })

    res.json({
        message: 'Data get successfully',
        data: getData
    });

    res.send('get post Data ')
})


// update Api

app.put('/updatePost', async (req, res) => {

    const { title, desc, postID } = req.body;

    const updatePost = await postModel.findByIdAndUpdate(postID, { title, desc });

    res.json({
        message: 'Post Update Successfully',
        data: updatePost
    });
})

// delete api

app.delete('/deletePost/:id', async (req, res) => {
    const Params = req.params.id

    await postModel.findByIdAndDelete(Params)

    res.json({
        message: "Post has been deleted"
    })


    
    
})


// Create user for SignUp

app.post('/api/SignUp', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
        res.json({
            message: 'requir field are missing',
            status: false
        })
        return
    }

    const emailExist = await UserModel.findOne({email})
    if(emailExist !== null){
        res.json({
            message: "email is already exist",
            status: false,
        })
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const userObj = {
        firstName, lastName, email, password: hashPassword
    }
    
    const response = await UserModel.create(userObj)
    
    res.json({
        message: "User create successfully",
        status: true
    })
    
})


app.get('/getSign', async (req, res) => {
    const getData = await UserModel.find({})

    res.json({
        message:'Data get successful',
        data: getData,
    })


})
    
    // For login api

    app.post('api/login', async(req, res) =>{
        const {email, password} = req.body

        if(!email || !password){
            res.json({
                message : "required fields are missing", 
                status: false
            })
            return;
        }

        const emailExist = await UserModel.findOne({email})

        if(!emailExist){
            res.json({
                message : "Invalid email and password", 
                status: false
            })
            return;
        }

        const comparePassword = await bcrypt.compare(password, emailExist.password);

        if (!comparePassword) {
          res.json({
            message: "Invalid email & password",
            status: false,
          });
      
          return;
        }
      
        res.json({
          message: "login successfully",
          status: true,
        });                                             


    // res.send('SignUp api')
})
