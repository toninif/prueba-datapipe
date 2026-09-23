(() => {
  const consentScreen = document.getElementById("consent-screen");
  const experimentRoot = document.getElementById("jspsych-root");
  const consentMessage = document.getElementById("consent-message");

  document.getElementById("decline-consent").addEventListener("click", () => {
    consentScreen.innerHTML = `
      <p class="kicker">Encuesta breve</p>
      <h1>Gracias por tu tiempo.</h1>
      <p class="intro">No se inició la encuesta ni se registraron respuestas.</p>`;
  });

  document.getElementById("accept-consent").addEventListener("click", startStudy);

  function startStudy() {
    if (typeof initJsPsych !== "function" || typeof jsPsychSurveyLikert === "undefined") {
      consentMessage.textContent = "No se pudieron cargar los componentes. Revisá tu conexión y volvé a intentar.";
      return;
    }

    consentScreen.hidden = true;
    experimentRoot.hidden = false;
    experimentRoot.removeAttribute("id");
    experimentRoot.id = "jspsych-target";

    const jsPsychInstance = initJsPsych({
      display_element: "jspsych-target",
      show_progress_bar: true,
      auto_update_progress_bar: true,
    });

    const participantId = jsPsychInstance.randomization.randomID(12);
    // A random, non-identifying ID is attached to each response row.
    jsPsychInstance.data.addProperties({ participant_id: participantId, consent_given: true });

    const timeline = [];

    timeline.push({
      type: jsPsychSurveyHtmlForm,
      preamble: `<div class="survey-intro"><p class="kicker">1 de 3 · Sobre vos</p><h1>Algunos datos generales</h1><p class="trial-note">No incluyas información que permita identificarte.</p></div>`,
      html: `<div class="demographics">
        <label for="age_band">¿En qué rango de edad estás?</label>
        <select id="age_band" name="age_band" required><option value="" selected disabled>Elegí una opción</option><option>18–24</option><option>25–34</option><option>35–44</option><option>45–54</option><option>55–64</option><option>65 o más</option><option>Prefiero no responder</option></select>
        <label for="gender">¿Cómo describís tu género?</label>
        <select id="gender" name="gender" required><option value="" selected disabled>Elegí una opción</option><option>Mujer</option><option>Varón</option><option>No binario / otra identidad</option><option>Prefiero no responder</option></select>
        <label for="education">¿Cuál es el nivel educativo más alto que completaste?</label>
        <select id="education" name="education" required><option value="" selected disabled>Elegí una opción</option><option>Primario</option><option>Secundario</option><option>Terciario o universitario en curso</option><option>Terciario o universitario completo</option><option>Posgrado</option><option>Prefiero no responder</option></select>
      </div>`,
      button_label: "Continuar",
      data: { section: "demographics" }
    });

    timeline.push({
      type: jsPsychSurveyLikert,
      preamble: `<div class="survey-intro"><p class="kicker">2 de 3 · Cómo te sentís</p><h1>En este momento</h1><p>Indicá en qué medida te sentís así ahora mismo.</p></div>`,
      questions: panasItems.map((prompt, index) => ({ prompt, name: `panas_${String(index + 1).padStart(2, "0")}`, labels: panasLabels, required: false })),
      button_label: "Continuar",
      data: { section: "panas_18_argentina" }
    });

    timeline.push({
      type: jsPsychSurveyLikert,
      preamble: `<div class="survey-intro"><p class="kicker">3 de 3 · Tu vida en general</p><h1>Satisfacción con la vida</h1><p>Indicá cuánto estás de acuerdo o en desacuerdo con cada afirmación.</p></div>`,
      questions: swlsItems.map((prompt, index) => ({ prompt, name: `swls_${String(index + 1).padStart(2, "0")}`, labels: swlsLabels, required: false })),
      button_label: "Continuar",
      data: { section: "swls" }
    });

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<div class="survey-intro"><p class="kicker">Cierre</p><h1>Gracias por responder</h1><p>La encuesta termina acá. En esta versión de prueba, tus respuestas no se enviaron ni quedaron guardadas en un repositorio.</p><p class="trial-note">Este cuestionario es una demostración técnica y no ofrece una evaluación individual.</p></div>`,
      choices: ["Finalizar"],
      data: { section: "debrief" }
    });

    jsPsychInstance.run(timeline);
  }
})();
