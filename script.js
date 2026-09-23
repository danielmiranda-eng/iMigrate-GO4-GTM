// Inicializamos el DataLayer de Google (El estándar de la industria)
window.dataLayer = window.dataLayer || [];

// 1. Función para cambiar de "páginas" simuladas
function navegar(vistaDestino, nombreVista) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  // Mostrar la nueva
  document.getElementById(vistaDestino).classList.add('active');
  
  // Avisar a Google Tag Manager que el usuario "cambió de página"
  window.dataLayer.push({
    event: 'virtual_pageview',
    page_name: nombreVista
  });
  
  console.log('👁️ VISTA CAMBIADA:', nombreVista);
}

// 2. Función para procesar cada respuesta
function responder(pregunta, valor, siguienteVista) {
  // Guardar en el navegador
  localStorage.setItem(`quiz_${pregunta}`, valor);
  
  // Avisar a Google Tag Manager de la interacción específica
  window.dataLayer.push({
    event: 'quiz_respuesta',
    quiz_question: pregunta,
    quiz_answer: valor
  });
  
  console.log(`📊 EVENTO ENVIADO A GTM: ${pregunta} = ${valor}`);
  
  // Avanzar a la siguiente pantalla
  navegar(siguienteVista, `vista_${siguienteVista}`);
}

// 3. Función final que envía a Salesforce
function finalizarCuestionario() {
  const email = document.getElementById('user-email').value;
  const consent = document.getElementById('user-consent').checked;
  
  if(!email || !consent) {
    alert("Por favor ingresa tu correo y acepta las políticas.");
    return;
  }
  
  // Rescatamos datos del LocalStorage
  const payloadSalesforce = {
    email: email,
    consentimiento_privacidad: consent,
    origen_utm: "campaña_codepen",
    respuestas: {
      ubicacion: localStorage.getItem('quiz_ubicacion'),
      pain_point: localStorage.getItem('quiz_pain_point')
    }
  };
  
  // Avisar a Tag Manager que hubo una conversión (Lead)
  window.dataLayer.push({
    event: 'lead_generado',
    lead_quality: 'MQL'
  });
  
  console.log('🚀 PAYLOAD FINAL PARA SALESFORCE:', payloadSalesforce);
  
  // Limpiar memoria y mostrar éxito
  localStorage.clear();
  navegar('view-success', 'pantalla_exito');
}

// Registrar la primera vista al cargar la página
window.dataLayer.push({ event: 'virtual_pageview', page_name: 'landing_page' });
