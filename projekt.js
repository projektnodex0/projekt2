var oDoc,showSource, init, format;
init = function () {
	'use strict';
	oDoc = document.getElementById("textBox");
	if (document.formularz.switchMode.checked) { showSource(true); }
};

format = function (sCmd, sValue) {
	'use strict';
	document.execCommand(sCmd, false, sValue);
	oDoc.focus();
};

showSource = function (bol) {
	'use strict';
	var oContent, oPre;
	if (bol) {
		oContent = document.createTextNode(oDoc.innerHTML);
		oDoc.innerHTML = "";
		oPre = document.createElement("pre");
		oDoc.contentEditable = false;
		oPre.id = "src";
		oPre.contentEditable = true;
		oPre.appendChild(oContent);
		oDoc.appendChild(oPre);
	} else {
		if (document.all) {
			oDoc.innerHTML = oDoc.innerText;
		} else {
			oContent = document.createRange();
			oContent.selectNodeContents(oDoc.firstChild);
			oDoc.innerHTML = oContent.toString();
		}
		oDoc.contentEditable = true;
	}
	oDoc.focus();
};