
const ExpenseSchema = require("../models/expenseModel")


exports.addExpense = async(req,res) =>{
const {title,amount,category,description,date} = req.body


const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    date
})
try {
    //validations
    if(!title || !amount || !category || !description || !date ){
        return res.status (400).json({message: "all field are required"})
    }
    if(amount <= 0 || !amount === 'number'){
        return res.status (400).json({message: "amount must be a positive number"})
    }
    await expense.save()
    res.status(200).json({message: "expense added successfully"})
} catch (error) {
    res.status(500).json({message: "Server error while trying to save"})

}
console.log(expense);
}

exports.getExpense = async(req, res) =>{
    try {
        const expense  = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(expense)
    } catch (error) {
        res.status(500).json({message: "server error"})
    }
}
exports.deleteIExpense = async(req, res) =>{
   const {id} = req.params;
   console.log(req.params);
   ExpenseSchema.findByIdAndDelete(id).then((expense) => {
    res.status(200).json({message: "expense deleted successfully"})
   }).catch((error) => {
    res.status(500).json({message: "server error"})
   })
}