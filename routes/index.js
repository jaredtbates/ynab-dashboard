const router = require('express').Router();

const request = require('request-promise-native');

const apiUrl = 'https://api.youneedabudget.com/v1';
const options = {auth: {bearer: process.env.YNAB_ACCESS_TOKEN}};

router.get('/', async (req, res) => {
  const budgets = JSON.parse(await request(`${apiUrl}/budgets`, options)).data.budgets;
  const budgetId = budgets.find(budget => budget.name === 'My Budget').id;
  const budget = JSON.parse(await request(`${apiUrl}/budgets/${budgetId}`, options)).data.budget;
  const categories = budget.categories.filter(category => category.goal_target > 0);

  // Commented out these for testing purposes due to rate limiting on YNAB side
  /*
  const categories = [
    {
      name: 'Example 1',
      goal_percentage_complete: 30
    },
    {
      name: 'Example 2',
      goal_percentage_complete: 50
    }
  ];
  */

  res.render('index', { categories });
});

module.exports = router;