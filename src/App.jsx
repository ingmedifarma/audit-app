import { useState, useEffect, useCallback, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const GESTION_CRITERIA = [
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "Cuenta con Certificado de Existencia y Representación Legal no menor a 6 meses", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "En la Cámara de Existencia y Representación Legal, se observa objeto social de la empresa coherente con la dispensación de medicamentos", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "En caso de empresa aliada y si es IPS, cuenta con Certificado de Habilitación Vigente", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "En caso de empresa aliada y si es IPS, dentro de los servicios habilitados, ¿se evidencia Servicio Farmacéutico en la modalidad ambulatoria?", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "¿Cuenta con Concepto Sanitario Vigente expedido por la Secretaría de Salud Municipal?", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "¿Cuenta con certificado de uso de suelos?", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "¿Cuenta con certificado de bomberos vigente?", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "¿Cuentan con concepto de apertura del establecimiento farmacéutico?", aclaracion: "NO APLICA" },
  { componente: "DOCUMENTACIÓN LEGAL", criterio: "¿Cuentan con resolución para el manejo de medicamentos de control especial en el punto de dispensación?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuenta con plano de evacuación de residuos y de emergencias?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuentan con señalización de ruta de residuos, coherentes con código de colores y horas de recolección?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuenta con contrato para la recolección de residuos peligrosos?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Se evidencia correcta segregación de los residuos en el punto?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuentan con Plan de Gestión Integral de Residuos Hospitalarios y Similares (PGIRHS)?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuentan con un procedimiento o documento de control de plagas?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "¿Cuentan con certificado de fumigación de al menos el mes anterior o de ser de antes, cuentan con validez de los tiempos de fumigación?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GESTIÓN - DOCUMENTACIÓN Y EVIDENCIAS DE EJECUCIÓN", criterio: "En caso de red aliada, ¿se evidencia autoevaluación del SG-SST correspondiente al período del año inmediatamente anterior?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se cuenta con procedimiento de Selección, adquisición, recepción y almacenamiento, distribución y dispensación de medicamentos y dispositivos médicos?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se cuenta con procedimientos y evidencias de información y educación al paciente y la comunidad sobre uso adecuado de medicamentos y dispositivos médicos?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se cuenta con procedimiento de farmacovigilancia y tecnovigilancia?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿El personal del dispensario valida que la fórmula médica cumpla con la normativa colombiana vigente antes de realizar la dispensación?", aclaracion: "Nombre del prestador o profesional de la salud con su dirección y número telefónico, lugar y fecha de prescripción, nombre del paciente y documento de identidad, número de historia clínica, tipo de usuario, nombre del medicamento en DCI, concentración y forma farmacéutica, vía de administración, dosis y frecuencia, período de duración del tratamiento, cantidad total de unidades, indicaciones, vigencia de la prescripción, nombre y firma del prescriptor con su registro profesional." },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se cuenta con un cronograma de mantenimiento preventivo de los equipos para la refrigeración de medicamentos y/o DM?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia cumplimiento del cronograma de mantenimiento preventivo anterior?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Cuentan con procedimiento para la semaforización de medicamentos por fechas de vencimiento?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Cuenta con procedimiento para la destrucción de medicamentos?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Cuentan con procedimientos de limpieza y desinfección de áreas?", aclaracion: "NO APLICA" },
  { componente: "SISTEMA DE GARANTÍA DE CALIDAD DE PUNTOS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Cuentan con registros de limpieza y desinfección de áreas?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Llevan registros de recepción técnica y administrativa de los medicamentos y dispositivos médicos en el punto de dispensación?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Llevan registros de control de temperatura y humedad relativa ambiente?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Llevan registros de control de la cadena de frío para medicamentos que así lo requieran?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Llevan registros de la devolución de medicamentos/dispositivos médicos que deban ser sometidos a procesos de destrucción o desnaturalización?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se cuentan con equipos de medición de temperatura y/o humedad con calibración vigente?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "Se cumple con rotación adecuada de fechas de vencimiento de los productos farmacéuticos. (FEFO: primeros en vencer, primeros en salir)", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "Se verifican alertas sanitarias, emitidas por INVIMA, en el proceso de recepción de los productos farmacéuticos y dispositivos médicos.", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencian mecanismos de colocación de PQR por parte de los clientes?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia prohibición de asesoría farmacéutica, por personal diferente a Químico Farmacéutico?", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "De la muestra seleccionada, se evidencia concordancia entre el conteo físico de los medicamentos y las existencias registradas en el sistema.", aclaracion: "NO APLICA" },
  { componente: "EVIDENCIAS DE LA GESTIÓN DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "En la revisión de las fórmulas médicas, se evidencia que el usuario se encontraba en cobertura al momento de la dispensación del medicamento.", aclaracion: "NO APLICA" },
  { componente: "TALENTO HUMANO", criterio: "¿El director técnico del punto de dispensación es un Tecnólogo en Regencia de Farmacia? (podrá ser por gradualidad de perfil, también un QF).", aclaracion: "NO APLICA" },
  { componente: "TALENTO HUMANO", criterio: "En caso de empresa aliada, ¿se evidencia contrato vigente del director técnico?", aclaracion: "NO APLICA" },
  { componente: "TALENTO HUMANO", criterio: "¿El director técnico tiene RETHUS para el ejercicio de su profesión/labor?", aclaracion: "NO APLICA" },
  { componente: "TALENTO HUMANO", criterio: "En caso de empresa aliada, ¿Existe notificación del director técnico al ente territorial?", aclaracion: "NO APLICA" },
  { componente: "TALENTO HUMANO", criterio: "¿Cuenta el punto con personal suficiente para las labores y actividades que se desarrollan?", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "El establecimiento está ubicado en un lugar independiente, alejado de focos de contaminación y fácil acceso para los usuarios.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Se identifica con un aviso en letras visibles que exprese la razón o denominación social del establecimiento, ubicado en la parte exterior del local o edificio que ocupe.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Pisos de material impermeable, resistente y sistema de drenaje que permite su fácil limpieza y sanitización.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Techos y cielo rasos, resistentes, uniformes y de fácil limpieza y sanitización.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Instalaciones eléctricas en buen estado, tomas, interruptores y cableado protegido.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Se enuncia el horario de atención a público.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Se evidencian equipo e implementos de seguridad en funcionamiento y ubicados de acuerdo a normas de seguridad industrial (extintores, alarmas sensibles al humo, estibas, etc).", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "El acceso es restringido para personal ajeno al punto.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Las áreas y estanterías o modulares, se encuentran limpios y ordenados, y son de material sanitario, impermeable y fácil de limpieza.", aclaracion: "NO APLICA" },
  { componente: "INFRAESTRUCTURA FÍSICA Y MOBILIARIOS", criterio: "Los productos farmacéuticos no tienen contacto directo con el piso.", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área administrativa debidamente delimitada?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área de recepción y almacenamiento provisional de medicamentos, dispositivos médicos, productos autorizados?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área para el almacenamiento de medicamentos y dispositivos médicos?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área independiente y segura para el almacenamiento de medicamentos de control especial?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área especial, debidamente identificada, para el almacenamiento transitorio de los medicamentos vencidos o deteriorados?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área de dispensación de medicamentos y entrega de dispositivos médicos y productos autorizados?", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área de cuarentena de medicamentos?, en ella también se podrán almacenar de manera transitoria los productos retirados del mercado", aclaracion: "NO APLICA" },
  { componente: "ÁREAS ESPECÍFICAS DEL ESTABLECIMIENTO FARMACÉUTICO", criterio: "¿Se evidencia área para manejo y disposición de residuos, de acuerdo con la normatividad vigente?", aclaracion: "NO APLICA" },
];

const CI_CRITERIA = [
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿La transcripción está ajustada a la formulación? (frecuencia de tratamiento, posología, pertinencia médica, vigencia de la formulación)" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿La transcripción de fórmulas está al día? (evaluar si la recepción de recetas de la IPS se encuentra al día con el proceso de transcripción en el sistema)" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "Revisión de inclusión de nuevos medicamentos y ajuste del vademécum socializado con la red de prestadores" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿Se evidencia descargue de fórmulas médicas al día, en el software de la institución?" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿Se evidencia generación de informes de pendientes de entrega, al día?" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿Se evidencia que se está haciendo el descargue y actualización de medicamentos y está al día?" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "Realización de traslados de medicamentos e insumos médicos a otras bodegas" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿Se están haciendo las devoluciones y ajustes de medicamentos/DM en el sistema de información de la empresa?" },
  { componente: "MOVIMIENTOS EN EL SISTEMA", criterio: "¿Se evidencian salidas de consumo de medicamentos sin justificación?" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "¿Se evidencia ingreso de productos ajustados al procedimiento, según la sede? (aliados y propios)" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "¿La revisión del muestreo aleatorio de medicamentos/DM tomados durante la auditoría, coincide físico versus sistema de información?" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "Diligenciamiento de formatos de recepción técnica de medicamentos" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "Revisión de organización de los medicamentos: Verificar almacenamiento en estanterías por orden alfabético y de acuerdo a su naturaleza, organizados FEFO. Revisar medicamentos en nevera." },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "Integridad física de los medicamentos según políticas de calidad del servicio farmacéutico" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "Verificar los Registros de Temperatura y Humedad Relativa desde la fecha de la última auditoría. Si se encuentra variaciones importantes verificar la conducta tomada." },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "¿Se evidencia que la dispensación de los medicamentos se hace por entrega completa y no por fragmentación del blíster?" },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "Revisión de condiciones de temperatura: Nevera (2 a 8°C), Ambiental (15 a 30°C), Humedad relativa (40 a 75%)." },
  { componente: "GESTIÓN DE INVENTARIO", criterio: "El termómetro digital de nevera y/o termohigrómetros cuentan con certificado de calibración vigente: menor a 1 año." },
  { componente: "AJUSTES DE FORMULACIÓN AL VADEMÉCUM", criterio: "Ajuste de formulación según vademécum socializado con la red de prestadores" },
  { componente: "AJUSTES DE FORMULACIÓN AL VADEMÉCUM", criterio: "Si se presentaron casos de medicamentos nuevos, ¿hay evidencia de la solicitud de creación de ellos, con las causales explícitas para ello?" },
  { componente: "AJUSTES DE FORMULACIÓN AL VADEMÉCUM", criterio: "Generación de pendientes a partir de formulación de medicamentos nuevos" },
  { componente: "CRITERIOS DE CONFORMIDAD DE SOPORTES", criterio: "La receta cumple con los criterios exigidos en el Decreto 2200" },
  { componente: "CRITERIOS DE CONFORMIDAD DE SOPORTES", criterio: "¿Se evidencia entrega de documento con pendientes y copia de la dispensación, con su respectivo sello?" },
  { componente: "CRITERIOS DE CONFORMIDAD DE SOPORTES", criterio: "¿Se evidencia que se están recepcionando documentos anexos para la dispensación, como: FOREAM, tutelas, direccionamientos de servicio…?" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "¿Se evidencia que se entrega el paquete documental establecido, para el procedimiento de auditoría y facturación?" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "Cargue de información de soportes en el software FTP del municipio designado" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "¿Se está generando el respectivo informe para el reporte de indicadores y es remitido a Gestión de Calidad y Control Interno?" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "Resolución de novedades de proceso de auditoría" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "Nivel de facturación de soportes reportados" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "Nivel de recobro de medicamentos reportados" },
  { componente: "GESTIÓN DE SOPORTES DE AUDITORÍA", criterio: "Nivel de conciliación de glosas de facturación" },
];

const ESTADOS = ["", "Conforme", "No conforme", "Observación", "No aplica"];

const ESTADO_COLORS = {
  "Conforme": { bg: "#d4edda", text: "#155724", border: "#28a745" },
  "No conforme": { bg: "#f8d7da", text: "#721c24", border: "#dc3545" },
  "Observación": { bg: "#fff3cd", text: "#856404", border: "#ffc107" },
  "No aplica": { bg: "#e2e3e5", text: "#495057", border: "#6c757d" },
};


// ── PDF Report Generator ──
// Logo base64 is defined inside generatePDF as LOGO_B64

async function generateWord(audit, config = {}) {
  const sede = audit.sede || "Sin sede";
  const fecha = audit.fecha || "";
  const auditorNombre = audit.realizadaPor || "—";
  const receptorNombre = audit.recibidaPor || "—";

  const conformes = audit.items.filter(i => i.estado === "Conforme").length;
  const noConformes = audit.items.filter(i => i.estado === "No conforme").length;
  const observaciones = audit.items.filter(i => i.estado === "Observacion" || i.estado === "Observación").length;
  const evaluados = conformes + noConformes + observaciones;
  const pct = evaluados > 0 ? ((conformes + observaciones) / evaluados * 100).toFixed(1) : "0.0";

  const groups = {};
  audit.items.forEach(item => {
    if (!groups[item.componente]) groups[item.componente] = [];
    groups[item.componente].push(item);
  });

  const noConformeItems = audit.items.filter(i => i.estado === "No conforme");

  const auditorObj = (config.auditores || []).find(a => (typeof a === "string" ? a : a.nombre) === auditorNombre);
  const auditorCargo = auditorObj?.cargo || "";
  const auditorFirma = auditorObj?.firma || "";

  const LOGO_B64 = "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";
  const MARGIN = 15;
  const HEADER_H = 24;
  const TITLE_SHORT = "Informe de Resultados – Auditoría Interna y/o Externa";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const contentW = pw - MARGIN * 2;

  const addHeader = (pageNum) => {
    doc.setPage(pageNum);
    // Dark blue header bar matching the logo background
    doc.setFillColor(12, 35, 64);
    doc.rect(MARGIN, 2, pw - MARGIN * 2, 20, "F");
    doc.addImage("data:image/jpeg;base64," + LOGO_B64, "JPEG", MARGIN, 2, 58, 20);
    if (pageNum > 1) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(200, 210, 220);
      doc.text(TITLE_SHORT, MARGIN + 62, 13);
    }
    doc.setDrawColor(100, 180, 80);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, HEADER_H, pw - MARGIN, HEADER_H);
  };

  const addFooter = (pageNum, total) => {
    doc.setPage(pageNum);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.line(MARGIN, ph - 12, pw - MARGIN, ph - 12);
    doc.text("FT-GCCI-01 v2", MARGIN, ph - 7);
    doc.text(`Página ${pageNum} de ${total}`, pw - MARGIN, ph - 7, { align: "right" });
  };

  const h1 = (text, y) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 58, 92);
    doc.text(text, MARGIN, y);
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y + 1.5, pw - MARGIN, y + 1.5);
    return y + 7;
  };

  const bodyText = (text, y) => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach(line => {
      if (y > ph - 20) {
        doc.addPage();
        y = HEADER_H + 6;
      }
      doc.text(line, MARGIN, y);
      y += 5.5;
    });
    return y + 2;
  };

  const checkPage = (y, needed = 25) => {
    if (y + needed > ph - 20) {
      doc.addPage();
      return HEADER_H + 6;
    }
    return y;
  };

  // ── PAGE 1 header ──
  let y = HEADER_H + 8;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 58, 92);
  doc.text(TITLE_SHORT, pw / 2, y, { align: "center" });
  y += 7;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(50, 50, 50);
  doc.text(`Dispensario: ${sede}`, pw / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${fecha}`, pw / 2, y, { align: "center" });
  y += 4.5;
  doc.text(`Realizada por: ${auditorNombre}     |     Recibida por: ${receptorNombre}`, pw / 2, y, { align: "center" });
  y += 10;

  y = h1("Introducción", y);
  y = bodyText("En cumplimiento del programa de auditorías internas y en el marco del Sistema de Gestión de Calidad y Control Interno, se realizó auditoría a la droguería comercial con el propósito de verificar el cumplimiento de los requisitos normativos, técnicos y operativos aplicables al servicio farmacéutico, así como la adecuada implementación de los procedimientos institucionales.", y);

  y = checkPage(y);
  y = h1("Objetivo", y);
  y = bodyText(`Evaluar las condiciones legales, técnicas, locativas y operativas de ${sede}, determinando el nivel de cumplimiento frente a los criterios establecidos y formulando hallazgos y recomendaciones orientadas al mejoramiento continuo.`, y);

  y = checkPage(y);
  y = h1("Alcance", y);
  y = bodyText("La auditoría comprendió la revisión de la documentación legal y del sistema de gestión, la verificación de evidencias de ejecución del Sistema de Garantía de Calidad, la gestión del establecimiento farmacéutico, el talento humano, la infraestructura física y mobiliarios, así como la adecuada definición y funcionamiento de las áreas específicas del servicio farmacéutico.", y);

  y = checkPage(y);
  y = h1("Metodología", y);
  y = bodyText("La auditoría se desarrolló mediante visita presencial al establecimiento, observación directa de las condiciones físicas y operativas, revisión documental de soportes y procedimientos, validación selectiva de registros, y muestreo físico de inventarios.", y);

  y = checkPage(y);
  y = h1("Resultados y hallazgos", y);
  for (const [comp, items] of Object.entries(groups)) {
    const conclusion = (audit.conclusiones || {})[comp] || "Sin conclusiones registradas para este componente.";
    y = checkPage(y, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    const compLines = doc.splitTextToSize(comp, contentW);
    compLines.forEach(l => { doc.text(l, MARGIN, y); y += 5; });
    y = bodyText(conclusion, y);
  }

  y = checkPage(y, 40);
  y = h1("Hallazgos evidenciados", y);
  if (noConformeItems.length > 0) {
    doc.autoTable({
      startY: y,
      margin: { left: MARGIN, right: MARGIN },
      head: [["N°", "Criterio de auditoría", "Hallazgo", "Proceso responsable"]],
      body: noConformeItems.map(f => [f.num, f.criterio, f.descripcion || "—", f.procesoResponsable || "—"]),
      styles: { fontSize: 8.5, cellPadding: 3, font: "helvetica", textColor: [50,50,50], overflow: "linebreak" },
      headStyles: { fillColor: [26, 58, 92], textColor: 255, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 58 }, 2: { cellWidth: 65 }, 3: { cellWidth: 37 } },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      didDrawPage: () => { /* headers added at end */ }
    });
    y = doc.lastAutoTable.finalY + 8;
  } else {
    y = bodyText("No se registraron no conformidades en esta auditoría.", y);
  }

  y = checkPage(y, 30);
  y = h1("Conclusiones", y);
  y = bodyText(`De acuerdo con los resultados de la auditoría, ${sede} alcanza un porcentaje de cumplimiento del ${pct}%, con ${conformes} criterios conformes, ${noConformes} no conformidades y ${observaciones} observaciones. Se identifican oportunidades de mejora que requieren intervención para fortalecer el cumplimiento normativo, optimizar los procesos y asegurar la calidad en la prestación del servicio farmacéutico.`, y);

  // ── Firmas ──
  y = checkPage(y, 60);
  y = h1("Firmas", y);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text("La firma representa la aceptación de los resultados de la auditoría.", pw / 2, y, { align: "center" });
  y += 8;

  const colW = (contentW - 15) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colW + 15;
  const boxH = 20;

  // Receptor (izquierda)
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.rect(leftX, y, colW, boxH);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text("Firma", leftX + 3, y + 5);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 58, 92);
  const recepLines = doc.splitTextToSize(receptorNombre.toUpperCase(), colW - 4);
  doc.text(recepLines, leftX + colW / 2, y + boxH + 6, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Receptor / Aceptante", leftX + colW / 2, y + boxH + 11, { align: "center" });

  // Auditor (derecha)
  doc.setDrawColor(180, 180, 180);
  doc.rect(rightX, y, colW, boxH);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text("Firma", rightX + 3, y + 5);
  if (auditorFirma) {
    try {
      const ext = auditorFirma.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(auditorFirma, ext, rightX + 3, y + 1, colW - 6, boxH - 2);
    } catch(e) {}
  }
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(26, 58, 92);
  const audLines = doc.splitTextToSize(auditorNombre.toUpperCase(), colW - 4);
  doc.text(audLines, rightX + colW / 2, y + boxH + 6, { align: "center" });
  if (auditorCargo) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(auditorCargo, rightX + colW / 2, y + boxH + 11, { align: "center" });
  }

  // ── Add headers + footers to ALL pages ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addHeader(i);
    addFooter(i, totalPages);
  }

  const safeSede = sede.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/g, "").trim();
  doc.save(`Informe_${safeSede}_${fecha}.pdf`);
}


function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function createNewAudit(tipo) {
  const criteria = tipo === "gestion" ? GESTION_CRITERIA : CI_CRITERIA;
  return {
    id: generateId(),
    tipo,
    sede: "",
    fecha: new Date().toISOString().split("T")[0],
    realizadaPor: "",
    recibidaPor: "",
    items: criteria.map((c, i) => ({
      num: i + 1,
      componente: c.componente,
      criterio: c.criterio,
      aclaracion: c.aclaracion || "",
      estado: "",
      descripcion: "",
    })),
  };
}

// ── Badge Component ──
function EstadoBadge({ estado, small }) {
  if (!estado) return <span style={{ color: "#aaa", fontSize: small ? 11 : 12 }}>Sin evaluar</span>;
  const c = ESTADO_COLORS[estado] || {};
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "2px 8px" : "3px 10px",
      borderRadius: 4,
      fontSize: small ? 11 : 12,
      fontWeight: 600,
      backgroundColor: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      letterSpacing: 0.3,
    }}>{estado}</span>
  );
}

// ── Summary Stats ──
function SummaryStats({ items }) {
  const conformes = items.filter(i => i.estado === "Conforme").length;
  const noConformes = items.filter(i => i.estado === "No conforme").length;
  const observaciones = items.filter(i => i.estado === "Observación").length;
  const noAplica = items.filter(i => i.estado === "No aplica").length;
  const evaluados = conformes + noConformes + observaciones;
  const pct = evaluados > 0 ? ((conformes + observaciones) / evaluados * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Conformes", val: conformes, color: "#28a745" },
    { label: "No conformes", val: noConformes, color: "#dc3545" },
    { label: "Observaciones", val: observaciones, color: "#ffc107" },
    { label: "No aplica", val: noAplica, color: "#6c757d" },
  ];

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
      {stats.map(s => (
        <div key={s.label} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 8,
          backgroundColor: "#f8f9fa", border: "1px solid #e9ecef",
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: "50%",
            backgroundColor: s.color, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13,
          }}>{s.val}</span>
          <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>{s.label}</span>
        </div>
      ))}
      <div style={{
        marginLeft: "auto", padding: "6px 16px", borderRadius: 8,
        background: "linear-gradient(135deg, #1a5276, #2980b9)",
        color: "#fff", fontWeight: 700, fontSize: 14,
      }}>
        Cumplimiento: {pct}%
      </div>
    </div>
  );
}


// ── AdminModal ──
function AdminModal({ onConfirm, onCancel, mensaje }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (inputRef.current) inputRef.current.focus(); }, []);

  const handleSubmit = () => {
    if (password === "CoordinadorQCI*") {
      setError(false);
      onConfirm();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        background: "#fff", borderRadius: 14, padding: 32, width: 360,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a3a5c" }}>
            Permiso de Administrador
          </h3>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>{mensaje}</p>
        </div>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Contraseña de administrador..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 8, boxSizing: "border-box",
            border: `2px solid ${error ? "#dc3545" : "#ddd"}`, fontSize: 14,
            outline: "none", marginBottom: 6,
          }}
        />
        {error && <div style={{ color: "#dc3545", fontSize: 12, marginBottom: 10 }}>Contraseña incorrecta. Inténtalo de nuevo.</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #ddd",
            background: "#f8f9fa", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>Cancelar</button>
          <button onClick={handleSubmit} style={{
            flex: 1, padding: "10px", borderRadius: 8, border: "none",
            background: "#1a5276", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ── SearchableSelect ──
function SearchableSelect({ value, onChange, options, placeholder, style }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} style={{ position: "relative", ...style }}>
      <input
        value={open ? query : value}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(""); setOpen(true); }}
        placeholder={value || placeholder}
        style={{
          width: "100%", padding: "8px 12px", borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)",
          color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", cursor: "pointer",
        }}
      />
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: "#fff", border: "1px solid #ddd", borderRadius: 6,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", maxHeight: 200, overflowY: "auto", marginTop: 2,
        }}>
          {filtered.length === 0 && (
            <div style={{ padding: "10px 14px", color: "#aaa", fontSize: 13 }}>Sin resultados</div>
          )}
          {filtered.map(o => (
            <div key={o} onClick={() => { onChange(o); setOpen(false); setQuery(""); }}
              style={{
                padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "#333",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = "#f0f6ff"}
              onMouseOut={e => e.currentTarget.style.backgroundColor = ""}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ConfigView ──
function ConfigView({ config, onSave, onBack }) {
  const [sedes, setSedes] = useState([...config.sedes]);
  const [auditores, setAuditores] = useState([...(config.auditores || []).map(a => typeof a === "string" ? { nombre: a, cargo: "", firma: "" } : a)]);
  const [receptores, setReceptores] = useState([...config.receptores]);
  const [procesos, setProcesos] = useState([...(config.procesos || [])]);
  const [newSede, setNewSede] = useState("");
  const [newReceptor, setNewReceptor] = useState("");
  const [newProceso, setNewProceso] = useState("");
  const [newAuditorNombre, setNewAuditorNombre] = useState("");
  const [newAuditorCargo, setNewAuditorCargo] = useState("");
  const [activeTab, setActiveTab] = useState("sedes");

  const addItem = (list, setList, value, setValue) => {
    const trimmed = value.trim();
    if (!trimmed || list.includes(trimmed)) return;
    setList([...list, trimmed]);
    setValue("");
  };

  const removeItem = (list, setList, item) => {
    setList(list.filter(i => i !== item));
  };

  const addAuditor = () => {
    const nombre = newAuditorNombre.trim();
    if (!nombre) return;
    if (auditores.some(a => a.nombre === nombre)) return;
    setAuditores([...auditores, { nombre, cargo: newAuditorCargo.trim(), firma: "" }]);
    setNewAuditorNombre("");
    setNewAuditorCargo("");
  };

  const removeAuditor = (nombre) => {
    setAuditores(auditores.filter(a => a.nombre !== nombre));
  };

  const updateAuditorFirma = (nombre, firmaBase64) => {
    setAuditores(auditores.map(a => a.nombre === nombre ? { ...a, firma: firmaBase64 } : a));
  };

  const updateAuditorField = (nombre, field, value) => {
    setAuditores(auditores.map(a => a.nombre === nombre ? { ...a, [field]: value } : a));
  };

  const handleFirmaUpload = (nombre, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAuditorFirma(nombre, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({ sedes, auditores, receptores, procesos });
    onBack();
  };

  const simpleTabs = [
    { key: "sedes", label: "🏥 Sedes", list: sedes, setList: setSedes, newVal: newSede, setNewVal: setNewSede, placeholder: "Nombre de la sede..." },
    { key: "receptores", label: "👥 Receptores", list: receptores, setList: setReceptores, newVal: newReceptor, setNewVal: setNewReceptor, placeholder: "Nombre del receptor..." },
    { key: "procesos", label: "🔧 Proceso Responsable", list: procesos, setList: setProcesos, newVal: newProceso, setNewVal: setNewProceso, placeholder: "Nombre del proceso responsable..." },
  ];

  const current = simpleTabs.find(t => t.key === activeTab);

  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, #0c2340 0%, #1a5276 100%)",
        borderRadius: 12, padding: 24, color: "#fff", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>CONFIGURACIÓN</div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Gestión de Parámetros</h2>
        </div>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
          color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13,
        }}>← Volver</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[...simpleTabs, { key: "auditores", label: "👤 Auditores" }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: "10px 20px", borderRadius: 8, border: "2px solid",
            borderColor: activeTab === t.key ? "#1a5276" : "#e0e0e0",
            backgroundColor: activeTab === t.key ? "#1a5276" : "#fff",
            color: activeTab === t.key ? "#fff" : "#555",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>{t.label} <span style={{
            marginLeft: 6, background: activeTab === t.key ? "rgba(255,255,255,0.2)" : "#eee",
            borderRadius: 10, padding: "1px 7px", fontSize: 11,
          }}>{t.key === "auditores" ? auditores.length : t.key === "sedes" ? sedes.length : t.key === "receptores" ? receptores.length : procesos.length}</span>
          </button>
        ))}
      </div>

      {/* Content — Auditores tab (special) */}
      {activeTab === "auditores" && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8edf2", padding: 24 }}>
          {/* Add auditor form */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, marginBottom: 24 }}>
            <input value={newAuditorNombre} onChange={e => setNewAuditorNombre(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAuditor()}
              placeholder="Nombre del auditor..."
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" }} />
            <input value={newAuditorCargo} onChange={e => setNewAuditorCargo(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addAuditor()}
              placeholder="Cargo..."
              style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" }} />
            <button onClick={addAuditor} style={{
              padding: "10px 20px", borderRadius: 8, background: "#1a5276", color: "#fff",
              border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
            }}>+ Agregar</button>
          </div>

          {auditores.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 13 }}>No hay auditores. Agrega el primero.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {auditores.map(a => (
                <div key={a.nombre} style={{
                  borderRadius: 10, border: "1px solid #e0e8f0", background: "#f8fbff", padding: 16,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", display: "block", marginBottom: 4 }}>NOMBRE</label>
                        <input value={a.nombre} onChange={e => updateAuditorField(a.nombre, "nombre", e.target.value)}
                          style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #d0dce8", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", display: "block", marginBottom: 4 }}>CARGO</label>
                        <input value={a.cargo} onChange={e => updateAuditorField(a.nombre, "cargo", e.target.value)}
                          placeholder="Cargo del auditor..."
                          style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #d0dce8", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    <button onClick={() => removeAuditor(a.nombre)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#ccc", fontSize: 20, padding: "2px 8px", marginLeft: 10,
                    }}
                      onMouseOver={e => e.currentTarget.style.color = "#dc3545"}
                      onMouseOut={e => e.currentTarget.style.color = "#ccc"}
                    >×</button>
                  </div>
                  {/* Firma */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", display: "block", marginBottom: 6 }}>FIRMA</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {a.firma ? (
                        <>
                          <img src={a.firma} alt="firma" style={{ height: 48, border: "1px solid #ddd", borderRadius: 4, background: "#fff", padding: 4 }} />
                          <button onClick={() => updateAuditorFirma(a.nombre, "")} style={{
                            fontSize: 12, color: "#dc3545", background: "none", border: "1px solid #dc3545",
                            borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                          }}>Quitar firma</button>
                        </>
                      ) : (
                        <label style={{
                          display: "inline-block", padding: "7px 16px", borderRadius: 6,
                          background: "#e8f0fe", border: "1px dashed #4a90d9",
                          color: "#1a5276", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>
                          📎 Subir firma (PNG)
                          <input type="file" accept="image/png,image/jpeg"
                            onChange={e => handleFirmaUpload(a.nombre, e)}
                            style={{ display: "none" }} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content — Simple tabs */}
      {activeTab !== "auditores" && current && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8edf2", padding: 24 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input
              value={current.newVal}
              onChange={e => current.setNewVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addItem(current.list, current.setList, current.newVal, current.setNewVal)}
              placeholder={current.placeholder}
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" }}
            />
            <button onClick={() => addItem(current.list, current.setList, current.newVal, current.setNewVal)} style={{
              padding: "10px 20px", borderRadius: 8, background: "#1a5276", color: "#fff",
              border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>+ Agregar</button>
          </div>
          {current.list.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "#aaa" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 13 }}>No hay elementos. Agrega el primero.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {current.list.map(item => (
                <div key={item} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 8, background: "#f8f9fa", border: "1px solid #e9ecef",
                }}>
                  <span style={{ fontSize: 14, color: "#333" }}>{item}</span>
                  <button onClick={() => removeItem(current.list, current.setList, item)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#ccc", fontSize: 18, padding: "2px 6px", borderRadius: 4,
                  }}
                    onMouseOver={e => e.currentTarget.style.color = "#dc3545"}
                    onMouseOut={e => e.currentTarget.style.color = "#ccc"}
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} style={{
          padding: "12px 32px", borderRadius: 8, background: "#28a745", color: "#fff",
          border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
        }}>💾 Guardar cambios</button>
      </div>
    </div>
  );
}

// ── Audit Form (Formulario 1) ──
function AuditForm({ audit, onUpdate, onBack, onLock, onRequestEdit, config = { sedes: [], auditores: [], receptores: [], procesos: [] } }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (idx) => {
    setExpandedRows(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });
  };

  const updateHeader = (field, value) => {
    onUpdate({ ...audit, [field]: value });
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...audit.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    onUpdate({ ...audit, items: newItems });
  };

  const updateConclusion = (componente, value) => {
    const conclusiones = { ...(audit.conclusiones || {}), [componente]: value };
    onUpdate({ ...audit, conclusiones });
  };

  // Group items by componente
  const groups = [];
  let currentComp = "";
  audit.items.forEach((item, idx) => {
    if (item.componente !== currentComp) {
      currentComp = item.componente;
      groups.push({ componente: currentComp, items: [] });
    }
    groups[groups.length - 1].items.push({ ...item, _idx: idx });
  });

  const tipoLabel = audit.tipo === "gestion"
    ? "REGISTRO DE AUDITORÍA DE GESTIÓN A ESTABLECIMIENTOS FARMACÉUTICOS"
    : "AUDITORÍA DE CONTROL INTERNO";

  return (
    <div>
      {/* Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a5c 0%, #2b6cb0 100%)",
        borderRadius: 12, padding: 24, color: "#fff", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>MEDIFARMA</div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{tipoLabel}</h2>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>CÓDIGO: FT-GCCI-01 | VERSIÓN: 2</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!audit.bloqueado && (
              <button onClick={onLock} style={{
                background: "rgba(40,167,69,0.85)", border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
              }}>💾 Guardar informe</button>
            )}
            {audit.bloqueado && (
              <>
                <button onClick={() => generateWord(audit, config)} style={{
                  background: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.3)",
                  color: "#1a3a5c", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
                }}>📄 Descargar PDF</button>
                <button onClick={onRequestEdit} style={{
                  background: "rgba(255,193,7,0.85)", border: "1px solid rgba(255,255,255,0.3)",
                  color: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer",
                  fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
                }}>🔒 Editar informe</button>
              </>
            )}
            <button onClick={onBack} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
              fontSize: 13, fontWeight: 500,
            }}>← Volver</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Sede / Establecimiento</label>
            {audit.bloqueado
              ? <div style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, opacity: 0.8 }}>{audit.sede || "—"}</div>
              : <SearchableSelect value={audit.sede} onChange={v => updateHeader("sede", v)} options={config.sedes.includes(audit.sede) ? config.sedes : audit.sede ? [audit.sede, ...config.sedes] : config.sedes} placeholder="Buscar sede..." />
            }
          </div>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Fecha de la Auditoría</label>
            <input type="date" value={audit.fecha} onChange={e => !audit.bloqueado && updateHeader("fecha", e.target.value)}
              disabled={!!audit.bloqueado}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                opacity: audit.bloqueado ? 0.7 : 1,
              }} />
          </div>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Realizada por</label>
            {audit.bloqueado
              ? <div style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, opacity: 0.8 }}>{audit.realizadaPor || "—"}</div>
              : <SearchableSelect value={audit.realizadaPor} onChange={v => updateHeader("realizadaPor", v)}
                  options={(() => { const nombres = (config.auditores || []).map(a => typeof a === "string" ? a : a.nombre); return nombres.includes(audit.realizadaPor) ? nombres : audit.realizadaPor ? [audit.realizadaPor, ...nombres] : nombres; })()}
                  placeholder="Buscar auditor..." />
            }
          </div>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Recibida por</label>
            {audit.bloqueado
              ? <div style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, opacity: 0.8 }}>{audit.recibidaPor || "—"}</div>
              : <SearchableSelect value={audit.recibidaPor} onChange={v => updateHeader("recibidaPor", v)} options={config.receptores.includes(audit.recibidaPor) ? config.receptores : audit.recibidaPor ? [audit.recibidaPor, ...config.receptores] : config.receptores} placeholder="Buscar receptor..." />
            }
          </div>
        </div>
      </div>

      <SummaryStats items={audit.items} />

      {/* Criteria Groups */}
      {groups.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 16 }}>
          <div style={{
            background: "#1a3a5c", color: "#fff", padding: "10px 16px",
            borderRadius: "8px 8px 0 0", fontSize: 12, fontWeight: 700,
            letterSpacing: 0.5,
          }}>
            {group.componente}
          </div>
          <div style={{ border: "1px solid #dee2e6", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
            {group.items.map((item) => {
              const isExpanded = expandedRows.has(item._idx);
              return (
                <div key={item._idx} style={{
                  borderBottom: "1px solid #eee",
                  backgroundColor: item._idx % 2 === 0 ? "#fff" : "#fafbfc",
                }}>
                  {/* Row summary */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 160px 44px",
                    alignItems: "center",
                    padding: "10px 12px",
                    gap: 10,
                    cursor: "pointer",
                  }}
                    onClick={() => toggleRow(item._idx)}
                  >
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: "#1a3a5c",
                      textAlign: "center",
                    }}>{item.num}</span>
                    <span style={{ fontSize: 13, color: "#333", lineHeight: 1.4 }}>
                      {item.criterio}
                    </span>
                    <div onClick={e => e.stopPropagation()}>
                      <select
                        value={item.estado}
                        onChange={e => !audit.bloqueado && updateItem(item._idx, "estado", e.target.value)}
                        disabled={!!audit.bloqueado}
                        style={{
                          width: "100%", padding: "6px 8px", borderRadius: 5,
                          border: `2px solid ${ESTADO_COLORS[item.estado]?.border || "#ccc"}`,
                          backgroundColor: ESTADO_COLORS[item.estado]?.bg || "#fff",
                          color: ESTADO_COLORS[item.estado]?.text || "#333",
                          fontSize: 12, fontWeight: 600,
                          cursor: audit.bloqueado ? "not-allowed" : "pointer",
                          outline: "none", opacity: audit.bloqueado ? 0.8 : 1,
                        }}
                      >
                        {ESTADOS.map(e => <option key={e} value={e}>{e || "— Seleccionar —"}</option>)}
                      </select>
                    </div>
                    <span style={{
                      fontSize: 16, color: "#999", transition: "transform 0.2s",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      textAlign: "center",
                    }}>▼</span>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{
                      padding: "0 12px 14px 52px",
                      background: "#f5f7fa",
                      borderTop: "1px solid #eef0f2",
                    }}>
                      {item.aclaracion && item.aclaracion !== "NO APLICA" && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", marginBottom: 3 }}>
                            ACLARACIÓN DE EVIDENCIA A SOLICITAR
                          </div>
                          <div style={{
                            fontSize: 12, color: "#555", backgroundColor: "#e8edf2",
                            padding: "8px 12px", borderRadius: 6, lineHeight: 1.5,
                          }}>
                            {item.aclaracion}
                          </div>
                        </div>
                      )}
                      {item.estado === "No conforme" && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", marginBottom: 3 }}>
                            PROCESO RESPONSABLE
                          </div>
                          <select
                            value={item.procesoResponsable || ""}
                            onChange={e => !audit.bloqueado && updateItem(item._idx, "procesoResponsable", e.target.value)}
                            disabled={!!audit.bloqueado}
                            style={{
                              width: "100%", padding: "8px 12px", borderRadius: 6,
                              border: "1px solid #d1d5db", fontSize: 13,
                              outline: "none", backgroundColor: "#fff", color: "#333",
                              cursor: audit.bloqueado ? "not-allowed" : "pointer",
                              opacity: audit.bloqueado ? 0.8 : 1,
                            }}
                          >
                            <option value="">— Seleccionar proceso —</option>
                            {(config.procesos || []).map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                            {item.procesoResponsable && !(config.procesos || []).includes(item.procesoResponsable) && (
                              <option value={item.procesoResponsable}>{item.procesoResponsable}</option>
                            )}
                          </select>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#1a3a5c", marginBottom: 3 }}>
                          DESCRIPCIÓN DEL HALLAZGO
                        </div>
                        <textarea
                          value={item.descripcion}
                          onChange={e => !audit.bloqueado && updateItem(item._idx, "descripcion", e.target.value)}
                          readOnly={!!audit.bloqueado}
                          placeholder="Describa el hallazgo encontrado..."
                          rows={3}
                          style={{
                            width: "100%", padding: "8px 12px", borderRadius: 6,
                            border: "1px solid #d1d5db", fontSize: 13,
                            resize: audit.bloqueado ? "none" : "vertical",
                            outline: "none", boxSizing: "border-box",
                            lineHeight: 1.5,
                            backgroundColor: audit.bloqueado ? "#f5f5f5" : "#fff",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Conclusiones del componente */}
          <div style={{
            borderTop: "2px solid #e8edf2", backgroundColor: "#f0f4f8",
            padding: "14px 16px",
            borderRadius: "0 0 8px 8px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3a5c", marginBottom: 6, letterSpacing: 0.5 }}>
              CONCLUSIONES DEL COMPONENTE
            </div>
            <textarea
              value={(audit.conclusiones || {})[group.componente] || ""}
              onChange={e => !audit.bloqueado && updateConclusion(group.componente, e.target.value)}
              readOnly={!!audit.bloqueado}
              placeholder="Escriba las conclusiones generales de este componente..."
              rows={2}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 6,
                border: "1px solid #c8d6e5", fontSize: 13,
                resize: audit.bloqueado ? "none" : "vertical",
                outline: "none", boxSizing: "border-box",
                lineHeight: 1.5,
                backgroundColor: audit.bloqueado ? "#e8edf2" : "#fff",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── No Conformidades View (Formulario 2) ──
function NoConformidadesView({ audits, onBack }) {
  const [filtroSede, setFiltroSede] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("No conforme");
  const [expandedAudits, setExpandedAudits] = useState({});

  const toggleAudit = (auditId) => {
    setExpandedAudits(prev => ({ ...prev, [auditId]: !prev[auditId] }));
  };

  // Build list of audits with their matching findings
  const auditosConHallazgos = audits.map(a => {
    const findings = a.items.filter(item =>
      item.estado === filtroEstado ||
      (filtroEstado === "todos_nc" && (item.estado === "No conforme" || item.estado === "Observación"))
    ).map(item => ({
      ...item,
      tipo: a.tipo === "gestion" ? "Gestión" : "Control Interno",
    }));
    return { ...a, findings };
  }).filter(a => {
    const matchSede = filtroSede === "todas" || a.sede === filtroSede;
    return matchSede && a.findings.length > 0;
  });

  const totalHallazgos = auditosConHallazgos.reduce((s, a) => s + a.findings.length, 0);
  const sedes = [...new Set(audits.map(a => a.sede || "(Sin sede)"))].sort();

  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, #922b21 0%, #c0392b 100%)",
        borderRadius: 12, padding: 24, color: "#fff", marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 4 }}>FORMULARIO 2</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Hallazgos y No Conformidades</h2>
          </div>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer",
            fontSize: 13, fontWeight: 500,
          }}>← Volver</button>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Sede</label>
            <select value={filtroSede} onChange={e => setFiltroSede(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 13, outline: "none",
              }}>
              <option value="todas" style={{color:"#333"}}>Todas las sedes</option>
              {sedes.map(s => <option key={s} value={s} style={{color:"#333"}}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, opacity: 0.7, display: "block", marginBottom: 2 }}>Estado del Hallazgo</label>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
              style={{
                padding: "8px 12px", borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 13, outline: "none",
              }}>
              <option value="No conforme" style={{color:"#333"}}>No conformes</option>
              <option value="Observación" style={{color:"#333"}}>Observaciones</option>
              <option value="todos_nc" style={{color:"#333"}}>No conformes + Observaciones</option>
            </select>
          </div>
          <div style={{
            marginLeft: "auto", display: "flex", alignItems: "flex-end",
            padding: "8px 16px", borderRadius: 8,
            background: "rgba(255,255,255,0.15)",
            fontWeight: 700, fontSize: 22,
          }}>
            {totalHallazgos}
            <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 6, opacity: 0.8 }}>hallazgos</span>
          </div>
        </div>
      </div>

      {auditosConHallazgos.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 60, color: "#999",
          border: "2px dashed #ddd", borderRadius: 12, margin: "20px 0",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No se encontraron hallazgos</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>
            {audits.length === 0 ? "Aún no hay auditorías registradas." : "No hay hallazgos con los filtros seleccionados."}
          </div>
        </div>
      ) : (
        auditosConHallazgos.map(a => {
          const isOpen = !!expandedAudits[a.id];
          const nc = a.findings.filter(f => f.estado === "No conforme").length;
          const obs = a.findings.filter(f => f.estado === "Observación").length;
          return (
            <div key={a.id} style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0" }}>
              {/* Audit header row - always visible */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#2c3e50", color: "#fff",
                padding: "12px 16px", cursor: "pointer", gap: 12,
              }} onClick={() => toggleAudit(a.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a.sede || "(Sin sede)"}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{a.fecha}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                    {nc > 0 && <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "#dc3545", color: "#fff", padding: "2px 8px", borderRadius: 6 }}>{nc} NC</span>}
                    {obs > 0 && <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "#ffc107", color: "#333", padding: "2px 8px", borderRadius: 6 }}>{obs} OBS</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>{isOpen ? "Ocultar" : "Ver reporte"}</span>
                  <span style={{
                    fontSize: 14, transition: "transform 0.2s",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    display: "inline-block",
                  }}>▼</span>
                </div>
              </div>

              {/* Expanded findings */}
              {isOpen && (
                <div style={{ border: "none" }}>
                  {a.findings.map((f, i) => (
                    <div key={i} style={{
                      padding: "14px 16px",
                      borderBottom: i < a.findings.length - 1 ? "1px solid #eee" : "none",
                      backgroundColor: i % 2 === 0 ? "#fff" : "#fafbfc",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#fff",
                          backgroundColor: "#1a3a5c", borderRadius: 4, padding: "2px 8px",
                        }}>#{f.num}</span>
                        <EstadoBadge estado={f.estado} small />
                      </div>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 4, fontWeight: 500 }}>
                        {f.componente}
                      </div>
                      <div style={{ fontSize: 13, color: "#333", lineHeight: 1.4, marginBottom: 6 }}>
                        {f.criterio}
                      </div>
                      {f.procesoResponsable && (
                        <div style={{
                          fontSize: 12, color: "#1e5799",
                          backgroundColor: "#eaf1fb",
                          padding: "6px 12px", borderRadius: 6,
                          borderLeft: "3px solid #2980b9",
                          marginBottom: 6, lineHeight: 1.5,
                        }}>
                          <strong>Proceso responsable:</strong> {f.procesoResponsable}
                        </div>
                      )}
                      {f.descripcion && (
                        <div style={{
                          fontSize: 12, color: "#555",
                          backgroundColor: f.estado === "No conforme" ? "#fef2f2" : "#fffbeb",
                          padding: "8px 12px", borderRadius: 6,
                          borderLeft: `3px solid ${f.estado === "No conforme" ? "#dc3545" : "#ffc107"}`,
                          lineHeight: 1.5,
                        }}>
                          <strong>Hallazgo:</strong> {f.descripcion}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Main App ──
const DEFAULT_CONFIG = { sedes: [], auditores: [], receptores: [], procesos: [] }; // auditores: [{nombre, cargo, firma}]

export default function App() {
  const [audits, setAudits] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [currentView, setCurrentView] = useState("home"); // home, form, nc, config
  const [activeAuditId, setActiveAuditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditorias-data");
      if (saved) setAudits(JSON.parse(saved));
      const savedConfig = localStorage.getItem("auditorias-config");
      if (savedConfig) setConfig(JSON.parse(savedConfig));
    } catch (e) { /* primera vez */ }
    setLoading(false);
  }, []);

  // Guarda auditorías en localStorage
  const saveAudits = useCallback((newAudits) => {
    setAudits(newAudits);
    try {
      localStorage.setItem("auditorias-data", JSON.stringify(newAudits));
    } catch (e) { console.error("Error al guardar:", e); }
  }, []);

  // Guarda config en localStorage
  const saveConfig = useCallback((newConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem("auditorias-config", JSON.stringify(newConfig));
    } catch (e) { console.error("Error al guardar config:", e); }
  }, []);

  const createAudit = (tipo) => {
    const newAudit = createNewAudit(tipo);
    const updated = [...audits, newAudit];
    saveAudits(updated);
    setActiveAuditId(newAudit.id);
    setCurrentView("form");
  };

  const openAudit = (id) => {
    setActiveAuditId(id);
    setCurrentView("form");
  };

  const updateAudit = (updatedAudit) => {
    const updated = audits.map(a => a.id === updatedAudit.id ? updatedAudit : a);
    saveAudits(updated);
  };

  const [adminModal, setAdminModal] = useState(null); // { action, payload }

  const deleteAudit = (id) => {
    const audit = audits.find(a => a.id === id);
    if (audit?.bloqueado) {
      setAdminModal({ action: "delete", payload: id, mensaje: "Esta auditoría está guardada. Se requiere contraseña para eliminarla." });
    } else {
      if (confirm("¿Está seguro de eliminar esta auditoría?")) {
        saveAudits(audits.filter(a => a.id !== id));
      }
    }
  };

  const lockAudit = (id) => {
    if (confirm("¿Guardar el informe? Ya no podrá modificarse sin contraseña de administrador.")) {
      const updated = audits.map(a => a.id === id ? { ...a, bloqueado: true } : a);
      saveAudits(updated);
    }
  };

  const unlockAudit = (id) => {
    const updated = audits.map(a => a.id === id ? { ...a, bloqueado: false } : a);
    saveAudits(updated);
  };

  const handleAdminConfirm = () => {
    if (!adminModal) return;
    if (adminModal.action === "delete") {
      saveAudits(audits.filter(a => a.id !== adminModal.payload));
    } else if (adminModal.action === "unlock") {
      unlockAudit(adminModal.payload);
      setCurrentView("form");
    }
    setAdminModal(null);
  };

  const activeAudit = audits.find(a => a.id === activeAuditId);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center", color: "#666" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', -apple-system, sans-serif",
      maxWidth: 1100, margin: "0 auto", padding: "20px 16px",
      color: "#333",
    }}>
      {/* Navigation Bar */}
      {currentView === "home" && (
        <>
          {/* Hero Header */}
          <div style={{
            background: "linear-gradient(135deg, #0c2340 0%, #1a5276 50%, #2980b9 100%)",
            borderRadius: 16, padding: "28px 28px", color: "#fff",
            marginBottom: 24, position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{
              position: "absolute", top: -30, right: -30, width: 160, height: 160,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)",
            }} />
            <div style={{
              position: "absolute", bottom: -40, right: 80, width: 100, height: 100,
              borderRadius: "50%", background: "rgba(255,255,255,0.03)",
            }} />
            {/* Logo */}
            <div style={{ flexShrink: 0 }}>
              <img
                src="data:image/jpeg;base64,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"
                alt="MEDIfarma"
                style={{ height: 70, width: "auto", display: "block", mixBlendMode: "screen" }}
              />
            </div>
            {/* Títulos */}
            <div style={{ marginLeft: "auto", textAlign: "right", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.6, marginBottom: 6, fontWeight: 700 }}>
                GESTIÓN DE CALIDAD Y CONTROL INTERNO
              </div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
                Sistema de Auditorías Internas y Externas
              </h1>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                FT-GCCI-01 v2
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
            <button onClick={() => createAudit("gestion")} style={{
              background: "#fff", border: "2px solid #e8edf2", borderRadius: 12,
              padding: "20px 16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#2980b9"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(41,128,185,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#e8edf2"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1a3a5c", marginBottom: 4 }}>Nueva Auditoría de Gestión</div>
              <div style={{ fontSize: 12, color: "#888" }}>61 criterios · 7 componentes</div>
            </button>

            <button onClick={() => setCurrentView("nc")} style={{
              background: "#fff", border: "2px solid #e8edf2", borderRadius: 12,
              padding: "20px 16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(192,57,43,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#e8edf2"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#922b21", marginBottom: 4 }}>Ver No Conformidades</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {audits.reduce((s, a) => s + a.items.filter(i => i.estado === "No conforme").length, 0)} hallazgos registrados
              </div>
            </button>

            <button onClick={() => setCurrentView("config")} style={{
              background: "#fff", border: "2px solid #e8edf2", borderRadius: 12,
              padding: "20px 16px", cursor: "pointer", textAlign: "left",
              transition: "all 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "#27ae60"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(39,174,96,0.15)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "#e8edf2"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚙️</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e8449", marginBottom: 4 }}>Configuración</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {config.sedes.length} sedes · {(config.auditores || []).length} auditores
              </div>
            </button>
          </div>

          {/* Audit List */}
          {audits.length > 0 && (
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c", marginBottom: 12 }}>
                Auditorías Registradas ({audits.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...audits].reverse().map(a => {
                  const nc = a.items.filter(i => i.estado === "No conforme").length;
                  const obs = a.items.filter(i => i.estado === "Observación").length;
                  const conf = a.items.filter(i => i.estado === "Conforme").length;
                  const evaluated = a.items.filter(i => i.estado).length;
                  const total = a.items.length;
                  return (
                    <div key={a.id} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      background: "#fff", border: "1px solid #e8edf2",
                      borderRadius: 10, padding: "14px 16px",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                      onClick={() => openAudit(a.id)}
                      onMouseOver={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
                      onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: a.tipo === "gestion"
                          ? "linear-gradient(135deg, #1a5276, #2980b9)"
                          : "linear-gradient(135deg, #6c3483, #8e44ad)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 18, flexShrink: 0,
                      }}>
                        {a.tipo === "gestion" ? "G" : "CI"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a3a5c" }}>
                          {a.sede || "(Sin sede asignada)"}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                          {a.fecha} · {a.realizadaPor || "—"} · {evaluated}/{total} evaluados
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {nc > 0 && <span style={{
                          fontSize: 11, fontWeight: 700, color: "#dc3545",
                          backgroundColor: "#fef2f2", padding: "3px 8px", borderRadius: 6,
                        }}>{nc} NC</span>}
                        {obs > 0 && <span style={{
                          fontSize: 11, fontWeight: 700, color: "#856404",
                          backgroundColor: "#fffbeb", padding: "3px 8px", borderRadius: 6,
                        }}>{obs} OBS</span>}
                        {conf > 0 && <span style={{
                          fontSize: 11, fontWeight: 700, color: "#155724",
                          backgroundColor: "#d4edda", padding: "3px 8px", borderRadius: 6,
                        }}>{conf} ✓</span>}
                      </div>
                      {a.bloqueado && (
                        <>
                          <button onClick={e => { e.stopPropagation(); generateWord(a, config); }}
                            style={{
                              background: "#1a5276", border: "none", borderRadius: 6,
                              color: "#fff", fontSize: 11, fontWeight: 700,
                              padding: "4px 10px", cursor: "pointer",
                            }}
                            title="Descargar informe Word"
                          >📄 PDF</button>
                          <span title="Informe guardado" style={{ fontSize: 16, color: "#28a745", padding: "4px 6px" }}>🔒</span>
                        </>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteAudit(a.id); }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "#ccc", fontSize: 18, padding: "4px 8px", borderRadius: 6,
                        }}
                        onMouseOver={e => e.currentTarget.style.color = "#dc3545"}
                        onMouseOut={e => e.currentTarget.style.color = "#ccc"}
                        title="Eliminar auditoría"
                      >×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {audits.length === 0 && (
            <div style={{
              textAlign: "center", padding: 48, color: "#aaa",
              border: "2px dashed #e0e0e0", borderRadius: 12,
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Sin auditorías registradas</div>
              <div style={{ fontSize: 13 }}>Cree una nueva auditoría para comenzar</div>
            </div>
          )}
        </>
      )}

      {adminModal && (
        <AdminModal
          mensaje={adminModal.mensaje}
          onConfirm={handleAdminConfirm}
          onCancel={() => setAdminModal(null)}
        />
      )}

      {currentView === "form" && activeAudit && (
        <AuditForm
          audit={activeAudit}
          onUpdate={updateAudit}
          onBack={() => setCurrentView("home")}
          onLock={() => lockAudit(activeAudit.id)}
          onRequestEdit={() => setAdminModal({ action: "unlock", payload: activeAudit.id, mensaje: "Ingrese la contraseña de administrador para editar este informe." })}
          config={config}
        />
      )}

      {currentView === "config" && (
        <ConfigView
          config={config}
          onSave={saveConfig}
          onBack={() => setCurrentView("home")}
        />
      )}

      {currentView === "nc" && (
        <NoConformidadesView
          audits={audits}
          onBack={() => setCurrentView("home")}
        />
      )}
    </div>
  );
}
