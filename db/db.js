const mongoose = require('mongoose');


const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('database connected');
    } catch (error) {
        console.log('database error');
    }
}

module.exports = {db}