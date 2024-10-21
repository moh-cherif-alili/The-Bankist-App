'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// MOvements section
let timer;
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

  const startLogOutTimer = function () {
    // set time to 5 min
    let time = 20;
    console.log('suiii');

    // call the timer every sec
     timer = setInterval(function () {
      const min = String(Math.trunc(time / 60)).padStart(2, 0);
      const sec = string(time % 60) .padStart(2, 0) ;
      // in each call , print the remaining time to UI
      labelTimer.textContent = `${min}:${sec}`;

      time--;

      // when 0 sec , stop timer and log user
      if (time == 0) {
        clearInterval(timer);
        containerApp.style.opacity = 0;
      }
    }, 1000);
  };
// startLogOutTimer();
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const disp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    }).format(new Date(acc.movementsDates[i]));

    const html = `   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}  </div>
          <div class="movements__date">${
            new Date() - disp <= 24 * 60 * 60 * 1000
              ? 'today'
              : new Date() - disp <= 24 * 60 * 60 * 1000 * 2
              ? 'yesterday'
              : disp
          }</div>
          <div class="movements__value">${formattedMov}</div>
        </div> `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

//creating user names for every account
const createUsernames = users => {
  users.forEach(user => {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(nam => nam[0])
      .join('');
  });
};
createUsernames(accounts);

// console.log(accounts);

// calculate the balances for every account

const calcBdisp = account => {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};
// console.log(balances);

// console.log(calcBalaceAcc(accounts));

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}£  `;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${-out.toFixed(2)}£`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}£`;
};
// calcDisplaySummary(account1.movements);

// event handler
const updateUI = function (inputedACC) {
  displayMovements(inputedACC);

  // display balance
  calcBdisp(inputedACC);

  // display summary
  calcDisplaySummary(inputedACC);
if(timer) clearInterval(timer);
  startLogOutTimer();
};

let inputedACC;
// fake always logged in
// inputedACC=account1;
// updateUI(inputedACC);
// containerApp.style.opacity=100;

const now = new Date();
const day = now.getDate();
const month = now.getMonth();
const year = now.getFullYear();
const hours = now.getHours();
const min = now.getMinutes();
labelDate.textContent = now;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  inputedACC = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  if (inputedACC) {
    // display Ui and message
    labelWelcome.textContent = `OH YEAH BABY , ${
      inputedACC.owner.split(' ')[0]
    } fucking ${inputedACC.owner.split(' ')[1]}`;

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    // clear input fields

    // display movements

    updateUI(inputedACC);
  } else {
    labelWelcome.textContent = 'OH what a failure ,Bitch!!';
    containerApp.style.opacity = 0;
  }

  // console.log(inputedACC);
  // console.log(inputLoginUsername.value);
});
// console.log(`this is you acc after executing the event ok `);

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(inputedACC);
  clearInterval(timer);
  startLogOutTimer();

  const toAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);
  // console.log( ` from ${inputedACC.username } to ${inputTransferTo.value}` );
  if (
    amount > 0 &&
    toAcc &&
    toAcc?.username != inputedACC.username &&
    amount <= inputedACC.balance
  ) {
    inputedACC.movements.push(-amount);
    inputedACC.movementsDates.push(new Date());
    toAcc.movements.push(amount);
    toAcc.movementsDates.push(new Date());

    updateUI(inputedACC);
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  clearInterval(timer);
  startLogOutTimer();
  
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && inputedACC.movements.some(move => move >= amount * 0.01)) {
    inputedACC.movements.push(amount);
    inputedACC.movementsDates.push(new Date());
    updateUI(inputedACC);
  }
  inputLoanAmount.value = '';
  containerApp.style.opacity = 100;
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === inputedACC.username &&
    Number(inputClosePin.value) === inputedACC.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputedACC.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'RIP, ASShole';
  }
  console.log(inputCloseUsername === inputedACC.username);
  console.log(Number(inputClosePin) === inputedACC.pin);
  console.log(accounts);
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(inputedACC.movements, !sorted);
});

const bankDep = accounts;
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 == 0) row.style.backgroundColor = 'orangered';
  });
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
console.log(Number.parseInt('30sdkfjmqsd', 10));
console.log(new Date());
console.log('5000');

const future = new Date('February 05, 2006');
const myNum = 3884764.23;
console.log(
  'us :     ',
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    unit: 'celsius',
    currency: 'EUR',
  })
);
