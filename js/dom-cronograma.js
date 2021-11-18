// Cuando el html esta cargado
const cargarHistorialCronogramas = (paramStorageListCalendario) => {
  if (paramStorageListCalendario !== null) {
    const tbody = document.querySelector('.table-historial tbody');
    tbody.innerHTML = '';

    for (let index = 0; index < paramStorageListCalendario.length; index += 1) {
      const tr = document.createElement('tr');

      Object.entries(paramStorageListCalendario[index]).forEach(([key, value]) => {
        const td = document.createElement('td');
        if (key === 'id') {
          td.innerText = index + 1;
        } else {
          td.innerText = value;
        }
        // console.log(key);
        if (key === 'calendario') {
          const stringHtml = `<a class="svg-link" id="svgLink-${paramStorageListCalendario[index].id}"><img src="../images/view.svg" class="svg" /></a>`;
          td.innerHTML = stringHtml;
          tr.appendChild(td);
        } else {
          tr.appendChild(td);
        }
      });

      const td = document.createElement('td');
      const stringHtml = `<a class="svg-link" id="svgLink-${paramStorageListCalendario[index].id}"><img src="../images/delete.svg" class="svg" /></a>`;
      td.innerHTML = stringHtml;
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
};

window.addEventListener('load', () => {
  const storageListCalendario = localStorage.getItem('listCalendario');
  cargarHistorialCronogramas(JSON.parse(storageListCalendario));

  // const agregarEvento = () => {
  //   const tbody = document.querySelector('.historial tbody');
  //   const { rows } = tbody;
  //   /* eslint-disable-next-line */
  //   for (const tr of rows) {
  //     /* eslint-disable-next-line */
  //     for (const td of tr.cells) {
  //       if (td.cellIndex === 5) {
  //         const elementoEliminar = td.childNodes[0];
  //         const id = elementoEliminar.id.substr(elementoEliminar.id.indexOf('-') + 1, 2);
  //         elementoEliminar.addEventListener('click', () => eventEliminar(id));
  //       }
  //     }
  //   }
  // };

  const eventEliminar = (id) => {
    // const id = elementoEliminar.id.substr(elementoEliminar.id.indexOf('-') + 1, 2);
    // console.log(elementoEliminar.id.indexOf('-'));
    const storage = localStorage.getItem('listCalendario');
    let listCalendario = JSON.parse(storage);
    listCalendario = listCalendario.filter((row) => row.id !== parseInt(id, 10));
    localStorage.setItem('listCalendario', JSON.stringify(listCalendario));
    cargarHistorialCronogramas(listCalendario);

    // TODO: Mejorar (Repetido)
    const tbody = document.querySelector('.historial tbody');
    const { rows } = tbody;
    /* eslint-disable-next-line */
    for (const tr of rows) {
      /* eslint-disable-next-line */
      for (const td of tr.cells) {
        if (td.cellIndex === 5) {
          const elementoEliminar = td.childNodes[0];
          const idX = elementoEliminar.id.substr(elementoEliminar.id.indexOf('-') + 1, 2);
          elementoEliminar.addEventListener('click', () => eventEliminar(idX));
        }
      }
    }
  };

  // TODO: Mejorar (Repetido)
  const tbody = document.querySelector('.historial tbody');
  const { rows } = tbody;
  /* eslint-disable-next-line */
  for (const tr of rows) {
    /* eslint-disable-next-line */
    for (const td of tr.cells) {
      if (td.cellIndex === 5) {
        const elementoEliminar = td.childNodes[0];
        const id = elementoEliminar.id.substr(elementoEliminar.id.indexOf('-') + 1, 2);
        elementoEliminar.addEventListener('click', () => eventEliminar(id));
      }
    }
  }
});
