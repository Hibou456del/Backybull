import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  ChevronRight, 
  Eye, 
  X, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Compass, 
  Filter,
  CheckCircle,
  ArrowRight,
  User,
  LogIn,
  UserPlus,
  PlusCircle,
  FileText,
  Lock,
  Truck,
  CreditCard,
  ChevronDown,
  HelpCircle,
  Award,
  Globe,
  Check,
  Building,
  Upload,
  AlertTriangle,
  LogOut,
  Package,
  Layers,
  ArrowLeft,
  Home,
  Grid,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { CATEGORIES, PRODUCTS as INITIAL_PRODUCTS, STORYSHOOT, TESTIMONIALS, FAQS, LEGAL_TEXTS } from './data/products';
import Dashboard from './components/Dashboard';

export default function App() {
  // Multi-Page Router state
  const [route, setRoute] = useState('home'); // 'home' | 'catalog' | 'product' | 'my-products' | 'sell' | 'story' | 'cart' | 'auth' | 'legal'
  const [routeParam, setRouteParam] = useState(null);

  // Catalog state
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(60);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authTab, setAuthTab] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'seller' });

  // Add Product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'snowboard',
    price: '',
    description: '',
    seller: '',
    stock: '10',
    badge: 'Nouveau',
    specs: '',
    acceptsImagePolicy: false
  });

  // Cart & Checkout state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingForm, setShippingForm] = useState({ name: '', email: '', address: '', city: '', postalCode: '', carrier: 'dhl' });
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // FAQ Accordion state
  const [expandedFaqId, setExpandedFaqId] = useState('faq-1');

  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Navigation Helper Function
  const navigateTo = (targetRoute, param = null) => {
    setRoute(targetRoute);
    setRouteParam(param);
    window.location.hash = `#/${targetRoute}${param ? `/${param}` : ''}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync Hash on Load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (!hash) {
        setRoute('home');
        setRouteParam(null);
        return;
      }
      const parts = hash.split('/');
      setRoute(parts[0] || 'home');
      setRouteParam(parts[1] || null);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const cartImageFallback = '/images/auto-fill/secondary-core-placeholder.svg';
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = cartImageFallback;
  };

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  // Auth Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }
    const user = {
      name: authForm.name || authForm.email.split('@')[0],
      email: authForm.email,
      role: authForm.role
    };
    setCurrentUser(user);
    showToast(`Bienvenue ${user.name} ! (${user.role === 'seller' ? 'Compte Vendeur' : 'Compte Acheteur'})`);
    navigateTo('home');
  };

  // Add Product Handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.acceptsImagePolicy) {
      alert('Vous devez certifier que vos visuels sont conformes à la charte d\'image BarkyBull.');
      return;
    }
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === newProduct.category);
    const sellerName = currentUser ? currentUser.name : 'Mon Enseigne BarkyBull';
    const createdItem = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      category: newProduct.category,
      categoryName: catObj ? catObj.name : 'Équipement',
      price: parseFloat(newProduct.price),
      rating: 5.0,
      reviews: 1,
      badge: newProduct.badge || 'Nouveau',
      seller: sellerName,
      stock: parseInt(newProduct.stock) || 10,
      image: catObj ? catObj.image : '/images/hero/hero-bg.webp',
      secondaryImage: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&w=1000&q=80',
      description: newProduct.description,
      specs: {
        'Origine': 'Publié par Vendeur Certifié',
        'Garantie': '2 Ans Constructeur',
        'Livraison': 'Expédié sous 24h',
        'Spécifications': newProduct.specs || 'Conforme aux normes de performance'
      },
      traceability: 'Produit certifié avec engagement de conformité de visuels.'
    };

    setProductsList([createdItem, ...productsList]);
    setNewProduct({
      name: '',
      category: 'snowboard',
      price: '',
      description: '',
      seller: '',
      stock: '10',
      badge: 'Nouveau',
      specs: '',
      acceptsImagePolicy: false
    });
    showToast(`Produit "${createdItem.name}" publié avec succès !`);
    navigateTo('my-products');
  };

  // Cart Handlers
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} ajouté au panier`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // Remove Item Completely from Cart
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Article supprimé du panier');
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const sellerName = currentUser ? currentUser.name : null;
    return productsList.filter(product => {
      if (route === 'my-products' && !sellerName) {
        return false;
      }
      const matchesMyProducts = route !== 'my-products' || product.seller === sellerName;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMyProducts && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [productsList, selectedCategory, searchQuery, sortBy, route, currentUser]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const currentProductDetail = useMemo(() => {
    if (route === 'product' && routeParam) {
      return productsList.find(p => p.id === routeParam) || productsList[0];
    }
    return null;
  }, [route, routeParam, productsList]);

  // Checkout Handler
  const handleFinalCheckout = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!currentUser) {
      showToast('Veuillez vous connecter pour finaliser la livraison.');
      setAuthTab('login');
      navigateTo('auth');
      return;
    }
    if (!shippingForm.name || !shippingForm.address || !shippingForm.city) {
      alert('Veuillez remplir les informations de livraison.');
      return;
    }
    const orderNum = `BB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmation({
      number: orderNum,
      total: cartTotal,
      items: [...cart],
      shipping: shippingForm
    });
    setCart([]);
    showToast(`Commande ${orderNum} validée avec succès !`);
  };

  // Update product helper (for dashboard edits)
  const updateProduct = (id, changes) => {
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
    showToast('Produit mis à jour');
  };

  const featuredProducts = useMemo(() => {
    const priorityIds = ['alpine-core-158', 'urban-flux-825', 'raven-r900', 'velocity-trail-pro', 'hyper-glide-v2'];
    const selected = priorityIds
      .map((id) => productsList.find((product) => product.id === id))
      .filter(Boolean);

    const extraMatches = productsList.filter((product) => {
      const name = product.name.toLowerCase();
      return !selected.some((item) => item.id === product.id) && (
        name.includes('ducati') ||
        name.includes('ride warpig') ||
        name.includes('alpine') ||
        name.includes('urban') ||
        name.includes('raven') ||
        name.includes('velocity')
      );
    });

    return [...selected, ...extraMatches].slice(0, 5);
  }, [productsList]);

  const homeBenefits = [
    { icon: ShieldCheck, title: 'Produits vérifiés', text: 'Sélection rigoureuse avec visuels alignés et fiches détaillées.' },
    { icon: Truck, title: 'Livraison rapide', text: 'Expédition sous 24h et suivi simple depuis le panier.' },
    { icon: CreditCard, title: 'Paiement sécurisé', text: 'Processus fiable pour des achats rapides et rassurants.' },
    { icon: Award, title: 'Service premium', text: 'Support dédié pour vendeur et acheteur sur chaque étape.' }
  ];

  const testimonials = [
    { name: 'Lina M.', role: 'Acheteuse premium', quote: 'Le parcours d’achat est fluide, les produits sont bien présentés et je retrouve facilement ce que je cherche.' },
    { name: 'Julien P.', role: 'Vendeur certifié', quote: 'La page de publication et la gestion de mon inventaire sont vraiment plus professionnelles qu’un simple catalogue.' },
    { name: 'Sofiane R.', role: 'Rider passionné', quote: 'Le design inspire confiance et les visuels donnent envie de découvrir chaque catégorie.' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 10px 30px rgba(0, 240, 255, 0.3)',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fff',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle size={20} color="var(--accent-cyan)" />
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{notification}</span>
        </div>
      )}

      {/* Top Banner Announcement */}
      <div style={{
        background: 'linear-gradient(90deg, #09131f 0%, #162438 50%, #09131f 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.82rem',
        padding: '8px 0',
        color: 'var(--text-secondary)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            Sélection premium • Catalogue sportif curaté et cohérent
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span 
              onClick={() => navigateTo('legal', 'images')}
              style={{ cursor: 'pointer', color: 'var(--accent-amber)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Règle Droits d'Image & Pinterest
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--accent-cyan)" /> Garanties Constructeur 3 ans
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation Multi-Pages */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(7, 9, 14, 0.94)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0077ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-cyan-glow)'
            }}>
              <Compass size={26} color="#040810" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em' }}>
                BARKY<span style={{ color: 'var(--accent-cyan)' }}>BULL</span>
              </h1>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-muted)', fontWeight: 700 }}>
                Boutique sportive premium
              </p>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={() => navigateTo('home')}
              style={{
                background: route === 'home' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                color: route === 'home' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: route === 'home' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Home size={15} /> Accueil
            </button>

            <button 
              onClick={() => navigateTo('catalog')}
              style={{
                background: route === 'catalog' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                color: route === 'catalog' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: route === 'catalog' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Grid size={15} /> Catalogue premium
            </button>

            <button 
              onClick={() => navigateTo('my-products')}
              style={{
                background: route === 'my-products' ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                color: route === 'my-products' ? 'var(--accent-amber)' : 'var(--text-secondary)',
                border: route === 'my-products' ? '1px solid var(--accent-amber)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Package size={15} /> Voir tous mes produits
            </button>

            <button 
              onClick={() => navigateTo('story')}
              style={{
                background: route === 'story' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                color: route === 'story' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: route === 'story' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ImageIcon size={15} /> Storyshoot
            </button>
            <button 
              onClick={() => navigateTo('cart')}
              style={{
                background: route === 'cart' ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                color: route === 'cart' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: route === 'cart' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShoppingBag size={15} /> Panier
            </button>
          </nav>

          {/* Action Buttons: Explicit "Connexion" & "Inscription" Nav buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => navigateTo('sell')}
              style={{
                background: 'rgba(255, 107, 0, 0.12)',
                border: '1px solid var(--accent-amber)',
                color: 'var(--accent-amber)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PlusCircle size={15} /> Vendre
            </button>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <User size={15} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{currentUser.name}</span>
                <button onClick={() => navigateTo('dashboard')} style={{ background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer' }}>
                  Dashboard
                </button>
                <button onClick={() => { setCurrentUser(null); showToast('Vous êtes déconnecté.'); navigateTo('home'); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => { setAuthTab('login'); navigateTo('auth'); }} 
                  className="btn-secondary" 
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <LogIn size={15} /> Connexion
                </button>
                <button 
                  onClick={() => { setAuthTab('register'); navigateTo('auth'); }} 
                  className="btn-primary" 
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <UserPlus size={15} /> Inscription
                </button>
              </div>
            )}

            <button onClick={() => setIsCartOpen(true)} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', cursor: 'pointer' }}>
              <ShoppingBag size={18} color="var(--accent-cyan)" />
              {cartCount > 0 && <span style={{ background: 'var(--accent-amber)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 800, padding: '2px 6px' }}>{cartCount}</span>}
            </button>
          </div>

        </div>
      </header>

      {/* PAGE 1: HOME PAGE */}
      {route === 'home' && (
        <main className="animate-fade-in">
          <section style={{
            position: 'relative',
            minHeight: '640px',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `linear-gradient(to right, rgba(7, 9, 14, 0.96) 25%, rgba(7, 9, 14, 0.72) 60%, rgba(7, 9, 14, 0.28) 100%), url('/images/hero/hero-bg.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,240,255,0.16), transparent 45%, rgba(255,107,0,0.16))', pointerEvents: 'none' }} />
            <div className="container" style={{ position: 'relative', zIndex: 2, padding: '88px 24px', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '36px', alignItems: 'center' }}>
              <div style={{ maxWidth: '690px' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '16px' }}>
                  BarkyBull • Boutique premium et catalogue certifié
                </span>
                <h2 style={{ fontSize: '3.1rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '18px', letterSpacing: '-0.03em' }}>
                  Une marketplace dédiée aux produits <span style={{ color: 'var(--accent-cyan)' }}>sportifs premium</span>.
                </h2>
                <p style={{ fontSize: '1.03rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.8 }}>
                  Une expérience de vente soignée, des fiches produits claires et une navigation fluide pour découvrir, comparer et acheter en toute confiance.
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '22px' }}>
                  <button className="btn-primary" onClick={() => navigateTo('catalog')}>
                    Explorer le catalogue <ArrowRight size={18} />
                  </button>
                  <button className="btn-secondary" onClick={() => navigateTo('sell')}>
                    <Package size={18} /> Vendre un produit
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {homeBenefits.slice(0, 3).map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)' }}>
                        <Icon size={16} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '0.84rem', fontWeight: 700 }}>{item.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ borderRadius: '28px', padding: '20px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-amber">Produits à la une</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>+24% de conversion</span>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="product-card" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px' }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={product.image} alt={product.name} className="product-card__image" style={{ borderRadius: '12px' }} />
                        <div className="product-card__overlay" style={{ borderRadius: '12px' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, marginBottom: '2px' }}>{product.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{product.categoryName}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>{product.price.toLocaleString('fr-FR')} €</div>
                        <button className="btn-primary" style={{ marginTop: '6px', padding: '7px 10px', fontSize: '0.75rem' }} onClick={() => addToCart(product)}>
                          Ajouter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Produits phares</span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Des références sélectionnées pour une expérience d’achat fluide et rassurante</h2>
                </div>
                <button onClick={() => navigateTo('catalog')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                  Voir tout le catalogue →
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
                {featuredProducts.map((product) => (
                  <div key={product.id} className="product-card glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '190px' }}>
                      <img src={product.image} onError={handleImageError} alt={product.name} className="product-card__image" />
                      <div className="product-card__overlay" />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 1 }}>
                        <span className="badge badge-green">{product.badge || 'Nouveau'}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '999px', background: 'rgba(7, 9, 14, 0.72)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--accent-cyan)' }}>{product.categoryName}</span>
                      </div>
                    </div>
                    <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                          <Star size={14} fill="currentColor" /> {product.rating.toFixed(1)}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.reviews} avis</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>{product.name}</h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.6 }}>{product.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>À partir de</div>
                          <div style={{ fontWeight: 900 }}>{product.price.toLocaleString('fr-FR')} €</div>
                        </div>
                        <button className="btn-primary" style={{ padding: '8px 12px', fontSize: '0.78rem' }} onClick={() => addToCart(product)}>
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '24px' }}>
              <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px' }}>
                <span className="badge badge-amber" style={{ marginBottom: '12px' }}>Pourquoi choisir BarkyBull</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '18px' }}>Une boutique pensée comme une marketplace moderne et professionnelle</h3>
                <div style={{ display: 'grid', gap: '14px' }}>
                  {homeBenefits.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,240,255,0.12)' }}>
                          <Icon size={18} color="var(--accent-cyan)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, marginBottom: '4px' }}>{item.title}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,107,0,0.08))' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Expérience de vente</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px' }}>Des parcours simples pour acheter, vendre et gérer efficacement</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    ['Catalogue expert', 'Des catégories claires et des fiches produits riches pour réduire les hésitations.'],
                    ['Publication simplifiée', 'Ajoutez votre produit rapidement avec une logique de vente claire.'],
                    ['Panier optimisé', 'Un tunnel d’achat plus fluide, avec suivi et rassurance à chaque étape.']
                  ].map(([title, text]) => (
                    <div key={title} style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontWeight: 800, marginBottom: '4px' }}>{title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '64px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Explorer par catégories</span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Des collections organisées comme dans une vraie marketplace</h2>
                </div>
                <button onClick={() => navigateTo('catalog')} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                  Voir le catalogue complet →
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <div key={cat.id} onClick={() => { setSelectedCategory(cat.id); navigateTo('catalog'); }} className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '16px', cursor: 'pointer' }}>
                    <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '14px' }}>
                      <img src={cat.image} onError={handleImageError} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{cat.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.subtitle}</p>
                      </div>
                      <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>{cat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '64px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Ce que disent nos clients</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Une plateforme qui inspire confiance dès la première visite</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {testimonials.map((item) => (
                  <div key={item.name} className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>“{item.quote}”</p>
                    <div style={{ fontWeight: 800 }}>{item.name}</div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{item.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ padding: '0 0 72px' }}>
            <div className="container">
              <div className="glass-panel" style={{ borderRadius: '28px', padding: '32px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,240,255,0.12), rgba(255,107,0,0.08))' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Prêt à passer à l’action ?</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Donnez à votre catalogue une expérience de vente premium</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 20px' }}>BarkyBull permet de présenter vos produits avec plus de clarté, de cohérence et de professionnalisme.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => navigateTo('catalog')}>Parcourir les produits</button>
                  <button className="btn-secondary" onClick={() => navigateTo('sell')}>Créer une annonce</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* PAGE 2: CATALOG PAGE (800+ PRODUCTS, ZERO DUPLICATE IMAGES) */}
      {route === 'catalog' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>Visuels 100% Uniques</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Catalogue premium</h2>
              <p style={{ color: 'var(--text-muted)' }}>Affichage de {displayedProducts.length} sur {filteredProducts.length} référence(s)</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
                <button onClick={() => { setSelectedCategory('all'); setVisibleCount(100); }} style={{ background: selectedCategory === 'all' ? 'var(--accent-cyan)' : 'transparent', color: selectedCategory === 'all' ? '#040810' : 'var(--text-secondary)', border: 'none', borderRadius: 'var(--radius-full)', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Tous les produits
                </button>
                {CATEGORIES.slice(0, 4).map(c => (
                  <button key={c.id} onClick={() => { setSelectedCategory(c.id); setVisibleCount(100); }} style={{ background: selectedCategory === c.id ? 'var(--accent-cyan)' : 'transparent', color: selectedCategory === c.id ? '#040810' : 'var(--text-secondary)', border: 'none', borderRadius: 'var(--radius-full)', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    {c.name}
                  </button>
                ))}
              </div>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff', padding: '10px 14px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}>
                <option value="featured">Tri : Vedette</option>
                <option value="price-low">Prix : croissant</option>
                <option value="price-high">Prix : décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '28px' }}>
            {displayedProducts.map((product) => (
              <div key={product.id} className="product-card glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '230px', position: 'relative', cursor: 'pointer' }} onClick={() => navigateTo('product', product.id)}>
                  <img src={product.image} onError={handleImageError} alt={product.name} className="product-card__image" />
                  <div className="product-card__overlay" />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 1 }}>
                    <span className="badge badge-green">{product.badge || 'Nouveau'}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '999px', background: 'rgba(7, 9, 14, 0.72)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--accent-cyan)' }}>{product.categoryName}</span>
                  </div>
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)', fontWeight: 700 }}>
                        <Star size={14} fill="currentColor" /> {product.rating.toFixed(1)}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{product.reviews} avis</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '6px 0' }}>{product.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>{product.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>À partir de</div>
                      <span style={{ fontSize: '1.3rem', fontWeight: 900 }}>{product.price.toLocaleString('fr-FR')} €</span>
                    </div>
                    <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }} onClick={() => addToCart(product)}>
                      <Plus size={15} /> Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedProducts.length < filteredProducts.length && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button className="btn-primary" onClick={() => setVisibleCount(prev => prev + 60)}>
                Charger 60 produits supplémentaires ({filteredProducts.length - displayedProducts.length} restants)
              </button>
            </div>
          )}
        </main>
      )}

      {/* PAGE 3: MY PRODUCTS PAGE ("Voir tous mes produits") */}
      {route === 'my-products' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Page Dédiée Vendeur</span>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 900 }}>{currentUser ? 'Mes produits publiés' : 'Accès vendeur sécurisé'}</h2>
              <p style={{ color: 'var(--text-muted)' }}>{currentUser ? 'Gestion et aperçu de votre inventaire de produits sur la plateforme BarkyBull' : 'Connectez-vous pour créer, modifier et suivre vos annonces en toute sécurité.'}</p>
            </div>
            <button className="btn-exit" onClick={() => navigateTo('home')}>
              <ArrowLeft size={16} /> Quitter la page & Retour à l'accueil
            </button>
          </div>

          {!currentUser ? (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Connexion requise pour voir vos produits</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.8 }}>Pour accéder à votre espace vendeur et gérer votre inventaire, veuillez vous connecter ou créer un compte.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => { setAuthTab('login'); navigateTo('auth'); }}>Connexion</button>
                <button className="btn-secondary" onClick={() => { setAuthTab('register'); navigateTo('auth'); }}>Créer un compte</button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>Aucun produit trouvé</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.8 }}>Commencez par publier votre premier produit pour l’ajouter à votre inventaire BarkyBull.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '28px' }}>
              {filteredProducts.map(product => (
                <div key={product.id} className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                  <img src={product.image} onError={handleImageError} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '14px' }} />
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>{product.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Prix : {product.price.toLocaleString('fr-FR')} € | Stock : {product.stock}</p>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigateTo('product', product.id)}>
                    <Eye size={16} /> Voir la fiche complète
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* PAGE X: DASHBOARD (utilisateur connecté) */}
      {route === 'dashboard' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px' }}>
          <button className="btn-exit" onClick={() => navigateTo('home')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Retour
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <Dashboard currentUser={currentUser} productsList={productsList} navigateTo={navigateTo} addToCart={addToCart} updateProduct={updateProduct} orders={orderConfirmation ? [orderConfirmation] : []} />
          </div>
        </main>
      )}

      {/* PAGE 4: DETAILED PRODUCT PAGE */}
      {route === 'product' && currentProductDetail && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px' }}>
          <button className="btn-exit" onClick={() => navigateTo('catalog')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter cette fiche & Retour au catalogue
          </button>

          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '36px' }}>
            <div>
              <img src={currentProductDetail.image} onError={handleImageError} alt={currentProductDetail.name} style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '12px' }}>{currentProductDetail.categoryName}</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px' }}>{currentProductDetail.name}</h2>
                <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '16px' }}>Vendeur Agréé : {currentProductDetail.seller}</p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>{currentProductDetail.description}</p>
              </div>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '20px' }}>{currentProductDetail.price.toLocaleString('fr-FR')} €</div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} onClick={() => addToCart(currentProductDetail)}>
                  <ShoppingBag size={20} /> Ajouter au Panier
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* PAGE 5: SELL PRODUCT PAGE */}
      {route === 'sell' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px', maxWidth: '680px' }}>
          <button className="btn-exit" onClick={() => navigateTo('home')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter la page
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '20px' }}>Page de Mise en Vente Produit</h2>
            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nom du produit *</label>
                <input type="text" required placeholder="ex: Snowboard Carbon Apex Pro 160" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Catégorie *</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prix (€ TTC) *</label>
                  <input type="number" required placeholder="499.00" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description commerciale *</label>
                <textarea required rows={4} placeholder="Description complète..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
              </div>
              <div style={{ background: 'rgba(255, 107, 0, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <input type="checkbox" id="imgCheck4" checked={newProduct.acceptsImagePolicy} onChange={(e) => setNewProduct({ ...newProduct, acceptsImagePolicy: e.target.checked })} />
                <label htmlFor="imgCheck4" style={{ fontSize: '0.85rem', marginLeft: '8px', color: 'var(--text-secondary)' }}>Engagement Charte Image BarkyBull : Mes visuels disposent d'une licence commerciale autorisée.</label>
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>Publier l'Annonce</button>
            </form>
          </div>
        </main>
      )}

      {/* PAGE 6: STORYSHOOT PAGE */}
      {route === 'story' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px' }}>
          <button className="btn-exit" onClick={() => navigateTo('home')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter la page
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '24px' }}>Page Storyshoot & Expéditions Outdoor</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
              {STORYSHOOT.map(story => (
                <div key={story.id} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                  <img src={story.image} onError={handleImageError} alt={story.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  <div style={{ padding: '20px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 800 }}>{story.tagline}</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '6px 0' }}>{story.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{story.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* PAGE 7: CART & CHECKOUT PAGE (WITH SUPPRIMER DUL PANIER ACTION) */}
      {route === 'cart' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px', maxWidth: '720px' }}>
          <button className="btn-exit" onClick={() => navigateTo('catalog')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter la page Panier
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '24px' }}>Votre Panier & Tunnel de Commande</h2>
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Votre panier est actuellement vide.</p>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={item.image} onError={handleImageError} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{item.price.toLocaleString('fr-FR')} €</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={14} /></button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={14} /></button>
                        </div>
                        {/* Supprimer du panier button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          title="Supprimer du panier"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '8px', color: '#f87171', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {currentUser ? (
                  <div style={{ display: 'grid', gap: '18px', marginBottom: '28px', padding: '24px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Nom du destinataire</label>
                        <input value={shippingForm.name} onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })} placeholder="Jean Dupont" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Email de contact</label>
                        <input value={shippingForm.email} onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })} placeholder="jean@exemple.com" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Adresse de livraison</label>
                      <input value={shippingForm.address} onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })} placeholder="123 rue du Sport" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Ville</label>
                        <input value={shippingForm.city} onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })} placeholder="Paris" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Code postal</label>
                        <input value={shippingForm.postalCode} onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })} placeholder="75008" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Transporteur préféré</label>
                      <select value={shippingForm.carrier} onChange={(e) => setShippingForm({ ...shippingForm, carrier: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }}>
                        <option value="dhl">DHL - Standard</option>
                        <option value="colissimo">Colissimo</option>
                        <option value="ups">UPS - Express</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', textAlign: 'center', marginBottom: '28px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px' }}>Connexion requise pour remplir les informations de livraison</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.7 }}>Vous devez être connecté pour renseigner et valider l’adresse de livraison.</p>
                    <button className="btn-primary" onClick={() => { setAuthTab('login'); navigateTo('auth'); }}>
                      Se connecter
                    </button>
                  </div>
                )}

                <div style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'right', marginBottom: '24px' }}>Total : {cartTotal.toLocaleString('fr-FR')} €</div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleFinalCheckout}>
                  Valider & Régler la Commande
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* PAGE 8: AUTH PAGE (CONNEXION & INSCRIPTION DÉDIÉE) */}
      {route === 'auth' && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px', maxWidth: '480px' }}>
          <button className="btn-exit" onClick={() => navigateTo('home')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter la page
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', pb: '12px' }}>
              <button 
                onClick={() => setAuthTab('login')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: authTab === 'login' ? '2px solid var(--accent-cyan)' : '2px solid transparent', 
                  color: authTab === 'login' ? 'var(--accent-cyan)' : 'var(--text-muted)', 
                  fontWeight: 800, 
                  fontSize: '1.1rem', 
                  paddingBottom: '8px', 
                  cursor: 'pointer' 
                }}
              >
                Connexion
              </button>
              <button 
                onClick={() => setAuthTab('register')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  borderBottom: authTab === 'register' ? '2px solid var(--accent-cyan)' : '2px solid transparent', 
                  color: authTab === 'register' ? 'var(--accent-cyan)' : 'var(--text-muted)', 
                  fontWeight: 800, 
                  fontSize: '1.1rem', 
                  paddingBottom: '8px', 
                  cursor: 'pointer' 
                }}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authTab === 'register' && (
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nom complet</label>
                  <input type="text" placeholder="Jean Dupont" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Adresse Email</label>
                <input type="email" required placeholder="rider@barkybull.com" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
                <input type="password" required placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', color: '#fff' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '12px' }}>
                {authTab === 'login' ? 'Se Connecter' : 'Créer Mon Compte'}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* PAGE 9: LEGAL PAGE */}
      {route === 'legal' && routeParam && LEGAL_TEXTS[routeParam] && (
        <main className="container animate-fade-in" style={{ padding: '48px 24px', maxWidth: '780px' }}>
          <button className="btn-exit" onClick={() => navigateTo('home')} style={{ marginBottom: '24px' }}>
            <ArrowLeft size={16} /> Quitter le document & Retour
          </button>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '40px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Document Officiel</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px' }}>{LEGAL_TEXTS[routeParam].title}</h2>
            <p style={{ color: 'var(--accent-amber)', marginBottom: '24px' }}>{LEGAL_TEXTS[routeParam].subtitle}</p>
            <div style={{ whiteSpace: 'pre-line', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{LEGAL_TEXTS[routeParam].content}</div>
          </div>
        </main>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end' }} onClick={() => setIsCartOpen(false)}>
          <div className="glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '460px', height: '100%', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Votre Panier ({cartCount})</h3>
                <button className="btn-exit" onClick={() => setIsCartOpen(false)}>
                  <X size={16} /> Fermer
                </button>
              </div>

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                  <p>Votre panier est vide.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '14px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.price.toLocaleString('fr-FR')} €</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-sm)', padding: '2px 6px' }}>
                          <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={13} /></button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={13} /></button>
                        </div>
                        {/* Trash Button for instant removal */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          title="Supprimer du panier"
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px', color: '#f87171', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Frais de port DHL</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Offerts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.3rem', fontWeight: 900 }}>
                  <span>Total TTC</span>
                  <span>{cartTotal.toLocaleString('fr-FR')} €</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { setIsCartOpen(false); navigateTo('cart'); }}>
                  Passer au Tunnel de Commande
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#040609', borderTop: '1px solid var(--border-subtle)', padding: '60px 0 30px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, marginBottom: '16px' }}>BARKY<span style={{ color: 'var(--accent-cyan)' }}>BULL</span></h3>
              <p style={{ lineHeight: 1.7, fontSize: '0.85rem' }}>La destination d'exception pour plus de 800 équipements sportifs, mobilités futuristes et véhicules d'aventure.</p>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px' }}>Pages Légales</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li><span onClick={() => navigateTo('legal', 'mentions')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Mentions Légales</span></li>
                <li><span onClick={() => navigateTo('legal', 'privacy')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Confidentialité & RGPD</span></li>
                <li><span onClick={() => navigateTo('legal', 'cgv')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Conditions Générales de Vente</span></li>
                <li><span onClick={() => navigateTo('legal', 'images')} style={{ cursor: 'pointer', color: 'var(--accent-amber)' }}>Charte Droits Visuels & Pinterest</span></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '16px' }}>Navigation Multi-Pages</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li><span onClick={() => navigateTo('catalog')} style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }}>✔ Catalogue premium et structuré</span></li>
                <li><span onClick={() => navigateTo('my-products')} style={{ cursor: 'pointer', color: 'var(--accent-cyan)' }}>✔ Voir tous mes produits</span></li>
                <li><span onClick={() => navigateTo('auth')} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>✔ Inscription & Connexion</span></li>
              </ul>
            </div>
          </div>
          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', fontSize: '0.8rem' }}>
            © 2026 BarkyBull Inc. Multi-Page Architecture. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
