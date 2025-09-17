// src/components/CharacterSheet.js
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../tabs.css';

import { FaUser, FaScroll, FaBookDead, FaShoppingBag } from 'react-icons/fa';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css'; // Estilo base do accordion

import CharacterInfo from './CharacterInfo';
import AbilityScores from './AbilityScores';
import ProficiencyBonus from './ProficiencyBonus';
import SavingThrows from './SavingThrows';
import Skills from './Skills';
import CombatStats from './CombatStats';
import Personality from './Personality';
import Inventory from './Inventory';
import Spells from './Spells';
import OtherProficiencies from './OtherProficiencies';
import Features from './Features';
import PassivePerception from './PassivePerception';
import Attacks from './Attacks';

const SKILL_LIST = { 'Acrobatics': 'dexterity', 'Animal Handling': 'wisdom', 'Arcana': 'intelligence', 'Athletics': 'strength', 'Deception': 'charisma', 'History': 'intelligence', 'Insight': 'wisdom', 'Intimidation': 'charisma', 'Investigation': 'intelligence', 'Medicine': 'wisdom', 'Nature': 'intelligence', 'Perception': 'wisdom', 'Performance': 'charisma', 'Persuasion': 'charisma', 'Religion': 'intelligence', 'Sleight of Hand': 'dexterity', 'Stealth': 'dexterity', 'Survival': 'wisdom' };

const CharacterSheet = ({ characterData, onUpdate, onBack, spellbook, onAddNewSpellToBook, onUpdateSpellInBook }) => {
  const calculateModifier = (score) => Math.floor((score - 10) / 2);
  const proficiencyBonus = characterData.level >= 1 ? Math.floor((characterData.level - 1) / 4) + 2 : 0;
  const abilityModifiers = Object.entries(characterData.abilityScores).reduce((acc, [ability, score]) => {
    acc[ability] = calculateModifier(score);
    return acc;
  }, {});
  const passivePerception = 10 + (abilityModifiers.wisdom || 0) + ((characterData.skillProficiencies && characterData.skillProficiencies['Perception']) ? proficiencyBonus : 0);

  const handleUpdate = (path, value) => {
    const keys = path.split('.');
    const newCharacterData = JSON.parse(JSON.stringify(characterData));
    let current = newCharacterData;
    for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) { current[keys[i]] = {}; }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate(newCharacterData);
  };

  return (
    <main className="bg-white shadow-lg rounded-lg p-4 md:p-6 border-2 border-gray-400">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-grow">
          <input 
            type="text"
            value={characterData.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="text-3xl font-bold w-full border-b-2 border-gray-400 pb-1"
            placeholder="Nome do Personagem"
          />
        </div>
        <button onClick={onBack} className="flex-shrink-0 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-bold">&larr; Voltar ao Menu</button>
      </div>
      
      <Tabs className="mt-4">
        <TabList>
        <TabList>
          <Tab title="Ficha Principal">
            <FaUser className="inline-block mr-0 md:mr-2" />
            <span className="hidden md:inline">Principal</span>
          </Tab>
          <Tab title="Personalidade">
            <FaScroll className="inline-block mr-0 md:mr-2" />
            <span className="hidden md:inline">Personalidade</span>
          </Tab>
          <Tab title="Inventário">
            <FaShoppingBag className="inline-block mr-0 md:mr-2" />
            <span className="hidden md:inline">Inventário</span>
          </Tab>
          <Tab title="Magias">
            <FaBookDead className="inline-block mr-0 md:mr-2" />
            <span className="hidden md:inline">Magias</span>
          </Tab>
        </TabList>
        </TabList>

        <TabPanel>
            {/* 2. A MÁGICA DA RESPONSIVIDADE ACONTECE AQUI */}
            
            {/* VISÃO DESKTOP: Layout de 3 colunas (escondido no mobile) */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 md:gap-6 mt-4">
                <div className="flex flex-col gap-4"> {/* Coluna Esquerda */}
                    <div className="grid grid-cols-2 gap-4">
                      <ProficiencyBonus bonus={proficiencyBonus} />
                      <PassivePerception value={passivePerception} />
                    </div>
                    <AbilityScores scores={characterData.abilityScores} modifiers={abilityModifiers} onScoreChange={(ability, val) => handleUpdate(`abilityScores.${ability}`, parseInt(val) || 0)} />
                    <SavingThrows proficiencies={characterData.savingThrowProficiencies} modifiers={abilityModifiers} proficiencyBonus={proficiencyBonus} onProficiencyChange={(key) => handleUpdate(`savingThrowProficiencies.${key}`, !characterData.savingThrowProficiencies[key])} />
                    <Skills proficiencies={characterData.skillProficiencies} expertise={characterData.skillExpertise} modifiers={abilityModifiers} proficiencyBonus={proficiencyBonus} skillList={SKILL_LIST} onProficiencyChange={(key) => handleUpdate(`skillProficiencies.${key}`, !characterData.skillProficiencies[key])} onExpertiseChange={(key) => handleUpdate(`skillExpertise.${key}`, !characterData.skillExpertise[key])} />
                </div>
                <div className="flex flex-col gap-4"> {/* Coluna Central */}
                    <CombatStats stats={{ ac: characterData.armorClass, initiative: abilityModifiers.dexterity, speed: characterData.speed }} hp={{ max: characterData.maxHp, current: characterData.currentHp, temp: characterData.tempHp }} hitDice={characterData.hitDice} deathSaves={characterData.deathSaves} onUpdate={handleUpdate} />
                    <Attacks />
                </div>
                <div className="flex flex-col gap-4"> {/* Coluna Direita */}
                    <CharacterInfo data={characterData} onStatChange={(stat, val) => handleUpdate(stat, val)} />
                    <Features value={characterData.featuresAndTraits} onUpdate={handleUpdate} />
                    <OtherProficiencies value={characterData.otherProficiencies} onUpdate={handleUpdate} />
                </div>
            </div>

            {/* VISÃO MOBILE: Layout de Accordion (escondido no desktop) */}
            <div className="block md:hidden mt-4">
                <Accordion allowZeroExpanded>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Combate & Status</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><CombatStats stats={{ ac: characterData.armorClass, initiative: abilityModifiers.dexterity, speed: characterData.speed }} hp={{ max: characterData.maxHp, current: characterData.currentHp, temp: characterData.tempHp }} hitDice={characterData.hitDice} deathSaves={characterData.deathSaves} onUpdate={handleUpdate} /></AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Atributos</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><AbilityScores scores={characterData.abilityScores} modifiers={abilityModifiers} onScoreChange={(ability, val) => handleUpdate(`abilityScores.${ability}`, parseInt(val) || 0)} /></AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Testes de Resistência</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><SavingThrows proficiencies={characterData.savingThrowProficiencies} modifiers={abilityModifiers} proficiencyBonus={proficiencyBonus} onProficiencyChange={(key) => handleUpdate(`savingThrowProficiencies.${key}`, !characterData.savingThrowProficiencies[key])} /></AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Perícias</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><Skills proficiencies={characterData.skillProficiencies} expertise={characterData.skillExpertise} modifiers={abilityModifiers} proficiencyBonus={proficiencyBonus} skillList={SKILL_LIST} onProficiencyChange={(key) => handleUpdate(`skillProficiencies.${key}`, !characterData.skillProficiencies[key])} onExpertiseChange={(key) => handleUpdate(`skillExpertise.${key}`, !characterData.skillExpertise[key])} /></AccordionItemPanel>
                    </AccordionItem>
                     <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Ataques & Conjuração</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><Attacks /></AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Características & Aptidões</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><Features value={characterData.featuresAndTraits} onUpdate={handleUpdate} /></AccordionItemPanel>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemHeading><AccordionItemButton>Outras Proficiências & Idiomas</AccordionItemButton></AccordionItemHeading>
                        <AccordionItemPanel><OtherProficiencies value={characterData.otherProficiencies} onUpdate={handleUpdate} /></AccordionItemPanel>
                    </AccordionItem>
                </Accordion>
            </div>

        </TabPanel>

        <TabPanel>
            <Personality data={characterData} onUpdate={(field, value) => handleUpdate(field, value)} />
        </TabPanel>

        <TabPanel>
            <Inventory money={characterData.money} equipment={characterData.equipment} onUpdate={(field, value) => handleUpdate(field, value)} />
        </TabPanel>
        
        <TabPanel>
            <Spells characterData={characterData} spellbook={spellbook} onUpdate={handleUpdate} proficiencyBonus={proficiencyBonus} abilityModifiers={abilityModifiers} onAddNewSpellToBook={onAddNewSpellToBook} onUpdateSpellInBook={onUpdateSpellInBook} />
        </TabPanel>
      </Tabs>
    </main>
  );
};
export default CharacterSheet;