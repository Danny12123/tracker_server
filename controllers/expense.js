
const ExpenseSchema = require("../models/expenseModel")
const User = require("../models/user")


exports.addExpense = async(req,res) =>{
const {title,amount,category,description,date,userId} = req.body
console.log(req.body)

// const expense = ExpenseSchema({
//     title,
//     amount,
//     category,
//     description,
//     date,
// })
const expense1 = new ExpenseSchema(req.body)
try {
    //validations
    if(!title || !amount || !category || !description || !date ){
        return res.status (400).json({message: "all field are required"})
    }
    if(amount <= 0 || !amount === 'number'){
        return res.status (400).json({message: "amount must be a positive number"})
    }
    const res = await expense1.save();
    console.log(res);
    res.status(200).json({message: "expense added successfully"})
} catch (error) {
    res.status(500).json({message: "Server error while trying to save"})

}

}

exports.getExpense = async(req, res) =>{
    
    try {
        const user = await User.findById(req.params.id );
        const expense = await ExpenseSchema.find({ userId: user._id });
        res.status(200).json(expense)
    } catch (error) {
        res.status(500).json({ message: "server error", error })
    }
}
exports.deleteIExpense = async(req, res) =>{
   const {id} = req.params;
//    console.log(req.params);
   ExpenseSchema.findByIdAndDelete(id).then((expense) => {
    res.status(200).json({message: "expense deleted successfully"})
   }).catch((error) => {
    res.status(500).json({message: "server error"})
   })
}