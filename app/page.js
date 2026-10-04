'use client';
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Flame, Lock, Eye, EyeOff, ShieldCheck, 
  ArrowLeft, CheckCircle2, XCircle, Send, PlusCircle, 
  Tag, Image as ImageIcon 
} from 'lucide-react';

const BUDGET_RANGES = [
  { id: '1-500', label: '1 RS TO 500 RS', min: 1, max: 500 },
  { id: '500-1000', label: '500 RS TO 1000 RS', min: 500, max: 1000 },
  { id: '1000-5000', label: '1000 RS TO 5000 RS', min: 1000, max: 5000 },
  { id: '5000-10000', label: '5000 RS TO 10,000 RS', min: 5000, max: 10000 },
  { id: '10000-plus', label: 'MORE THAN 10,000 RS', min: 10000, max: 9999999 },
];

export default function App() {
  // Navigation: 'home' | 'budget_chart' | 'budget_view' | 'proofs'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedRange, setSelectedRange] = useState(null);

  // Authentication State
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Auth Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');

  // Permanent Storage Lists
  const [listings, setListings] = useState([]);
  const [proofs, setProofs] = useState([]);

  // Admin Listing Modal & Fields (Single Description + Fakemail)
  const [showListModal, setShowListModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFakemail, setNewFakemail] = useState('');
  const [newImageBase64, setNewImageBase64] = useState('');

  // Proof Modal
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofTitle, setProofTitle] = useState('');
  const [proofImageBase64, setProofImageBase64] = useState('');

  // Checkout State
  const [selectedID, setSelectedID] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Load lifetime data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('xd_user');
    const savedAdmin = localStorage.getItem('xd_admin');
    const savedListings = localStorage.getItem('xd_listings');
    const savedProofs = localStorage.getItem('xd_proofs');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAdmin === 'true') setIsAdmin(true);
    if (savedListings) {
      setListings(JSON.parse(savedListings));
    } else {
      const defaultListings = [
        {
          id: 1,
          description: 'Level 72 | Cobra MP40 Max | 5 Evo Weapons | Old Bundles',
          price: 2400,
          fakemail: 'ff_fakemail_player72@fakemail.com / Pass@123',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
          sold: false
        }
      ];
      setListings(defaultListings);
      localStorage.setItem('xd_listings', JSON.stringify(defaultListings));
    }

    if (savedProofs) {
      setProofs(JSON.parse(savedProofs));
    }
  }, []);

  // Mobile image upload handler
  const handleFileUpload = (e, callback) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Auth Handlers
  const handleRegister = (e) => {
    e.preventDefault();
    if (regPass !== regConfirmPass) return alert('Passwords do not match');
    const userData = { username: regUser, email: regEmail, name: `${regFirst} ${regLast}` };
    setUser(userData);
    localStorage.setItem('xd_user', JSON.stringify(userData));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { username: loginEmail.split('@')[0], email: loginEmail, name: loginEmail };
    setUser(userData);
    localStorage.setItem('xd_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('xd_user');
    localStorage.removeItem('xd_admin');
    setCurrentPage('home');
  };

  // Admin PIN Unlocker (Edit PIN here: line 125)
  const toggleAdmin = () => {
    const pin = prompt('Enter Admin PIN:');
    if (pin && pin.trim().toLowerCase() === 'xdadmin123') {
      setIsAdmin(true);
      localStorage.setItem('xd_admin', 'true');
      alert('Admin Access Granted!');
    } else {
      alert('Incorrect PIN');
    }
  };

  // Final Publish from Admin Form or Preview
  const handleConfirmAndPublish = () => {
    if (!newPrice || !newDescription || !newFakemail || !newImageBase64) {
      return alert('Please fill Price, Description, Add Fakemail and choose Photo.');
    }

    const updated = [
      {
        id: Date.now(),
        description: newDescription,
        price: Number(newPrice),
        fakemail: newFakemail,
        image: newImageBase64,
        sold: false
      },
      ...listings
    ];

    setListings(updated);
    localStorage.setItem('xd_listings', JSON.stringify(updated));
    setShowPreviewModal(false);
    setShowListModal(false);
    setNewPrice('');
    setNewDescription('');
    setNewFakemail('');
    setNewImageBase64('');
    alert('ID Successfully Listed on Xd Laka Store!');
  };

  // Toggle Sold Status
  const toggleSoldStatus = (id) => {
    const updated = listings.map((item) => (item.id === id ? { ...item, sold: !item.sold } : item));
    setListings(updated);
    localStorage.setItem('xd_listings', JSON.stringify(updated));
  };

  // Admin Create Proof
  const handleCreateProof = (e) => {
    e.preventDefault();
    if (!proofImageBase64) return alert('Please select proof photo from gallery!');

    const updated = [
      { id: Date.now(), title: proofTitle, image: proofImageBase64, date: new Date().toLocaleDateString() },
      ...proofs
    ];

    setProofs(updated);
    localStorage.setItem('xd_proofs', JSON.stringify(updated));
    setShowProofModal(false);
    setProofTitle('');
    setProofImageBase64('');
    alert('Proof Added Successfully!');
  };

  // 1. GATEKEEPER: Authentication View
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-3">
              <Flame className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-wide">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to your account or create a new one</p>
          </div>

          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => setAuthTab('login')}
              className={`py-2 text-xs font-black rounded-lg transition flex items-center justify-center gap-1.5 ${
                authTab === 'login' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> Login
            </button>
            <button
              onClick={() => setAuthTab('register')}
              className={`py-2 text-xs font-black rounded-lg transition flex items-center justify-center gap-1.5 ${
                authTab === 'register' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Register
            </button>
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Username / Email</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your username or email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="rem" defaultChecked className="rounded accent-red-600" />
                <label htmlFor="rem" className="text-xs text-slate-400">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3 rounded-xl font-black text-sm shadow-lg shadow-red-950 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={regFirst}
                  onChange={(e) => setRegFirst(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={regLast}
                  onChange={(e) => setRegLast(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Choose a unique username"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />

              <input
                type="email"
                required
                placeholder="Enter email address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <input
                type="password"
                required
                placeholder="Confirm your password"
                value={regConfirmPass}
                onChange={(e) => setRegConfirmPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 py-3 rounded-xl font-black text-sm shadow-lg shadow-red-950 flex items-center justify-center gap-2 mt-2"
              >
                <Flame className="w-4 h-4" /> Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 2. MAIN APP PORTAL
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div onClick={() => setCurrentPage('home')} className="flex items-center gap-2 cursor-pointer">
          <Flame className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-lg font-black tracking-wider text-amber-500">XD LAKA STORE</h1>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="text-[10px] bg-red-600 font-black px-2 py-0.5 rounded text-white tracking-widest uppercase">
              ADMIN
            </span>
          ) : (
            <button onClick={toggleAdmin} className="text-[10px] text-slate-500 underline">
              Admin Access
            </button>
          )}

          <button onClick={handleLogout} className="text-xs bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300">
            Sign Out
          </button>
        </div>
      </header>

      {/* PAGE 1: HOME PAGE */}
      {currentPage === 'home' && (
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="text-center py-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              OFFICIAL VERIFIED FF ID MARKETPLACE
            </span>
            <h2 className="text-2xl font-black mt-1">XD LAKA STORE</h2>
            <p className="text-xs text-slate-400 mt-1">Direct Escrow | Instant Credential Delivery</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => setCurrentPage('budget_chart')}
              className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 py-4 rounded-xl font-black text-base shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5" /> BUY FF ID
            </button>

            <button
              onClick={() => setCurrentPage('proofs')}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 py-3.5 rounded-xl font-bold text-sm text-slate-200 flex items-center justify-center gap-2 shadow"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PROOFS ({proofs.length})
            </button>

            <a
              href="https://t.me"
              onClick={(e) => {
                e.preventDefault();
                alert('Opening Customer Care for Telegram Chat ID: 8511350765');
                window.open('https://t.me/xdlakastore', '_blank');
              }}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 py-3.5 rounded-xl font-bold text-sm text-sky-400 flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-4 h-4" /> CUST. CARE (Telegram ID: 8511350765)
            </a>
          </div>

          {isAdmin && (
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ADMIN PANEL ACTIONS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowListModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> LIST NEW ID
                </button>
                <button
                  onClick={() => setShowProofModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> POST PROOF
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PAGE 2: SEPARATE BUDGET CHART PAGE */}
      {currentPage === 'budget_chart' && (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-400 flex items-center gap-1 font-bold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="text-center mb-4">
            <h3 className="text-xl font-black">SELECT YOUR BUDGET</h3>
            <p className="text-xs text-slate-400">Choose a category to view listed accounts</p>
          </div>

          <div className="space-y-2.5">
            {BUDGET_RANGES.map((b) => {
              const count = listings.filter((item) => item.price >= b.min && item.price <= b.max).length;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedRange(b);
                    setCurrentPage('budget_view');
                  }}
                  className="w-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl flex items-center justify-between text-left group transition"
                >
                  <div>
                    <h4 className="font-black text-sm text-slate-200 group-hover:text-amber-400">{b.label}</h4>
                    <span className="text-[10px] text-slate-400">{count} Free Fire IDs Available</span>
                  </div>
                  <Tag className="w-4 h-4 text-slate-500 group-hover:text-amber-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PAGE 3: SEPARATE RANGE SHOWCASE PAGE */}
      {currentPage === 'budget_view' && selectedRange && (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <button
            onClick={() => setCurrentPage('budget_chart')}
            className="text-xs text-slate-400 flex items-center gap-1 font-bold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Budget Chart
          </button>

          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">SHOWCASE</span>
            <h3 className="text-xl font-black">{selectedRange.label}</h3>
          </div>

          <div className="space-y-4">
            {listings
              .filter((item) => item.price >= selectedRange.min && item.price <= selectedRange.max)
              .map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative">
                    <img src={item.image} alt="FF ID Screenshot" className="w-full h-48 object-cover" />
                    {item.sold && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-600 text-white font-black px-4 py-1.5 rounded-lg text-sm tracking-widest uppercase rotate-[-6deg] shadow-2xl">
                          SOLD OUT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-slate-100 flex-1 pr-2">{item.description}</p>
                      <span className="text-amber-400 font-black text-base whitespace-nowrap">₹{item.price}</span>
                    </div>

                    {isAdmin && (
                      <div className="pt-2 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={() => toggleSoldStatus(item.id)}
                          className={`text-[10px] font-black px-3 py-1 rounded-md border ${
                            item.sold 
                              ? 'bg-slate-800 text-slate-300 border-slate-700' 
                              : 'bg-red-950/60 text-red-400 border-red-800'
                          }`}
                        >
                          {item.sold ? 'Mark as Available' : 'Mark as Sold'}
                        </button>
                      </div>
                    )}

                    <button
                      disabled={item.sold}
                      onClick={() => {
                        setSelectedID(item);
                        setPaymentStatus(null);
                        setUtrInput('');
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition mt-2 ${
                        item.sold
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md'
                      }`}
                    >
                      {item.sold ? 'ID SOLD OUT ❌' : `PAY ₹${item.price} NOW`}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* PAGE 4: SEPARATE PROOFS PAGE */}
      {currentPage === 'proofs' && (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-400 flex items-center gap-1 font-bold mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="border-b border-slate-800 pb-3 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">TRANSACTION HISTORY</span>
              <h3 className="text-xl font-black">CUSTOMER PROOFS</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowProofModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>

          <div className="space-y-4">
            {proofs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No proofs uploaded yet.</div>
            ) : (
              proofs.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-3 space-y-2">
                  <img src={p.image} alt="Proof" className="w-full rounded-lg max-h-64 object-cover" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{p.title}</span>
                    <span className="text-[10px] text-slate-500">{p.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADMIN LIST ID MODAL: 1 DESCRIPTION + ADD FAKEMAIL + PREVIEW POPUP */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 space-y-3">
            <h3 className="font-black text-sm text-amber-500">LIST FREE FIRE ID (ADMIN)</h3>
            
            <input
              type="number"
              required
              placeholder="Price in INR (e.g. 1500)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Pick Screenshot From Gallery</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileUpload(e, setNewImageBase64)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-amber-500 file:text-slate-950"
              />
            </div>

            {/* Single Description Box */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Description / Evo Guns / Level info</label>
              <textarea
                placeholder="Level 70, Cobra MP40 Max, Evo AK, Old Bundles, full details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white h-20"
              />
            </div>

            {/* Add Fakemail */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Add Fakemail (Unlocked after payment)</label>
              <input
                type="text"
                required
                placeholder="fakemail@domain.com / SecretPass123"
                value={newFakemail}
                onChange={(e) => setNewFakemail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!newPrice || !newDescription || !newFakemail || !newImageBase64) {
                    return alert('Fill all fields and pick screenshot first to preview');
                  }
                  setShowPreviewModal(true);
                }}
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-xl text-xs"
              >
                👁 Preview Post
              </button>
              <button
                type="button"
                onClick={handleConfirmAndPublish}
                className="flex-1 bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs"
              >
                Confirm & List ID
              </button>
              <button
                type="button"
                onClick={() => setShowListModal(false)}
                className="bg-slate-800 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST PREVIEW POPUP MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-amber-500">POST PREVIEW</span>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 text-xs">✕ Close</button>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <img src={newImageBase64} alt="Preview" className="w-full h-44 object-cover" />
              <div className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-xs text-slate-100">{newDescription}</p>
                  <span className="text-amber-400 font-black text-sm whitespace-nowrap ml-2">₹{newPrice}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-400 font-mono">
                  <span className="text-amber-500 font-bold block">Fakemail (Buyer sees after payment):</span>
                  {newFakemail}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleConfirmAndPublish}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                ✅ Confirm & Publish
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOCKED UPI CHECKOUT MODAL */}
      {selectedID && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-amber-400">Scan & Pay ₹{selectedID.price}</h3>
              <button onClick={() => setSelectedID(null)} className="text-slate-400 text-sm">✕ Close</button>
            </div>

            {!paymentStatus && (
              <div className="space-y-4 text-center">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-xl">
                  <QRCodeSVG
                    value={`upi://pay?pa=7978404391@fam&pn=Xd+Laka+Store&am=${selectedID.price}&cu=INR&tn=XD_ID_${selectedID.id}`}
                    size={200}
                  />
                </div>
                <div className="text-xs text-slate-400">
                  UPI ID: <span className="text-amber-400 font-mono font-bold">7978404391@fam</span>
                </div>

                <div className="text-left space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Enter 12-Digit Payment UTR</label>
                  <input
                    type="text"
                    placeholder="e.g. 439281902812"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  onClick={() => {
                    if (utrInput.trim().length < 8) return alert('Enter valid 12-digit UTR number');
                    setPaymentStatus('pending');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs"
                >
                  Submit Payment Verification
                </button>
              </div>
            )}

            {paymentStatus === 'pending' && (
              <div className="text-center py-6 space-y-3">
                <div className="animate-spin w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full mx-auto" />
                <h4 className="font-bold text-sm text-slate-200">Verifying Payment With Admin...</h4>
                <p className="text-xs text-slate-400">UTR: <span className="text-white font-mono">{utrInput}</span></p>

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl mt-4 text-left">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Admin Approval Action</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentStatus('approved')}
                      className="flex-1 bg-emerald-600 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setPaymentStatus('rejected')}
                      className="flex-1 bg-red-600 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'approved' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-base text-emerald-400">Payment Verified ✅</h4>
                <p className="text-xs text-slate-300">Here are your Free Fire ID Fakemail credentials. Save them immediately:</p>
                <div className="bg-slate-950 border border-emerald-500/40 p-3 rounded-xl text-left select-all">
                  <p className="text-[10px] text-slate-400 font-bold mb-1">FAKEMAIL & PASSWORD:</p>
                  <code className="text-xs text-emerald-300 font-mono break-all">{selectedID.fakemail}</code>
                </div>
              </div>
            )}

            {paymentStatus === 'rejected' && (
              <div className="text-center py-4 space-y-3">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h4 className="font-bold text-base text-red-400">Payment False ❌</h4>
                <p className="text-xs text-slate-300">Admin could not confirm this transaction. Please try again with valid UTR.</p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Pay Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMIN POST PROOF MODAL */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <form onSubmit={handleCreateProof} className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 space-y-3">
            <h3 className="font-black text-sm text-emerald-400">POST NEW PROOF (ADMIN)</h3>
            
            <input
              type="text"
              required
              placeholder="Proof Title (e.g. Sold ₹4500 ID to Rohit)"
              value={proofTitle}
              onChange={(e) => setProofTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">Pick Screenshot From Gallery</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFileUpload(e, setProofImageBase64)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-emerald-500 file:text-slate-950"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-emerald-500 text-slate-950 font-bold py-2 rounded-xl text-xs">
                Publish Proof
              </button>
              <button
                type="button"
                onClick={() => setShowProofModal(false)}
                className="bg-slate-800 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
