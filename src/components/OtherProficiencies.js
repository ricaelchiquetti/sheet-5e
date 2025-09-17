// src/components/OtherProficiencies.js
import React from 'react';

const OtherProficiencies = ({ value, onUpdate }) => {
  return (
    <div className="p-2 border-2 border-black rounded-lg bg-gray-50 h-full flex flex-col">
      <h3 className="text-center font-bold mb-1 uppercase text-sm flex-shrink-0">Outras Proficiências & Idiomas</h3>
      <textarea 
        value={value}
        onChange={(e) => onUpdate('otherProficiencies', e.target.value)}
        className="w-full flex-grow text-sm bg-transparent resize-none focus:outline-none focus:bg-gray-200 rounded p-1"
        placeholder={
`Proficiências com Armas...
Proficiências com Armaduras...
Proficiências com Ferramentas...
Idiomas...`
        }
      />
    </div>
  );
};

export default OtherProficiencies;