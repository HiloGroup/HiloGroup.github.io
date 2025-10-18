window.HiloPluginSignature = window.HiloPluginSignature || {};

window.HiloPluginSignature.Plugin = {
    schemas: ['http', 'https'],
    ports: [56789, 5050,6060,7070,8080,9090,6789],
    hosts:[],
    availabilityHosts:[],
    currentHost: null,    
    test : {        
        dataSignXmlTest: {
            IdToSign: "HiloGroup",
            XMLDataToSign: "<XmlTemplate><Data Id=\"HiloGroup\"></Data><DSCKS><NNT /></DSCKS></XmlTemplate>",
            HashAlgorithm: "SHA256",
            RSASignaturePadding: "Pkcs1",
            CertSerial: "",
        },
        dataSignXmlsTest: {
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
        signXml:function() {
            return window.HiloPluginSignature.Plugin.signXml(this.dataSignXmlTest).then(response => {
                console.log(response);
                return response;
            });
        },
        signXmls:function() {
            return window.HiloPluginSignature.Plugin.signXmls(this.dataSignXmlsTest).then(response => {
            console.log(response);
            return response;
        })
        }
    },
    httpRequest:function(url, method = 'GET', data = null)
    {
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
                if(response && response.status)
                    resolve(response.Data);
                else
                    reject(response?.Message??"Lỗi không xác định");
             })
            .catch(reject)
            ;
        });
    },
    init() {
        this.hosts = this.schemas.flatMap(schema =>this.ports.map(port => `${schema}://hilo-signature-plugin.hilo.com.vn:${port}`));
    },
    checkHost(host) {
        return new Promise((resolve, reject) => {
            this.httpRequest(`${host}/api/certificate/getversion`)     
            .then(data => {              
                resolve({Host: host, IsAvailability: true});
            }).catch(error => {
                resolve({Host: host, IsAvailability: false});
            })
        });
    },
    checkAllHosts() {
        return Promise.all(this.hosts.map(host => this.checkHost(host)))
            .then(results => {
                this.availabilityHosts = results.filter(result => result.IsAvailability);
                if(this.availabilityHosts.length > 0) {
                    this.currentHost = this.availabilityHosts[0].Host;
                }
                return this.currentHost;
            })
    },
    getRandomHost() {
        return new Promise((resolve, reject) => {
            if(this.currentHost != null)
                return resolve(this.currentHost);
            else
                this.checkAllHosts().then((value) => {
                    resolve(this.currentHost);
                })
        });
    },
    getAllCertificates() {
        return new Promise((resolve, reject) => {
            this.getRandomHost().then((host) => {
                this.httpRequest(`${host}/api/certificate/getall`)
                .then(data => {       
                    resolve(data??[]);
                }).catch(error => {
                    resolve([])
                })
            });
        });
    },
    selectCertificate() {
        return new Promise((resolve, reject) => {
            this.getRandomHost().then((host) => {
                this.httpRequest(`${host}/api/certificate/get`)
                .then(data => {   
                    resolve(data);
                }).catch(error => {
                    resolve(null)
                })
            });
        });
    },
    signXml(data) {
        return new Promise((resolve, reject) => {
            this.getRandomHost().then((host) => {
                this.httpRequest(`${host}/api/certificate/sign78`, 'POST', data)
                .then(resolve).catch(reject)
            });
        });
    },
    signXmls(data) {
        
        return new Promise((resolve, reject) => {
            this.getRandomHost().then((host) => {
                this.httpRequest(`${host}/api/certificate/Sign78s`, 'POST', data)
                .then(resolve).catch(reject)
            });
        });
    }
}
;
window.HiloPluginSignature.Plugin.init();