import React, { useEffect, useState } from "react";

const API = "http://localhost:4000/api"; // Change if deploying backend elsewhere

function MainMenu() {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    fetch(`${API}/menu`)
      .then(res => res.json())
      .then(setMenu)
      .catch(() => setMenu([]));
  }, []);
  return (
    <section>
      <h2>Menu Highlights</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        {menu.map((item, idx) => (
          <div key={idx} style={{ background: "#f2f5fa", borderRadius: 8, padding: 20, minWidth: 220 }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p style={{ fontWeight: "bold" }}>{item.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const fetchMenu = () => {
    fetch(`${API}/menu`).then(res => res.json()).then(setMenu);
  };

  const handleLogin = e => {
    e.preventDefault();
    fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLoggedIn(true);
          fetchMenu();
        } else {
          setError("Invalid credentials");
        }
      });
  };

  const saveMenu = newMenu => {
    fetch(`${API}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...login, menu: newMenu })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setMenu(newMenu);
        else setError("Failed to update menu");
      });
  };

  const addItem = e => {
    e.preventDefault();
    if (!form.name) return;
    const newMenu = [...menu, form];
    saveMenu(newMenu);
    setForm({ name: "", description: "", price: "" });
  };

  const deleteItem = idx => {
    const newMenu = menu.filter((_, i) => i !== idx);
    saveMenu(newMenu);
  };

  if (!loggedIn)
    return (
      <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: "2rem auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <h2>Admin Login</h2>
        <input placeholder="Username" value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} />
        <input type="password" placeholder="Password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
        <button type="submit">Login</button>
        <div style={{ color: "red" }}>{error}</div>
      </form>
    );

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Manage Menu</h2>
      <form onSubmit={addItem} style={{ display: "flex", gap: 8 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
        <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {menu.map((item, idx) => (
          <li key={idx} style={{ margin: "1rem 0", listStyle: "none" }}>
            <span><b>{item.name}</b> - {item.description} ({item.price})</span>
            <button style={{ marginLeft: 10 }} onClick={() => deleteItem(idx)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    window.onpopstate = () => setRoute(window.location.pathname);
  }, []);

  if (route === "/admin") return <AdminPanel />;
  return (
    <div style={{ fontFamily: "sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>
      <section style={{ background: "#0f253a", color: "#fff", padding: "3rem 1rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>YesGar</h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Authentic Indian Flavors in Gurugram</p>
        <p style={{ fontWeight: "bold" }}>
          Shop No 19A Near Exit Gate Pyramid Fusion Homes Sector 70a Gurugram Haryana 122101
        </p>
      </section>
      <section style={{ padding: "2rem 1rem", maxWidth: 900, margin: "auto" }}>
        <h2 style={{ color: "#0f253a" }}>About Us</h2>
        <p>
          Welcome to YesGar, your destination for delicious Indian cuisine in Gurugram. 
          We bring you traditional recipes with a modern twist, fresh ingredients, and warm hospitality. 
          Join us for a memorable dining experience!
        </p>
      </section>
      <MainMenu />
      <section style={{ padding: "2rem 1rem", maxWidth: 900, margin: "auto" }}>
        <h2 style={{ color: "#0f253a" }}>Find Us</h2>
        <p>
          Shop No 19A Near Exit Gate Pyramid Fusion Homes Sector 70a Gurugram Haryana 122101
        </p>
        <iframe
          title="YesGar Location"
          src="https://www.google.com/maps?q=Shop+No+19A+Near+Exit+Gate+Pyramid+Fusion+Homes+Sector+70a+Gurugram+Haryana+122101&output=embed"
          width="100%"
          height="250"
          style={{ border: 0, borderRadius: 8 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
      <footer style={{ background: "#0f253a", color: "#fff", textAlign: "center", padding: 16, marginTop: 32 }}>
        &copy; {new Date().getFullYear()} YesGar. All rights reserved.
      </footer>
    </div>
  );
                                     }
