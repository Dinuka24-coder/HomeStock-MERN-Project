import { useState, useEffect } from "react";
import "./../styles/Expenses.css";
import Header from "../components/Header";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("http://localhost:3000/api/expenses/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setExpenses(data);
        } else {
          setError(data.message);
          alert(data.message);
        }
      } catch (err) {
        setError("Error fetching expenses.");
        alert("Error fetching expenses.");
      }
      setLoading(false);
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`http://localhost:3000/api/expenses/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setExpenses(expenses.filter((expense) => expense._id !== id));
          alert("Expense has been deleted.");
        } else {
          setError("Error deleting expense.");
          alert("Error deleting expense.");
        }
      } catch (err) {
        setError("Error deleting expense.");
        alert("Error deleting expense.");
      }
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch(`http://localhost:3000/api/expenses/update/${editExpense._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editExpense),
      });

      if (response.ok) {
        setExpenses(
          expenses.map((exp) => (exp._id === editExpense._id ? editExpense : exp))
        );
        setEditExpense(null);
        alert("Expense has been updated.");
      } else {
        setError("Error updating expense.");
        alert("Error updating expense.");
      }
    } catch (err) {
      setError("Error updating expense.");
      alert("Error updating expense.");
    }
  };

  return (
    <div className="expenses-container">
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="expenses-list">
          {expenses.length === 0 ? (
            <p>No expenses recorded.</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="expense-card">
                {editExpense && editExpense._id === expense._id ? (
                  <>
                    <input
                      type="text"
                      value={editExpense.itemName}
                      onChange={(e) =>
                        setEditExpense({ ...editExpense, itemName: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editExpense.quantity}
                      onChange={(e) =>
                        setEditExpense({ ...editExpense, quantity: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editExpense.price}
                      onChange={(e) =>
                        setEditExpense({ ...editExpense, price: e.target.value })
                      }
                    />
                    <button onClick={handleUpdate}>Save</button>
                  </>
                ) : (
                  <>
                    <h3>{expense.itemName}</h3>
                    <p>Category: {expense.category}</p>
                    <p>Quantity: {expense.quantity}</p>
                    <p>Price: Rs.{expense.price}</p>
                    <p>Total: Rs.{expense.totalCost}</p>
                    <button onClick={() => handleEdit(expense)}>Edit</button>
                    <button onClick={() => handleDelete(expense._id)}>Delete</button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Expenses;
