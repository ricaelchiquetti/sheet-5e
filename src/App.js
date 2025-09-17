// src/App.js
import React, { useState, useEffect } from 'react';
import CharacterSheet from './components/CharacterSheet';
import CharacterMenu from './components/CharacterMenu';

const newCharacterTemplate = {
  name: 'Novo Personagem', class: 'Guerreiro', level: 1, race: 'Humano',
  alignment: 'Leal e Bom', experience: 0,
  background: 'Soldado',
  inspiration: 0,
  abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
  savingThrowProficiencies: {}, 
  skillProficiencies: {},
  skillExpertise: {},
  armorClass: 10, initiative: 0, speed: 30, maxHp: 10, currentHp: 10, tempHp: 0,
  hitDice: { total: 1, type: 10, current: 1 },
  deathSaves: { successes: 0, failures: 0 },
  personalityTraits: '', ideals: '', bonds: '', flaws: '',
  featuresAndTraits: [
    { id: Date.now(), name: 'Visão no Escuro', description: 'Você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.' },
    { id: Date.now() + 1, name: 'Retomar o Fôlego', description: 'No seu turno, você pode usar uma ação bônus para recuperar pontos de vida igual a 1d10 + seu nível de guerreiro. Depois de usar essa característica, você precisa terminar um descanso curto ou longo para usá-la de novo.' },
  ],
  otherProficiencies: 'Armas: Todas\nArmaduras: Todas\nFerramentas: Nenhuma\nIdiomas: Comum, Anão',
  money: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
  equipment: [
    { id: Date.now(), name: 'Mochila', quantity: 1, weight: 2.5 },
    { id: Date.now() + 1, name: 'Saco de dormir', quantity: 1, weight: 3.5 },
    { id: Date.now() + 2, name: 'Rações (1 dia)', quantity: 3, weight: 1 },
  ],
  spells: ["std-mage-hand", "std-magic-missile"],
  spellcastingAbility: 'intelligence',
  spellSlots: { level1: { total: 2, used: 0 }, level2: { total: 0, used: 0 }, level3: { total: 0, used: 0 }, level4: { total: 0, used: 0 }, level5: { total: 0, used: 0 }, level6: { total: 0, used: 0 }, level7: { total: 0, used: 0 }, level8: { total: 0, used: 0 }, level9: { total: 0, used: 0 } }
};

function App() {
  const [characters, setCharacters] = useState([]);
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [spellbook, setSpellbook] = useState([]);

  useEffect(() => {
    const savedSpellbook = localStorage.getItem('spellbook');
    if (savedSpellbook) { setSpellbook(JSON.parse(savedSpellbook)); }
    else { fetch('/data/spells.json').then(res => res.json()).then(data => setSpellbook(data)).catch(console.error); }
    const savedCharacters = localStorage.getItem('characters');
    if (savedCharacters) { setCharacters(JSON.parse(savedCharacters)); }
  }, []);

  useEffect(() => { if (spellbook.length > 0) { localStorage.setItem('spellbook', JSON.stringify(spellbook)); } }, [spellbook]);
  useEffect(() => { localStorage.setItem('characters', JSON.stringify(characters)); }, [characters]);
  
  const handleAddNewSpellToBook = (newSpell) => {
    if (spellbook.some(spell => spell.name.toLowerCase() === newSpell.name.toLowerCase())) { alert("Uma magia com este nome já existe!"); return null; }
    const spellWithId = { ...newSpell, id: Date.now() };
    setSpellbook(prev => [...prev, spellWithId].sort((a, b) => a.name.localeCompare(b.name)));
    return spellWithId;
  };
  
  const handleUpdateSpellInBook = (spellId, updatedSpellData) => {
    if (spellbook.some(spell => spell.name.toLowerCase() === updatedSpellData.name.toLowerCase() && spell.id !== spellId)) { alert("Outra magia já existe com este nome!"); return false; }
    setSpellbook(prev => prev.map(spell => (spell.id === spellId ? updatedSpellData : spell)).sort((a, b) => a.name.localeCompare(b.name)));
    return true;
  };

  const handleCreateCharacter = () => { const newChar = { ...newCharacterTemplate, id: Date.now(), name: `Personagem #${characters.length + 1}` }; setCharacters(prev => [...prev, newChar]); setActiveCharacterId(newChar.id); };
  const handleDeleteCharacter = (id) => { if (window.confirm("Tem certeza?")) { setCharacters(prev => prev.filter(char => char.id !== id)); } };
  const handleSelectCharacter = (id) => setActiveCharacterId(id);
  const handleBackToMenu = () => setActiveCharacterId(null);
  const handleUpdateCharacter = (data) => { setCharacters(prev => prev.map(char => (char.id === data.id ? data : char))); };
  
  const handleExportCharacters = () => { if (characters.length === 0) return alert("Não há personagens para salvar."); const jsonString = JSON.stringify(characters, null, 2); const blob = new Blob([jsonString], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `personagens_dnd_5e_${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); };
  const handleImportCharacters = (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const imported = JSON.parse(e.target.result); if (Array.isArray(imported) && window.confirm(`Arquivo com ${imported.length} personagem(ns). Deseja substituir os atuais?`)) { setCharacters(imported); alert('Personagens importados com sucesso!'); } else { throw new Error('Arquivo JSON inválido.'); } } catch (error) { alert('Erro ao importar arquivo: ' + error.message); } }; reader.readAsText(file); event.target.value = null; };
  
  const activeCharacter = characters.find(char => char.id === activeCharacterId);

  return (
    <div className="container mx-auto p-2 md:p-4 font-sans bg-gray-100 min-h-screen">
      {activeCharacter ? (
        <CharacterSheet characterData={activeCharacter} onUpdate={handleUpdateCharacter} onBack={handleBackToMenu} spellbook={spellbook} onAddNewSpellToBook={handleAddNewSpellToBook} onUpdateSpellInBook={handleUpdateSpellInBook} />
      ) : (
        <CharacterMenu characters={characters} onCreate={handleCreateCharacter} onDelete={handleDeleteCharacter} onSelect={handleSelectCharacter} onExport={handleExportCharacters} onImport={handleImportCharacters} />
      )}
    </div>
  );
}

export default App;