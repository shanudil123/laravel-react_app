import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getProducts = async (token) => {
    return await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createProduct = async (product, token) => {
    return await axios.post(`${API_URL}/products`, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const updateProduct = async (id, product, token) => {
    return await axios.put(`${API_URL}/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteProduct = async (id, token) => {
    return await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
