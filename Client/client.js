document.addEventListener('DOMContentLoaded', () => {
    const countBtn = document.getElementById('countBtn');
    const inputText = document.getElementById('inputText');
    const tokenCount = document.getElementById('tokenCount');

    countBtn.addEventListener('click', async () => {
        const text = inputText.value;

        // Enviar el texto al middleware
        try {
            const response = await fetch('http://localhost:3000/count-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            const data = await response.json();
            if (response.ok) {
                tokenCount.textContent = data.tokens;
            } else {
                alert(data.error || 'Error en la petición.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo conectar al middleware.');
        }
    });
});
