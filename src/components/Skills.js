// src/components/Skills.js
import React from 'react';

const skillTranslations = { /* ... */ };

const Skills = ({ proficiencies, expertise, modifiers, proficiencyBonus, skillList, onProficiencyChange, onExpertiseChange }) => (
  <div className="p-3 border-2 border-black rounded-lg">
    <h3 className="text-center font-bold mb-2 uppercase text-sm">Perícias</h3>
    <ul className="space-y-1 text-xs">
      {Object.entries(skillList).map(([skill, ability]) => {
        const isProficient = !!proficiencies[skill];
        const isExpert = !!expertise[skill];
        let total = modifiers[ability];
        if (isProficient) {
          total += proficiencyBonus;
        }
        if (isExpert) {
          total += proficiencyBonus; // Adiciona o bônus de novo para a especialização
        }
        
        return (
          <li key={skill} className="grid grid-cols-12 items-center gap-2">
            <input 
              type="checkbox" 
              title="Proficiência"
              checked={isProficient} 
              onChange={() => onProficiencyChange(skill)} 
              className="form-checkbox h-3 w-3 rounded-full text-black border-2 border-black focus:ring-0 col-span-1" 
            />
            <input 
              type="checkbox"
              title="Especialização (Expertise)"
              checked={isExpert}
              onChange={() => onExpertiseChange(skill)}
              disabled={!isProficient} // Só pode ter expertise se for proficiente
              className="form-checkbox h-3 w-3 rounded-sm text-yellow-500 border-2 border-black focus:ring-0 col-span-1 disabled:bg-gray-300"
            />
            <span className="font-bold border-b border-gray-400 w-full text-center col-span-1">{total >= 0 ? '+' : ''}{total}</span>
            <span className="capitalize col-span-9">{skillTranslations[skill]} <span className="text-gray-400">({ability.slice(0, 3).toUpperCase()})</span></span>
          </li>
        );
      })}
    </ul>
  </div>
);
// Cole o objeto skillTranslations aqui
skillTranslations.Acrobatics='Acrobacia';skillTranslations['Animal Handling']='Adestrar Animais';skillTranslations.Arcana='Arcanismo';skillTranslations.Athletics='Atletismo';skillTranslations.Deception='Enganação';skillTranslations.History='História';skillTranslations.Insight='Intuição';skillTranslations.Intimidation='Intimidação';skillTranslations.Investigation='Investigação';skillTranslations.Medicine='Medicina';skillTranslations.Nature='Natureza';skillTranslations.Perception='Percepção';skillTranslations.Performance='Atuação';skillTranslations.Persuasion='Persuasão';skillTranslations.Religion='Religião';skillTranslations['Sleight of Hand']='Prestidigitação';skillTranslations.Stealth='Furtividade';skillTranslations.Survival='Sobrevivência';

export default Skills;