HILOGroup.sign.checkAllPorts()

    .then(results => {
        const contentFeatures = document.getElementById('content-features');
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'col-md-3';
            card.innerHTML = `
                <div class="card h-100 border-default">
                    <div class="card-body">
                        <h5 class="card-title">${result.schema}://localhost:${result.port}</h5>
                        <p class="card-text">Version: ${result.version || 'Not available'}</p>
                        ${result.version ? `<a href="${result.schema}://localhost:${result.port}/api/swagger/index.html" class="btn btn-default border-default text-white">API</a>` : ''}
                    </div>
                </div>
            `;
            contentFeatures.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error checking ports:", error);
    });