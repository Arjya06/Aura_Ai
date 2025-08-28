
import React from 'react';
import { UserProfile } from '../constants';

interface BaselineModalProps {
  userProfile: UserProfile;
  onClose: () => void;
}

const BaselineItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 px-4 bg-sentinel-blue-deep rounded-md">
        <span className="text-sm text-sentinel-gray">{label}</span>
        <span className="font-mono text-base text-sentinel-light-gray">{value}</span>
    </div>
);

const BaselineModal: React.FC<BaselineModalProps> = ({ userProfile, onClose }) => {
  const { normalRanges } = userProfile;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-sentinel-blue-light border border-sentinel-cyan/50 rounded-lg shadow-xl p-8 max-w-lg w-full transform transition-all animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
            <div>
                 <h2 className="text-xl font-bold text-sentinel-cyan">{userProfile.name}</h2>
                 <p className="text-sm text-sentinel-gray">{userProfile.description}</p>
            </div>
          <button onClick={onClose} className="text-2xl text-sentinel-gray hover:text-white">&times;</button>
        </div>
        
        <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-sentinel-light-gray mb-2">Behavioral Baseline</h3>
            <BaselineItem label="Normal Typing Speed" value={`${normalRanges.typingSpeed.min}-${normalRanges.typingSpeed.max} cps`} />
            <BaselineItem label="Normal Error Rate" value={`${normalRanges.errorRate.min}-${normalRanges.errorRate.max} bks/evt`} />
            <BaselineItem label="Normal Mouse Speed" value={`${normalRanges.mouseSpeed.min}-${normalRanges.mouseSpeed.max} px/s`} />
            <BaselineItem label="Normal Mouse Hesitation" value={`${normalRanges.mouseHesitation.min}-${normalRanges.mouseHesitation.max} stops`} />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="bg-sentinel-cyan hover:bg-opacity-80 text-sentinel-blue-deep font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default BaselineModal;
