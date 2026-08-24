tailwind.config = { theme: { extend: { fontFamily: { sans: ['Be Vietnam Pro', 'sans-serif'] }, colors: { navy: '#1E3A8A', brand: '#2563EB' } } } };

var checkPortButton = document.getElementById('checkPortButton');
var checkConfigButton = document.getElementById('checkConfigButton');
var checkCertificateButton = document.getElementById('checkCertificateButton');
var signXmlButton = document.getElementById('signXmlButton');
var signPdfButton = document.getElementById('signPdfButton');
var signHashButton = document.getElementById('signHashButton');
var signDataButton = document.getElementById('signDataButton');
async function readBase64File(input) {
    if (input.files.length === 0) return null;
    const file = input.files[0];
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function downloadPDFFromBase64(base64Data, fileName = 'document.pdf') {
    // 1. Loại bỏ tiền tố "data:application/pdf;base64," nếu API trả về kèm theo
    const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');

    // 2. Decode chuỗi Base64 thành chuỗi nhị phân (binary string)
    const binaryString = atob(cleanBase64);
    const len = binaryString.length;

    // 3. Chuyển chuỗi nhị phân thành mảng byte (Uint8Array)
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 4. Tạo Blob từ Uint8Array với định dạng application/pdf
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // 5. Tạo đường dẫn Object URL tạm thời
    const blobUrl = URL.createObjectURL(blob);

    // 6. Tạo thẻ <a> ẩn để kích hoạt sự kiện tải file
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);

    // 7. Click tự động để tải
    link.click();

    // 8. Dọn dẹp DOM và giải phóng bộ nhớ
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}
checkPortButton.addEventListener('click', async () => {
    var checkPortContent = document.getElementById('checkPortContent');
    checkPortContent.innerHTML = 'Đang kiểm tra các cổng...';
    var results = await HiloPlugin.Utils.checkAvailablePorts();
    checkPortContent.innerHTML = '';
    for (const result of results) {

        const statusText = result.status === 'online' ? 'Online' : 'Offline';
        const statusClass = result.status === 'online' ? 'bg-green text-blue-800' : 'bg-red-100 text-red-800';
        const dataText = result.data ? `Version: ${result.data}` : '';
        checkPortContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4">
                                <p class="text-xs font-semibold uppercase text-slate-400">Cổng ${result.protocol.toUpperCase()}</p>
                                <p class="mt-1 font-bold text-slate-800">${result.port}</p>
                                <p><span class="mt-3 inline-block rounded-full bg-slate-100 py-1 text-xs font-bold text-slate-500 ${statusClass}">${statusText}</span></p>                                
                                <p><span class="mt-3 inline-block rounded-full bg-slate-100 py-1 text-xs font-bold text-slate-500 ${statusClass}">${dataText}</span></p>
                            </div>`;
    }
    if (results.every(result => result.status === 'offline')) {
        checkPortContent.innerHTML += `<div class="rounded-xl border border-slate-200 p-4">
                                <button id="openAppButton" type="button" class="rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"><i class="fa-solid fa-ope mr-2"></i>Mở ứng dụng</button>
                            </div>`;
        var openAppButton = document.getElementById('openAppButton');
        openAppButton.addEventListener('click', async () => {
            try {
                let secondsLeft = 5;
                await HiloPlugin.Utils.openApp();
                checkPortContent.innerHTML = `Đang mở ứng dụng... (${secondsLeft}s)`;

                const timer = setInterval(() => {
                    secondsLeft--;
                    if (secondsLeft > 0) {
                        checkPortContent.innerHTML = `Đang mở ứng dụng... (${secondsLeft}s)`;
                    } else {
                        clearInterval(timer);
                        checkPortButton.click();
                    }
                }, 1000);
            } catch (error) {
                console.error('Error opening the app:', error);
            }
        });
    }
});
checkConfigButton.addEventListener('click', async () => {
    var configContent = document.getElementById('configContent');
    configContent.innerHTML = 'Đang kiểm tra cấu hình...';
    try {
        var configData = await HiloPlugin.Utils.getConfig();
        configContent.innerHTML = '';


        if (configData) {
            configContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4">
                                <p class="text-xs font-semibold uppercase text-slate-400">Cấu hình đường dẫn</p>
                                <p class="mt-1 font-bold text-slate-800">Ứng dụng : <a href="${configData?.Path.BaseDirectory}" target="_blank">${configData?.Path.BaseDirectory}</a></p>
                                <p class="mt-1 font-bold text-slate-800">TempPath : <a href="${configData?.Path.TempPath}" target="_blank">${configData?.Path.TempPath}</a></p>
                                <p class="mt-1 font-bold text-slate-800">PathLog : <a href="${configData?.Path.PathLog}" target="_blank">${configData?.Path.PathLog}</a></p>
                                <p class="mt-1 font-bold text-slate-800">MyDocuments : <a href="${configData?.Path.MyDocuments}" target="_blank">${configData?.Path.MyDocuments}</a></p>
                                <p class="mt-1 font-bold text-slate-800">ApplicationData : <a href="${configData?.Path.ApplicationData}" target="_blank">${configData?.Path.ApplicationData}</a></p>
                                <p class="mt-1 font-bold text-slate-800">LocalApplicationData : <a href="${configData?.Path.LocalApplicationData}" target="_blank">${configData?.Path.LocalApplicationData}</a></p>
                            </div>`;
            configContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4">
                                <p class="text-xs font-semibold uppercase text-slate-400">Cấu hình chứng thư số</p>
                                <p class="mt-1 font-bold text-slate-800">Allowlist : ${(configData?.CertificateStore?.Allowlist ?? []).join(', ')}</p>
                                <p class="mt-1 font-bold text-slate-800">Denylist : ${(configData?.CertificateStore?.Denylist ?? []).join(', ')}</p>
                                <p class="mt-1 font-bold text-slate-800">Name : ${configData?.CertificateStore?.Name}</p>
                                <p class="mt-1 font-bold text-slate-800">Location : ${configData?.CertificateStore?.Location}</p>
                                <p class="mt-1 font-bold text-slate-800">IsPrivateKey : ${configData?.CertificateStore?.IsPrivateKey}</p>
                                <p class="mt-1 font-bold text-slate-800">IsUseGUI : ${configData?.CertificateStore?.IsUseGUI}</p>
                            </div>`;
            configContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4">
                                <p class="text-xs font-semibold uppercase text-slate-400">Hệ điều hành</p>
                                <p class="mt-1 font-bold text-slate-800">MachineName : ${configData?.OS?.MachineName}</p>
                                <p class="mt-1 font-bold text-slate-800">UserName : ${configData?.OS?.UserName}</p>
                                <p class="mt-1 font-bold text-slate-800">MacAddress : ${configData?.OS?.MacAddress}</p>
                                <p class="mt-1 font-bold text-slate-800">OsDescription : ${configData?.OS?.OsDescription}</p>
                                <p class="mt-1 font-bold text-slate-800">OsArchitecture : ${configData?.OS?.OsArchitecture}</p>
                                <p class="mt-1 font-bold text-slate-800">ProcessArchitecture : ${configData?.OS?.ProcessArchitecture}</p>
                                <p class="mt-1 font-bold text-slate-800">FrameworkDescription : ${configData?.OS?.FrameworkDescription}</p>
                                <p class="mt-1 font-bold text-slate-800">Is64BitOperatingSystem : ${configData?.OS?.Is64BitOperatingSystem}</p>
                                <p class="mt-1 font-bold text-slate-800">Is64BitProcess : ${configData?.OS?.Is64BitProcess}</p>
                                <p class="mt-1 font-bold text-slate-800">ProcessorCount : ${configData?.OS?.ProcessorCount}</p>
                                <p class="mt-1 font-bold text-slate-800">SystemDirectory : ${configData?.OS?.SystemDirectory}</p>
                                <p class="mt-1 font-bold text-slate-800">CurrentDirectory : ${configData?.OS?.CurrentDirectory}</p>
                                <p class="mt-1 font-bold text-slate-800">TickCount64 : ${configData?.OS?.TickCount64}</p>
                                <p class="mt-1 font-bold text-slate-800">DomainName : ${configData?.OS?.DomainName}</p>
                                <p class="mt-1 font-bold text-slate-800">IsAdministrator : ${configData?.OS?.IsAdministrator}</p>
                            </div>`;
        } else {
            configContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4 bg-red-100">
                                <p class="text-xs font-semibold uppercase text-red-800">Không thể lấy thông tin cấu hình từ Hilo Plugin.</p>
                            </div>`;
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        configContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4 bg-red-100">
                                <p class="text-xs font-semibold uppercase text-red-800">Không thể lấy thông tin cấu hình từ Hilo Plugin.</p>
                            </div>`;
    }
});
checkCertificateButton.addEventListener('click', async () => {
    var certificateContent = document.getElementById('certificateContent');
    certificateContent.innerHTML = 'Đang kiểm tra chứng thư...';
    try {
        var certificates = await HiloPlugin.Utils.getCertificates();
        certificateContent.innerHTML = '';


        if (certificates && certificates.length > 0) {
            for (const cert of certificates) {
                certificateContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4">
                                <p class="text-xs font-semibold uppercase text-slate-400">Chứng thư số  ${cert?.SerialNumber}</p>
                                <p class="mt-1 font-bold text-slate-800">Subject : ${cert?.Subject}</p>
                                <p class="mt-1 font-bold text-slate-800">SerialNumber : ${cert?.SerialNumber}</p>
                                <p class="mt-1 font-bold text-slate-800">Owner : ${cert?.Owner}</p>
                                <p class="mt-1 font-bold text-slate-800">Supplier : ${cert?.Supplier}</p>
                                <p class="mt-1 font-bold text-slate-800">FromDate : ${cert?.FromDate}</p>
                                <p class="mt-1 font-bold text-slate-800">ToDate : ${cert?.ToDate}</p>
                                <p class="mt-1 font-bold text-slate-800">CommonName : ${cert?.CommonName}</p>
                                <p class="mt-1 font-bold text-slate-800">Country : ${cert?.Country}</p>
                                <p class="mt-1 font-bold text-slate-800">State : ${cert?.State}</p>
                                <p class="mt-1 font-bold text-slate-800">Organization : ${cert?.Organization}</p>
                                <p class="mt-1 font-bold text-slate-800">Email : ${cert?.Email}</p>
                                <p class="mt-1 font-bold text-slate-800">TelephoneNumber : ${cert?.TelephoneNumber}</p>
                                <p class="mt-1 font-bold text-slate-800">UserID : ${cert?.UserID}</p>
                                <p class="mt-1 font-bold text-slate-800">TaxCode : ${cert?.TaxCode}</p>
                                <p class="mt-1 font-bold text-slate-800">IsHasPrivateKey : ${cert?.IsHasPrivateKey}</p>
                            </div>`;
            }
        } else {
            certificateContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4 bg-red-100">
                                <p class="text-xs font-semibold uppercase text-red-800">Không có chứng thư nào.</p>
                            </div>`;
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        certificateContent.innerHTML += `<div class="rounded-xl border border-slate-600 border-dashed  p-4 bg-red-100">
                                <p class="text-xs font-semibold uppercase text-red-800">Không thể lấy thông tin chứng thư từ Hilo Plugin.</p>
                            </div>`;
    }
});
signXmlButton.addEventListener('click', async () => {
    var signedXmlResult = document.getElementById('signedXmlResult');
    signedXmlResult.value = 'Đang ký XML...';
    try {
        var resultSignXml = await HiloPlugin.Utils.signXml(
            document.getElementById('xmlData').value,
            document.getElementById('xmlIdToSign').value,
            document.getElementById('xmlHashAlgorithm').value,
            document.getElementById('xmlRSASignaturePadding').value,
            null
        );


        if (resultSignXml) {
            signedXmlResult.value = resultSignXml;
        } else {
            signedXmlResult.value = 'Không thể ký XML.';
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        signedXmlResult.value = error;
    }
});

signPdfButton.addEventListener('click', async () => {
    var pdfFile = document.getElementById('pdfFile');
    var pdfSignatureImage = document.getElementById('pdfSignatureImage');
    var pdfData = await readBase64File(pdfFile);
    var signatureImageData = await readBase64File(pdfSignatureImage);
    if (!pdfData) {
        alert('Vui lòng chọn file PDF trước khi ký.');
        return;
    }
    try {
        var resultSignPdf = await HiloPlugin.Utils.signPdf(
            pdfData,
            signatureImageData,
            document.getElementById('pdfHashAlgorithm').value,
            document.getElementById('pdfRSASignaturePadding').value,
            null
        );


        if (resultSignPdf) {
            downloadPDFFromBase64(resultSignPdf.Pdf, 'signed_document.pdf');
        } else {
            alert('Không thể ký PDF.');
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        alert('Lỗi khi ký PDF: ' + error.message);
    }

});
signHashButton.addEventListener('click', async () => {
    var signedHashResult = document.getElementById('signedHashResult');
    signedHashResult.value = 'Đang ký Hash...';
    try {
        var resultSignHash = await HiloPlugin.Utils.signHash(
            document.getElementById('hashData').value,
            document.getElementById('hashHashAlgorithm').value,
            document.getElementById('hashRSASignaturePadding').value,
            null
        );


        if (resultSignHash) {
            signedHashResult.value = resultSignHash;
        } else {
            signedHashResult.value = 'Không thể ký Hash.';
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        signedHashResult.value = 'Lỗi khi ký Hash: ' + error.message;
    }
});

signDataButton.addEventListener('click', async () => {
    var signedDataResult = document.getElementById('signedDataResult');
    signedDataResult.value = 'Đang ký Data...';
    try {
        var resultSignData = await HiloPlugin.Utils.signData(
            document.getElementById('hashData').value,
            document.getElementById('dataHashAlgorithm').value,
            document.getElementById('dataRSASignaturePadding').value,
            null
        );

        if (resultSignData) {
            signedDataResult.value = resultSignData;
        } else {
            signedDataResult.value = 'Không thể ký Data.';
        }
    } catch (error) {
        console.error('Error fetching configuration:', error);

        signedDataResult.value = 'Lỗi khi ký Data: ' + error.message;
    }
});

