//HILOGroup.sign.checkAllPorts()
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

            const card = document.createElement('div');
            card.className = 'col-md-3';
            card.innerHTML = `
            <div class="card h-100 border-default">
                <div class="card-body">
                    <h5 class="card-title"></h5>
                    <p class="card-text"></p>
                    <button id="sign-button" class="btn btn-default border-default text-white">Ký thử</button>
                </div>
            </div>
            `;
            contentFeatures.appendChild(card);
            $('#sign-button').on('click', function () {
                HILOGroup.sign.signXml({
                    IdToSign: "DL",
                    XMLDataToSign: "<XmlTemplate><Data Id=\"DL\"></Data><DSCKS><NNT /></DSCKS></XmlTemplate>",
                    HashAlgorithm: "SHA256",
                    RSASignaturePadding: "Pkcs1",
                    CertSerial: "",
                }).then(response => {
                    if (response?.status === true) {
                        var beautifiedXmlText = new XmlBeautify().beautify(response.data,
                            {
                                indent: "  ",  //indent pattern like white spaces
                                useSelfClosingElement: true //true:use self-closing element when empty element.
                            });
                        beautifiedXmlText = beautifiedXmlText
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
                        Swal.fire({
                            title: "Thành công",
                            icon: "info",
                            html: `<pre id="xmlBox" style="text-align:left;white-space:pre-wrap;">${beautifiedXmlText}</pre>`,
                            width: '80%',
                            html: `
      <pre id="xmlBox" style="
        text-align:left;
        background:#0b1220;
        color:#e6eef7;
        padding:14px;
        border-radius:8px;
        font-size:13px;
        line-height:1.4;
        max-height:60vh;
        overflow:auto;
        white-space:pre;
      ">${beautifiedXmlText}</pre>
    `,
                            width: "90%",
                            confirmButtonText: "Đóng",
                        });
                    }
                    else {
                        Swal.fire({
                            icon: "error",
                            title: "Ký thất bại",
                            text: response?.Message
                        });
                    }
                });
            })
        }
    })
    ;