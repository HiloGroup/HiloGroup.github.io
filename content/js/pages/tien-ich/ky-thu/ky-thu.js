$("#btnOpenApplication").click(function() {
    HiloPluginSignature.Plugin.openApp()
});
formatXml = function(xmlString) {
    return new XmlBeautify().beautify(xmlString,
                            {
                                indent: "  ",  //indent pattern like white spaces
                                useSelfClosingElement: true //true:use self-closing element when empty element.
                            })
                            ;
}
$("#btnXmlSignSingle").click(function() {
    document.getElementById('xmlToSignSingle').innerText = formatXml(HiloPluginSignature.Plugin.test.xml.XMLDataToSign);
    HiloPluginSignature.Plugin.test.signXml().then(response => {
        console.log(response);
        document.getElementById('xmlToSignSingleResult' ).innerHTML = formatXml(response).replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
    })
    .catch(error => {
        document.getElementById('xmlToSignSingleResult' ).innerHTML = error;
    })
});
$("#btnXmlToSignMultiple").click(function() {
    let xmls = HiloPluginSignature.Plugin.test.xmls;
    document.getElementById('xmlToSignMultiple1').innerText = formatXml(xmls.Sign78s[0].XMLDataToSign);
    document.getElementById('xmlToSignMultiple2').innerText = formatXml(xmls.Sign78s[1].XMLDataToSign);
    HiloPluginSignature.Plugin.test.signXmls().then(response => {
        console.log(response);
        document.getElementById('xmlToSignMultiple1' ).innerHTML = formatXml(response.Items[0].XMLDataToSign).replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
        document.getElementById('xmlToSignMultiple1Result' ).innerHTML = formatXml(response.Items[0].XmlSignature).replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
        document.getElementById('xmlToSignMultiple2' ).innerHTML = formatXml(response.Items[1].XMLDataToSign).replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
        document.getElementById('xmlToSignMultiple1Result2' ).innerHTML = formatXml(response.Items[1].XmlSignature).replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;");
    })
    .catch(error => {
        document.getElementById('xmlToSignMultiple1Result' ).innerHTML = error;
    })
});
$("#btnHashSignSingle").click(function() {
    document.getElementById('hashToSignSingle').innerText = HiloPluginSignature.Plugin.test.hash.Data;
    HiloPluginSignature.Plugin.test.signHash().then(response => {
        console.log(response);
        document.getElementById('hashToSignSingleResult' ).innerText = response.Data;
    }
    ).catch(error => {
        document.getElementById('hashToSignSingleResult' ).innerText = error;
    });
});
$("#btnHashSignMultiple").click(function() {
    let hashs = HiloPluginSignature.Plugin.test.hashs;
    document.getElementById('hashToSignMultiple1').innerText = hashs.Data[0].Data;
    document.getElementById('hashToSignMultiple2').innerText = hashs.Data[1].Data;
    HiloPluginSignature.Plugin.test.signHashs().then(response => {
        console.log(response);
        document.getElementById('hashToSignMultiple1').innerText = response[0].Hash;
        document.getElementById('hashToSignMultiple1Result' ).innerText = response[0].Data;
        document.getElementById('hashToSignMultiple2').innerText = response[1].Hash;
        document.getElementById('hashToSignMultipleResult2' ).innerText = response[1].Data;
    }).catch(error => {
        document.getElementById('hashToSignMultiple1Result' ).innerText = error;
    });
});