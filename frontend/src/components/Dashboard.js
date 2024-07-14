import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('http://localhost:8000/api/products');
            setProducts(response.data);
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/api/products', {
            name,
            description,
            price,
        });
        setProducts([...products, response.data]);
    };

    const handleDeleteProduct = async (id) => {
        await axios.delete(`http://localhost:8000/api/products/${id}`);
        setProducts(products.filter((product) => product.id !== id));
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <form onSubmit={handleAddProduct}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                <button type="submit">Add Product</button>
            </form>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.description} - ${product.price}
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        <Link to={`/product-form/${product.id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
