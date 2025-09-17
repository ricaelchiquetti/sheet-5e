// src/components/Features.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const customModalStyles = {
    content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', border: '2px solid black', borderRadius: '10px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#fdf9e4' },
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
};

Modal.setAppElement('#root');

const emptyFeature = { id: null, name: '', description: '' };

const Features = ({ value, onUpdate }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(emptyFeature);
    const [isEditing, setIsEditing] = useState(false);

    const featuresList = Array.isArray(value) ? value : [];

    const openModal = (feature = null) => {
        if (feature) {
            setCurrentFeature(feature);
            setIsEditing(true);
        } else {
            setCurrentFeature(emptyFeature);
            setIsEditing(false);
        }
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSave = () => {
        if (!currentFeature.name) {
            alert("O nome é obrigatório.");
            return;
        }

        let newList;
        if (isEditing) {
            // Edita uma característica existente
            newList = featuresList.map(f => f.id === currentFeature.id ? currentFeature : f);
        } else {
            // Adiciona uma nova característica
            const newFeature = { ...currentFeature, id: Date.now() };
            newList = [...featuresList, newFeature];
        }
        onUpdate('featuresAndTraits', newList);
        closeModal();
    };

    const handleDelete = (featureId) => {
        if (window.confirm("Tem certeza que deseja remover esta característica?")) {
            const newList = featuresList.filter(f => f.id !== featureId);
            onUpdate('featuresAndTraits', newList);
        }
    };
    
    return (
        <div className="p-2 border-2 border-black rounded-lg bg-gray-50 h-full">
            <h3 className="text-center font-bold mb-2 uppercase text-sm">Características & Aptidões</h3>
            <div className="space-y-2">
                {featuresList.map(feature => (
                    <div key={feature.id} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                        <span className="font-semibold cursor-pointer hover:text-red-700" onClick={() => openModal(feature)}>
                            {feature.name}
                        </span>
                        <button onClick={() => handleDelete(feature.id)} className="text-red-600 font-bold px-2 text-lg">&times;</button>
                    </div>
                ))}
            </div>
            <button onClick={() => openModal()} className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                + Adicionar Característica
            </button>

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles} contentLabel="Característica ou Aptidão">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? "Editar" : "Adicionar"} Característica</h2>
                <div className="space-y-4">
                    <div>
                        <label className="font-bold">Nome</label>
                        <input 
                            type="text"
                            value={currentFeature.name}
                            onChange={(e) => setCurrentFeature({...currentFeature, name: e.target.value})}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="font-bold">Descrição</label>
                        <textarea 
                            value={currentFeature.description}
                            onChange={(e) => setCurrentFeature({...currentFeature, description: e.target.value})}
                            className="w-full p-2 border rounded min-h-[150px]"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={closeModal} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancelar</button>
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Salvar</button>
                </div>
            </Modal>
        </div>
    );
};

export default Features;