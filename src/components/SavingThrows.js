// src/components/SavingThrows.js
import React from 'react';

const ABILITIES = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
const abilityTranslations = {
    strength: 'Força', dexterity: 'Destreza', constitution: 'Constituição',
    intelligence: 'Inteligência', wisdom: 'Sabedoria', charisma: 'Carisma'
};

const SavingThrows = ({ proficiencies, modifiers, proficiencyBonus, onProficiencyChange }) => (
  <div className="p-3 border-2 border-black rounded-lg">
    <h3 className="text-center font-bold mb-2 uppercase text-sm">Testes de Resistência</h3>
    <ul className="space-y-2">
      {ABILITIES.map(ability => {
        const total = modifiers[ability] + (proficiencies[ability] ? proficiencyBonus : 0);
        return (
          <li key={ability} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={!!proficiencies[ability]} 
              onChange={() => onProficiencyChange(ability)} 
              className="form-checkbox h-4 w-4 rounded-full text-black border-2 border-black focus:ring-0" 
            />
            <span className="font-bold border-b border-gray-400 w-6 text-center">{total >= 0 ? '+' : ''}{total}</span>
            <span className="capitalize text-sm">{abilityTranslations[ability]}</span>
          </li>
        );
      })}
    </ul>
  </div>
);

export default SavingThrows;