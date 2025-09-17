// src/components/Inventory.js
import React from 'react';

const MoneyInput = ({ label, value, name, onMoneyChange }) => (
  <div className="flex flex-col items-center p-2 border-2 border-black rounded-lg bg-gray-50">
    <label className="text-xs font-bold uppercase">{label}</label>
    <input 
      type="number"
      value={value}
      onChange={(e) => onMoneyChange(name, parseInt(e.target.value) || 0)}
      className="w-full text-center font-bold text-lg bg-transparent focus:outline-none"
    />
  </div>
);

const Inventory = ({ money, equipment, onUpdate }) => {
  const handleMoneyChange = (coin, value) => {
    const newMoney = { ...money, [coin]: value };
    onUpdate('money', newMoney);
  };

  const handleEquipmentChange = (index, field, value) => {
    const newEquipment = [...equipment];
    newEquipment[index] = { ...newEquipment[index], [field]: value };
    onUpdate('equipment', newEquipment);
  };

  const handleAddItem = () => {
    const newItem = { id: Date.now(), name: 'Novo item', quantity: 1, weight: 0 };
    const newEquipment = [...(equipment || []), newItem];
    onUpdate('equipment', newEquipment);
  };

  const handleRemoveItem = (index) => {
    const newEquipment = equipment.filter((_, i) => i !== index);
    onUpdate('equipment', newEquipment);
  };

  const totalWeight = (equipment || []).reduce((sum, item) => sum + ((item.weight || 0) * (item.quantity || 0)), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 flex flex-col gap-6">
        <div className="p-3 border-2 border-black rounded-lg">
          <h3 className="text-center font-bold mb-2 uppercase text-sm">Dinheiro</h3>
          <div className="grid grid-cols-5 gap-2">
            <MoneyInput label="PC" value={money.cp} name="cp" onMoneyChange={handleMoneyChange} />
            <MoneyInput label="PP" value={money.sp} name="sp" onMoneyChange={handleMoneyChange} />
            <MoneyInput label="PE" value={money.ep} name="ep" onMoneyChange={handleMoneyChange} />
            <MoneyInput label="PO" value={money.gp} name="gp" onMoneyChange={handleMoneyChange} />
            <MoneyInput label="PL" value={money.pp} name="pp" onMoneyChange={handleMoneyChange} />
          </div>
        </div>

        <div className="p-3 border-2 border-black rounded-lg">
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="font-bold uppercase text-sm">Equipamento</h3>
            <div className="text-xs font-bold">PESO TOTAL: {totalWeight.toFixed(2)} kg</div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 font-bold text-xs uppercase">
              <div className="col-span-1 text-center">Qtd.</div>
              <div className="col-span-7">Nome</div>
              <div className="col-span-2 text-center">Peso (un.)</div>
              <div className="col-span-2"></div>
            </div>
            {(equipment || []).map((item, index) => (
              <div key={item.id || index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-1">
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleEquipmentChange(index, 'quantity', parseInt(e.target.value) || 0)} 
                    className="w-full text-center bg-gray-100 rounded" 
                  />
                </div>
                <div className="col-span-7">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)} 
                    className="w-full bg-gray-100 rounded px-2 py-1" 
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={item.weight || 0} 
                    onChange={(e) => handleEquipmentChange(index, 'weight', parseFloat(e.target.value) || 0)} 
                    className="w-full text-center bg-gray-100 rounded" 
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button onClick={() => handleRemoveItem(index)} className="bg-red-600 text-white font-bold py-1 px-2 rounded hover:bg-red-700">X</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleAddItem} className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">+ Adicionar Item</button>
        </div>
      </div>
      <div className="md:col-span-1 p-3 border-2 border-black rounded-lg">
        <h3 className="text-center font-bold mb-2 uppercase text-sm">Tesouros</h3>
        <textarea className="w-full h-64 bg-gray-50 rounded p-2 text-sm" placeholder="Liste aqui gemas, obras de arte e outros tesouros..."></textarea>
      </div>
    </div>
  );
};

export default Inventory;