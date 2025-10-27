
const contentFeatures = document.getElementById('content-features');
$("#btnOpenApplication").click(function() {
    HiloPluginSignature.Plugin.openApp()
});
$("#btnResetStore").click(function(){

    HiloPluginSignature.Plugin.reopenStore()
    .then(value => console.log(value))
    .then(p => $("#btnShowCertificates").trigger("click"))
    ;
});
$("#btnShowCertificate").click(function() {
    HiloPluginSignature.Plugin.selectCertificate().then(cert => {
        contentFeatures.innerHTML = '';
        console.log(cert);
        
                    const card = document.createElement('div');
                    card.className = 'col-md-3';
                    card.innerHTML = `
                    <div class="card h-100 border-default">
                        <div class="card-body">
                            <h5 class="card-title text-blue-default">${cert.CertSerial}</h5>
                            <p class="card-text text-start">FromDate: ${cert.FromDate}</p>
                            <p class="card-text text-start">ToDate: ${cert.ToDate}</p>
                            <p class="card-text text-start">Supplier: ${cert.Supplier}</p>
                            <p class="card-text text-start">Owner: ${cert.Owner}</p>
                            <p class="card-text text-start">Subject: ${cert.Subject}</p>
                            <p class="card-text text-start">SerialNumber: ${cert.CertSerial}</p>
                        </div>
                    </div>
                `;
                    contentFeatures.appendChild(card);
    })
    .catch(error => {
        contentFeatures.innerHTML = error;
    })
});

$("#btnShowCertificates").click(function() {
    HiloPluginSignature.Plugin.getAllCertificates().then(certificates => {
        contentFeatures.innerHTML = '';
        console.log(certificates);
        certificates.forEach(cert => {
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
    })
    .catch(error => {
        contentFeatures.innerHTML = error;
    })
});