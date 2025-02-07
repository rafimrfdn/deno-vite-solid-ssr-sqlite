
import { createSignal, createEffect } from 'solid-js';
import './App.css';
import solidLogo from './assets/solid.svg';

function App() {
  const [users, setUsers] = createSignal([]);
  const [name, setName] = createSignal('');
  const [editingId, setEditingId] = createSignal(null);

  const [count, setCount] = createSignal(0)

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  createEffect(() => {
    fetchUsers();
  });

  const addUser = async () => {
    if (!name()) return;
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name() }),
    });
    setName('');
    fetchUsers();
  };

  const updateUser = async (id) => {
    if (!name()) return;
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name() }),
    });
    setName('');
    setEditingId(null);
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  return (
    <div class="App">
      <h1>Deno + Vite + Sqlite</h1>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
      </div>
      <h2>User Management</h2>
      <div>
        <input
          type="text"
          value={name()}
          onInput={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        {editingId() ? (
          <button onClick={() => updateUser(editingId())}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>
      <ul>
        {users().map((user) => (
          <li key={user.id}>
            <span class="user">{user.name}</span>
            <button onClick={() => { setName(user.name); setEditingId(user.id); }}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
