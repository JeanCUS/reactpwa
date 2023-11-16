import { Routes, Route, BrowserRouter as Router, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { Forms } from "./components/Forms";
import { CreateForms } from "./components/CreateForms";
import AnswerForm from "./components/AnswerForm";
import FormResponses from "./components/FormResponses";


function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const changePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="container">
        <header>
          <h1>Formulario React</h1>
          <nav>
            <ul>
              <li>
                <Link className="menu" to="/">Inicio</Link>
              </li>
              <li>
                <Link className="menu" to="/forms/create">Formularios</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Forms />
                </div>
              }
            />
            <Route path="/forms" element={<Forms />} />
            <Route path="/forms/create" element={<CreateForms />} />
            <Route path="/forms/:formId/answer" element={<AnswerForm />} />
            <Route path="/forms/:formId/responses" element={<FormResponses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
