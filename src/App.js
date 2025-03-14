import { useState } from 'react';

const initialExpenses = [
  {
    id: 118836,
    name: 'Shopping',
    amount: 50,
  },
  {
    id: 933372,
    name: 'Holiday',
    amount: 300,
  },
  {
    id: 499476,
    name: 'Transportation',
    amount: 70,
  },
];

export default function App() {
  return (
    <div className='App'>
      <BudgetTracker />
    </div>
  );
}

function BudgetTracker() {
  const [totalBudget, setTotalBudget] = useState(1000);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [currency, setCurrency] = useState('$');

  const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0);
  const amountLeft = totalBudget - totalExpenses;

  const date = new Date().toISOString().slice(0, 10);

  function handleAddExpense(expense) {
    setExpenses(expenses => [...expenses, expense]);
  }

  function handleRemoveExpense(id) {
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(filteredExpenses);
  }

  function handleChangeCurrency(e) {
    setCurrency(e);
  }

  return (
    <>
      <div className='top'>
        <div className='top-header'>
          <Text>{date}</Text>
          <Text>💰 My Budget Tracker 💳</Text>
          <SelectCurrency
            currency={currency}
            onChangeCurrency={handleChangeCurrency}
          />
        </div>
        <div className='balance'>
          <BalanceCard currency={currency} amount={totalBudget}>
            Budget
          </BalanceCard>
          <BalanceCard currency={currency} amount={totalExpenses}>
            Spent
          </BalanceCard>
          <BalanceCard currency={currency} amount={amountLeft}>
            Left
          </BalanceCard>
        </div>
      </div>
      <div className='container'>
        <div>
          <Text>Your current expenses</Text>
          <Expenses
            currency={currency}
            expenses={expenses}
            onRemoveExpense={handleRemoveExpense}
          />
        </div>

        <AddExpense
          currency={currency}
          amountLeft={amountLeft}
          onAddExpense={handleAddExpense}
        />
      </div>
    </>
  );
}

function Text({ children }) {
  return <h2>{children}</h2>;
}

function SelectCurrency({ currency, onChangeCurrency }) {
  return (
    <div className='currency-select-container'>
      <label>Select your currency</label>
      <select
        className='currency-select'
        value={currency}
        onChange={e => onChangeCurrency(e.target.value)}
      >
        <option value='$'>USD $</option>
        <option value='€'>EUR €</option>
        <option value='£'>GBP £</option>
        <option value='₴'>UAH ₴</option>
      </select>
    </div>
  );
}

function BalanceCard({ currency, amount, children }) {
  return (
    <div className='balance-card'>
      <h3>
        {currency}
        {amount}
      </h3>
      <p>{children}</p>
    </div>
  );
}

function Expenses({ currency, expenses, onRemoveExpense }) {
  return (
    <div className='expenses'>
      {expenses.map(expense => (
        <ExpenseItem
          currency={currency}
          expense={expense}
          onRemoveExpense={onRemoveExpense}
          key={expense.id}
        />
      ))}
    </div>
  );
}

function ExpenseItem({ currency, expense, onRemoveExpense }) {
  return (
    <div className='expense-item'>
      <p>
        {expense.name} {currency}
        {expense.amount}
      </p>
      <button onClick={() => onRemoveExpense(expense.id)}>&times;</button>
    </div>
  );
}

function AddExpense({ currency, amountLeft, onAddExpense }) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState(0);
  const [showForm, setShowForm] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (cost > amountLeft || !name || !cost) return;
    const id = crypto.randomUUID();

    const newExpense = {
      id,
      name,
      amount: cost,
    };

    onAddExpense(newExpense);
    setName('');
    setCost(0);
  }

  return (
    <div className='add-expense-form'>
      <button className='button' onClick={() => setShowForm(s => !s)}>
        {showForm ? 'Close' : 'Add new expense'}
      </button>
      {showForm && (
        <>
          <h2>Add Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='cost'>Cost {currency}</label>
              <input
                type='text'
                value={cost}
                onChange={e => setCost(Number(e.target.value))}
              />
            </div>
            {name && cost && <button className='button'>Save</button>}
          </form>
        </>
      )}
    </div>
  );
}
