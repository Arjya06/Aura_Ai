
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { USER_PROFILES, UserProfileKey } from './constants';

const App: React.FC = () => {
  const [currentUserKey, setCurrentUserKey] = useState<UserProfileKey>('userA');
  const [modelStatus, setModelStatus] = useState<'Ready' | 'Training'>('Ready');

  // Simulate periodic model retraining
  useEffect(() => {
    const intervalId = setInterval(() => {
      setModelStatus('Training');
      setTimeout(() => setModelStatus('Ready'), 3000); // Training for 3s
    }, 30000); // Retrain every 30s
    return () => clearInterval(intervalId);
  }, []);

  const handleUserChange = (userKey: UserProfileKey) => {
    setCurrentUserKey(userKey);
  };

  const currentUserProfile = USER_PROFILES[currentUserKey];

  return (
    <div className="min-h-screen bg-sentinel-blue-dark text-sentinel-light-gray font-sans">
      <Header 
        profiles={USER_PROFILES}
        currentUserKey={currentUserKey}
        onUserChange={handleUserChange}
        modelStatus={modelStatus}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard key={currentUserKey} userProfile={currentUserProfile} />
      </main>
       <footer className="text-center p-4 text-sentinel-gray text-xs">
          <p>Sentinel AI Prototype. All data is simulated.</p>
      </footer>
    </div>
  );
};

export default App;
