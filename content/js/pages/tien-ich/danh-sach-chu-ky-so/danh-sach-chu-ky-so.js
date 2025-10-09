HILOGroup.sign.checkAllPorts()
    .then(results => {
        const contentFeatures = document.getElementById('content-features');

        if (results.every(r => !r.version)) {
            const card = document.createElement('div');
            card.className = 'col-md-3';
            card.innerHTML = `
            <div class="card h-100 border-default">
                <div class="card-body">
                    <h5 class="card-title">Mở ứng dụng</h5>
                    <p class="card-text"></p>
                    <a href="HiloPlugin://sign" class="btn btn-default border-default text-white">Mở ứng dụng</a>
                </div>
            </div>
        `;
            contentFeatures.appendChild(card);
        }
        else {
            var first = results.find(r => r.version);
            HILOGroup.sign.currentPort = first.port;
            HILOGroup.sign.currentSchema = first.schema;
            HILOGroup.sign.getAllCertificates().then(certificates => {
                certificates.data.forEach(cert => {
                    const card = document.createElement('div');
                    card.className = 'col-md-3';
                    card.innerHTML = `
                    <div class="card h-100 border-default">
                        <div class="card-body">
                            <h5 class="card-title text-blue-default">${cert.CommonName}</h5>
                            <p class="card-text text-start">FromDate: ${cert.FromDate}</p>
                            <p class="card-text text-start">ToDate: ${cert.ToDate}</p>
                            <p class="card-text text-start">Supplier: ${cert.Supplier}</p>
                            <p class="card-text text-start">Owner: ${cert.Owner}</p>
                            <p class="card-text text-start">Subject: ${cert.Subject}</p>
                            <p class="card-text text-start">SerialNumber: ${cert.SerialNumber}</p>
                        </div>
                    </div>
                `;
                    contentFeatures.appendChild(card);
                });
            });
        }
    });