// src/components/Spells.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const customModalStyles = {
    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', border: '2px solid black', borderRadius: '10px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#fdf9e4' },
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
};
Modal.setAppElement('#root');

const emptySpell = { name: '', level: 0, school: '', casting_time: '1 Ação', range: '', components: [], duration: '', description: '', at_higher_levels: '' };

const SpellcastingHeader = ({ ability, saveDC, attackBonus, onAbilityChange }) => (
    <div className="grid grid-cols-3 gap-2 p-2 border-2 border-black rounded-lg mb-4">
        <div className="flex flex-col items-center">
            <select value={ability} onChange={onAbilityChange} className="font-bold text-center bg-gray-100 rounded w-full p-2">
                <option value="intelligence">Inteligência</option>
                <option value="wisdom">Sabedoria</option>
                <option value="charisma">Carisma</option>
            </select>
            <label className="text-xs uppercase font-bold mt-1">Atributo Chave</label>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded"><span className="font-bold text-2xl">{saveDC}</span><label className="text-xs uppercase font-bold">CD da Magia</label></div>
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded"><span className="font-bold text-2xl">+{attackBonus}</span><label className="text-xs uppercase font-bold">Bônus de Ataque</label></div>
    </div>
);

const SpellLevelBlock = ({ level, slots, spells, spellbook, onUpdateSlots, onAddSpell, onRemoveSpell, onShowDetails }) => {
    const levelLabel = level === 0 ? "Truques (Nível 0)" : `Magias de Nível ${level}`;
    const knownSpellIds = spells.map(s => s.id);
    const availableSpellsToAdd = spellbook.filter(spell => spell.level === level && !knownSpellIds.includes(spell.id));
    return (
        <div className="mb-4 p-2 border-2 border-black rounded-lg">
            <div className="flex justify-between items-center mb-2 flex-wrap">
                <h4 className="font-bold text-lg">{levelLabel}</h4>
                {level > 0 && (
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold">Espaços</label>
                        <input type="number" value={slots.total} onChange={(e) => onUpdateSlots('total', e.target.value)} className="w-12 text-center bg-gray-100 rounded" />
                        <label className="text-xs font-bold">Gastos</label>
                        <input type="number" value={slots.used} onChange={(e) => onUpdateSlots('used', e.target.value)} className="w-12 text-center bg-gray-100 rounded" />
                    </div>
                )}
            </div>
            <div className="space-y-1 min-h-[2rem]">
                {spells.map(spell => (
                    <div key={spell.id} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                        <span className="cursor-pointer hover:text-red-700 font-semibold" onClick={() => onShowDetails(spell.id)}>{spell.name}</span>
                        <button onClick={() => onRemoveSpell(spell.id)} className="text-red-600 font-bold px-2 text-lg"> &times; </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Spells = ({ characterData, spellbook, onUpdate, proficiencyBonus, abilityModifiers, onAddNewSpellToBook, onUpdateSpellInBook }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSpell, setSelectedSpell] = useState(null);
    const [newSpellModalIsOpen, setNewSpellModalIsOpen] = useState(false);
    const [newSpellData, setNewSpellData] = useState(emptySpell);
    const [editingSpellId, setEditingSpellId] = useState(null);

    const spellcastingModifier = abilityModifiers[characterData.spellcastingAbility] || 0;
    const spellSaveDC = 8 + proficiencyBonus + spellcastingModifier;
    const spellAttackBonus = proficiencyBonus + spellcastingModifier;

    const openModal = (spellId) => {
        const spellDetails = spellbook.find(spell => spell.id === spellId);
        if (spellDetails) { setSelectedSpell(spellDetails); setModalIsOpen(true); }
    };
    const closeModal = () => setModalIsOpen(false);

    const openNewSpellModal = (spellToEdit = null) => {
        if (spellToEdit) {
            setEditingSpellId(spellToEdit.id);
            setNewSpellData(spellToEdit);
        } else {
            setEditingSpellId(null);
            setNewSpellData(emptySpell);
        }
        setNewSpellModalIsOpen(true);
    };
    const closeNewSpellModal = () => { setNewSpellModalIsOpen(false); setEditingSpellId(null); setNewSpellData(emptySpell); };

    const handleNewSpellChange = (field, value) => {
        if (field === "components") {
            const componentsArray = value.split(',').map(s => s.trim());
            setNewSpellData(prev => ({ ...prev, components: componentsArray }));
        } else {
            setNewSpellData(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const handleSaveNewSpell = () => {
        if (!newSpellData.name) {
            alert("O nome da magia é obrigatório!");
            return;
        }

        if (editingSpellId) {
            const success = onUpdateSpellInBook(editingSpellId, newSpellData);
            if (success) {
                closeNewSpellModal();
            }
        } else {
            // AQUI ESTÁ A CORREÇÃO
            const newlyCreatedSpell = onAddNewSpellToBook(newSpellData);
            if (newlyCreatedSpell) {
                // Se a magia foi criada com sucesso, adicione-a ao personagem
                handleAddSpell(newlyCreatedSpell.id);
                closeNewSpellModal();
            }
        }
    };

    const handleAddSpell = (spellId) => {
        if (spellId && !(characterData.spells || []).includes(spellId)) {
            onUpdate('spells', [...(characterData.spells || []), spellId]);
        }
    };

    const handleRemoveSpell = (spellId) => {
        onUpdate('spells', (characterData.spells || []).filter(id => id !== spellId));
    };

    const handleUpdateSlots = (level, field, value) => {
        const levelKey = `level${level}`;
        const newSlots = { ...characterData.spellSlots, [levelKey]: { ...characterData.spellSlots[levelKey], [field]: parseInt(value) || 0 } };
        onUpdate('spellSlots', newSlots);
    };

    return (
        <div>
            <SpellcastingHeader ability={characterData.spellcastingAbility} saveDC={spellSaveDC} attackBonus={spellAttackBonus} onAbilityChange={(e) => onUpdate('spellcastingAbility', e.target.value)} />
            
            <div className="text-center mb-4">
                <button onClick={() => openNewSpellModal()} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    + Criar Nova Magia
                </button>
            </div>

            {Array.from({ length: 10 }, (_, i) => i).map(level => {
                const spellsOfLevel = (characterData.spells || [])
                    .map(id => spellbook.find(s => s.id === id))
                    .filter(spell => spell && spell.level === level);

                return (
                    <SpellLevelBlock
                        key={level}
                        level={level}
                        slots={characterData.spellSlots[`level${level}`]}
                        spells={spellsOfLevel}
                        spellbook={spellbook}
                        onUpdateSlots={(field, value) => handleUpdateSlots(level, field, value)}
                        onAddSpell={handleAddSpell}
                        onRemoveSpell={handleRemoveSpell}
                        onShowDetails={openModal}
                    />
                );
            })}

            {selectedSpell && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles} contentLabel="Detalhes da Magia">
                    <h2 className="text-2xl font-display font-bold mb-2 text-red-800">{selectedSpell.name}</h2>
                    <p className="mb-4 italic text-gray-600">Magia de {selectedSpell.school} de Nível {selectedSpell.level}</p>
                    <p><span className="font-bold">Tempo de Conjuração:</span> {selectedSpell.casting_time}</p>
                    <p><span className="font-bold">Alcance:</span> {selectedSpell.range}</p>
                    <p><span className="font-bold">Componentes:</span> {selectedSpell.components.join(', ')}</p>
                    <p className="mb-4"><span className="font-bold">Duração:</span> {selectedSpell.duration}</p>
                    <div className="border-t pt-4"><p>{selectedSpell.description}</p></div>
                    {selectedSpell.at_higher_levels && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-bold text-lg">Em Níveis Superiores</h4>
                            <p>{selectedSpell.at_higher_levels}</p>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => { openNewSpellModal(selectedSpell); closeModal(); }} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600">Editar Magia</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Fechar</button>
                    </div>
                </Modal>
            )}
            
            <Modal isOpen={newSpellModalIsOpen} onRequestClose={closeNewSpellModal} style={customModalStyles} contentLabel="Formulário de Magia">
                <h2 className="text-2xl font-bold mb-4">{editingSpellId ? "Editar Magia" : "Criar Nova Magia"}</h2>
                <div className="space-y-3 text-sm">
                    <input type="text" placeholder="Nome da Magia" value={newSpellData.name} onChange={e => handleNewSpellChange('name', e.target.value)} className="w-full p-2 border rounded" />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Nível" value={newSpellData.level} onChange={e => handleNewSpellChange('level', parseInt(e.target.value) || 0)} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Escola de Magia" value={newSpellData.school} onChange={e => handleNewSpellChange('school', e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Tempo de Conjuração" value={newSpellData.casting_time} onChange={e => handleNewSpellChange('casting_time', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Alcance" value={newSpellData.range} onChange={e => handleNewSpellChange('range', e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Componentes (V, S, M)" value={newSpellData.components.join(', ')} onChange={e => handleNewSpellChange('components', e.target.value)} className="w-full p-2 border rounded" />
                        <input type="text" placeholder="Duração" value={newSpellData.duration} onChange={e => handleNewSpellChange('duration', e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <textarea placeholder="Descrição da Magia" value={newSpellData.description} onChange={e => handleNewSpellChange('description', e.target.value)} className="w-full p-2 border rounded min-h-[100px]" />
                    <textarea placeholder="Em Níveis Superiores..." value={newSpellData.at_higher_levels} onChange={e => handleNewSpellChange('at_higher_levels', e.target.value)} className="w-full p-2 border rounded min-h-[60px]" />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={closeNewSpellModal} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSaveNewSpell} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Salvar</button>
                </div>
            </Modal>
        </div>
    );
};

export default Spells;