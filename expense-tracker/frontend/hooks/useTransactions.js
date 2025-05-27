const API_URL = "https://react-native-projects.onrender.com/api";
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance:0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
 
    const fetchTransactions = useCallback(async (userId) => {
      try {
        const response = await fetch(`${API_URL}/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [userId]);

    const fetchSummary = useCallback(async (userId) => {
      try {
        
        const response = await fetch(`${API_URL}/transactions/summary/${userId}`, {
          method: 'GET',});
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      }
    }, [userId]);

    const loadData = useCallback(async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchTransactions(userId), fetchSummary(userId)]);
    }, [fetchTransactions, fetchSummary]);


    const deleteTransaction = useCallback(async (transactionId) => {
      try {
        const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete transaction');
        }
        loadData(); // Refresh data after deletion
        Alert.alert('Success', 'Transaction deleted successfully');
      } catch (err) {
        setError(err.message);
        Alert.alert('Error', `Failed to delete transaction: ${err.message}`);
      }
    }, []);

    return {
        transactions,
        summary,
        loading,
        error,
        loadData,
        deleteTransaction
    }
}