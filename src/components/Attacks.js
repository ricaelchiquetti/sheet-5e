// src/components/Attacks.js
import React from 'react';

const Attacks = () => {
  const attackRow = (
    <div className="grid grid-cols-3 gap-x-2 border-b border-gray-300 py-1">
      <input type="text" className="bg-gray-100 rounded text-center text-sm p-1" placeholder="Nome" />
      <input type="text" className="bg-gray-100 rounded text-center text-sm p-1" placeholder="Bônus" />
      <input type="text" className="bg-gray-100 rounded text-center text-sm p-1" placeholder="Dano/Tipo" />
    </div>
  );

  return (
    <div className="p-2 border-2 border-black rounded-lg h-full flex flex-col">
      <div className="grid grid-cols-3 gap-x-2 text-center font-bold text-xs uppercase mb-2">
        <span>Nome</span>
        <span>Bônus de ATQ</span>
        <span>Dano / Tipo</span>
      </div>
      <div className="space-y-2 mb-2">
        {attackRow}
        {attackRow}
        {attackRow}
      </div>
      <textarea 
        className="w-full flex-grow text-sm bg-transparent resize-none focus:outline-none focus:bg-gray-100 rounded p-2"
        placeholder="Ataques e outras ações que podem ser feitas no seu turno..."
      ></textarea>
      <h3 className="text-center font-bold mt-2 uppercase text-xs">Ataques & Conjuração</h3>
    </div>
  );
};

export default Attacks;