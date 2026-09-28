import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
    createProduct,
    deleteProduct,
    getMe,
    getProducts,
    loginUser,
    logoutUser,
    registerUser,
    updateProduct
} from "./api";
import "./styles.css";

const emptyProduct = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: ""
};

function Auth({ onLogin }) {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        try {
            if (mode === "register") {
                const data = await registerUser(form);
                setMessage(data.message);
                setMode("login");
                setForm({
                    name: "",
                    email: form.email,
                    password: "",
                    confirmPassword: ""
                });
            } else {
                const data = await loginUser({
                    email: form.email,
                    password: form.password
                });

                onLogin(data.user);
            }
        } catch (err) {
            const fields = err.data?.errors;

            if (fields) {
                setError(Object.values(fields).join(" • "));
            } else {
                setError(err.message);
            }
        }
    }

    return (
        <div className="auth-page">
            <form className="card auth-card" onSubmit={handleSubmit}>
                <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
                <p className="muted">
                    Authentication & Product CRUD 
                </p>

                {mode === "register" && (
                    <label>
                        Name
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                        />
                    </label>
                )}

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                    />
                </label>

                {mode === "register" && (
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repeat password"
                        />
                    </label>
                )}

                {message && <div className="success">{message}</div>}
                {error && <div className="error">{error}</div>}

                <button type="submit">
                    {mode === "login" ? "Login" : "Register"}
                </button>

                <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                        setMode(mode === "login" ? "register" : "login");
                        setError("");
                        setMessage("");
                    }}
                >
                    {mode === "login"
                        ? "Create a new account"
                        : "Already have an account? Login"}
                </button>
            </form>
        </div>
    );
}

function ProductForm({ editingProduct, onSaved, onCancel }) {
    const [form, setForm] = useState(
        editingProduct
            ? {
                  ...editingProduct,
                  price: String(editingProduct.price),
                  stock: String(editingProduct.stock)
              }
            : emptyProduct
    );
    const [error, setError] = useState("");

    useEffect(() => {
        setForm(
            editingProduct
                ? {
                      ...editingProduct,
                      price: String(editingProduct.price),
                      stock: String(editingProduct.stock)
                  }
                : emptyProduct
        );
    }, [editingProduct]);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock)
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, payload);
            } else {
                await createProduct(payload);
            }

            onSaved();
            setForm(emptyProduct);
        } catch (err) {
            const fields = err.data?.errors;

            if (fields) {
                setError(Object.values(fields).join(" • "));
            } else {
                setError(err.message);
            }
        }
    }

    return (
        <form className="card product-form" onSubmit={handleSubmit}>
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>

            <div className="grid">
                <label>
                    Name
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Category
                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Price
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Stock
                    <input
                        type="number"
                        min="0"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <label>
                Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Image URL
                <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                />
            </label>

            {error && <div className="error">{error}</div>}

            <div className="actions">
                <button type="submit">
                    {editingProduct ? "Update Product" : "Add Product"}
                </button>

                {editingProduct && (
                    <button type="button" className="secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

function ProductList({ products, onEdit, onDelete }) {
    if (!products.length) {
        return <div className="card empty">No products yet.</div>;
    }

    return (
        <div className="products">
            {products.map((product) => (
                <article className="card product-card" key={product._id}>
                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <div className="image-placeholder">No image</div>
                    )}

                    <div className="product-info">
                        <span className="badge">{product.category}</span>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>

                        <div className="product-meta">
                            <strong>₹{product.price}</strong>
                            <span>Stock: {product.stock}</span>
                        </div>

                        <div className="actions">
                            <button onClick={() => onEdit(product)}>Edit</button>
                            <button
                                className="danger"
                                onClick={() => onDelete(product._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

function Dashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadProducts() {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data.products);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleDelete(id) {
        const confirmed = window.confirm("Delete this product?");

        if (!confirmed) return;

        try {
            await deleteProduct(id);
            await loadProducts();
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleLogout() {
        await onLogout();
    }

    return (
        <div>
            <header className="navbar">
                <div>
                    <h1>Product Store</h1>
                    <span>Welcome, {user.name}</span>
                </div>
                <button className="secondary" onClick={handleLogout}>
                    Logout
                </button>
            </header>

            <main className="container">
                <ProductForm
                    editingProduct={editingProduct}
                    onSaved={async () => {
                        setEditingProduct(null);
                        await loadProducts();
                    }}
                    onCancel={() => setEditingProduct(null)}
                />

                {error && <div className="error">{error}</div>}

                <section>
                    <div className="section-heading">
                        <h2>Products</h2>
                        <button className="secondary" onClick={loadProducts}>
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="card empty">Loading products...</div>
                    ) : (
                        <ProductList
                            products={products}
                            onEdit={setEditingProduct}
                            onDelete={handleDelete}
                        />
                    )}
                </section>
            </main>
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setCheckingAuth(false);
            }
        }

        checkAuth();
    }, []);

    if (checkingAuth) {
        return <div className="loading-screen">Checking authentication...</div>;
    }

    if (!user) {
        return (
            <Auth
                onLogin={(loggedInUser) => {
                    setUser(loggedInUser);
                }}
            />
        );
    }

    return (
        <Dashboard
            user={user}
            onLogout={async () => {
                await logoutUser();
                setUser(null);
            }}
        />
    );
}

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
