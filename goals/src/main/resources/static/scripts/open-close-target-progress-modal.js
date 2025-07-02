document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.progress-container').forEach(progress => {//click on the progress container to open the modal
        progress.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = e.target.closest('.goal-targets').dataset.targetId; // Get target ID, need to ensure this is set in the HTML
            // Open the current progress window
            const modal = progress.nextElementSibling;
            modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
            document.querySelector("body").style.overflow = 'hidden';
            // Обновляем URL with targetId цели
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('targetId', targetId);
            window.history.pushState({}, '', currentUrl);
            // And show the progress for this target
            fetch(`/api/targets/${targetId}`, {
                method: 'GET'
            })
                .then(response => {
                    if (!response.ok) {
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
                                title: 'Can not show progress for this target',
                            })
                        })();
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    });

    // Closing the current progress window when clicked on the button
    document.addEventListener("click", function(event) {
        if (event.target.closest(".close-button")) {
            event.preventDefault();
            document.querySelectorAll('.targetProgressModal').forEach(modal => {
                modal.style.display = 'none';
                document.querySelector("body").style.overflow = 'visible';
                // Delete targetId from URL
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete('targetId');
                window.history.pushState({}, '', currentUrl);
            });
        }
    });
});
