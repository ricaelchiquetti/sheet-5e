// src/components/CharacterInfo.js
import React from 'react';

const InfoField = ({ label, value, name, onStatChange, className = '' }) => (
  <div className={`flex flex-col ${className}`}>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onStatChange(name, e.target.value)} 
      className="border-b-2 border-gray-300 bg-transparent text-center focus:outline-none focus:border-black" 
    />
    <label className="text-xs uppercase text-gray-500 mt-1 text-center font-bold">{label}</label>
  </div>
);

const CharacterInfo = ({ data, onStatChange }) => (
  <div className="grid grid-cols-3 gap-x-4 p-2 rounded-lg border-2 border-gray-400">
    <InfoField className="col-span-1" label="Nome" value={data.name} name="name" onStatChange={onStatChange}  />
    <InfoField className="col-span-1" label="Classe & Nível" value={data.class} name="class" onStatChange={onStatChange}  />
    <InfoField className="col-span-1" label="Antecedente" value={data.background} name="background" onStatChange={onStatChange} />
    <InfoField className="col-span-1" label="Raça" value={data.race} name="race" onStatChange={onStatChange} />
    <InfoField className="col-span-1" label="Alinhamento" value={data.alignment} name="alignment" onStatChange={onStatChange} />
    <InfoField className="col-span-1" label="Experiência" value={data.experience} name="experience" onStatChange={onStatChange} />
  </div>
);

export default CharacterInfo;