'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, UserCheck, Flame, PlusCircle, CheckCircle2, XCircle } from 'lucide-react';

const BUDGET_RANGES = [
  { label: '₹1 TO ₹500', min: 1, max: 500 },
  { label: '₹500 TO ₹1,000', min: 501, max: 1000 },
  { label: '₹1,000 TO ₹5,000', min: 1001, max: 5000 },
  { label: '₹5,000 TO ₹10,000', min: 5001, max: 10000 },
  { label: 'MORE THAN ₹10,000', min: 10001, max: 999999 },
];

export default function Home() {
  // Auth state
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMethod, setLoginMethod] = useState('');

  // Store data state
  const [activeBudget, setActiveBudget] = useState(null);
  const [listings, setListings] = useState([
    {
      id: 1,
      title: 'Level 71 | Evo MP40 Max | Cobra Bundle',
      price: 2400,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      details: 'Old pass badges, 5 Evo max, Full email access available.',
      credentials: 'sample_ff_email@gmail.com / Pass@12345'
    },
    {
      id: 2,
      title: 'Level 65 | Criminal Red Bundle | Rare ID',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',
      details: 'Old verified ID, Clean Gmail login.',
      credentials: 'sample_gmail2@gmail.com / Pass@98765'
    }
  ]);

  // Admin listing form modal
  const [showListModal, setShowListModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newCreds, setNewCreds] = useState('');

  // Payment checkout flow
  const [selectedID, setSelectedID] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending' | 'approved' | 'rejected'

  // Admin secret toggle
  const enableAdmin = () => {
    const code = prompt('Enter Admin Passcode:');
    if (code === 'xdadmin123') {
      setIsAdmin(true);
      alert('Admin Access Granted!');
    } else {
      alert('Incorrect passcode');
    }
  };

  // Add listing handler
  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newPrice || !newTitle || !newCreds) return alert('Fill required fields');

    const newItem = {
      id: Date.now(),
      title: newTitle,
      price: Number(newPrice),
      image: newImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      details: newDetails,
      credentials: newCreds
    };

    setListings([newItem, ...listings]);
    setShowListModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewImage('');
    setNewDetails('');
    setNewCreds('');
    alert('ID Successfully Listed on Xd Laka Store!');
  };

  // Filter listings
  const filteredListings = activeBudget
    ? listings.filter((item) => item.price >= activeBudget.min && item.price <= activeBudget.max)
    : listings;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h1 className="text-xl font-black tracking-wider text-amber-500">XD LAKA STORE</h1>
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-sm font-bold shadow-md"
            >
              Sign In
            </button>
          ) : (
            <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded-md text-amber-400">
              {user.name}
            </span>
          )}

          {isAdmin ? (
            <button
              onClick={() => setShowListModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> LIST ID
            </button>
          ) : (
            <button
              onClick={enableAdmin}
              className="text-[10px] text-slate-500 underline ml-1"
            >
              Admin?
            </button>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 py-6 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80">
        <span className="text-xs tracking-widest text-amber-500 uppercase font-semibold">100% Verified Accounts</span>
        <h2 className="text-2xl font-black mt-1">BUY FREE FIRE ID</h2>
        <p className="text-xs text-slate-400 mt-1">Instant Delivery | Safe Escrow | Direct Admin Approval</p>
      </section>

      {/* Budget Selector */}
      <section className="px-4 py-5 max-w-2xl mx-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">SELECT YOUR BUDGET</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BUDGET_RANGES.map((b, idx) => {
            const isSelected = activeBudget?.label === b.label;
            return (
              <button
                key={idx}
                onClick={() => setActiveBudget(isSelected ? null : b)}
                className={`py-2.5 px-3 rounded-lg border text-xs font-black transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-[1.02]'
                    : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Listing Feed */}
      <main className="px-4 max-w-2xl mx-auto space-y-4">
        <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
          <span>AVAILABLE IDS ({filteredListings.length})</span>
          {activeBudget && (
            <button onClick={() => setActiveBudget(null)} className="text-xs text-amber-500 underline">
              Show All
            </button>
          )}
        </h3>

        {filteredListings.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-base text-slate-100">{item.title}</h4>
                <div className="text-right">
                  <span className="text-amber-500 font-black text-lg block">₹{item.price}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.details}</p>

              <button
                onClick={() => {
                  setSelectedID(item);
                  setPaymentStatus(null);
                  setUtrInput('');
                }}
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
              >
                PAY ₹{item.price} NOW
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Payment / Checkout Modal */}
      {selectedID && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-amber-400">Scan & Pay ₹{selectedID.price}</h3>
              <button onClick={() => setSelectedID(null)} className="text-slate-400 text-sm">✕ Close</button>
            </div>

            {/* Step 1: Default QR & UTR form */}
            {!paymentStatus && (
              <div className="space-y-4 text-center">
                <div className="bg-white p-3 rounded-xl inline-block shadow-inner">
                  <QRCodeSVG
                    value={`upi://pay?pa=yourupi@bank&pn=Xd+Laka+Store&am=${selectedID.price}&cu=INR&tn=ID_${selectedID.id}`}
                    size={190}
                  />
                </div>
                <p className="text-xs text-slate-400">Scan using PhonePe, Google Pay, or Paytm</p>

                <div className="text-left space-y-1">
                  <label className="text-xs text-slate-300 font-semibold">Enter 12-Digit UTR / Transaction No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 339482910394"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={() => {
                    if (utrInput.length < 8) return alert('Enter valid 12-digit UTR');
                    setPaymentStatus('pending');
                  }}
                  className="w-full bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm mt-2"
                >
                  Submit Payment Verification
                </button>
              </div>
            )}

            {/* Step 2: Verification Screen with Admin Override Demo */}
            {paymentStatus === 'pending' && (
              <div className="text-center py-6 space-y-3">
                <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
                <h4 className="font-bold text-slate-200">Verifying Payment with Admin...</h4>
                <p className="text-xs text-slate-400">
                  UTR: <span className="text-white font-mono">{utrInput}</span> (₹{selectedID.price})
                </p>

                {/* Instant Control Test for Admin */}
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg mt-4 text-left">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Admin Quick Action</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentStatus('approved')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setPaymentStatus('rejected')}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 py-1.5 rounded text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Approved */}
            {paymentStatus === 'approved' && (
              <div className="text-center py-4 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-lg text-emerald-400">Payment Verified ✅</h4>
                <p className="text-xs text-slate-300">Here are your Free Fire ID login details. Please change the password immediately:</p>
                <div className="bg-slate-950 border border-emerald-500/40 p-3 rounded-lg text-left select-all">
                  <p className="text-xs text-slate-400 font-semibold mb-1">GMAIL & PASSWORD:</p>
                  <code className="text-sm text-emerald-300 font-mono break-all">{selectedID.credentials}</code>
                </div>
              </div>
            )}

            {/* Step 4: Rejected */}
            {paymentStatus === 'rejected' && (
              <div className="text-center py-4 space-y-4">
                <XCircle className="w-14 h-14 text-rose-500 mx-auto" />
                <h4 className="font-bold text-lg text-rose-400">Payment False ❌</h4>
                <p className="text-xs text-slate-300">Admin could not verify your transaction. Please double check your UTR or try again.</p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Pay Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Add Listing Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateListing} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-base text-amber-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> LIST FREE FIRE ID (ADMIN ONLY)
            </h3>
            <input
              type="text"
              placeholder="Title (e.g. Level 70, Cobra MP40)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              required
            />
            <input
              type="number"
              placeholder="Price (in INR, e.g. 1500)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              required
            />
            <input
              type="url"
              placeholder="Screenshot Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
            <textarea
              placeholder="Extra details / Bundles / Level..."
              value={newDetails}
              onChange={(e) => setNewDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white h-16"
            />
            <input
              type="text"
              placeholder="Gmail & Password (shown after verified payment)"
              value={newCreds}
              onChange={(e) => setNewCreds(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
              required
            />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs">
                Confirm & List ID
              </button>
              <button
                type="button"
                onClick={() => setShowListModal(false)}
                className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg text-xs"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Login Options Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-center text-base">Sign In to Xd Laka Store</h3>
            <p className="text-xs text-slate-400 text-center mb-2">Choose an option to continue</p>
            
            <button
              onClick={() => {
                setUser({ name: 'Google User' });
                setShowLoginModal(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              Option 1: Continue with Google
            </button>
            
            <button
              onClick={() => {
                setUser({ name: 'Email User' });
                setShowLoginModal(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              Option 2: Sign In via Mail
            </button>
            
            <button
              onClick={() => {
                setUser({ name: 'Mobile User' });
                setShowLoginModal(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              Option 3: Sign In via Mobile Number
            </button>

            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full text-slate-500 text-xs py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
