import { useState, useEffect, useRef, useCallback } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer, useLocalParticipant, useRoomContext } from '@livekit/components-react';
import io from 'socket.io-client';
import '@livekit/components-styles';
import '@livekit/components-styles/index.css';

const SERVER_URL = 'wss://sign-meet-3krlzdb1.livekit.cloud';


function LandingPage({ onLaunch }) {
const [showContactModal, setShowContactModal] = useState(false);
const [contactName, setContactName] = useState('');
const [contactIssue, setContactIssue] = useState('');
const [contactDesc, setContactDesc] = useState('');


const targetEmails = "226m1a4227@bvcr.edu.in,226m1a4262@bvcr.edu.in,226m1a4268@bvcr.edu.in,226m1a4264@bvcr.edu.in";


const teamMembers = [
{
name: "K V V Mahendra",
linkedin: "https://www.linkedin.com/in/kaparapu-veera-venkata-mahendra-97379927a/",
imageUrl: "/images/student1.jpeg"
},
{
name: "T Ganga Shankar",
linkedin: "https://www.linkedin.com/in/ganga-shankar-tata-8a07a7229/",
imageUrl: "/images/student2.png"
},
{
name: "Y Vijay Kumar",
linkedin: "https://www.linkedin.com/in/vijay-kumar-yannamsetti-17979a27a/",
imageUrl: "/images/student3.jpeg"
},
{
name: "T Naresh",
linkedin: "https://www.linkedin.com/in/naresh-thota/",
imageUrl: "/images/student4.png"
}
];



const handleSendEmail = (e) => {
e.preventDefault();
const subject = encodeURIComponent(`Sign-Meet Issue/Suggestion: ${contactIssue}`);
const body = encodeURIComponent(`Name: ${contactName}\n\nMessage:\n${contactDesc}`);
window.location.href = `mailto:${targetEmails}?subject=${subject}&body=${body}`;
setShowContactModal(false);
setContactName(''); setContactIssue(''); setContactDesc('');
};

return (
<div style={{ backgroundColor: '#F8FAFC', color: '#111827', fontFamily: '"Inter", "Poppins", sans-serif', minHeight: '100vh', width: '100vw', overflowX: 'hidden', position: 'absolute', top: 0, left: 0, margin: 0, padding: 0 }}>
{/* Design System & Animations */}
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');


    h1, h2, h3 { font-family: 'Poppins', sans-serif; font-weight: 800; }
    p, span, div, input, textarea, button { font-family: 'Inter', sans-serif; color: '#6B7280'; }
    
    .nav-btn { background: #2563EB; color: white; border-radius: 8px; padding: 12px 24px; border: none; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
    .nav-btn:hover { background: #1D4ED8; transform: scale(1.02); }
    
    .feature-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: all 0.3s ease; text-align: left; }
    .feature-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    
    .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
    
    .team-card { background: white; border-radius: 12px; padding: 25px; text-align: center; transition: all 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; box-sizing: border-box; }
    .team-card:hover { transform: scale(1.03); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    
    .team-image { width: 100%; height: 260px; border-radius: 10px; margin-bottom: 20px; object-fit: cover; background: #E5E7EB; display: flex; align-items: center; justify-content: center; color: #9CA3AF; }
    
    .team-details { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 100%; margin-top: auto; }
    
    .linkedin-btn { display: inline-block; padding: 10px 20px; background-color: #EFF6FF; color: #2563EB; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; transition: all 0.2s; border: none; cursor: pointer; width: 100%; box-sizing: border-box; }
    .linkedin-btn:hover { background-color: #DBEAFE; transform: translateY(-2px); }

    .fade-up { animation: fadeUpAnim 0.8s ease-out forwards; }
    @keyframes fadeUpAnim { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .hero-img-container { transition: all 0.3s ease; border-radius: 20px; }
    .hero-img-container:hover { transform: scale(1.05) translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }

    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease; }
    .modal-content { background: white; padding: 40px; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; }
    .modal-input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #E5E7EB; border-radius: 8px; font-family: 'Inter', sans-serif; box-sizing: border-box; outline: none; transition: border-color 0.2s; font-size: 15px; }
    .modal-input:focus { border-color: #2563EB; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 992px) { .team-grid { grid-template-columns: 1fr 1fr !important; } .hero-row { flex-direction: column; text-align: center; } .hero-row .content { align-items: center !important; text-align: center !important; } }
    @media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr !important; } .team-grid { grid-template-columns: 1fr !important; } .step-container { flex-direction: column; gap: 30px; } }
  `}</style>

  {/* Navbar: Fixed React inline styles (boxShadow instead of box-shadow) */}
  <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 5%', backgroundColor: 'white', position: 'fixed', width: '100%', top: 0, zIndex: 100, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
    <h2 
      onClick={() => window.location.reload()} 
      style={{ margin: 0, color: '#2563EB', fontSize: '26px', fontWeight: '800', cursor: 'pointer' }}
    >
      Sign-Meet
    </h2>
    <div style={{ display: 'flex', alignItems: 'center', gap: '35px' }}>
      <span style={{ cursor: 'pointer', fontWeight: '600', color: '#4B5563' }} onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</span>
      <span style={{ cursor: 'pointer', fontWeight: '600', color: '#4B5563' }} onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Features</span>
      <span style={{ cursor: 'pointer', fontWeight: '600', color: '#4B5563' }} onClick={() => document.getElementById('team').scrollIntoView({ behavior: 'smooth' })}>Team</span>
      <button className="nav-btn" onClick={onLaunch}>Sign-Meet</button>
    </div>
  </nav>

  {/* Hero Section */}
  <section className="fade-up hero-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '160px 5% 100px 5%', maxWidth: '1200px', margin: '0 auto', gap: '60px' }}>
    
    <div className="hero-img-container" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <img 
        src="/images/hero.png" 
        alt="Sign-Meet Hero" 
        style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain', borderRadius: '20px' }}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
      <div style={{ display: 'none', width: '500px', height: '350px', backgroundColor: '#E5E7EB', borderRadius: '20px', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <p>[ Hero Image Placeholder ]</p>
      </div>
    </div>

    <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: '56px', color: '#111827', lineHeight: '1.2', marginBottom: '20px' }}>
        Real Time <br/><span style={{ color: '#2563EB' }}>Sign-Meet</span>
      </h1>
      <p style={{ fontSize: '20px', lineHeight: '1.6', marginBottom: '40px', color: '#4B5563' }}>
        Bridging communication between sign language users and the hearing world using artificial intelligence.
      </p>
      <button className="nav-btn" style={{ padding: '16px 36px', fontSize: '20px' }} onClick={onLaunch}>Try Sign-Meet</button>
    </div>
    
  </section>

  {/* About Section */}
  <section id="about" style={{ backgroundColor: 'white', padding: '80px 5%', textAlign: 'center' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="fade-up">
      <h2 style={{ fontSize: '32px', color: '#111827', marginBottom: '30px' }}>About Sign-Meet</h2>
      <p style={{ fontSize: '18px', lineHeight: '1.8' }}>
        Sign-Meet is an AI powered real-time sign language recognition system that enables seamless communication between sign language users and non-signers. <br/><br/>
        Using deep learning and computer vision technologies, the system detects hand gestures through a webcam and converts them into understandable text in real time.
      </p>
    </div>
  </section>

  {/* Features Section */}
  <section id="features" style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
    <h2 style={{ fontSize: '32px', color: '#111827', marginBottom: '50px' }}>Platform Features</h2>
    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
      <div className="feature-card">
        <h3 style={{ fontSize: '22px', color: '#111827', marginBottom: '15px' }}>⚡ Real-Time Detection</h3>
        <p>Detects sign language gestures instantly using a webcam and converts them into text.</p>
      </div>
      <div className="feature-card">
        <h3 style={{ fontSize: '22px', color: '#111827', marginBottom: '15px' }}>🧠 AI Powered Recognition</h3>
        <p>Built using deep learning models trained on large sign language datasets for accurate gesture recognition.</p>
      </div>
      <div className="feature-card">
        <h3 style={{ fontSize: '22px', color: '#111827', marginBottom: '15px' }}>🌍 Accessible Communication</h3>
        <p>Helps bridge the communication gap between the deaf community and hearing individuals.</p>
      </div>
    </div>
  </section>

  {/* How it Works Section */}
  <section style={{ backgroundColor: 'white', padding: '80px 5%', textAlign: 'center' }}>
    <h2 style={{ fontSize: '32px', color: '#111827', marginBottom: '50px' }}>How It Works</h2>
    <div className="step-container" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#22C55E', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>1</div>
        <h3 style={{ fontSize: '22px', color: '#111827' }}>Open Camera</h3>
        <p>Allow access to your webcam so the system can detect hand gestures.</p>
      </div>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#22C55E', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>2</div>
        <h3 style={{ fontSize: '22px', color: '#111827' }}>Perform Sign Gesture</h3>
        <p>Show the sign language gesture in front of the camera.</p>
      </div>
      <div style={{ flex: 1, padding: '0 20px' }}>
        <div style={{ width: '60px', height: '60px', backgroundColor: '#22C55E', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 20px' }}>3</div>
        <h3 style={{ fontSize: '22px', color: '#111827' }}>Get Instant Translation</h3>
        <p>The AI model detects the gesture and displays the predicted word.</p>
      </div>
    </div>
  </section>

  {/* Redesigned Team Section */}
  <section id="team" style={{ padding: '80px 5%', textAlign: 'center' }}>
    <h2 style={{ fontSize: '32px', color: '#111827', marginBottom: '50px' }}>Meet the Team</h2>
    <div className="team-grid">
      
      {teamMembers.map((member, index) => (
        <div key={index} className="team-card">
          <img 
            src={member.imageUrl} 
            alt={member.name}
            className="team-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="team-image" style={{ display: 'none' }}>
            <p>[ Placeholder ]</p>
          </div>

          <div className="team-details">
            <h3 style={{ fontSize: '21px', color: '#111827', margin: '0 0 15px 0' }}>{member.name}</h3>
            <a href={member.linkedin} target="_blank" rel="noreferrer" className="linkedin-btn">
              LinkedIn Profile
            </a>
          </div>
        </div>
      ))}

    </div>
  </section>

  {/* Footer */}
  <footer style={{ backgroundColor: '#111827', padding: '60px 5%', color: 'white' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid #374151', paddingBottom: '40px', flexWrap: 'wrap', gap: '30px' }}>
      <div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: 'white' }}>Sign-Meet</h2>
        <p style={{ margin: 0, color: '#9CA3AF' }}>AI Powered Sign Language Recognition</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => setShowContactModal(true)} 
          style={{ background: 'transparent', border: '1px solid #4B5563', color: 'white', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', transition: 'border-color 0.2s', fontSize: '15px' }}
          onMouseOver={(e) => e.target.style.borderColor = 'white'}
          onMouseOut={(e) => e.target.style.borderColor = '#4B5563'}
        >
          Contact Us
        </button>
      </div>
    </div>
    <div style={{ textAlign: 'center', paddingTop: '30px', color: '#9CA3AF', fontSize: '14px' }}>
      © 2026 Sign-Meet. All rights reserved. Developed by the Sign-Meet Team.
    </div>
  </footer>

  {/* Contact Form Modal */}
  {showContactModal && (
    <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setShowContactModal(false) }}>
      <div className="modal-content">
        <h3 style={{ margin: '0 0 20px 0', color: '#111827', fontSize: '24px' }}>Contact Team</h3>
        <form onSubmit={handleSendEmail}>
          <input type="text" placeholder="Your Name" required className="modal-input" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <input type="text" placeholder="Issue or Suggestion Subject" required className="modal-input" value={contactIssue} onChange={(e) => setContactIssue(e.target.value)} />
          <textarea placeholder="Description..." required className="modal-input" style={{ height: '120px', resize: 'none' }} value={contactDesc} onChange={(e) => setContactDesc(e.target.value)}></textarea>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setShowContactModal(false)} style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: '12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Send Email</button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>



);
}


function AIBridge({ userName }) {
const room = useRoomContext();
const { localParticipant, isCameraEnabled, isMicrophoneEnabled } = useLocalParticipant();
const videoRef = useRef(null);
const canvasRef = useRef(null);
const socketRef = useRef(null);

const [captions, setCaptions] = useState([]);
const currentVoiceIdRef = useRef(Math.random().toString());

const addCaption = useCallback((id, name, text, type) => {
setCaptions(prev => {
const existingIndex = prev.findIndex(c => c.id === id);
if (existingIndex !== -1) {
const updatedCaptions = [...prev];
updatedCaptions[existingIndex] = { ...updatedCaptions[existingIndex], text, timestamp: Date.now() };
return updatedCaptions;
}
const newCaption = { id, name, text, type, timestamp: Date.now() };
return [...prev, newCaption].slice(-6);
});
}, []);

const broadcastCaption = useCallback((id, text, type) => {
addCaption(id, userName, text, type);
if (room && localParticipant) {
const payload = JSON.stringify({ id, name: userName, text, type });
const data = new TextEncoder().encode(payload);
localParticipant.publishData(data, { reliable: true });
}
}, [userName, room, localParticipant, addCaption]);

useEffect(() => {
if (!room) return;
const handleDataReceived = (payload) => {
try {
const decoded = new TextDecoder().decode(payload);
const parsed = JSON.parse(decoded);
addCaption(parsed.id, parsed.name, parsed.text, parsed.type);
} catch (e) {
console.error("Caption error", e);
}
};
room.on('dataReceived', handleDataReceived);
return () => room.off('dataReceived', handleDataReceived);
}, [room, addCaption]);

useEffect(() => {
const interval = setInterval(() => {
setCaptions(prev => prev.filter(c => Date.now() - c.timestamp < 12000));
}, 1000);
return () => clearInterval(interval);
}, []);

useEffect(() => {
socketRef.current = io('http://localhost:5000');
socketRef.current.on('ai_subtitle', (data) => {
broadcastCaption(Math.random().toString(), data.text, 'sign');
});
return () => { if (socketRef.current) socketRef.current.disconnect(); };
}, [broadcastCaption]);

useEffect(() => {
const cameraPub = Array.from(localParticipant?.videoTrackPublications.values() || []).find(p => p.source === 'camera' || p.source === 1);
const videoTrack = cameraPub?.videoTrack;


if (isCameraEnabled && videoTrack?.mediaStreamTrack && videoRef.current) {
  videoRef.current.srcObject = new MediaStream([videoTrack.mediaStreamTrack]);
} else if (videoRef.current) {
  videoRef.current.srcObject = null;
}



}, [localParticipant, isCameraEnabled, localParticipant?.videoTrackPublications]);

useEffect(() => {
const interval = setInterval(() => {
if (isCameraEnabled && videoRef.current && videoRef.current.readyState >= 2 && canvasRef.current) {
const context = canvasRef.current.getContext('2d');
context.drawImage(videoRef.current, 0, 0, 320, 240);
const frameBase64 = canvasRef.current.toDataURL('image/jpeg', 0.5);
socketRef.current.emit('video_frame', frameBase64);
}
}, 66);
return () => clearInterval(interval);
}, [isCameraEnabled]);

useEffect(() => {
let recognition;
let isStopped = false;


if (isMicrophoneEnabled && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true; 

  recognition.onresult = (event) => {
    let transcript = '';
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) { isFinal = true; }
    }
    if (transcript.trim().length > 0) {
      broadcastCaption(currentVoiceIdRef.current, transcript.trim().toUpperCase(), 'voice');
    }
    if (isFinal) {
      currentVoiceIdRef.current = Math.random().toString(); 
    }
  };

  recognition.onend = () => {
    if (!isStopped) { try { recognition.start(); } catch(e) {} }
  };
  try { recognition.start(); } catch(e) {}
}

return () => { 
  isStopped = true;
  if (recognition) recognition.stop(); 
};




}, [isMicrophoneEnabled]);

return (
<>
<video ref={videoRef} autoPlay muted playsInline style={{ opacity: 0.01, position: 'absolute', width: '320px', height: '240px', zIndex: -10, pointerEvents: 'none' }} />
<canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />

```
  <div style={{ position: 'absolute', bottom: '100px', left: '20px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1000, pointerEvents: 'none', maxWidth: '80%' }}>
    {captions.map(c => (
      <div key={c.id} style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '10px 18px', borderRadius: '12px', color: 'white', fontSize: '18px', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', animation: 'fadeIn 0.3s ease-in-out' }}>
        <span style={{ fontWeight: 'bold', color: c.type === 'sign' ? '#4ade80' : '#3b82f6', marginRight: '8px' }}>{c.name}:</span>
        <span>{c.text} {c.type === 'sign' ? '✋' : '🎤'}</span>
      </div>
    ))}
  </div>
</>



);
}


export default function App() {
const [currentPage, setCurrentPage] = useState('landing');
const [room, setRoom] = useState('');
const [name, setName] = useState('');
const [token, setToken] = useState(null);

async function joinRoom() {
if (!name.trim() || !room.trim()) {
alert("Please enter both your Display Name and the Meeting Room ID.");
return;
}


try {
  const response = await fetch(`http://localhost:3000/getToken?room=${room}&name=${name}`);
  const data = await response.json();
  setToken(data.token);
} catch (e) {
  alert("Could not fetch token. Is the backend server running?");
}



}

if (currentPage === 'landing') {
return <LandingPage onLaunch={() => setCurrentPage('app')} />;
}

if (!token) {
return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: '#F8FAFC', color: '#111827', fontFamily: '"Inter", "Poppins", sans-serif', position: 'absolute', top: 0, left: 0, margin: 0, padding: 0 }}>


    <button onClick={() => setCurrentPage('landing')} style={{ position: 'absolute', top: '30px', left: '30px', background: 'transparent', border: '1px solid #E5E7EB', color: '#4B5563', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }} onMouseOver={(e) => {e.target.style.borderColor='#2563EB'; e.target.style.color='#2563EB'}} onMouseOut={(e) => {e.target.style.borderColor='#E5E7EB'; e.target.style.color='#4B5563'}}>
      ← Back to Home
    </button>

    <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', width: '90%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '800', color: '#2563EB', fontFamily: 'Poppins, sans-serif' }}>Sign-Meet</h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '15px' }}>AI-Powered Accessible Meetings</p>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Display Name" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#111827', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = '#2563EB'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Meeting Room ID" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#111827', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', width: '100%', boxSizing: 'border-box' }} onFocus={(e) => e.target.style.borderColor = '#2563EB'} onBlur={(e) => e.target.style.borderColor = '#E5E7EB'} />
      </div>
      <button onClick={joinRoom} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', transition: 'all 0.2s' }} onMouseOver={(e) => {e.target.style.backgroundColor='#1D4ED8'; e.target.style.transform='scale(1.02)'}} onMouseOut={(e) => {e.target.style.backgroundColor='#2563EB'; e.target.style.transform='scale(1)'}}>
        Join Meeting
      </button>
    </div>
  </div>
);



}

return (
<div style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: '#111', overflow: 'hidden', margin: 0, padding: 0 }}>
<LiveKitRoom video={true} audio={true} token={token} serverUrl={SERVER_URL} data-lk-theme="default" style={{ height: '100%' }} onDisconnected={() => setToken(null)}>
<VideoConference />
<AIBridge userName={name} />
</LiveKitRoom>
</div>
);
}
