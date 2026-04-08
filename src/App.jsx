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
  const auditadoNombre = audit.recibidaPor || "—";

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

  const LOGO_B64 = "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riMOYe8HmF6KLzOEZrlktohpPoyOavZTQOeTSXaqiafgyMa/HrGF2bTsvs1NKJK+pqa4j4Bwxh9IHH51vuUWhHhWJGXMoIxLHqT3o46WngpadlPTQxwwsGGMY0Na0dwAXIiKwSSWkZgiIpAwiZRAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBETKAIiIAiIgCIiAIiIAiJlAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREACLAWUAREQBERAEREAREQBeTqq+0mnrS+uqsvOd2KNp4yOPID/jkvWUQbbKuSTUVHR7x6qCn3wOzecTk+xoVfxPLeLjSsj39DFdPkg2eBfNX3+7VDnzV8sER97DTvLGNHq4n1rp0Oob5QyiSkulXG4dhkLgfSDkFefgISAF8/eXfKXO5vf5Kt2Sb3smvZ5rAahidSVjGQ3CJu84N97I34zf6QtvVe9F1klHq21zREgmpZG7xa87pHsKsIu44LmzyqPn7roWWPY5x6habtH1rHpuJtHRtZNcpW7zQ73sTfjO7+3AW5KuWsqmSv1XdKmUknyl7Bnsa07oHsCnjGZPGpXJ3Z5yrnXDp6nHXaivdfKZaq6Vkjic4Epa0egDAC7ti1nqK0VDXw10tTED50FQ8vY4eviPUvBIAWMhcdDKujLnUnv8AJUK6ae0yxulL7SahtEdwpcsyd2SNx86Nw5g/8cl6yiDYVWSNvlfQ5PVy04lx3FrgM/7XzKX13fD8l5OPGb7l1j2eZWpMKJdom0ipjrprTp6QRNhcWTVYALi4cwzswOWfZ3qRNY1klBpW6VkJxJFSyOYe47pwVWhrcelaHGMydKVcHrZqZ+RKtKMfU78t4u8svWvule6TnvGpfn6VtWjto13tNQyG7TSXCgJAcX+dLGO9p7fQVpBOF+c5XPU5V1cuaMmVUL7IS2mWppZ4qmnjqIJGyRSNDmPaeDgeRXItH2J1klTopsMhJ8lnfE0n4vBwHq3sLeF29Fvm1xn7nRVT54KXuERFmMgREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQAIgRAEREARYysoAixlEBlEWMoDKjHbbaJnGkvcLC6NjeonI+Dxy0+jJI9YUnLjqYoqinfDPGyWJ7S17HDIcO4hamdirKpdT9TxZBTjylZt4rHEradoljobHemwW9sjYpG724528G+A7cenK8nT1FFcb1TUUzntjldhxYQDy7M5XzyePKFrrffsVDi1LlPX2X2eW6aqp5tw+T0ThPK7syPej054+oqdF0LHaaCzUDaO3QCKIcT2lx7ye0rvZXecLwliU8u9t9WWtNflx0ZUB7UbTNaNWVLyw+T1jjPC7HA5PnD0g/MQp7yvO1DZrdfLe6juUAljzvNIOHMPe09hU8Tw1l08u9NdUecinzYaK18Ss4Xo36jit93qaOFz3RxOw0vIz68YXu7MrBb79eJI7i2R8ULQ7ca7dDvA9uPRhcXXjynYq0UkYOUuVG0bDrNLHHV3yZhayZohgz8JoOXH0ZAHqKk9cdPHHBAyGGNkcbAGtY0YDQOwBfvPFd5iYyxqVWvQvqq1XBRR1b1QsuVoq7fIcNqYXxE928MZVZLhR1Vur56CsiMc8Dyx7T3jtHgeYVplp+0nTNpu1smuFRC5lZTxncmiO64gdh7CPStLi2H58OdPqjVzsfzIcy7ogIpy4JzGVLOx3TFonoor7UwuqKtrvvYkOWRkdoHf4nK5vFxnfYoJ6KWip2z5Ubbsxs01k0jTU1SzcqZSZpmn4JdyHqGAtnQpldvVWq4KC7I6aEFCKivQIiwCvZ6MoiZQBEzxTtQBECIAiFDwQBERAEQogCLGVnPBAEWMrIQBERAEWMrIQBERAEQrGUBlERAERM8UARYys5QBFjKyUARYymUBlEyhKAIiFAEQogCJngsZQGUQlAgCIEygCImeKAInasZQGUWMrJKAIgWMoDKLBKZQGUTsRAEQLGUBlFjKZQGUTtRAERMoAiFYygMosZWUAROxYygMomUQBECZQBE7UQBERAEREARYysoAiIgCIgQBECxlAZRYymUBlFgFZBQBETKAIiID/9k=";
  const MARGIN = 15;
  const HEADER_H = 24;
  const TITLE_SHORT = "Informe de Resultados – Auditoría Interna y/o Externa";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const contentW = pw - MARGIN * 2;

  const addHeader = (pageNum) => {
    doc.setPage(pageNum);
    doc.addImage("data:image/jpeg;base64," + LOGO_B64, "JPEG", MARGIN, 3, 58, 17);
    if (pageNum > 1) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80, 80, 80);
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
  doc.text(`Realizada por: ${auditorNombre}     |     Recibida por: ${auditadoNombre}`, pw / 2, y, { align: "center" });
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

  // Auditado (izquierda)
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
  const auditadoLines = doc.splitTextToSize(auditadoNombre.toUpperCase(), colW - 4);
  doc.text(auditadoLines, leftX + colW / 2, y + boxH + 6, { align: "center" });
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Auditado", leftX + colW / 2, y + boxH + 11, { align: "center" });

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
  const [auditados, setAuditados] = useState([...(config.auditados || [])]);
  const [procesos, setProcesos] = useState([...(config.procesos || [])]);
  const [newSede, setNewSede] = useState("");
  const [newAuditado, setNewAuditado] = useState("");
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
    onSave({ sedes, auditores, auditados, procesos });
    onBack();
  };

  const simpleTabs = [
    { key: "sedes", label: "🏥 Sedes", list: sedes, setList: setSedes, newVal: newSede, setNewVal: setNewSede, placeholder: "Nombre de la sede..." },
    { key: "auditados", label: "👥 Auditados", list: auditados, setList: setAuditados, newVal: newAuditado, setNewVal: setNewAuditado, placeholder: "Nombre del auditado..." },
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
          }}>{t.key === "auditores" ? auditores.length : t.key === "sedes" ? sedes.length : t.key === "auditados" ? auditados.length : procesos.length}</span>
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
function AuditForm({ audit, onUpdate, onBack, onLock, onRequestEdit, config = { sedes: [], auditores: [], auditados: [], procesos: [] } }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState(null);

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

  // Validation before locking
  const validateAndLock = () => {
    const errors = [];

    // 1. Header fields
    if (!audit.sede || !audit.sede.trim()) errors.push("Falta seleccionar la sede.");
    if (!audit.fecha) errors.push("Falta la fecha de la auditoría.");
    if (!audit.realizadaPor || !audit.realizadaPor.trim()) errors.push("Falta seleccionar quién realiza la auditoría.");
    if (!audit.recibidaPor || !audit.recibidaPor.trim()) errors.push("Falta seleccionar el auditado.");

    // 2. All criteria must have calificación
    const sinCalificar = audit.items.filter(i => !i.estado);
    if (sinCalificar.length > 0) errors.push(`Hay ${sinCalificar.length} criterio(s) sin calificar.`);

    // 3. Observación → must have hallazgo
    const obsVacias = audit.items.filter(i => i.estado === "Observación" && (!i.descripcion || !i.descripcion.trim()));
    if (obsVacias.length > 0) errors.push(`Hay ${obsVacias.length} observación(es) sin hallazgo escrito.`);

    // 4. No conforme → must have procesoResponsable AND hallazgo
    const ncSinProceso = audit.items.filter(i => i.estado === "No conforme" && (!i.procesoResponsable || !i.procesoResponsable.trim()));
    const ncSinHallazgo = audit.items.filter(i => i.estado === "No conforme" && (!i.descripcion || !i.descripcion.trim()));
    if (ncSinProceso.length > 0) errors.push(`Hay ${ncSinProceso.length} no conformidad(es) sin proceso responsable.`);
    if (ncSinHallazgo.length > 0) errors.push(`Hay ${ncSinHallazgo.length} no conformidad(es) sin hallazgo escrito.`);

    // 5. All component conclusions must be filled
    const componentes = [...new Set(audit.items.map(i => i.componente))];
    const sinConclusion = componentes.filter(c => !(audit.conclusiones || {})[c] || !(audit.conclusiones || {})[c].trim());
    if (sinConclusion.length > 0) errors.push(`Faltan conclusiones en ${sinConclusion.length} componente(s): ${sinConclusion.map(c => c.length > 30 ? c.substring(0, 30) + "…" : c).join(", ")}.`);

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors(null);
    onLock();
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
              <button onClick={validateAndLock} style={{
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
              : <SearchableSelect value={audit.recibidaPor} onChange={v => updateHeader("recibidaPor", v)} options={(config.auditados || []).includes(audit.recibidaPor) ? (config.auditados || []) : audit.recibidaPor ? [audit.recibidaPor, ...(config.auditados || [])] : (config.auditados || [])} placeholder="Buscar auditado..." />
            }
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors && validationErrors.length > 0 && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "4px solid #dc3545",
          borderRadius: 8, padding: "14px 18px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#991b1b" }}>
              No se puede guardar el informe
            </div>
            <button onClick={() => setValidationErrors(null)} style={{
              background: "none", border: "none", color: "#991b1b", cursor: "pointer",
              fontSize: 18, fontWeight: 700, padding: "0 4px",
            }}>×</button>
          </div>
          {validationErrors.map((err, i) => (
            <div key={i} style={{ fontSize: 13, color: "#b91c1c", padding: "3px 0", lineHeight: 1.4 }}>
              • {err}
            </div>
          ))}
        </div>
      )}

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
  const [expandedSedesNC, setExpandedSedesNC] = useState({});

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
        (() => {
          // Group by sede
          const sedeGroups = {};
          auditosConHallazgos.forEach(a => {
            const sede = a.sede || "(Sin sede)";
            if (!sedeGroups[sede]) sedeGroups[sede] = [];
            sedeGroups[sede].push(a);
          });
          return Object.entries(sedeGroups).map(([sede, sedeAudits]) => (
            <div key={sede} style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14, fontWeight: 700, color: "#1a5276",
                padding: "10px 16px", backgroundColor: "#eaf1fb",
                borderRadius: expandedSedesNC[sede] === false ? 10 : "10px 10px 0 0",
                borderBottom: expandedSedesNC[sede] === false ? "none" : "2px solid #2980b9",
                display: "flex", alignItems: "center", gap: 8,
                cursor: "pointer", userSelect: "none",
              }} onClick={() => setExpandedSedesNC(prev => ({ ...prev, [sede]: prev[sede] === false ? true : prev[sede] === undefined ? false : !prev[sede] }))}>
                <span style={{
                  fontSize: 12, transition: "transform 0.2s", display: "inline-block",
                  transform: expandedSedesNC[sede] === false ? "rotate(-90deg)" : "rotate(0deg)",
                }}>▼</span>
                <span>📍</span> {sede}
                <span style={{ fontSize: 11, fontWeight: 400, color: "#666", marginLeft: "auto" }}>
                  {sedeAudits.reduce((s, a) => s + a.findings.length, 0)} hallazgo(s)
                </span>
              </div>
              {expandedSedesNC[sede] !== false && (
              <div>
              {sedeAudits.map(a => {
          const isOpen = !!expandedAudits[a.id];
          const nc = a.findings.filter(f => f.estado === "No conforme").length;
          const obs = a.findings.filter(f => f.estado === "Observación").length;
          return (
            <div key={a.id} style={{ overflow: "hidden", border: "1px solid #e0e0e0", borderTop: "none" }}>
              {/* Audit header row - always visible */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#2c3e50", color: "#fff",
                padding: "12px 16px", cursor: "pointer", gap: 12,
              }} onClick={() => toggleAudit(a.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a.tipo === "gestion" ? "Gestión" : "Control Interno"}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{a.fecha} · {a.realizadaPor || "—"}</div>
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
        })}
              </div>
              )}
            </div>
          ));
        })()
      )}
    </div>
  );
}

// ── Main App ──
const DEFAULT_CONFIG = { sedes: [], auditores: [], auditados: [], procesos: [] }; // auditores: [{nombre, cargo, firma}]

export default function App() {
  const [audits, setAudits] = useState([]);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [currentView, setCurrentView] = useState("home"); // home, form, nc, config
  const [activeAuditId, setActiveAuditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSedes, setExpandedSedes] = useState({});

  // Carga desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("auditorias-data");
      if (saved) setAudits(JSON.parse(saved));
      const savedConfig = localStorage.getItem("auditorias-config");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        // Migrar clave receptores → auditados
        if (parsed.receptores && !parsed.auditados) {
          parsed.auditados = parsed.receptores;
          delete parsed.receptores;
        }
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      }
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
                src="data:image/jpeg;base64,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bn0VVoWzUocPdmoKdtNKw+YdHg/bkeioVxKbN3HaHV0dKJ311jrw6S3Vjm4cQPrRv8OduR26EEHp1ACKEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQbJeBq3UlDw5WKopmNEtdPVVFQ4Dq54newZ88NY0fJTmqVcBG79qtlHLtjqOsZSOlqTPZ55nhsbnvxzQZPZxd7zfMucO+AbqoPxa8fug1vpKLfqKopomslrrNT1FSR+PIHyxgn15I2D5K/OqdQWfTFhqr7f7hBb7dSM55p5ncrWjwHqSegAySSAMrVvvxr+bcvdG76rcySKlneIqKF/eKnYOVgPU4JHvEA45nHCDHdE0VPctZ2O3VYBp6q408EoPix0jWn8hW35oDRygYAGAFptp5paeeOogkdHLE4PY9pwWuByCPXK2vbKa+tu5O3Vr1Rb5Y/aTRhlbA13WnqGgCSM+XXqM92kHxQZsmERB8aqGKpppaedgfFKwse09i0jBC03vAD3AdgVtT4hdf0u3G1V41BLPHHXOhdT22Nx6y1LwQwAdMgfWOPBpWqpBZ37nPQUtRu7eq2XlM9JZX+wB8OaWMOcPl0/pK/S1YcN+5B2t3UoNRzRGW3StNHcWN+t9He5pc5vmWlrXAePLjpnK2fWC8Wy/wBnprxZq6CuoKpgkgngfzNe0+R/0fIoPSPZV9497XR13D9V1tSAJ7dX001Mf4Tn+zI/qvd9gVgSqNcfW7Vt1BVUe3OnquKrp7dUfSbpPE7mYZwC1kQI6HlDnF3fqQO7SgqaiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAOhyFJumd/d4NO29lBbdc3E00YwxlS2OpLR5AytcQPTKjJEGUa73C1trqZkmrdS3C7CM5jjmkxEw9erY24aD1PUBYuiICkDZTdvVm1F+fcNPzsm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zXtHoAtoY8Frd45tTUWpN/a6KgkZLFZ6SK2vkY4EOkYXPeP6LpCw+rSiITtlFUXK5UtupGh9RVTMhiaTjL3ODQPtIW3LQemrdo7R9q0xaYhHR26nbCwAAFxHVzjjxccuPmSVqW0tchZtTWq8GMyChrYaksB6u5Hh2PyLb5bK2luNuprhRTMnpamJs0MjDlr2OGWuHxBRXaREygxXdbSVHrnby96VrWNcyvpHMjcRn2coGY3j1a8NPyWpJzS1xae4OCtw+obpR2OwXC83CVsVJQU0lTO9xwGsY0uJ+wLTw88zi7zOUExcH23tBuJvLSUV4j9ra7XA641UJGWzBjmhkbs/ilzm5HiAR4rZlGxjI2xsa1jGjDWgYAHkFrx4AtS0Ni3wfb6+dkLb1bpKOnc7oDOHska3PhkMcB5nA7kLYh2UodlUv7oXt3QVWk6TcagpGx3Kinjpa+RgA9rA/IY53mWv5Wj0d6BW0PVVz4/9S0Vq2QNglkYa29VsMcMeRzckbhK9+PIFrW/F4VGvRERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB7mhdU3fReqKXUlilijuFKJGxukjD24fG6N2Qe/uuK6up73cNSahr79dZGy11fO6edzWhoLnHJwB2C81EBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBneym6WpdqdWC+WCRssMzRHXUMpPsqqMHOD5OHXlcOoye4JBuTprjI2wrqFkl4or3Z6vH7ZEacTsB/gvYckfFoWvtEFyd4+MmGptNRattLVV09RMws++le1rTED0zHGCcux2Lj0/elU6qJpqiokqKiV800ry+SR7i5z3E5JJPck+K+aICuNwacQ9qtdmp9u9e3COhhpvdtNzqH8sTY+/sZXHo3HXlcemPd6YGacog3KxvZIxskbmvY4Za5pyCF+SyRxROmleyONgLnOcQA0DuSVqX0tuVuBpalbSaf1lfLdSsGG08Na/2TfHownlH2L81XuRr/VVM6k1FrG+XKldjmp5qx5idg5GWZ5T19EFlOM7iEtV8s8u3ehLgytpZyDdblA/MUjQciGNw+sCcFzh06YGclVAREH1pKioo6uGrpJ5aeoge2SKWJ5a+N7TkOaR1BBAIIVydn+Mqjhs1Pa9yrVWyVkLQz76UDGuEwH40kZI5XY7luQT4DsqYog2Bap4yNsqCge6x0N6vNZyn2cf0cQR83hzOccgfBpVMd4tytR7o6ufqDUMrG8rfZ0tLFkRU0Wc8rQfHxJPUn5AYWiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiD6U0E1TUR09NDJNNK4MjjjaXOe49AAB1JPkpq0xwsbyXyibVvsFNao3tDmNuFW2N7gf4DeZzT6OAKnfgE2rtdJpJu51zpmVN0r5JIrcXtyKaFjixzmg9nuc1wz+9GB3ObZINUW520m4G3BY/Vmnp6SlkfyR1cbmywPPgOdhIBPcB2D6LBVuKvlqt17tFVaLtRw1tDVxmKeCVvMx7T3BC1acQWgTtrutd9Lxue+ijcJ6F7+7oJBzMz6jq0nzaUGAIisZwK7YWvXOu67UF/pmVdssDY3tppG5ZNUPLuTmHiGhrjjz5fBBhG3nD3uvrihiuNq00+lt0w5o6uvlbTsePAta733A+BDSPVcNx9gN09B2+W53nTjp7ZCMyVlDK2eNg83BvvNHq5oHqtooAAwAAEe1rmFjmhzSMEHqCE2NNCKf+N3a+27fbi0tzsNOyltF/jfPHTMGGQTMIEjWjwaeZrgPDJA6ABQAgLPdtNntxdxYjUaV03UVVE13K6sle2GAHODh7yA7HiG5PovQ4ZNu4tzd3Ldp+tJFshY6tuADiHOgjIy0EfvnOa3PgHE+C2gWq30NqttPbbbSQ0lHTRtihghYGsjaBgNAHZBrc1Xwvbx6foH1x07DdIY2F8gt1S2Z7QP4HRzj/ABQVDE8UsEz4J4nxSxuLXse0tc0juCD2K3KdlT37oJtbbm2Sn3Os9GyCsjqGU129m0NEzH9GSu/hBwDCe55h5IilSIiKIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDZdwW3yjvXDxp1lM6P2tu9rRVTGHqx7ZHEZ9SxzHf0lNPitXvDnvRetodTSTxROuFiriG3G3l+ObHaSM9myD7COh8CNlekb9Sam03QX6hinipq6Bs0bJmgPDSOgOCRn5oPYWt/jtvtHeuIKugoyH/euigoZXggh0g5pHfZ7TlPq0q1HFVvx/cptjLTarXLVX64Ql1LPJyinp/DnIzlxGejcAHxPgtc9xrKq43CpuFdUSVFXUyumnmkOXSPcSXOJ8SSSUHXV1Pua95pjbNX6fcWNqmzQVjBnq9ha5jvkCG/1lStZRtZrq+7c60o9Vafla2qp8tfFJn2c8bvrRvA7tP5CAe4CDbgiwHY7cq37p6Fg1PQW2pt3M8xTwTOa7kkBweVw+s3PYkA+gXDfPcyg2r0NNqWtt1TcSJPYwQQlrQ6Q/V5nE+63PcgE+ia0K2fdKLzSvrtH6fjkY6qhjqKyZoPvMY4sYw/Alr/AOqqdrItxtZXzX2sK7VOoqhs1dWPyQwYZEwdGxsHg1o6Dx8SSSSsdQWN+573ujtm+NRb6qSON91tM1PTlx6uka9knKPi1jz8lsLWnKzXKvs13pLta6qSkrqOZs9PNGfejkactcPgQtjfCvvp/dbtc9BcrU+ivttha6skiwaefJxzs68zSf3pBA8ygnLuoB487tR2/h6uNDUScs9zraWnpm46uc2QSn5csbuvw81MeuNSUektL12oLhDUTU1FEZZGQAF7gPLJA/KtaPERvFed3tVsr6qH6BaKLmZbqBrs+zaT1e8/jPdgZPYYAHmQjBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERB//9k="
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
                Programa de Auditorías Internas y Externas
              </h1>
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
              {(() => {
                const sorted = [...audits].reverse();
                const sedeGroups = {};
                sorted.forEach(a => {
                  const sede = a.sede || "(Sin sede asignada)";
                  if (!sedeGroups[sede]) sedeGroups[sede] = [];
                  sedeGroups[sede].push(a);
                });
                return Object.entries(sedeGroups).map(([sede, sedeAudits]) => (
                  <div key={sede} style={{ marginBottom: 16 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: "#1a5276",
                      padding: "10px 14px", backgroundColor: "#eaf1fb",
                      borderRadius: expandedSedes[sede] === false ? 8 : "8px 8px 0 0",
                      borderBottom: expandedSedes[sede] === false ? "none" : "2px solid #2980b9",
                      display: "flex", alignItems: "center", gap: 8,
                      cursor: "pointer", userSelect: "none",
                    }} onClick={() => setExpandedSedes(prev => ({ ...prev, [sede]: prev[sede] === false ? true : prev[sede] === undefined ? false : !prev[sede] }))}>
                      <span style={{
                        fontSize: 12, transition: "transform 0.2s", display: "inline-block",
                        transform: expandedSedes[sede] === false ? "rotate(-90deg)" : "rotate(0deg)",
                      }}>▼</span>
                      <span>📍</span> {sede}
                      <span style={{ fontSize: 11, fontWeight: 400, color: "#666", marginLeft: "auto" }}>
                        {sedeAudits.length} auditoría(s)
                      </span>
                    </div>
                    {expandedSedes[sede] !== false && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {sedeAudits.map((a, ai) => {
                        const nc = a.items.filter(i => i.estado === "No conforme").length;
                        const obs = a.items.filter(i => i.estado === "Observación").length;
                        const conf = a.items.filter(i => i.estado === "Conforme").length;
                        const evaluated = a.items.filter(i => i.estado).length;
                        const total = a.items.length;
                        return (
                          <div key={a.id} style={{
                            display: "flex", alignItems: "center", gap: 14,
                            background: "#fff", border: "1px solid #e8edf2",
                            borderTop: ai === 0 ? "none" : "1px solid #e8edf2",
                            borderRadius: ai === sedeAudits.length - 1 ? "0 0 8px 8px" : 0,
                            padding: "14px 16px",
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
                                {a.tipo === "gestion" ? "Gestión" : "Control Interno"}
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
                                  title="Descargar informe PDF"
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
                    )}
                  </div>
                ));
              })()}
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
