import { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api';

const useUsers = (initialPage = 1, initialFilters = {}) => {
  const [usersData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await fetchUsers(page, filters);
        setData(users);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [page, filters]);

  return { usersData, loading, error, page, setPage, filters, setFilters };
};

export default useUsers;
