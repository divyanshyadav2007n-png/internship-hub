import React, { useState } from 'react';

// PORT 5000 se 5001 kar diya hai backend connection ke liye
const baseUrl = 'http://localhost:5001'; 

const App = () => {
    const [mode, setMode] = useState('register'); // 'register' or 'login'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Student',
        password: '',
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetMessages = () => {
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetMessages();

        const endpoint = mode === 'register' ? '/register' : '/login';
        
        // Form Validation
        if (mode === 'register' && (!formData.name || !formData.email || !formData.password)) {
            setError('All fields are required!');
            return;
        }
        if (mode === 'login' && (!formData.email || !formData.password)) {
            setError('Email and password required!');
            return;
        }

        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                if (mode === 'login') {
                    setLoggedInUser(data.user);
                }
                // Success ke baad form clear kar do
                setFormData({ name: '', email: '', role: 'Student', password: '' });
            } else {
                // Backend se jo error message aayega wo yahan dikhega
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Cannot connect to server. Make sure Backend is running on port 5001');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
            <h2 style={{ textAlign: 'center' }}>INTERNSHIP HUB - {mode === 'register' ? 'Register' : 'Login'}</h2>

            {error && <p style={{ color: 'red', backgroundColor: '#fee', padding: '10px', borderRadius: '5px' }}>{error}</p>}
            {message && <p style={{ color: 'green', backgroundColor: '#efe', padding: '10px', borderRadius: '5px' }}>{message}</p>}

            {loggedInUser ? (
                <div style={{ textAlign: 'center' }}>
                    <h3>Welcome, {loggedInUser.name}! 👋</h3>
                    <p><b>Email:</b> {loggedInUser.email}</p>
                    <p><b>Role:</b> {loggedInUser.role}</p>
                    <button 
                        onClick={() => { setLoggedInUser(null); setMessage(''); }}
                        style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
                    />

                    {mode === 'register' && (
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
                        >
                            <option value="Student">Student</option>
                            <option value="Mentor">Mentor</option>
                        </select>
                    )}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: '100%', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
                    />

                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        {mode === 'register' ? 'Register' : 'Login'}
                    </button>
                </form>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                    onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); resetMessages(); }} 
                    style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {mode === 'register' ? 'Already have an account? Switch to Login' : "Don't have an account? Switch to Register"}
                </button>
            </div>
        </div>
    );
};

export default App;