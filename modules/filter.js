// Obtén el elemento de entrada y el select
const filterInput = document.getElementById('filterInput');
const destinationSelect = document.getElementById('destinationSelect');

// Al escribir en el campo de entrada, filtra las opciones del select
filterInput.addEventListener('input', function () {
    const filterText = filterInput.value.toLowerCase();

    // Itera a través de las opciones del select
    for (let i = 0; i < destinationSelect.options.length; i++) {
        const option = destinationSelect.options[i];
        const optionText = option.text.toLowerCase();

        // Comprueba si el texto de la opción contiene el texto del filtro
        if (optionText.includes(filterText)) {
            option.style.display = 'block'; // Muestra la opción
        } else {
            option.style.display = 'none'; // Oculta la opción
        }
    }
});
