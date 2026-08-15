import React, { useState } from 'react';

export default function Dashboard({ currentUser, productsList = [], navigateTo, addToCart, updateProduct, orders = [] }) {
  const sellerName = currentUser ? currentUser.name : null;
  const myProducts = productsList.filter(p => p.seller === sellerName);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditValues({ name: p.name, price: p.price, stock: p.stock });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const submitEdit = (id) => {
    const changes = { name: editValues.name, price: parseFloat(editValues.price) || 0, stock: parseInt(editValues.stock) || 0 };
    updateProduct(id, changes);
    cancelEdit();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ width: '96px', height: '96px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
          {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{currentUser ? currentUser.name : 'Utilisateur'}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{currentUser ? currentUser.email : ''}</p>
          <div style={{ marginTop: '8px', display: 'flex', gap: '10px' }}>
            <button onClick={() => navigateTo('my-products')} className="btn-secondary">Gérer mes produits</button>
            <button onClick={() => navigateTo('sell')} className="btn-primary">Ajouter un produit</button>
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Statistiques rapides</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Produits</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{myProducts.length}</div>
          </div>
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visites (simulées)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>+{Math.floor(120 + Math.random() * 980)}</div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Commandes récentes</h3>
        {orders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Aucune commande récente.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {orders.map(o => (
              <div key={o.number} className="glass-panel" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>Commande {o.number}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{o.items.length} article(s) • Total: {o.total.toLocaleString('fr-FR')} €</div>
                </div>
                <div>
                  <button className="btn-secondary" onClick={() => navigateTo('order', o.number)}>Voir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Mon inventaire</h3>
        {myProducts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Vous n'avez pas encore de produit publié. Cliquez sur "Ajouter un produit" pour commencer.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
            {myProducts.map(p => (
              <div key={p.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px' }}>
                <img src={p.image} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/auto-fill/secondary-core-placeholder.svg'; }} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{p.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.categoryName || p.category}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900 }}>{p.price.toLocaleString('fr-FR')} €</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Stock: {p.stock}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button className="btn-secondary" onClick={() => navigateTo('product', p.id)}>Voir</button>
                  <button className="btn-primary" onClick={() => addToCart(p)}>Ajouter au panier</button>
                  <button className="btn-secondary" onClick={() => startEdit(p)}>Éditer</button>
                </div>

                {editingId === p.id && (
                  <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nom</label>
                      <input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prix</label>
                        <input type="number" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }} />
                      </div>
                      <div style={{ width: '120px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock</label>
                        <input type="number" value={editValues.stock} onChange={(e) => setEditValues({ ...editValues, stock: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: '#fff' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-primary" onClick={() => submitEdit(p.id)}>Enregistrer</button>
                      <button className="btn-secondary" onClick={cancelEdit}>Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
