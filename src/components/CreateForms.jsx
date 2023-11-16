import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import database from "../firebase";

export const CreateForms = () => {
  const [formName, setFormName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "string",
    options: [],
  });

  const handleQuestionTypeChange = (event) => {
    const { value } = event.target;
    setNewQuestion({
      ...newQuestion,
      type: value,
      options: value === "checkbox" ? [] : null,
    });
  };

  const handleAddOption = () => {
    if (newQuestion.type === "checkbox") {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, ""],
      });
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.text.trim() === "") {
      alert("La pregunta no puede estar en blanco");
      return;
    }

    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({
      text: "",
      type: "string",
      options: [],
    });
  };

  const handleRemoveQuestion = (index) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de querer eliminar la pregunta?"
    );
    if (confirmDelete) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index, event) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = event.target.value;
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
  };

  const handleFormSubmit = () => {
    if (formName.trim() === "") {
      alert("Por favor, ingresa un nombre para el formulario");
      return;
    }

    if (questions.length === 0) {
      alert("Por favor, agrega al menos una pregunta al formulario");
      return;
    }

    const confirmSubmit = window.confirm(
      "¿Estás seguro de querer enviar el formulario?"
    );
    if (confirmSubmit) {
      // Guardar el formulario en Firebase
      try {
        const formRef = ref(database, "forms");
        const newFormRef = push(formRef);
        set(newFormRef, {
          name: formName,
          questions,
        });
        alert("Formulario enviado con éxito");

        // Reiniciar el estado para crear otro formulario
        setFormName("");
        setQuestions([]);
        setNewQuestion({
          text: "",
          type: "string",
          options: [],
        });
      } catch (error) {
        console.error("Error al enviar formulario a Firebase:", error);
      }
    }
  };

  return (
    <div className="create-forms">
      <h2>Crear Nuevo Formulario</h2>
      <label>
        Nombre del Formulario:
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </label>

      <h3>Agregar Pregunta</h3>
      <label>
        Texto de la Pregunta:
        <input
          type="text"
          value={newQuestion.text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, text: e.target.value })
          }
        />
      </label>

      <label>
        Tipo de Pregunta:
        <select value={newQuestion.type} onChange={handleQuestionTypeChange}>
          <option value="string">Entrada de Texto</option>
          <option value="number">Entrada Numérica</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </label>

      {newQuestion.type === "checkbox" && (
        <div>
          <h4>Opciones</h4>
          {newQuestion.options.map((option, index) => (
            <div key={index}>
              <label>
                Opción {index + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={handleAddOption}>
            Agregar Opción
          </button>
        </div>
      )}

      <button type="button" onClick={handleAddQuestion}>
        Agregar Pregunta
      </button>

      <button type="button" onClick={handleFormSubmit}>
        Enviar Formulario
      </button>

      <ul>
        {questions.map((question, index) => (
          <li key={index}>
            {index + 1}. {question.text}{" "}
            <button type="button" onClick={() => handleRemoveQuestion(index)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
