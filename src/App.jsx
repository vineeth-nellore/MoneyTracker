import { useEffect, useState } from "react";
import "./App.css";
//import { json } from 'express';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = import.meta.env.VITE_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        datetime,
        description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log(data);
      })
      .catch((err) => console.log(err));
  }
  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  let fraction = balance.toString().split(".")[1];
  balance = balance.toString().split(".")[0];
  return (
    <>
      <main>
        <h1>
          ₹{balance} <span>.{fraction}</span>
        </h1>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"price expense_name"}
            />
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 &&
            transactions.map((transaction) => {
              return (
                <div className="transaction" key={transaction._id}>
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
                  </div>
                  <div className="right">
                    <div
                      className={
                        "price " + (transaction.price > 0 ? "green" : "red")
                      }
                    >
                      {transaction.price > 0 ? "+" : ""}₹{transaction.price}
                    </div>
                    <div className="datetime">{transaction.datetime}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </>
  );
}

export default App;
