// Function to clear the local storage and reload the page
function clearLocalStorage() {
    Swal.fire({
        title: 'Limpiar Edificios',
        text: '¿Estás seguro de que deseas eliminar todos los edificios almacenados?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('buildingOptions');
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los edificios se han eliminado con éxito del almacenamiento local.',
            }).then(() => {
                location.reload(); // Reload the page
            });
        }
    });
}

// Attach an event listener to the button to trigger the function
document.getElementById('clearLocalStorage').addEventListener('click', clearLocalStorage);
