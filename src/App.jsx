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
    doc.addImage("data:image/jpeg;base64," + LOGO_B64, "JPEG", MARGIN, 4, 52, 15, "", "MULTIPLY");
    if (pageNum > 1) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80, 80, 80);
      doc.text(TITLE_SHORT, MARGIN + 55, 13);
    }
    doc.setDrawColor(26, 58, 92);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, HEADER_H - 2, pw - MARGIN, HEADER_H - 2);
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
