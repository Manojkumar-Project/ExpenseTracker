const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const transactionDate = document.querySelector("#transactionDate");
const downloadBtn = document.getElementById('downloadBtn');

let transactions = JSON.parse(localStorage.getItem("trans")) || [];

function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add("list-group-item", transaction.amount < 0 ? "exp" : "inc");
  item.innerHTML = `
        ${transaction.description}
        <span>${transaction.date}</span>
        <span>${sign} ${Math.abs(transaction.amount)}</span>
        <button class="btn btn-danger btn-del" onclick="removeTrans(${transaction.id})">Delete</button>
    `;
  trans.appendChild(item);
}

function removeTrans(id) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions = transactions.filter((transaction) => transaction.id != id);
    config();
    updateLocalStorage();
  } else {
    return;
  }
}

function updateAmount() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  balance.innerHTML = `₹  ${total}`;

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  inc_amt.innerHTML = `₹  ${income}`;

  const expense = amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  exp_amt.innerHTML = `₹  -${Math.abs(expense)}`;
}

function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
}

function addTransaction(e) {
  e.preventDefault();
  if (description.value.trim() === "" || amount.value.trim() === "") {
    alert("Please Enter Description and amount");
  } else {
    let confirmationMessage = "Are you okay with using the current date?";
    if (transactionDate.value.trim() === "") {
      if (!confirm(confirmationMessage)) {
        return;
      }
    }
    const transaction = {
      id: uniqueId(),
      description: description.value,
      amount: +amount.value,
      date: transactionDate.value || getCurrentDate(),
    };
    transactions.push(transaction);
    loadTransactionDetails(transaction);
    description.value = "";
    amount.value = "";
    transactionDate.value = "";
    updateAmount();
    updateLocalStorage();
  }
}

function uniqueId() {
  return Math.floor(Math.random() * 10000000);
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
}

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}

form.addEventListener("submit", addTransaction);

window.addEventListener("load", function () {
  config();
});
downloadBtn.addEventListener('click', () => {
  downloadTransactions();
});

function downloadTransactions() {
  const filename = 'transactions.txt';
  const content = transactions.map(transaction => `${transaction.description}, ${transaction.amount}, ${transaction.date}`).join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}


// Add event listener for "Enter" key press on description input
description.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (e.g., form submission)
        transactionDate.focus(); // Move focus to the date input
    }
});

// Add event listener for "Enter" key press on date input
transactionDate.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        amount.focus(); // Move focus to the amount input
    }
});
