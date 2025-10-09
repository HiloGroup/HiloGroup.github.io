window.HILOGroup = window.HILOGroup || {};

window.HILOGroup.sign = {
  ports: [56789, 5050,6060,7070,8080,9090,6789],
  schemas: ['http', 'https'],
  currentPort: 56789,
  currentSchema: 'http',
  init() {
        
  },
  callApi:function(data)
  {
    return new Promise((resolve, reject) => {
      $.ajax(data).done(function(response) {
        resolve(response);
      }).fail(function(jqXHR, textStatus) {
        reject(textStatus);
      });
    });
  },
  checkPort:function(port, schema) {
    return new Promise((resolve, reject) => {
      const url = `${schema}://localhost:${port}/api/certificate/getversion`;
      this.callApi({
        url: url,
        method: 'GET',
      }).then(response => resolve({
        schema: schema,
        port: port,
        version: response?.data
      })).catch(error => resolve({
        schema: schema,
        port: port,
        version: error?.data
      }));
    });
  },
  checkAllPorts() {
    const result = this.schemas.flatMap(schema =>
      this.ports.map(port => 
      ({
        schema: schema,
        port: port
      })
      )
    );
    return Promise.all(result.map(p => this.checkPort(p.port, p.schema)))
      .then(results => {
        console.log("All ports checked:", results);
        return results;
      })
      .catch(error => {
        console.error("Error checking ports:", error);
        throw error;
      });
  },
  sayHello(name) {
    console.log(`Xin chào ${name}`);
  },
  showVersion() {
    console.log("Phiên bản: 1.0.0");
  }
};
window.HILOGroup.sign.init();