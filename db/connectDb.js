const mongoose= require('mongoose');

const connectDb=async (url)=>{
    await mongoose.set("strictQuery", false);
    return mongoose.connect(url,{
        useNewUrlParser: true, 

        useUnifiedTopology: true
    })
}

module.exports=connectDb