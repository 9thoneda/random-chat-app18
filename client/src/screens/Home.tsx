import React from 'react';
import { FaMars, FaVenus, FaUsers, FaCrown } from 'react-icons/fa';

const Option = ({ icon, label, desc, selected, premium }: any) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-xl transition-all 
        ${selected ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'}
        ${premium && !selected ? 'opacity-70' : ''}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs">{desc}</p>
        </div>
      </div>
      {premium && <FaCrown className="text-yellow-500 text-sm" />}
    </div>
  );
};

export default function GenderPreference() {
  return (
    <div className="max-w-sm w-full bg-pink-50 rounded-2xl p-4 shadow-md space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-pink-600 text-lg">👤</span>
        <h2 className="font-bold text-sm text-pink-700 flex items-center gap-1">
          Gender Preference <FaCrown className="text-yellow-500 text-xs" />
        </h2>
      </div>

      <Option
        icon={<FaUsers />}
        label="Anyone"
        desc="Connect with all genders"
        selected
        premium={false}
      />

      <Option
        icon={<FaMars />}
        label="Male"
        desc="Connect with males only"
        selected={false}
        premium={true}
      />

      <Option
        icon={<FaVenus />}
        label="Female"
        desc="Connect with females only"
        selected={false}
        premium={true}
      />

      <div className="text-center mt-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl py-3 px-4">
        <p className="text-sm mb-2">🎯 Unlock gender filtering with Premium!</p>
        <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition">
          🔮 Upgrade Now
        </button>
      </div>
    </div>
  );
}
