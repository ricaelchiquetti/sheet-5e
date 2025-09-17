// src/components/CombatStats.js
import React from 'react';

// Sub-componente para os campos de AC, Iniciativa e Deslocamento
const StatInputBox = ({ label, value, name, onUpdate, isCalculated = false }) => (
    <div className="flex flex-col items-center justify-center p-2 border-2 border-black rounded-lg bg-gray-50 h-full">
        <input
          type="number"
          value={value}
          name={name}
          onChange={(e) => onUpdate(name, e.target.value)}
          disabled={isCalculated}
          className="w-full text-2xl font-bold text-center bg-transparent focus:outline-none focus:bg-gray-100 rounded disabled:bg-transparent"
        />
        <label className="text-xs uppercase font-bold text-center">{label}</label>
    </div>
);

// Sub-componente para os Testes contra a Morte
const DeathSaves = ({ successes, failures, onUpdate }) => {
    const renderChecks = (type, count) => {
        let checks = [];
        for (let i = 0; i < 3; i++) {
            checks.push(
                <input 
                    key={i} 
                    type="checkbox" 
                    checked={i < count} 
                    onChange={() => onUpdate(type, i < count ? i : i + 1)}
                    className="form-checkbox h-4 w-4 rounded-full text-black border-2 border-black focus:ring-0"
                />
            );
        }
        return checks;
    };

    return (
        <div className="p-2 border-2 border-black rounded-lg">
            <div className="flex justify-between items-center">
                <span className="font-bold text-sm">Sucessos</span>
                <div className="flex gap-1">{renderChecks('successes', successes)}</div>
            </div>
            <div className="flex justify-between items-center mt-1">
                <span className="font-bold text-sm">Falhas</span>
                <div className="flex gap-1">{renderChecks('failures', failures)}</div>
            </div>
            <h3 className="text-center font-bold mt-2 uppercase text-xs">Testes Contra a Morte</h3>
        </div>
    );
};

// Sub-componente para os Dados de Vida
const HitDice = ({ hitDice, onUpdate }) => (
    <div className="p-2 border-2 border-black rounded-lg">
        <div className="flex items-center gap-2">
            <div className="flex flex-col w-1/2">
                <span className="w-full text-center p-1 font-bold">Total: {hitDice.total || 1}d{hitDice.type || 10}</span>
            </div>
            <div className="flex flex-col w-1/2">
                <input
                    type="number"
                    value={hitDice.current}
                    onChange={(e) => onUpdate('current', e.target.value)}
                    className="w-full text-2xl font-bold text-center bg-transparent border-b-2 border-gray-400 focus:outline-none"
                />
            </div>
        </div>
        <h3 className="text-center font-bold mt-2 uppercase text-xs">Dados de Vida</h3>
    </div>
);

// Sub-componente para os Pontos de Vida
const HpBox = ({ hp, onHpChange }) => (
    <div className="p-3 border-2 border-black rounded-lg w-full">
        <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold">Pontos de Vida Atuais</label>
            <div className="text-xs">
                PV Máx:
                <input 
                    type="number" 
                    value={hp.max} 
                    onChange={(e) => onHpChange('maxHp', e.target.value)} 
                    className="w-12 text-center bg-gray-100 rounded" 
                />
            </div>
        </div>
        <input 
            type="number" 
            value={hp.current} 
            onChange={(e) => onHpChange('currentHp', e.target.value)} 
            className="w-full text-4xl text-center font-bold bg-transparent focus:outline-none" 
        />
        <div className="mt-2">
            <label className="text-xs font-bold">Pontos de Vida Temporários</label>
            <input 
                type="number" 
                value={hp.temp} 
                onChange={(e) => onHpChange('tempHp', e.target.value)} 
                className="w-full text-xl text-center font-bold bg-gray-100 rounded focus:outline-none" 
            />
        </div>
    </div>
);

// Componente principal que une tudo
const CombatStats = ({ stats, hp, hitDice, deathSaves, onUpdate }) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-3 gap-2">
      <StatInputBox label="Classe de Armadura" value={stats.ac} name="armorClass" onUpdate={onUpdate} />
      <StatInputBox label="Iniciativa" value={stats.initiative >= 0 ? `+${stats.initiative}` : stats.initiative} name="initiative" onUpdate={() => {}} isCalculated={true} />
      <StatInputBox label="Deslocamento" value={stats.speed} name="speed" onUpdate={onUpdate} />
    </div>
    <HpBox hp={hp} onHpChange={(field, value) => onUpdate(field, value)} />
    <div className="grid grid-cols-2 gap-2">
        <HitDice 
            hitDice={hitDice} 
            onUpdate={(field, value) => onUpdate('hitDice', {...hitDice, [field]: value})} 
        />
        <DeathSaves 
            successes={deathSaves.successes} 
            failures={deathSaves.failures} 
            onUpdate={(field, value) => onUpdate('deathSaves', {...deathSaves, [field]: value})} 
        />
    </div>
  </div>
);

export default CombatStats;