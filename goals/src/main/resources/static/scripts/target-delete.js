document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown-item.delete.target').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.closest('.goal-targets').dataset.targetId; // Get target ID, need to ensure this is set in the HTML

            if (Swal.fire({
                title: "Are you sure you want to delete this target?",
                text: "You won't be able to revert this!",
                color: '#3D0A91',
                icon: "warning",
                iconColor: "#ff0066",
                showCancelButton: true,
                confirmButtonText: "Delete",
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'delete-target-confirm-btn',
                    cancelButton: 'delete-target-cancel-btn',
                    title: 'delete-target-confirm-title'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    {
                        fetch(`/api/targets/${targetId}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    // Delete element from DOM
                                    e.target.closest('.goal-targets').remove();
                                    /*location.reload();*/
                                } else {
                                    const Toast = Swal.mixin({
                                            toast: true,
                                            position: 'bottom-end',
                                            iconColor: 'white',
                                            customClass: {
                                                popup: 'colored-toast',
                                            },
                                            showConfirmButton: false,
                                            timer: 6000,
                                            timerProgressBar: true,
                                        })

                                    ;(async () => {
                                        await Toast.fire({
                                            icon: 'error',
                                            title: 'This target can not be deleted',
                                        })
                                    })();
                                }
                            })
                            .catch(error => console.error('Error:', error));
                    }
                    const Toast = Swal.mixin({
                            toast: true,
                            position: 'bottom-end',
                            iconColor: 'white',
                            customClass: {
                                popup: 'colored-toast',
                            },
                            showConfirmButton: false,
                            timer: 6000,
                            timerProgressBar: true,
                        })

                    ;(async () => {
                        await Toast.fire({
                            icon: 'success',
                            title: 'Your target has been deleted',
                        })
                    })()

                }
            }));
        });
    });
});

