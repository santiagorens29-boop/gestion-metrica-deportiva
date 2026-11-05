import { jsPDF } from "jspdf";
import Chart from "chart.js/auto";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

/**
 * Genera un canvas temporal con colores contrastados para impresión.
 */
function generarCanvasParaPDF(prueba, marcas) {
  const canvasTemp = document.createElement("canvas");
  canvasTemp.width = 1200;
  canvasTemp.height = 450;
  const ctx = canvasTemp.getContext("2d");

  const labels = marcas.map((m) => m.fecha);
  const data = marcas.map((m) => Number(m.marca_valor));

  const metrica = (prueba?.tipo_metrica || marcas[0]?.tipo_metrica || "").toLowerCase();
  const esMetricaInversa = metrica === "tiempo" || metrica === "puesto" || String(marcas[0]?.marca_texto || "").includes(":");

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: prueba?.nombre || "Marca",
          data,
          borderColor: "#18181b",
          borderWidth: 3,
          backgroundColor: "rgba(24, 24, 27, 0.05)",
          fill: true,
          tension: 0.15,
          pointBackgroundColor: "#18181b",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6
        }
      ]
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "rgba(0, 0, 0, 0.08)" },
          ticks: { color: "#3f3f46", font: { family: "monospace", size: 14 } }
        },
        y: {
          reverse: esMetricaInversa,
          grid: { color: "rgba(0, 0, 0, 0.08)" },
          ticks: { color: "#3f3f46", font: { family: "monospace", size: 14 } }
        }
      }
    }
  });

  const dataURL = canvasTemp.toDataURL("image/png", 1.0);
  chart.destroy();
  return dataURL;
}

/**
 * Genera el reporte A4 y abre el diálogo nativo de Windows "Guardar como...".
 */
export async function exportarReporteAtletaPDF({ atleta, prueba, marcas }) {
  if (!atleta || !prueba || !marcas || marcas.length === 0) {
    return { ok: false, msg: "Datos insuficientes para generar el reporte." };
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // 1. ENCABEZADO INSTITUCIONAL
  doc.setFillColor(24, 24, 27);
  doc.rect(margin, margin, contentWidth, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("GESTIÓN DEPORTIVA • INFORME DE RENDIMIENTO", margin + 5, margin + 11);

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Emisión: ${fechaHoy}`, pageWidth - margin - 5, margin + 11, { align: "right" });

  // 2. FICHA DEL ATLETA Y PRUEBA
  let posY = margin + 26;

  doc.setDrawColor(228, 228, 231);
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(margin, posY, contentWidth, 22, 2, 2, "FD");

  doc.setTextColor(113, 113, 122);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("ATLETA", margin + 4, posY + 6);
  doc.text("DNI", margin + 55, posY + 6);
  doc.text("DISCIPLINA", margin + 90, posY + 6);
  doc.text("SUBDISCIPLINA / PRUEBA", margin + 130, posY + 6);

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`${atleta.nombre} ${atleta.apellido}`, margin + 4, posY + 14);

  doc.setFont("helvetica", "normal");
  doc.text(String(atleta.dni || "—"), margin + 55, posY + 14);
  doc.text(String(atleta.deporte_nombre || "General"), margin + 90, posY + 14);
  doc.setFont("helvetica", "bold");
  doc.text(String(prueba.nombre), margin + 130, posY + 14);

  // 3. TARJETAS DE MÉTRICAS CLAVE
  posY += 27;

  const metrica = (prueba?.tipo_metrica || marcas[0]?.tipo_metrica || "").toLowerCase();
  const esMayorMejor = metrica === "distancia" || metrica === "peso";

  const mejorRegistro = marcas.reduce((mejor, actual) => {
    if (!mejor) return actual;
    const valActual = Number(actual.marca_valor);
    const valMejor = Number(mejor.marca_valor);
    if (esMayorMejor) {
      return valActual > valMejor ? actual : mejor;
    }
    return valActual < valMejor ? actual : mejor;
  }, null);

  const cardWidth = (contentWidth - 6) / 3;
  const mejorMarcaTexto = mejorRegistro?.marca_texto || "—";
  const ultimaMarcaTexto = marcas[marcas.length - 1]?.marca_texto || "—";
  const totalMediciones = String(marcas.length);

  const cardsData = [
    { label: "MEJOR MARCA", val: mejorMarcaTexto },
    { label: "ÚLTIMA MARCA", val: ultimaMarcaTexto },
    { label: "TOTAL MEDICIONES", val: `${totalMediciones} registros` }
  ];

  cardsData.forEach((c, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX, posY, cardWidth, 16, 2, 2, "FD");

    doc.setTextColor(113, 113, 122);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(c.label, cardX + 4, posY + 5.5);

    doc.setTextColor(24, 24, 27);
    doc.setFontSize(10.5);
    doc.text(c.val, cardX + 4, posY + 12);
  });

  // 4. GRÁFICO DE RENDIMIENTO
  posY += 21;

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("CURVA EVOLUTIVA DE RENDIMIENTO", margin, posY);

  posY += 3;
  const chartHeight = 65;
  const chartImgData = generarCanvasParaPDF(prueba, marcas);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, posY, contentWidth, chartHeight, 2, 2, "FD");
  doc.addImage(chartImgData, "PNG", margin + 2, posY + 2, contentWidth - 4, chartHeight - 4);

  // 5. TABLA RESUMEN DE MARCAS
  posY += chartHeight + 6;

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text("HISTORIAL CRONOLÓGICO DE MEDICIONES", margin, posY);

  posY += 3;
  doc.setFillColor(244, 244, 245);
  doc.rect(margin, posY, contentWidth, 7, "F");

  doc.setTextColor(113, 113, 122);
  doc.setFontSize(7.5);
  doc.text("FECHA", margin + 4, posY + 4.8);
  doc.text("MARCA / EVALUACIÓN", margin + 45, posY + 4.8);
  doc.text("COMPETENCIA / DETALLE", margin + 105, posY + 4.8);

  posY += 7;

  const marcasParaMostrar = [...marcas].slice(-6);

  marcasParaMostrar.forEach((m, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(250, 250, 250);
    }
    doc.rect(margin, posY, contentWidth, 6.5, "F");

    doc.setTextColor(24, 24, 27);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(m.fecha || "—", margin + 4, posY + 4.5);
    doc.setFont("helvetica", "bold");
    doc.text(m.marca_texto || String(m.marca_valor), margin + 45, posY + 4.5);
    doc.setFont("helvetica", "normal");
    doc.text(m.competencia || "Evaluación regular", margin + 105, posY + 4.5);

    posY += 6.5;
  });

  // 6. PIE DE PÁGINA (Firma Institucional)
  const footerY = pageHeight - margin + 1;
  doc.setDrawColor(212, 212, 216);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(113, 113, 122);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Software de Alto Rendimiento • Gestión Deportiva Desktop", margin, footerY);

  // Firma destacada
  doc.setFontSize(9.5);
  doc.setTextColor(24, 24, 27);
  doc.setFont("helvetica", "bold");
  doc.text("Desarrollo: Santiago Rens", pageWidth - margin, footerY - 0.5, { align: "right" });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(113, 113, 122);
  doc.text("santiagorens29@gmail.com", pageWidth - margin, footerY + 3.5, { align: "right" });
  // 7. DIÁLOGO NATIVO "GUARDAR COMO..."
  const nombreLimpioAtleta = `${atleta.nombre}_${atleta.apellido}`.replace(/\s+/g, "_");
  const nombreLimpioPrueba = prueba.nombre.replace(/\s+/g, "_");
  const nombreSugerido = `Reporte_${nombreLimpioPrueba}_${nombreLimpioAtleta}.pdf`;

  try {
    const rutaDestino = await save({
      defaultPath: nombreSugerido,
      filters: [{ name: "Documento PDF", extensions: ["pdf"] }]
    });

    if (!rutaDestino) {
      return { ok: false, cancelado: true };
    }

    const pdfArrayBuffer = doc.output("arraybuffer");
    await writeFile(rutaDestino, new Uint8Array(pdfArrayBuffer));

    return { ok: true, nombreArchivo: nombreSugerido };
  } catch (error) {
    // Si falla el plugin nativo, recurre al guardado estándar
    doc.save(nombreSugerido);
    return { ok: true, nombreArchivo: nombreSugerido };
  }
}