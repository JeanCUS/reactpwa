import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import database from "../firebase";

export const Forms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const formsRef = ref(database, "forms");

    onValue(
      formsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const formsData = [];
          snapshot.forEach((childSnapshot) => {
            formsData.push({
              id: childSnapshot.key,
              ...childSnapshot.val(),
            });
          });
          setForms(formsData);
        }
      },
      {
        onlyOnce: true,
      }
    );
  }, []);

  const handleAnswerButtonClick = (formId) => {
    const answerLink = `${window.location.origin}/forms/${formId}/answer`;
    setTimeout(() => {
      navigator.clipboard
        .writeText(answerLink)
        .then(() => {
          console.log("Enlace copiado al portapapeles:", answerLink);
          alert("Enlace copiado al portapapeles");
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles:", err);
          alert("Error al copiar al portapapeles");
        });
    }, 1000);
  };

  const handleViewResponsesClick = (formId) => {
    navigate(`/forms/${formId}/responses`);
  };

  const handleDeleteButtonClick = async (formId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de querer eliminar el formulario?"
    );
    if (confirmDelete) {
      try {
        // Obtén la referencia al formulario en la base de datos
        const formRef = ref(database, `forms/${formId}`);
        // Elimina el formulario
        await remove(formRef);
        // Actualiza el estado para reflejar los formularios restantes
        setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
        alert("Formulario eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar formulario:", error);
        alert("Error al eliminar formulario");
      }
    }
  };

  return (
    <div className="forms">
      <h2>Formularios Creados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre del Formulario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td>{form.name}</td>
              <td>
                <button className="botones" onClick={() => handleAnswerButtonClick(form.id)}>
                  Generar Link
                </button>
                <button className="botones" onClick={() => handleViewResponsesClick(form.id)}>
                  Ver Respuestas
                </button>
                <button className="eliminar" onClick={() => handleDeleteButtonClick(form.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Forms;
