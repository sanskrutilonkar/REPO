// ═══════════════════════════════════════════════════
//   STUDIONEST — Admin Panel JS
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── DELETE CONFIRMATION ──────────────────────────
  document.querySelectorAll('[data-confirm]').forEach(el => {
    el.addEventListener('click', (e) => {
      const msg = el.dataset.confirm || 'Are you sure you want to delete this? This cannot be undone.';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  // ─── TOGGLE PUBLISH ───────────────────────────────
  document.querySelectorAll('.toggle-publish').forEach(btn => {
    btn.addEventListener('click', async function() {
      const id = this.dataset.id;
      const res = await fetch(`/admin/blogs/${id}/toggle-publish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const badge = this.closest('tr').querySelector('.pub-badge');
        if (data.published) {
          badge.className = 'badge badge-green pub-badge';
          badge.textContent = 'Published';
          this.textContent = 'Unpublish';
        } else {
          badge.className = 'badge badge-gray pub-badge';
          badge.textContent = 'Draft';
          this.textContent = 'Publish';
        }
      }
    });
  });

  // ─── SIDEBAR ACTIVE STATE ─────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && (path === href || (href !== '/admin/dashboard' && path.startsWith(href)))) {
      item.classList.add('active');
    }
  });

  // ─── CHARACTER COUNTER ────────────────────────────
  document.querySelectorAll('[data-maxlength]').forEach(el => {
    const max = parseInt(el.dataset.maxlength);
    const counter = document.createElement('div');
    counter.className = 'form-hint';
    el.parentNode.appendChild(counter);
    const update = () => {
      const len = el.value.length;
      counter.textContent = `${len} / ${max} characters`;
      counter.style.color = len > max * 0.9 ? '#ef4444' : '';
    };
    el.addEventListener('input', update);
    update();
  });

  // ─── IMAGE URL PREVIEW ────────────────────────────
  const imageUrlInput = document.getElementById('imageUrl');
  const imagePreview = document.getElementById('image-preview');
  if (imageUrlInput && imagePreview) {
    imageUrlInput.addEventListener('input', () => {
      const url = imageUrlInput.value.trim();
      if (url) {
        imagePreview.src = url;
        imagePreview.style.display = 'block';
        imagePreview.onerror = () => { imagePreview.style.display = 'none'; };
      } else {
        imagePreview.style.display = 'none';
      }
    });
    // Initial
    if (imageUrlInput.value) {
      imagePreview.src = imageUrlInput.value;
      imagePreview.style.display = 'block';
    }
  }

  // ─── AUTO DISMISS ALERTS ─────────────────────────
  document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.4s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 400);
    }, 4000);
  });

});
