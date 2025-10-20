
const contentFeatures = document.getElementById('content-features');
$("#btnOpenApplication").click(function() {
    HiloPluginSignature.Plugin.openApp()
});
$("#btnShowPorts").click(function() {
    HiloPluginSignature.Plugin.checkAllHosts().then(hosts => {
        contentFeatures.innerHTML = '';
        console.log(hosts);
        hosts.forEach(host => {
            const card = document.createElement('div');
            card.className = 'col-md-3';
            card.innerHTML = `
                <div class="card h-100 border-default">
                    <div class="card-body">
                        <h5 class="card-title">${host.Host}</h5>
                        <p class="card-text">Version: ${host.Version || 'Not available'}</p>    
                        ${host.IsAvailability ? `
                        <a class="btn btn-default border-default text-white">Kết nối thành công</a>` : '<p class="text-danger">Không kết nối được</p>'}      
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