// src/components/ProficiencyBonus.js
import React from 'react';

const ProficiencyBonus = ({ bonus }) => (
  <div className="flex items-center gap-2 border-2 border-black rounded-lg p-2">
    <span className="text-2xl font-bold">+{bonus}</span>
    <span className="text-xs uppercase font-bold leading-tight">Bônus de Proficiência</span>
  </div>
);

export default ProficiencyBonus;