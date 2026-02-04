// frontend/script.js
// Client-side handlers for login, register, complaints and tracking.
// This file attaches to forms if they exist on the page.
// It uses fetch() to POST JSON to backend endpoints and falls back to localStorage for demo.

(function () {
  'use strict';

  const backendBase = './backend'; // adjust if your backend is served elsewhere

  // Helpers
  function qs(sel, ctx = document) { return ctx.querySelector(sel); }
  function qsa(sel, ctx = document) { return Array.from((ctx || document).querySelectorAll(sel)); }

  function showMessage(el, message, type = 'info') {
    if (!el) return;
    el.textContent = message;
    el.className = 'message ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'message'; }, 5000);
  }

  function isEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }

  async function apiPost(path, data) {
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const text = await res.text();
      // backend might return JSON or plain text. Try parse.
      try { return JSON.parse(text); } catch (e) { return { ok: res.ok, body: text }; }
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // Register form
  function initRegister() {
    const form = qs('#registerForm');
    if (!form) return;
    const msg = qs('#registerMessage', form) || qs('#message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name')?.trim();
      const email = formData.get('email')?.trim();
      const password = formData.get('password');

      if (!name || !email || !password) {
        showMessage(msg, 'Please fill all required fields.', 'error');
        return;
      }
      if (!isEmail(email)) {
        showMessage(msg, 'Please provide a valid email.', 'error');
        return;
      }

      // Try backend registration endpoint; fallback to localStorage demo
      const url = `${backendBase}/register.php`;
      const result = await apiPost(url, { name, email, password });
      if (result && result.success) {
        showMessage(msg, 'Registration successful. You may login now.', 'success');
        form.reset();
      } else if (result && result.ok === false && result.error) {
        // network or server error
        showMessage(msg, 'Registration failed: ' + result.error, 'error');
      } else if (result && result.body) {
        // non-JSON response from server
        showMessage(msg, String(result.body), 'info');
      } else {
        // Demo fallback: store user in localStorage
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        if (users.find(u => u.email === email)) {
          showMessage(msg, 'Email already registered (demo).', 'error');
        } else {
          users.push({ name, email, password });
          localStorage.setItem('demo_users', JSON.stringify(users));
          showMessage(msg, 'Registered (demo). You can now login.', 'success');
          form.reset();
        }
      }
    });
  }

  // Login form
  function initLogin() {
    const form = qs('#loginForm');
    if (!form) return;
    const msg = qs('#loginMessage', form) || qs('#message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const email = fd.get('email')?.trim();
      const password = fd.get('password');

      if (!email || !password) { showMessage(msg, 'Fill in both fields.', 'error'); return; }
      if (!isEmail(email)) { showMessage(msg, 'Invalid email format.', 'error'); return; }

      const url = `${backendBase}/login.php`;
      const result = await apiPost(url, { email, password });
      if (result && result.success && result.token) {
        // Example: store token and redirect
        localStorage.setItem('auth_token', result.token);
        showMessage(msg, 'Login successful. Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'user-dashboard.html'; }, 800);
        return;
      }

      // fallback demo: check localStorage
      const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
  localStorage.setItem(
    'auth_user',
    JSON.stringify({ name: user.name || 'User', email: user.email })
  );

  showMessage(msg, 'Login successful. Redirecting to dashboard...', 'success');

  setTimeout(() => {
    window.location.assign('./user-dashboard.html');
  }, 800);
}
 else {
        showMessage(msg, 'Login failed. Check credentials.', 'error');
      }
    });
  }

  // Complaint submission
  function initComplaintForm() {
    const form = qs('#complaintForm');
    if (!form) return;
    const msg = qs('#complaintMessage', form) || qs('#message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = fd.get('title')?.trim();
      const details = fd.get('details')?.trim();
      const contact = fd.get('contact')?.trim();

      if (!title || !details) { showMessage(msg, 'Title and details required.', 'error'); return; }

      const payload = { title, details, contact };
      const url = `${backendBase}/submit_complaint.php`;
      const result = await apiPost(url, payload);
      if (result && result.success && result.complaint_id) {
        showMessage(msg, `Complaint submitted. ID: ${result.complaint_id}`, 'success');
        form.reset();
        return;
      }

      // Demo fallback: store in localStorage with random id
      const complaints = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
      const id = 'C' + Date.now();
      complaints.push({ id, title, details, contact, status: 'Received', created_at: new Date().toISOString() });
      localStorage.setItem('demo_complaints', JSON.stringify(complaints));
      showMessage(msg, `Complaint submitted (demo). ID: ${id}`, 'success');
      form.reset();
    });
  }

  // Track complaint
  function initTrackComplaint() {
    const form = qs('#trackForm');
    if (!form) return;
    const msg = qs('#trackMessage', form) || qs('#message');
    const resultBox = qs('#trackResult');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const id = fd.get('complaint_id')?.trim();
      if (!id) { showMessage(msg, 'Enter complaint ID to track.', 'error'); return; }

      const url = `${backendBase}/track_complaint.php`;
      const result = await apiPost(url, { complaint_id: id });
      if (result && result.success && result.status) {
        showMessage(msg, `Status: ${result.status}`, 'success');
        if (resultBox) resultBox.textContent = JSON.stringify(result, null, 2);
        return;
      }

      // Demo fallback: search localStorage
      const complaints = JSON.parse(localStorage.getItem('demo_complaints') || '[]');
      const c = complaints.find(x => x.id === id);
      if (c) {
        showMessage(msg, `Status: ${c.status}`, 'success');
        if (resultBox) resultBox.textContent = JSON.stringify(c, null, 2);
      } else {
        showMessage(msg, 'Complaint not found.', 'error');
      }
    });
  }

  // Simple page wiring: attach handlers for forms present
  document.addEventListener('DOMContentLoaded', () => {
    initRegister();
    initLogin();
    initComplaintForm();
    initTrackComplaint();

    // Optional convenience: link logout button
    const logoutBtn = qs('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        showMessage(qs('#message') || qs('body'), 'Logged out (demo).', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 400);
      });
    }
  });

})();
