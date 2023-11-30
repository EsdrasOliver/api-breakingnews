import mongoose from 'mongoose'

const connectDatabase = () => {
    console.log('Wait connecting to the database')

    mongoose.connect(
        process.env.MONGODB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('MongoDB Atlas Connection'))
    .catch((error) => console.log(error))
}

export default connectDatabase