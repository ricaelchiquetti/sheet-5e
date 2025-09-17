// src/components/AbilityScores.js
import React from 'react';

const AbilityScore = ({ name, score, modifier, onScoreChange }) => (
  <div className="flex flex-col items-center border-2 border-black rounded-lg p-2 bg-gray-50">
    <label className="text-sm font-bold uppercase">{name}</label>
    <input 
      type="number" 
      value={score} 
      onChange={(e) => onScoreChange(name.toLowerCase(), e.target.value)} 
      className="text-4xl font-bold my-1 w-20 text-center bg-transparent focus:outline-none focus:bg-gray-200 rounded" 
    />
    <div className="border-t-2 border-black w-full text-center mt-1 pt-1">
      <span className="text-xl">{modifier >= 0 ? '+' : ''}{modifier}</span>
    </div>
  </div>
);

const AbilityScores = ({ scores, modifiers, onScoreChange }) => (
  <div className="grid grid-cols-1 gap-4">
    {Object.keys(scores).map(key => 
      <AbilityScore 
        key={key} 
        name={key.charAt(0).toUpperCase() + key.slice(1)} 
        score={scores[key]} 
        modifier={modifiers[key]} 
        onScoreChange={onScoreChange} 
      />
    )}
  </div>
);

export default AbilityScores;