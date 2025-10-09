window.HILOGroup = window.HILOGroup || {};

window.HILOGroup.sign = {
init() {
      console.log("HILOGroup sign initialized");
      $("body").append("<div style='position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.5); color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; z-index: 1000;'>HILOGroup Sign v1.0.0</div>");
},
  sayHello(name) {
    console.log(`Xin chào ${name}`);
  },
  showVersion() {
    console.log("Phiên bản: 1.0.0");
  }
};
window.HILOGroup.sign.init();