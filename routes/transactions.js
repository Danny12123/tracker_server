
const { addExpense, getExpense, deleteIExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncomes } = require('../controllers/income');
const router = require('express').Router();



router.post('/add-income', addIncome)
router.get('/get-income', getIncomes)
router.delete('/delete-income/:id', deleteIncomes)
router.post('/add-expense', addExpense)
router.get('/get-expense', getExpense)
router.delete('/delete-expense/:id', deleteIExpense)


module.exports =router;