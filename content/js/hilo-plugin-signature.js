window.HiloPluginSignature = window.HiloPluginSignature || {};

window.HiloPluginSignature.Plugin = {
    schemas: ['http', 'https'],
    ports: [56789, 5050, 6060, 7070, 8080, 9090, 6789],
    domain: "localhost",
    deeplinkUrl: "HiloPlugin://openapp",
    linkDownload: "https://hilogroup.github.io/pages/tai-xuong/index.html",
    url: {
        getVersion: "/api/certificate/getversion",
        getAllCertificates: "/api/certificate/getall",
        selectCertificate: "/api/certificate/get",
        signXml: "/api/certificate/sign78",
        signXmls: "/api/certificate/Sign78s",
        signHash: "/api/hash/Sign",
        signHashs: "/api/hash/Signs",
    },
    hosts: [],
    availabilityHosts: [],
    currentHost: null,
    test: {
        hash: {
            Data: "2JI5VJsRLke0SVUzjO7QnYVc6W0GODjhrOmwFsRduCQ=",
            IsHash: true,
            HashAlgorithm: "SHA256",
            RSASignaturePadding: "Pkcs1",
            CertSerial: ""
        },
        hashs: {
            IsHash: false,
            Data: [
                {
                    Data: "2JI5VJsRLke0SVUzjO7QnYVc6W0GODjhrOmwFsRduCQ",
                    Key: "1"
                },
                {
                    Data: "2JI5VJsRLke0SVUzjO7QnYVc6W0GODjhrOmwFsRduCQ",
                    Key: "2"
                }
            ],
            HashAlgorithm: "SHA256",
            RSASignaturePadding: "Pkcs1",
            CertSerial: ""
        },
        xml: {
            IdToSign: "HiloGroup",
            XMLDataToSign: "<XmlTemplate><Data Id=\"HiloGroup\"></Data><DSCKS><NNT /></DSCKS></XmlTemplate>",
            HashAlgorithm: "SHA256",
            RSASignaturePadding: "Pkcs1",
            CertSerial: "",
        },
        xmls: {
            IdToSign: "",
            Sign78s: [
                {
                    InvoiceID: "HiloGroup1",
                    IdToSign: "HiloGroup1",
                    XMLDataToSign: "<XmlTemplate><Data Id=\"HiloGroup1\">HiloGroup1</Data><DSCKS><NNT /></DSCKS></XmlTemplate>",
                },
                {
                    InvoiceID: "HiloGroup2",
                    IdToSign: "HiloGroup2",
                    XMLDataToSign: "<XmlTemplate><Data Id=\"HiloGroup2\">HiloGroup2</Data><DSCKS><NNT /></DSCKS></XmlTemplate>",
                }
            ],
            HashAlgorithm: "SHA256",
            RSASignaturePadding: "Pkcs1",
            CertSerial: "",
        },
        signXml: function () {
            return window.HiloPluginSignature.Plugin.signXml(this.xml);
        },
        signXmls: function () {
            return window.HiloPluginSignature.Plugin.signXmls(this.xmls);
        },
        signHash: function () {
            return window.HiloPluginSignature.Plugin.signHash(this.hash);
        },
        signHashs: function () {
            return window.HiloPluginSignature.Plugin.signHashs(this.hashs);
        }
    },
    httpRequest: function (url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: data ? JSON.stringify(data) : null
            })
                .then(response => response.json())
                .then(response => {
                    if (response && response.status)
                        resolve(response.Data);
                    else
                        reject(response?.Message ?? "Lỗi không xác định");
                })
                .catch(reject)
                ;
        });
    },
    init() {
        this.hosts = this.schemas.flatMap(schema => this.ports.map(port => `${schema}://${this.domain}:${port}`));
    },
    openApp() {
        var deeplinkUrl = this.deeplinkUrl;
        var linkDownload = this.linkDownload;
        const windowOpened = window.open(deeplinkUrl, 'Phần mềm ký số T-VAN HILO');
        setTimeout(function () {
            console.log(windowOpened);
            if (windowOpened.closed === false) {
                windowOpened.location.href = linkDownload;
            }
        }, 1000);
    },
    checkHost(host) {
        return new Promise((resolve, reject) => {
            this.httpRequest(`${host}${this.url.getVersion}`)
                .then(data => {
                    resolve({ Host: host, IsAvailability: data != null, Version: data });
                }).catch(error => {
                    resolve({ Host: host, IsAvailability: false });
                })
        });
    },
    checkAllHosts() {
        return Promise.all(this.hosts.map(host => this.checkHost(host)))
            .then(results => {
                this.availabilityHosts = results.filter(result => result.IsAvailability);
                return results;
            })
    },
    getRandomHost() {
        return new Promise((resolve, reject) => {
            if (this.currentHost != null)
                return resolve(this.currentHost);
            else
                this.checkAllHosts().then((value) => {

                    if (this.availabilityHosts.length > 0) {
                        this.currentHost = this.availabilityHosts[0].Host;
                    }
                    if (this.currentHost == null) {
                        return reject("Không tìm thấy Hilo Signature Plugin đang chạy trên máy tính của bạn. Vui lòng khởi động Hilo Signature Plugin để sử dụng chức năng ký số.");
                    }
                    else
                        resolve(this.currentHost);
                })
        });
    },
    getAllCertificates() {
         return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.getAllCertificates}`));
    },
    selectCertificate() {
        return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.selectCertificate}`));
    },
    signHash(data) {

        return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.signHash}`, 'POST', data));

    },
    signHashs(data) {


        return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.signHashs}`, 'POST', data));
    },
    signXml(data) {
        return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.signXml}`, 'POST', data));
    },
    signXmls(data) {

        return this.getRandomHost().then((host) => this.httpRequest(`${host}${this.url.signXmls}`, 'POST', data));
    }
}
    ;
window.HiloPluginSignature.Plugin.init();