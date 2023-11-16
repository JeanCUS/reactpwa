import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, push, serverTimestamp } from "firebase/database";
import database from "../firebase";

const AnswerForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responses, setResponses] = useState({});
  const [userName, setUserName] = useState(""); // Puedes obtener el nombre del usuario de alguna manera

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://formsvue-default-rtdb.firebaseio.com/forms/${formId}.json`
        );

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        setFormData(data);

        // Inicializa las respuestas con un objeto que tiene las preguntas como claves
        const initialResponses = {};
        data.questions.forEach((question) => {
          initialResponses[question.id] = "";
        });
        setResponses(initialResponses);
      } catch (error) {
        console.error("Error fetching form data", error);
      }
    };

    fetchData();
  }, [formId]);

  const handleInputChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formResponseRef = ref(database, `formResponses/${formId}`);
      await push(formResponseRef, {
        timestamp: serverTimestamp(),
        userName: userName,
        answers: responses,
      });

      setFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form response", error);
    }
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  const formQuestions = formData?.questions || [];

  if (formSubmitted) {
    return <div>¡Gracias por llenar el formulario!</div>;
  }

  return (
    <div>
      <h2>Responder Formulario</h2>
      <form onSubmit={handleFormSubmit}>
        {formQuestions.map((question) => (
          <div key={question.id}>
            <label>{question.text}</label>
            {question.type === "checkbox" ? (
              question.options.map((option) => (
                <div key={option.id}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handleInputChange(question.id, option)}
                    />
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <input
                type="text"
                value={responses[question.id]}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="submit">Enviar Respuestas</button>
      </form>
    </div>
  );
};

export default AnswerForm;
