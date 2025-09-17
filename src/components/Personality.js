// src/components/Personality.js
import React from 'react';

// Um componente reutilizável para cada caixa de texto
const TraitBox = ({ label, value, name, onUpdate }) => (
  <div className="flex flex-col p-2 border-2 border-black rounded-lg bg-gray-50 h-32">
    <label className="text-center font-bold mb-1 uppercase text-xs">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onUpdate(name, e.target.value)}
      className="w-full h-full text-sm bg-transparent resize-none focus:outline-none focus:bg-gray-200 rounded p-1"
    />
  </div>
);

const Personality = ({ data, onUpdate }) => {
  return (
    <div className="flex flex-col gap-4">
      <TraitBox label="Traços de Personalidade" value={data.personalityTraits} name="personalityTraits" onUpdate={onUpdate} />
      <TraitBox label="Ideais" value={data.ideals} name="ideals" onUpdate={onUpdate} />
      <TraitBox label="Vínculos" value={data.bonds} name="bonds" onUpdate={onUpdate} />
      <TraitBox label="Fraquezas" value={data.flaws} name="flaws" onUpdate={onUpdate} />
    </div>
  );
};

export default Personality;