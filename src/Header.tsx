
import React from 'react';
import { UserProfile, UserProfileKey } from '../constants';

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 107.5 0v3h-7.5v-3z"
      clipRule="evenodd"
    />
  </svg>
);

interface HeaderProps {
    profiles: Record<UserProfileKey, UserProfile>;
    currentUserKey: UserProfileKey;
    onUserChange: (userKey: UserProfileKey) => void;
    modelStatus: 'Ready' | 'Training';
}

const Header: React.FC<HeaderProps> = ({ profiles, currentUserKey, onUserChange, modelStatus }) => {
  return (
    <header className="p-4 sm:p-6 border-b border-sentinel-blue-light">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <ShieldIcon className="w-8 h-8 text-sentinel-cyan" />
            <div>
                 <h1 className="text-xl sm:text-2xl font-bold text-sentinel-light-gray">Sentinel AI</h1>
                 <p className="text-xs sm:text-sm text-sentinel-gray">Emotion & Context-Aware Anomaly Detection</p>
            </div>
        </div>

        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
                <label htmlFor="user-select" className="text-sm text-sentinel-gray">Profile:</label>
                <select 
                    id="user-select"
                    value={currentUserKey}
                    onChange={(e) => onUserChange(e.target.value as UserProfileKey)}
                    className="bg-sentinel-blue-light border border-sentinel-blue-deep text-sentinel-light-gray text-sm rounded-md focus:ring-sentinel-cyan focus:border-sentinel-cyan block w-full p-1.5"
                >
                    {Object.entries(profiles).map(([key, profile]) => (
                        <option key={key} value={key}>{profile.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center space-x-2">
                 <div className={`w-3 h-3 rounded-full ${modelStatus === 'Ready' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                 <span className="text-sentinel-gray font-medium text-sm">
                    Model: {modelStatus}
                </span>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
