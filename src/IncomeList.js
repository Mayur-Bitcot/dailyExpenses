import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { useAuth } from "./AuthContext";
import { Modal, Button, Form } from "react-bootstrap"; // ✅ Bootstrap components
import deleteIcon from "./assets/images/delete.png";
import editIcon from "./assets/images/edit.png";
const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deletingIncomeId, setDeletingIncomeId] = useState(null);
  const [incomeName, setIncomeName] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const incomeRef = ref(database, `incomes/${currentUser.uid}`);
    onValue(incomeRef, (snapshot) => {
      const data = snapshot.val();
      const loadedIncomes = [];

      for (let key in data) {
        loadedIncomes.push({ id: key, ...data[key] });
      }

      setIncomes(loadedIncomes);
    });
  }, [currentUser]);

  const handleEdit = (income) => {
    setEditingIncome(income);
    setIncomeName(income.name);
    setIncomeAmount(income.amount);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (currentUser && editingIncome) {
      const incomeRef = ref(database, `incomes/${currentUser.uid}/${editingIncome.id}`);
      update(incomeRef, {
        name: incomeName,
        amount: Number(incomeAmount),
      })
        .then(() => {
          console.log("Income updated successfully!");
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error("Error updating income: ", error);
        });
    }
  };

  const handleDelete = (id) => {
    setDeletingIncomeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (currentUser && deletingIncomeId) {
      const incomeRef = ref(database, `incomes/${currentUser.uid}/${deletingIncomeId}`);
      remove(incomeRef)
        .then(() => {
          console.log("Income deleted successfully!");
          setShowDeleteModal(false);
        })
        .catch((error) => {
          console.error("Error deleting income: ", error);
        });
    }
  };

  return (
    <div className="income-list">
      <h3>Your Incomes</h3>
      <ul>
        {incomes.length === 0 ? (
          <li>No income added yet!</li>
        ) : (
          incomes.map((income) => (
            <li key={income.id}>
              <div className="expense_details">
                {income.name} - ₹{income.amount}
              </div>
              <div className="expense_actions">
                {/* <button onClick={() => handleEdit(income)}>Edit</button>
                <button onClick={() => handleDelete(income.id)}>Delete</button> */}
                <button onClick={() => handleEdit(income)} className="delete_button">
                  <img src={editIcon} alt="editIcon" /> Edit
                </button>
                <button onClick={() => handleDelete(income.id)} className="delete_button">
                  <img src={deleteIcon} alt="deleteIcon" /> Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* ✅ Modal for Editing Income */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Income</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Income Name</Form.Label>
              <Form.Control
                type="text"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
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

      {/* ✅ Modal for Deleting Income */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this income? This action cannot be undone.
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

export default IncomeList;
