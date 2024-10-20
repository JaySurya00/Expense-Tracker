const {connectDB}= require('./config/db.js');
const app= require('./app.js');

const start= async()=>{
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }
    await connectDB();

    app.listen(process.env.PORT || 4000, ()=>{
        console.log('Server started at port', process.env.PORT || 4000);
    })
}
start();