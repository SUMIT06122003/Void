import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  Check,
  CircleUserRound,
  CreditCard,
  LogOut,
  Mail,
  Menu,
  Minus,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import './styles.css';

const products = [
  {
    id: 1,
    name: 'Performance T-shirt',
    category: 'T-shirt',
    price: 1299,
    oldPrice: 1899,
    rating: 4.5,
    colors: ['#f5f5ef', '#202020', '#8f9890'],
    sizes: ['S', 'M', 'L', 'XL'],
    tag: 'Core',
    image: '/Tshirt.jpg',
  },
  {
    id: 2,
    name: 'Performance Shorts',
    category: 'Shorts',
    price: 1299,
    oldPrice: 2049,
    rating: 4.5,
    colors: ['#171717', '#d7d1c6', '#5f6a72'],
    sizes: ['M', 'L', 'XL'],
    tag: 'Sale',
    image: '/shorts.jpg',
  },
  {
    id: 3,
    name: 'Crystal Shaker',
    category: 'Gym Essentials',
    price: 499,
    oldPrice: 749,
    rating: 5,
    colors: ['#dbeafe', '#111827', '#e2e8f0'],
    sizes: ['650ml', '850ml'],
    tag: 'Hydrate',
    image: '/shaker.jpg',
  },
  {
    id: 4,
    name: 'Anti-Odour Socks',
    category: 'Socks',
    price: 449,
    oldPrice: 599,
    rating: 4.2,
    colors: ['#ffffff', '#1f2937', '#cbd5e1'],
    sizes: ['UK 6-8', 'UK 9-11'],
    tag: '2 Pack',
    image: '/socks.jpg',
  },
];

const productImageStyle = (product) => ({
  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.22)), url("${product.image}")`,
});

const cartKeyFor = (product, size) => `${product.id}-${size}`;

const categories = ['All', 'T-shirt', 'Shorts', 'Socks', 'Gym Essentials'];
const demoUser = { email: 'demo@voidactivewear.com', password: 'demo123', name: 'Demo Athlete' };

function App() {
  const [page, setPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [newsletter, setNewsletter] = useState('');
  const [expanded, setExpanded] = useState('Fit');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(
    () =>
      activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const navigate = (nextPage, product) => {
    if (product) {
      setSelectedProduct(product);
    }
    setIsLoading(true);
    setMenuOpen(false);
    window.setTimeout(() => {
      setPage(nextPage);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 360);
  };

  const addToCart = (product, size = product.sizes[0]) => {
    const cartKey = cartKeyFor(product, size);
    setCart((items) => {
      const existing = items.find((item) => item.cartKey === cartKey);
      if (existing) {
        return items.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { cartKey, product, quantity: 1, size }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (cartKey, quantity) => {
    setCart((items) =>
      items
        .map((item) => (item.cartKey === cartKey ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (cartKey) => setCart((items) => items.filter((item) => item.cartKey !== cartKey));
  const clearCart = () => setCart([]);

  const sharedProps = {
    activeCategory,
    addToCart,
    cart,
    cartTotal,
    expanded,
    filteredProducts,
    navigate,
    removeFromCart,
    setActiveCategory,
    setExpanded,
    setUser,
    searchQuery,
    selectedProduct,
    setSearchQuery,
    user,
  };

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        menuOpen={menuOpen}
        navigate={navigate}
        page={page}
        setCartOpen={setCartOpen}
        setMenuOpen={setMenuOpen}
        user={user}
      />

      <main>
        {isLoading && <LoadingScreen />}
        <div className={isLoading ? 'page-transition is-loading' : 'page-transition'}>
          {page === 'home' && <HomePage {...sharedProps} />}
          {page === 'shop' && <ShopPage {...sharedProps} />}
          {page === 'products' && <ProductsPage {...sharedProps} />}
          {page === 'product' && <ProductDetailPage {...sharedProps} />}
          {page === 'search' && <SearchPage {...sharedProps} />}
          {page === 'about' && <AboutPage expanded={expanded} setExpanded={setExpanded} navigate={navigate} />}
          {page === 'contact' && <ContactPage />}
          {page === 'login' && <LoginPage navigate={navigate} setUser={setUser} user={user} />}
          {page === 'register' && <RegisterPage navigate={navigate} setUser={setUser} user={user} />}
          {page === 'profile' && <ProfilePage navigate={navigate} setUser={setUser} user={user} />}
          {page === 'cart' && <CartPage cart={cart} cartTotal={cartTotal} clearCart={clearCart} navigate={navigate} removeFromCart={removeFromCart} updateCartQuantity={updateCartQuantity} />}
          {page === 'account' && <AccountPage cartCount={cartCount} cartTotal={cartTotal} navigate={navigate} setUser={setUser} user={user} />}
        </div>
        <BagPanel
          cart={cart}
          cartOpen={cartOpen}
          cartTotal={cartTotal}
          clearCart={clearCart}
          navigate={navigate}
          removeFromCart={removeFromCart}
          setCartOpen={setCartOpen}
          updateCartQuantity={updateCartQuantity}
        />
      </main>

      <Footer navigate={navigate} newsletter={newsletter} setNewsletter={setNewsletter} />
    </div>
  );
}

function Header({ cartCount, menuOpen, navigate, page, setCartOpen, setMenuOpen, user }) {
  const navItems = [
    ['home', 'Home'],
    ['products', 'Products'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ];

  return (
    <header className="site-header">
      <button className="brand brand-button" onClick={() => navigate('home')} aria-label="VOID home">
        <span>VOID</span>
        <small>Activewear</small>
      </button>

      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Primary navigation">
        {navItems.map(([key, label]) => (
          <button key={key} className={page === key ? 'active' : ''} onClick={() => navigate(key)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button className="icon-button" onClick={() => navigate('search')} aria-label="Search">
          <Search size={19} />
        </button>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`${cartCount} cart items`}>
          <ShoppingBag size={19} />
          <span>{cartCount}</span>
        </button>
        <button
          className="icon-button desktop-only"
          onClick={() => navigate(user ? 'profile' : 'login')}
          aria-label={user ? 'Account' : 'Login'}
        >
          <CircleUserRound size={20} />
        </button>
        <button className="login-chip" onClick={() => navigate(user ? 'profile' : 'login')}>
          {user ? 'Profile' : 'Login'}
        </button>
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loader-mark">
        <span />
        <span />
        <span />
      </div>
      <strong>VOID</strong>
    </div>
  );
}

function HomePage({ addToCart, expanded, filteredProducts, navigate, setExpanded }) {
  return (
    <>
      <section className="hero">
        <div className="hero-media photo-one" role="img" aria-label="VOID athlete wearing premium activewear">
          <div className="motion-panel">
            <span>Training / Daily Movement</span>
            <strong>07:00</strong>
          </div>
        </div>
        <div className="hero-content">
          <p className="eyebrow">Premium activewear from India</p>
          <h1>Discipline Over Noise</h1>
          <p>
            Performance essentials for training, work, and daily movement. Built to stay quiet,
            comfortable, and ready through every rep.
          </p>
          <div className="hero-actions">
            <button className="primary-link" onClick={() => navigate('products')}>
              Shop Core <ArrowRight size={18} />
            </button>
            <button className="secondary-link" onClick={() => navigate('about')}>About VOID</button>
          </div>
        </div>
        <div className="hero-stats">
          <span><strong>4.7</strong> average rating</span>
          <span><strong>Free</strong> India shipping</span>
          <span><strong>Easy</strong> returns</span>
        </div>
      </section>

      <AboutIntro />
      <FeatureStrip expanded={expanded} setExpanded={setExpanded} />
      <ProductSection
        addToCart={addToCart}
        filteredProducts={filteredProducts.slice(0, 3)}
        heading="VOID Core"
        navigate={navigate}
        showFilters={false}
        title="Featured standards"
      />
      <Manifesto navigate={navigate} />
      <Services />
    </>
  );
}

function ShopPage({ activeCategory, addToCart, filteredProducts, setActiveCategory }) {
  return (
    <PageShell eyebrow="Shop VOID" title="Training pieces for everyday discipline.">
      <ProductSection
        activeCategory={activeCategory}
        addToCart={addToCart}
        filteredProducts={filteredProducts}
        heading="VOID Core"
        navigate={undefined}
        setActiveCategory={setActiveCategory}
        showFilters
        title="Shop the standards"
      />
      <Services />
    </PageShell>
  );
}

function ProductsPage({ activeCategory, addToCart, filteredProducts, navigate, setActiveCategory }) {
  return (
    <PageShell eyebrow="Products" title="Explore every VOID essential.">
      <ProductSection
        activeCategory={activeCategory}
        addToCart={addToCart}
        filteredProducts={filteredProducts}
        heading="Catalog"
        navigate={navigate}
        setActiveCategory={setActiveCategory}
        showFilters
        title="All products"
      />
    </PageShell>
  );
}

function ProductDetailPage({ addToCart, navigate, selectedProduct }) {
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[0]);

  useEffect(() => {
    setSelectedSize(selectedProduct.sizes[0]);
  }, [selectedProduct]);

  return (
    <PageShell eyebrow={selectedProduct.category} title={selectedProduct.name}>
      <section className="product-detail">
        <div className={`product-detail-visual visual-${selectedProduct.id}`} style={productImageStyle(selectedProduct)}>
          <span>{selectedProduct.tag}</span>
        </div>
        <div className="product-detail-copy">
          <p>
            A VOID standard built for repeated training days, daily movement, and the quiet work
            between them.
          </p>
          <div className="rating">Rating {selectedProduct.rating.toFixed(1)} / 5</div>
          <div className="swatches">
            {selectedProduct.colors.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
          <div className="size-row">
            {selectedProduct.sizes.map((size) => (
              <button
                key={size}
                className={selectedSize === size ? 'active' : ''}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="price-row">
            <strong>Rs. {selectedProduct.price.toLocaleString('en-IN')}</strong>
            <del>Rs. {selectedProduct.oldPrice.toLocaleString('en-IN')}</del>
          </div>
          <div className="detail-actions">
            <button className="primary-link" onClick={() => addToCart(selectedProduct, selectedSize)}>
              <ShoppingBag size={18} /> Add to bag
            </button>
            <button className="secondary-dark" onClick={() => navigate('products')}>Back to products</button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SearchPage({ addToCart, navigate, searchQuery, setSearchQuery }) {
  const results = products.filter((product) => {
    const value = `${product.name} ${product.category} ${product.tag}`.toLowerCase();
    return value.includes(searchQuery.toLowerCase());
  });

  return (
    <PageShell eyebrow="Search" title="Find your training standard.">
      <section className="search-page">
        <div className="search-box">
          <Search size={21} />
          <input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search t-shirt, shorts, socks, shaker"
          />
        </div>
        <ProductSection
          addToCart={addToCart}
          filteredProducts={results}
          heading={`${results.length} results`}
          navigate={navigate}
          showFilters={false}
          title={searchQuery ? `Searching "${searchQuery}"` : 'Popular products'}
        />
      </section>
    </PageShell>
  );
}

function AboutPage({ expanded, navigate, setExpanded }) {
  return (
    <>
      <PageHero
        eyebrow="About VOID"
        title="Made for the unseen hours."
        body="VOID is for people who train without spectacle, choose consistency over applause, and understand discipline needs no noise."
        imageClass="photo-two"
      />
      <AboutIntro />
      <FeatureStrip expanded={expanded} setExpanded={setExpanded} />
      <Manifesto navigate={navigate} />
    </>
  );
}

function ContactPage() {
  return (
    <PageShell eyebrow="Contact" title="Need sizing help, orders, or collabs?">
      <section className="contact-grid">
        <div className="contact-card">
          <Mail size={24} />
          <h2>Talk to VOID</h2>
          <p>hello@voidactivewear.com</p>
          <p>+91 9892446741</p>
        </div>
        <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="name">Name</label>
          <input id="name" placeholder="Your name" />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" placeholder="you@example.com" />
          <label htmlFor="message">Message</label>
          <textarea id="message" rows="5" placeholder="How can we help?" />
          <button className="primary-link">Send message</button>
        </form>
      </section>
    </PageShell>
  );
}

function LoginPage({ navigate, setUser, user }) {
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState(demoUser.password);
  const [message, setMessage] = useState('');

  const login = (event) => {
    event.preventDefault();
    if (email === demoUser.email && password === demoUser.password) {
      setUser(demoUser);
      setMessage('');
      navigate('profile');
      return;
    }
    setMessage('Use demo@voidactivewear.com and demo123 for this demo login.');
  };

  if (user) {
    return (
      <PageShell eyebrow="Login" title="You are already signed in.">
        <button className="primary-link" onClick={() => navigate('profile')}>Go to profile</button>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Demo Login" title="Sign in to preview the account experience.">
      <section className="auth-layout">
        <form className="auth-card" onSubmit={login}>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {message && <p className="form-error">{message}</p>}
          <button className="primary-link">Login demo</button>
          <button type="button" className="text-button" onClick={() => navigate('register')}>
            Create a demo account
          </button>
        </form>
        <div className="demo-note">
          <p className="eyebrow">Demo credentials</p>
          <h2>Fast preview, no backend required.</h2>
          <p>Email: demo@voidactivewear.com</p>
          <p>Password: demo123</p>
        </div>
      </section>
    </PageShell>
  );
}

function RegisterPage({ navigate, setUser, user }) {
  const [name, setName] = useState('VOID Member');
  const [email, setEmail] = useState('member@voidactivewear.com');
  const [password, setPassword] = useState('member123');

  const register = (event) => {
    event.preventDefault();
    setUser({ name, email, password });
    navigate('profile');
  };

  if (user) {
    return (
      <PageShell eyebrow="Register" title="You already have an active demo session.">
        <button className="primary-link" onClick={() => navigate('profile')}>Go to profile</button>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Register" title="Create a demo VOID account.">
      <section className="auth-layout">
        <form className="auth-card" onSubmit={register}>
          <label htmlFor="register-name">Name</label>
          <input id="register-name" value={name} onChange={(event) => setName(event.target.value)} />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="primary-link">Register demo</button>
          <button type="button" className="text-button" onClick={() => navigate('login')}>
            Already have an account
          </button>
        </form>
        <div className="demo-note">
          <p className="eyebrow">Demo only</p>
          <h2>Registration stores your profile in app state.</h2>
          <p>No server or database is required for this prototype.</p>
        </div>
      </section>
    </PageShell>
  );
}

function ProfilePage({ navigate, setUser, user }) {
  if (!user) {
    return (
      <PageShell eyebrow="Profile" title="Login to view your demo profile.">
        <div className="auth-actions">
          <button className="primary-link" onClick={() => navigate('login')}>Login demo</button>
          <button className="secondary-dark" onClick={() => navigate('register')}>Register demo</button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Demo Profile" title={`${user.name}'s VOID profile`}>
      <section className="profile-layout">
        <div className="profile-hero-card">
          <div className="profile-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span>Member since May 2026</span>
          </div>
          <button className="secondary-dark">
            <Pencil size={17} /> Edit demo
          </button>
        </div>

        <div className="profile-card">
          <h2>Training Profile</h2>
          <dl>
            <div><dt>Primary use</dt><dd>Strength training</dd></div>
            <div><dt>Preferred fit</dt><dd>Relaxed athletic</dd></div>
            <div><dt>T-shirt size</dt><dd>L</dd></div>
            <div><dt>Shorts size</dt><dd>M</dd></div>
          </dl>
        </div>

        <div className="profile-card">
          <h2>Default Address</h2>
          <p>VOID Demo Member</p>
          <p>Mumbai, Maharashtra</p>
          <p>India - 400001</p>
        </div>

        <div className="profile-card">
          <h2>Preferences</h2>
          <div className="preference-list">
            <span>New drop alerts</span>
            <strong>On</strong>
          </div>
          <div className="preference-list">
            <span>Order updates</span>
            <strong>On</strong>
          </div>
          <div className="preference-list">
            <span>Workout content</span>
            <strong>Off</strong>
          </div>
        </div>

        <div className="profile-card profile-wide">
          <h2>Account Actions</h2>
          <div className="auth-actions">
            <button className="primary-link" onClick={() => navigate('account')}>View demo orders</button>
            <button
              className="secondary-dark"
              onClick={() => {
                setUser(null);
                navigate('home');
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function CartPage({ cart, cartTotal, clearCart, navigate, removeFromCart, updateCartQuantity }) {
  const shipping = cartTotal > 0 ? 0 : 0;
  const grandTotal = cartTotal + shipping;

  return (
    <PageShell eyebrow="Cart" title="Review your VOID bag.">
      <section className="cart-page">
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>Your bag is empty.</h2>
              <p>Add a VOID standard to start checkout.</p>
              <button className="primary-link" onClick={() => navigate('products')}>Shop products</button>
            </div>
          ) : (
            cart.map(({ cartKey, product, quantity, size }) => (
              <article className="cart-row" key={cartKey}>
                <button
                  className={`cart-thumb visual-${product.id}`}
                  style={productImageStyle(product)}
                  onClick={() => navigate('product', product)}
                  aria-label={`View ${product.name}`}
                />
                <div>
                  <p>{product.category}</p>
                  <h2>{product.name}</h2>
                  <small>Size: {size}</small>
                  <span>Rs. {product.price.toLocaleString('en-IN')}</span>
                </div>
                <QuantityControl
                  quantity={quantity}
                  onDecrease={() => updateCartQuantity(cartKey, quantity - 1)}
                  onIncrease={() => updateCartQuantity(cartKey, quantity + 1)}
                />
                <strong>Rs. {(product.price * quantity).toLocaleString('en-IN')}</strong>
                <button className="remove-link" onClick={() => removeFromCart(cartKey)}>Remove</button>
              </article>
            ))
          )}
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <div><span>Subtotal</span><strong>Rs. {cartTotal.toLocaleString('en-IN')}</strong></div>
          <div><span>Shipping</span><strong>{cartTotal > 0 ? 'Free' : 'Rs. 0'}</strong></div>
          <div className="summary-total"><span>Total</span><strong>Rs. {grandTotal.toLocaleString('en-IN')}</strong></div>
          <button className="primary-link" disabled={cart.length === 0}>Demo checkout</button>
          <button className="secondary-dark" onClick={() => navigate('products')}>Continue shopping</button>
          {cart.length > 0 && <button className="remove-link" onClick={clearCart}>Clear cart</button>}
        </aside>
      </section>
    </PageShell>
  );
}

function AccountPage({ cartCount, cartTotal, navigate, setUser, user }) {
  if (!user) {
    return (
      <PageShell eyebrow="Account" title="Login to view your demo account.">
        <button className="primary-link" onClick={() => navigate('login')}>Login demo</button>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="My Account" title={`Welcome back, ${user.name}.`}>
      <section className="account-grid">
        <div className="account-card">
          <h2>Profile</h2>
          <p>{user.email}</p>
          <button className="primary-link" onClick={() => navigate('profile')}>Open profile</button>
          <button
            className="secondary-dark"
            onClick={() => {
              setUser(null);
              navigate('home');
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
        <div className="account-card">
          <h2>Current Bag</h2>
          <p>{cartCount} items selected</p>
          <strong>Rs. {cartTotal.toLocaleString('en-IN')}</strong>
          <button className="primary-link" onClick={() => navigate('cart')}>Open cart</button>
        </div>
        <div className="account-card order-card">
          <h2>Demo Orders</h2>
          <p>#VOID-1024 - Performance T-shirt - Delivered</p>
          <p>#VOID-1025 - Anti-Odour Socks - Processing</p>
        </div>
      </section>
    </PageShell>
  );
}

function PageShell({ body, children, eyebrow, title }) {
  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {body && <p>{body}</p>}
      </section>
      {children}
    </>
  );
}

function PageHero({ body, eyebrow, imageClass, title }) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
      <div className={`page-hero-image ${imageClass}`} />
    </section>
  );
}

function AboutIntro() {
  return (
    <section className="about-section">
      <div>
        <p className="eyebrow">About VOID</p>
        <h2>Made for the unseen hours.</h2>
      </div>
      <div className="about-copy">
        <p>
          VOID is made for people who choose fitness as a daily habit. You do not need to be an
          athlete. You just need to show up.
        </p>
        <p>
          Simple, comfortable gear that works for training and daily life, so your clothes stay out
          of the way and you stay in motion.
        </p>
      </div>
    </section>
  );
}

function FeatureStrip({ expanded, setExpanded }) {
  return (
    <section className="feature-strip">
      <div className="photo-tile photo-one">
      </div>
      <div className="feature-copy">
        <h2>Built for movement. Designed for stillness.</h2>
        <div className="accordion">
          {[
            ['Fit', 'A close athletic fit with enough stretch for lifting, running, and commute days.'],
            ['Fabric', 'Breathable, smooth-touch knits with quick-dry comfort and all-day structure.'],
            ['Care', 'Machine washable pieces made to keep their shape through repeated wear.'],
          ].map(([title, body]) => (
            <button
              key={title}
              className={expanded === title ? 'accordion-item active' : 'accordion-item'}
              onClick={() => setExpanded(expanded === title ? '' : title)}
            >
              <span>
                <strong>{title}</strong>
                {expanded === title && <small>{body}</small>}
              </span>
              {expanded === title ? <Minus size={18} /> : <Plus size={18} />}
            </button>
          ))}
        </div>
      </div>
      <div className="photo-tile photo-two">
      </div>
    </section>
  );
}

function ProductSection({
  activeCategory,
  addToCart,
  filteredProducts,
  heading,
  navigate,
  setActiveCategory,
  showFilters,
  title,
}) {
  const [selectedSizes, setSelectedSizes] = useState({});

  const selectedSizeFor = (product) => selectedSizes[product.id] || product.sizes[0];

  return (
    <section className="shop-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{heading}</p>
          <h2>{title}</h2>
        </div>
        {showFilters && (
          <div className="category-tabs" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <button
              className={`product-visual visual-${product.id}`}
              style={productImageStyle(product)}
              onClick={() => navigate && navigate('product', product)}
              aria-label={`View ${product.name}`}
            >
              <span>{product.tag}</span>
            </button>
            <div className="product-body">
              <div>
                <p>{product.category}</p>
                <button className="product-name" onClick={() => navigate && navigate('product', product)}>
                  <h3>{product.name}</h3>
                </button>
              </div>
              <div className="rating" aria-label={`${product.rating} out of 5`}>
                {'*'.repeat(Math.floor(product.rating))}
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <div className="swatches">
                {product.colors.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="size-row">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={selectedSizeFor(product) === size ? 'active' : ''}
                    onClick={() => setSelectedSizes((sizes) => ({ ...sizes, [product.id]: size }))}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="price-row">
                <strong>Rs. {product.price.toLocaleString('en-IN')}</strong>
                <del>Rs. {product.oldPrice.toLocaleString('en-IN')}</del>
              </div>
              <button className="add-button" onClick={() => addToCart(product, selectedSizeFor(product))}>
                <ShoppingBag size={18} /> Add to bag
              </button>
            </div>
          </article>
        ))}
      </div>
      {filteredProducts.length === 0 && <p className="empty-results">No products found. Try a different search.</p>}
    </section>
  );
}

function Manifesto({ navigate }) {
  return (
    <section className="manifesto">
      <div className="manifesto-image photo-two" />
      <div>
        <p>We do not believe in motivation.</p>
        <h2>We believe in repetition.</h2>
        <span>VOID exists for the people who show up long after motivation fades.</span>
        <button className="primary-link" onClick={() => navigate('products')}>
          Wear The Standards <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="service-row" aria-label="Store benefits">
      {[
        [ShieldCheck, 'Secure Payments', 'Protected checkout for every order.'],
        [Truck, 'Free Shipping', 'Complimentary shipping across India.'],
        [PackageCheck, 'Easy Returns', 'Simple exchanges when the fit changes.'],
        [CreditCard, 'Order Tracking', 'Updates from checkout to doorstep.'],
      ].map(([Icon, title, body]) => (
        <div className="service-item" key={title}>
          <Icon size={22} />
          <strong>{title}</strong>
          <span>{body}</span>
        </div>
      ))}
    </section>
  );
}

function QuantityControl({ onDecrease, onIncrease, quantity }) {
  return (
    <div className="quantity-control" aria-label="Quantity control">
      <button onClick={onDecrease} aria-label="Decrease quantity">
        <Minus size={15} />
      </button>
      <span>{quantity}</span>
      <button onClick={onIncrease} aria-label="Increase quantity">
        <Plus size={15} />
      </button>
    </div>
  );
}

function BagPanel({ cart, cartOpen, cartTotal, clearCart, navigate, removeFromCart, setCartOpen, updateCartQuantity }) {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!cartOpen) {
    return null;
  }

  return (
    <div className="bag-overlay" role="presentation">
      <button className="bag-backdrop" onClick={() => setCartOpen(false)} aria-label="Close cart" />
      <aside className="bag-panel" aria-label="Shopping bag">
        <div className="bag-header">
          <div>
            <strong>Bag</strong>
            <span>{cartCount} items</span>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>
        <div className="bag-items">
          {cart.length === 0 ? (
            <p>Your bag is ready for the first standard.</p>
          ) : (
            cart.map(({ cartKey, product, quantity, size }) => (
              <div className="bag-item" key={cartKey}>
                <div className={`bag-thumb visual-${product.id}`} style={productImageStyle(product)} />
                <div className="bag-copy">
                  <span>{product.name}</span>
                  <small>Size: {size}</small>
                  <small>Rs. {product.price.toLocaleString('en-IN')}</small>
                  <QuantityControl
                    quantity={quantity}
                    onDecrease={() => updateCartQuantity(cartKey, quantity - 1)}
                    onIncrease={() => updateCartQuantity(cartKey, quantity + 1)}
                  />
                </div>
                <button onClick={() => removeFromCart(cartKey)} aria-label={`Remove ${product.name}`}>
                  <X size={15} />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="bag-total">
          <span>Total</span>
          <strong>Rs. {cartTotal.toLocaleString('en-IN')}</strong>
        </div>
        <div className="bag-actions">
          <button
            className="primary-link"
            onClick={() => {
              setCartOpen(false);
              navigate('cart');
            }}
          >
            View cart
          </button>
          <button
            className="secondary-dark"
            onClick={() => {
              setCartOpen(false);
              navigate('products');
            }}
          >
            Shop more
          </button>
          {cart.length > 0 && <button className="remove-link" onClick={clearCart}>Clear cart</button>}
        </div>
      </aside>
    </div>
  );
}

function Footer({ navigate, newsletter, setNewsletter }) {
  return (
    <footer className="footer">
      <div>
        <button className="brand brand-button footer-brand" onClick={() => navigate('home')}>
          <span>VOID</span>
          <small>Activewear</small>
        </button>
        <p>hello@voidactivewear.com</p>
        <p>+91 9892446741</p>
        <div className="socials">
          <a href="https://www.instagram.com/voidactivewear.in/" aria-label="Instagram">IG</a>
          <a href="https://www.linkedin.com/" aria-label="LinkedIn">in</a>
        </div>
      </div>
      <div className="footer-links">
        {[
          ['home', 'Home'],
          ['products', 'Products'],
          ['cart', 'Cart'],
          ['search', 'Search'],
          ['about', 'About Us'],
          ['contact', 'Contact Us'],
          ['register', 'Register'],
          ['profile', 'Profile'],
          ['account', 'My Orders'],
        ].map(([key, label]) => (
          <button onClick={() => navigate(key)} key={key}>{label}</button>
        ))}
      </div>
      <form
        className="newsletter"
        onSubmit={(event) => {
          event.preventDefault();
          setNewsletter('');
        }}
      >
        <label htmlFor="email">Sign up for mail</label>
        <div>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            value={newsletter}
            onChange={(event) => setNewsletter(event.target.value)}
            required
          />
          <button aria-label="Send newsletter signup">
            <Check size={18} />
          </button>
        </div>
      </form>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
