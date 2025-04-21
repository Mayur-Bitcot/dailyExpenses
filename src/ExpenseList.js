import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { useAuth } from "./AuthContext";
import deleteIcon from "./assets/images/delete.png";
import editIcon from "./assets/images/edit.png";
import { Modal, Button, Form } from "react-bootstrap"; // ✅ Bootstrap Modal & Form

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);
  const [expenseData, setExpenseData] = useState("");
  const [amountData, setAmountData] = useState("");
  const [categoryData, setCategoryData] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const expensesRef = ref(database, `expenses/${currentUser.uid}`);
      onValue(expensesRef, (snapshot) => {
        const data = snapshot.val();
        const loadedExpenses = [];
        for (let key in data) {
          loadedExpenses.push({ id: key, ...data[key] });
        }
        setExpenses(loadedExpenses);
      });
    }
  }, [currentUser]);

  const handleDelete = (id) => {
    setDeletingExpenseId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (currentUser && deletingExpenseId) {
      const expenseRef = ref(database, `expenses/${currentUser.uid}/${deletingExpenseId}`);
      remove(expenseRef)
        .then(() => {
          console.log("Expense deleted successfully.");
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting expense:", error);
        });
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setExpenseData(expense.name);
    setAmountData(expense.amount);
    setCategoryData(expense.category || "");
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (currentUser && editingExpense) {
      const expenseRef = ref(database, `expenses/${currentUser.uid}/${editingExpense.id}`);
      update(expenseRef, {
        name: expenseData,
        amount: amountData,
        category: categoryData,
      })
        .then(() => {
          console.log("Expense updated successfully.");
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error("Error updating expense:", error);
        });
    }
  };

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      <ul className="expense-list">
        {expenses.length === 0 ? (
          <li>No expenses added yet!</li>
        ) : (
          expenses.map((expense) => (
            <li key={expense.id}>
              <div className="expense_details">
                {expense.name} - ₹{expense.amount} ({expense.category})
              </div>
              <div className="expense_actions">
                <button onClick={() => handleEdit(expense)} className="delete_button">
                  <img src={editIcon} alt="editIcon" /> Edit
                </button>
                <button onClick={() => handleDelete(expense.id)} className="delete_button">
                  <img src={deleteIcon} alt="deleteIcon" /> Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* ✅ Bootstrap Modal for Editing */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Expense Name</Form.Label>
              <Form.Control
                type="text"
                value={expenseData}
                onChange={(e) => setExpenseData(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amountData}
                onChange={(e) => setAmountData(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={categoryData}
                onChange={(e) => setCategoryData(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Bootstrap Modal for Deleting */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this expense? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No, Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenseList;
