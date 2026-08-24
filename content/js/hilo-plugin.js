window.HiloPlugin = window.HiloPlugin || {};

HiloPlugin.Config = {
    http:[56789,5050,6060],
    https: [56790, 5051, 6061],
    deeplink: "HiloPlugin://openapp",
}
HiloPlugin.Api = {
    getUrl: function (protocol, port) {
        return `${protocol}://localhost:${port}`;
    },
    callApi: async function (protocol, port, endpoint, method = 'GET', body = null, timeoutMs = 2000) {
        const url = this.getUrl(protocol, port) + endpoint;

        // Add a timeout signal so failed/hanging ports reject quickly
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "Connection": "close"
            },
            signal: controller.signal
        };

        if (body) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            // Gracefully catch CORS or network connection failures
            return null;
        }
    },
    getVersion: async function (protocol, port) {
        const response = await this.callApi(protocol, port, '/api/certificate/getversion');
        if (response && response.ok) {
            try {
                const data = await response.json();
                console.log(data);
                return { protocol, port, status: 'online', data: data.Data };
            } catch (e) {
            }
        }
        return { protocol, port, status: 'offline', data: null };
    },
    getConfig: async function (protocol, port) {
        const response = await this.callApi(protocol, port, '/api/application/config');
        if (response && response.ok) {
            try {
                const data = await response.json();
                console.log(data);
                return data.Data;
            } catch (e) {
            }
        }
    },
    getCertificates: async function (protocol, port) {
        const response = await this.callApi(protocol, port, '/api/certificate/getall');
        if (response && response.ok) {
            try {
                const data = await response.json();
                console.log(data);
                return data.Data;
            } catch (e) {
            }
        }
        throw new Error('Failed to get certificates. The plugin may not be running or the request timed out.');
    },
    signXml: async function (protocol, port, xmlContent, idToSign, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        const response = await this.callApi(protocol, port, '/api/certificate/sign78', 'POST', {
            XMLDataToSign: xmlContent,
            IdToSign: idToSign,
            HashAlgorithm: hashAlgorithm,
            RSASignaturePadding: rsaSignaturePadding,
            CertSerial: certificateSerialNumber
        });
        if (response && response.ok) {
            const data = await response.json();
            if (!data.status)
                throw new Error(data.Message || 'Unknown error during signing.');
            console.log(data);
            return data.Data;
        }
        throw new Error('Failed to sign XML. The plugin may not be running or the request timed out.');
    },    
    signData: async function (protocol, port, data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        const response = await this.callApi(protocol, port, '/api/data/sign', 'POST', {
            data: data,
            HashAlgorithm: hashAlgorithm,
            RSASignaturePadding: rsaSignaturePadding,
            CertSerial: certificateSerialNumber
        });
        if (response && response.ok) {
            const data = await response.json();
            if (!data.status)
                throw new Error(data.Message || 'Unknown error during signing.');
            console.log(data);
            return data.Data.Data;
        }
        throw new Error('Failed to sign data. The plugin may not be running or the request timed out.');
    },
    signHash: async function (protocol, port, data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        const response = await this.callApi(protocol, port, '/api/hash/sign', 'POST', {
            data: data,
            HashAlgorithm: hashAlgorithm,
            RSASignaturePadding: rsaSignaturePadding,
            CertSerial: certificateSerialNumber
        });
        if (response && response.ok) {
            const data = await response.json();
            if (!data.status)
                throw new Error(data.Message || 'Unknown error during signing.');
            console.log(data);
            return data.Data.Data;
        }
        throw new Error('Failed to sign data. The plugin may not be running or the request timed out.');
    },
    signPdf: async function (protocol, port, data,image, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        const response = await this.callApi(protocol, port, '/api/SignPdf/sign', 'POST', {
            Data: data,
            Image: image,
            HashAlgorithm: hashAlgorithm,
            RSASignaturePadding: rsaSignaturePadding,
            CertSerial: certificateSerialNumber
        },600000);
        if (response && response.ok) {
            const data = await response.json();
            if (!data.status)
                throw new Error(data.Message || 'Unknown error during signing.');
            console.log(data);
            return data.Data;
        }
    }
}
HiloPlugin.Utils = {
    checkAvailablePorts: async function () {
        var taskList = [];
        for (const protocol of ['http', 'https']) {
            for (const port of HiloPlugin.Config[protocol]) {
                taskList.push(HiloPlugin.Api.getVersion(protocol, port));
            }
        }
        return Promise.all(taskList);
    },
    getRandomAvailablePort: async function () {
        var results = await this.checkAvailablePorts();
        var availablePort = results.find(result => result.status === 'online');
        if (availablePort) {
            return { protocol: availablePort.protocol, port: availablePort.port };
        } else {
            throw new Error('No available ports found.');
        }
    },
    openApp: async function () {
        const windowOpened = window.open(HiloPlugin.Config.deeplink, 'Phần mềm ký số T-VAN HILO');
    },
    getConfig: async function () {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.getConfig(protocol, port);
    },
    getCertificates: async function () {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.getCertificates(protocol, port);
    },
    signXml: async function (xmlContent, idToSign, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.signXml(protocol, port, xmlContent, idToSign, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber);
    },
    signData: async function (data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.signData(protocol, port, data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber);
    },
    signHash: async function (data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.signHash(protocol, port, data, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber);
    },
    signPdf: async function (data,image, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber) {
        var { protocol, port } = await this.getRandomAvailablePort();
        return await HiloPlugin.Api.signPdf(protocol, port, data,image, hashAlgorithm, rsaSignaturePadding, certificateSerialNumber);
    }


}