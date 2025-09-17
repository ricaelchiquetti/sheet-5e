// src/components/PassivePerception.js
import React from 'react';

const PassivePerception = ({ value }) => (
  <div className="flex items-center gap-2 border-2 border-black rounded-lg p-2">
    <span className="text-2xl font-bold">{value}</span>
    <span className="text-xs uppercase font-bold leading-tight">Sabedoria Passiva (Percepção)</span>
  </div>
);

export default PassivePerception;