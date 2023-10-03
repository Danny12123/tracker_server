
const IncomeSchema = require("../models/incomeModel")
const User  = require("../models/user")
exports.addIncome = async(req,res) =>{
const {title,amount,category,description,date} = req.body

    const income = new IncomeSchema(req.body)

// const income = IncomeSchema({
//     title,
//     amount,
//     category,
//     description,
//     date
// })
try {
    //validations
    if(!title || !amount || !category || !description || !date ){
        return res.status (400).json({message: "all field are required"})
    }
    if(amount <= 0 || !amount === 'number'){
        return res.status (400).json({message: "amount must be a positive number"})
    }
    
    const res = await income.save();
    res.status(200).json({message: "income added successfully"})
} catch (error) {
    res.status(500).json({message: "Server error while trying to save"})

}
console.log(income);
}

exports.getIncomes = async(req, res) =>{
    const {id} = req.params;
    try {
        
        const user = await User.findById(req.params.id);
        const incomes = await IncomeSchema.find({ userId: user._id });
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({message: "server error"})
    }
}
exports.deleteIncomes = async(req, res) =>{
   const {id} = req.params;
//    console.log(req.params);
   IncomeSchema.findByIdAndDelete(id).then((income) => {
    res.status(200).json({message: "income deleted successfully"})
   }).catch((error) => {
    res.status(500).json({message: "server error"})
   })
}