// src/utils/reportUtils.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { parse } from 'js2xmlparser';
import translations from './translations';

const translateField = (field, language) => translations[language][field] || field;
const translateValue = (field, value, language) => {
    if (typeof value === 'string') {
        return translations[language][value.toLowerCase().replace(/ /g, '_')] || value;
    }
    return value;
};

const translateData = (data, language) => {
    return data.map(item => ({
        [translations[language].nombre]: item.nombre,
        [translations[language].cedula]: item.cedula,
        [translations[language].correo]: item.correo,
        [translations[language].telefono]: item.telefono,
        [translations[language].departamento]: item.departamento,
        [translations[language].estado]: translations[language][item.estado.toLowerCase().replace(/ /g, '_')],
        [translations[language].proyecto]: item.proyecto === 'Sin asignar' ? translations[language].sin_asignar : item.proyecto
    }));
};

const orderFields = (data, language) => {
    const orderedKeys = [
        'colaboradores',
        'descripcion',
        'estadoProyecto',
        'fechaInicio',
        'fechaFin',
        'presupuesto',
        'recursos',
        'historial',
        'tareas'
    ];

    return orderedKeys.map(key => ({
        field: translateField(key, language),
        value: translateValue(key, data[key], language)
    }));
};

const orderTaskFields = (task, language) => {
    const orderedTaskKeys = [
        'nombreTarea',
        'descripcion',
        'responsable',
        'fechaInicio',
        'fechaFin',
        'estado',
        'storypoints'
    ];

    return orderedTaskKeys.map(key => ({
        field: translateField(key, language),
        value: translateValue(key, task[key], language)
    }));
};

// Funciones para generar informes de colaboradores
const generatePDFReport = (data, language) => {
    console.log("Generando PDF para colaboradores...");
    const doc = new jsPDF();
    const translatedData = translateData(data, language);
    const columns = Object.keys(translatedData[0]);
    const rows = translatedData.map(item => Object.values(item));
    doc.text(20, 20, `${translations[language].informe_del_proyecto} (${language})`);
    doc.autoTable({ head: [columns], body: rows });
    doc.save(`reporte_colaboradores_${language}.pdf`);
};

const generateCSVReport = (data, language) => {
    console.log("Generando CSV para colaboradores...");
    const translatedData = translateData(data, language);
    const csv = Papa.unparse(translatedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `reporte_colaboradores_${language}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const generateXMLReport = (data, language) => {
    console.log("Generando XML para colaboradores...");
    const translatedData = translateData(data, language);
    const xml = parse("colaboradores", translatedData);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `reporte_colaboradores_${language}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Funciones para generar informes de proyectos
const generateProjectPDFReport = (data, projectName, language) => {
    console.log("Generando PDF para proyecto...");
    const doc = new jsPDF('landscape');
    const translatedData = orderFields(data, language);
    const columns = [translations[language].campo, translations[language].valor];
    const rows = translatedData.map(item => {
        if (item.field === translateField('tareas', language) && Array.isArray(item.value)) {
            return [item.field, ''];
        }
        return [item.field, item.value];
    });

    doc.text(10, 10, `${translations[language].informe_del_proyecto}: ${projectName} (${language})`);
    doc.autoTable({ head: [columns], body: rows });

    // Agregar las tareas como una tabla separada
    const tareas = translatedData.find(item => item.field === translateField('tareas', language));
    if (tareas && Array.isArray(tareas.value)) {
        tareas.value.forEach((tarea, index) => {
            const tareaData = orderTaskFields(tarea, language);
            const tareaRows = tareaData.map(item => [item.field, item.value]);
            doc.addPage();
            doc.text(10, 10, `${translations[language].tarea} ${index + 1}`);
            doc.autoTable({ head: [columns], body: tareaRows, startY: 20 });
        });
    }

    doc.save(`${projectName}_informe.pdf`);
};

const generateProjectCSVReport = (data, projectName, language) => {
    console.log("Generando CSV para proyecto...");
    const translatedData = orderFields(data, language);
    let csvContent = '';
    translatedData.forEach(item => {
        if (item.field === translateField('tareas', language) && Array.isArray(item.value)) {
            item.value.forEach((tarea, index) => {
                const tareaData = orderTaskFields(tarea, language);
                csvContent += `Tarea ${index + 1},\n`;
                tareaData.forEach(tareaItem => {
                    csvContent += `${tareaItem.field},${tareaItem.value}\n`;
                });
                csvContent += '\n';
            });
        } else {
            csvContent += `${item.field},${item.value}\n`;
        }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${projectName}_informe.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const generateProjectXMLReport = (data, projectName, language) => {
    console.log("Generando XML para proyecto...");
    const translatedData = orderFields(data, language);
    const xml = parse("proyecto", translatedData);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${projectName}_informe.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Funciones para generar informes generales de todos los proyectos
const generateAllProjectsPDFReport = (projects, language) => {
    console.log("Generando PDF para todos los proyectos...");
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text(10, 10, `${translations[language].informe_del_proyecto} (${language})`);

    projects.forEach((project, index) => {
        if (index > 0) doc.addPage();
        doc.setFontSize(14);
        doc.text(10, 20, `${translateField('nombreProyecto', language)}: ${project.nombreProyecto}`);
        const translatedData = orderFields(project, language);
        const rows = translatedData.map(item => {
            if (item.field === translateField('tareas', language) && Array.isArray(item.value)) {
                return [item.field, ''];
            }
            return [item.field, item.value];
        });
        const columns = [translations[language].campo, translations[language].valor];

        doc.autoTable({ head: [columns], body: rows, startY: 30 });

        // Agregar las tareas como una tabla separada
        const tareas = translatedData.find(item => item.field === translateField('tareas', language));
        if (tareas && Array.isArray(tareas.value)) {
            tareas.value.forEach((tarea, tareaIndex) => {
                const tareaData = orderTaskFields(tarea, language);
                const tareaRows = tareaData.map(item => [item.field, item.value]);
                doc.addPage();
                doc.text(10, 10, `${translations[language].tarea} ${tareaIndex + 1}`);
                doc.autoTable({ head: [columns], body: tareaRows, startY: 20 });
            });
        }
    });

    doc.save(`informe_general_proyectos.pdf`);
};

const generateAllProjectsCSVReport = (projects, language) => {
    console.log("Generando CSV para todos los proyectos...");
    const headers = [
        translateField('nombre_del_proyecto', language),
        translateField('estado_del_proyecto', language),
        translateField('encargado', language),
        translateField('colaboradores', language),
        translateField('cantidad_de_tareas', language),
        translateField('cantidad_de_tareas_por_hacer', language),
        translateField('cantidad_de_tareas_en_progreso', language),
        translateField('cantidad_de_tareas_completadas', language)
    ];
    
    let csvContent = `${headers.join(',')}\n`;

    projects.forEach(project => {
        const nombreProyecto = project.nombreProyecto || '';
        const estadoProyecto = translateValue('estadoProyecto', project.estadoProyecto, language) || '';
        const encargado = project.encargado || '';
        const colaboradores = project.colaboradores ? project.colaboradores.join(', ') : '';
        const cantidadTareas = project.tareas ? project.tareas.length : 0;

        // Contadores para los diferentes estados de las tareas
        let tareasPorHacer = 0;
        let tareasEnProgreso = 0;
        let tareasCompletadas = 0;

        if (project.tareas) {
            project.tareas.forEach(tarea => {
                if (tarea.estado === 'Por Hacer' || tarea.estado === 'por_hacer') {
                    tareasPorHacer++;
                } else if (tarea.estado === 'En Progreso' || tarea.estado === 'en_progreso') {
                    tareasEnProgreso++;
                } else if (tarea.estado === 'Completada' || tarea.estado === 'completada') {
                    tareasCompletadas++;
                }
            });
        }

        csvContent += `"${nombreProyecto}","${estadoProyecto}","${encargado}","${colaboradores}","${cantidadTareas}","${tareasPorHacer}","${tareasEnProgreso}","${tareasCompletadas}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `informe_general_proyectos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const generateAllProjectsXMLReport = (projects, language) => {
    console.log("Generando XML para todos los proyectos...");
    let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<proyectos>\n';

    projects.forEach(project => {
        xmlContent += `<proyecto>\n`;
        xmlContent += `<nombreProyecto>${project.nombreProyecto}</nombreProyecto>\n`;
        xmlContent += `<estadoProyecto>${translateValue('estadoProyecto', project.estadoProyecto, language)}</estadoProyecto>\n`;
        xmlContent += `<encargado>${project.encargado}</encargado>\n`;
        xmlContent += `<colaboradores>${project.colaboradores.join(', ')}</colaboradores>\n`;
        xmlContent += `<cantidadTareas>${project.tareas ? project.tareas.length : 0}</cantidadTareas>\n`;

        // Contadores para los diferentes estados de las tareas
        let tareasPorHacer = 0;
        let tareasEnProgreso = 0;
        let tareasCompletadas = 0;

        if (project.tareas) {
            project.tareas.forEach(tarea => {
                if (tarea.estado === 'Por Hacer' || tarea.estado === 'por_hacer') {
                    tareasPorHacer++;
                } else if (tarea.estado === 'En Progreso' || tarea.estado === 'en_progreso') {
                    tareasEnProgreso++;
                } else if (tarea.estado === 'Completada' || tarea.estado === 'completada') {
                    tareasCompletadas++;
                }
            });
        }

        xmlContent += `<cantidadTareasPorHacer>${tareasPorHacer}</cantidadTareasPorHacer>\n`;
        xmlContent += `<cantidadTareasEnProgreso>${tareasEnProgreso}</cantidadTareasEnProgreso>\n`;
        xmlContent += `<cantidadTareasCompletadas>${tareasCompletadas}</cantidadTareasCompletadas>\n`;
        xmlContent += `</proyecto>\n`;
    });

    xmlContent += '</proyectos>';
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `informe_general_proyectos.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export {
    generatePDFReport,
    generateCSVReport,
    generateXMLReport,
    generateProjectPDFReport,
    generateProjectCSVReport,
    generateProjectXMLReport,
    generateAllProjectsPDFReport,
    generateAllProjectsCSVReport,
    generateAllProjectsXMLReport
};
