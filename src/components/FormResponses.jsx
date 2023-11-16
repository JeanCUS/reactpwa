import React, { useEffect, useState } from "react";
import { ref, get, child, onValue } from "firebase/database";
import { useParams } from "react-router-dom";
import database from "../firebase";

const FormResponses = () => {
  const { formId } = useParams();
  const [formQuestions, setFormQuestions] = useState([]);
  const [formResponses, setFormResponses] = useState([]);

  useEffect(() => {
    const fetchFormDetails = async () => {
      try {
        const formSnapshot = await get(child(ref(database), `forms/${formId}`));

        if (formSnapshot.exists()) {
          const formData = formSnapshot.val();
          setFormQuestions(formData.questions || []);
        } else {
          console.error("Formulario no encontrado");
        }
      } catch (error) {
        console.error("Error fetching form details", error);
      }
    };

    const fetchFormResponses = () => {
      const responsesRef = ref(database, `formResponses/${formId}/answers`);

      onValue(responsesRef, (snapshot) => {
        try {
          if (snapshot.exists()) {
            const formResponsesData = snapshot.val();
            const responsesArray = Object.values(formResponsesData);
            setFormResponses(responsesArray);
          } else {
            console.error("Snapshot encontrado, pero no contiene datos");
            setFormResponses([]);
          }
        } catch (error) {
          console.error("Error al obtener respuestas:", error);
          setFormResponses([]);
        }
      });
    };

    fetchFormDetails();
    fetchFormResponses();
  }, [formId]);

  return (
    <div>
      <h2>Respuestas del Formulario</h2>

      {formQuestions.length > 0 ? (
        <div>
          <h3>Preguntas</h3>
          {formQuestions.map((question, index) => (
            <p key={index}>
              <strong>{question.text}:</strong> {question.type}
            </p>
          ))}
        </div>
      ) : (
        <p>Error al obtener las preguntas del formulario</p>
      )}

      {formResponses.length > 0 ? (
        <div>
          <h3>Respuestas</h3>
          {formResponses.map((response, responseIndex) => (
            <div key={responseIndex}>
              <h4>Contestación {responseIndex + 1}</h4>
              {formQuestions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <p>
                    <strong>{question.text}:</strong>{" "}
                    {question.type === "checkbox"
                      ? response.answers && response.answers[question.id]
                        ? "1"
                        : "0"
                      : response.answers && response.answers[question.id]}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay respuestas disponibles</p>
      )}
    </div>
  );
};

export default FormResponses;
