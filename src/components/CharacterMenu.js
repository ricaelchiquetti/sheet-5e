// src/components/CharacterMenu.js
import React, { useRef } from 'react';

const CharacterMenu = ({ characters, onCreate, onDelete, onSelect, onExport, onImport }) => {
  const fileInputRef = useRef(null);
  const handleImportClick = () => fileInputRef.current.click();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border-2 border-gray-400 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Meus Personagens</h1>
      <div className="mb-6">
        <button onClick={onCreate} className="w-full bg-red-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-800 transition-colors duration-200 text-lg">
          + Criar Novo Personagem
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={handleImportClick} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Carregar Backup (JSON)
        </button>
        <input type="file" ref={fileInputRef} onChange={onImport} accept=".json" className="hidden" />
        <button onClick={onExport} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
          Salvar Backup (JSON)
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-3 border-b pb-2">Personagens Salvos</h2>
      <div className="space-y-3">
        {characters.length > 0 ? (
          characters.map(char => (
            <div key={char.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex-grow cursor-pointer" onClick={() => onSelect(char.id)}>
                <p className="font-bold text-lg">{char.name || 'Personagem sem nome'}</p>
                <p className="text-sm text-gray-600">{char.class} Nível {char.level} ({char.race})</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onDelete(char.id); }} className="bg-gray-300 hover:bg-red-500 hover:text-white text-gray-800 font-bold p-2 rounded-full transition-colors" aria-label={`Excluir ${char.name}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
              </button>
            </div>
          ))
        ) : (<p className="text-center text-gray-500 py-4">Nenhum personagem criado ainda.</p>)}
      </div>
    </div>
  );
};
export default CharacterMenu;