import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/products/${id}`);
                    const product = response.data;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name,
            description,
            price,
        };

        try {
            if (id) {
                // Update product
                await axios.put(`http://localhost:8000/api/products/${id}`, productData);
            } else {
                // Create new product
                await axios.post('http://localhost:8000/api/products', productData);
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div>
            <h2>{id ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    required
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                    required
                />
                <button type="submit">{id ? 'Update Product' : 'Add Product'}</button>
            </form>
        </div>
    );
};

export default ProductForm;
