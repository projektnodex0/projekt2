/*jslint browser: true, regexp: true, unparam: true */
/*global $: false, document: false, console: false, window: false, FileReader: false, hex_md5: false */
var oDoc, init, format, showSource, saveToFile, slides, slideNo, readfile, slide, createDiv, closeDiv, divNo = 0, tekst = 'Tu wpisz swój tekst', divClick, divBlur, makeDivAct, returnContent, saveDivs, repairDivs, slidesPrint = [], parseText;
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
closeDiv = function (obj) {
	'use strict';
	$("#" + obj.id).parent().remove();
};
makeDivAct = function (no) {
	'use strict';
	var id;
	if (typeof no !== 'undefined') {
		id = no.id;
		//$("#" + no).attr('contentEditable',true);
		$("#" + id + " > #handle").removeClass("ui-icon ui-icon-arrow-4 ui-drag").addClass("ui-icon ui-icon-arrow-4 ui-drag");
		$("#" + id + " > #close").attr('onclick', "closeDiv(this)").addClass("ui-close ui-icon ui-icon-close");
		$("#" + id).resizable("destroy").draggable("destroy");
		$("#" + id).resizable().draggable({ handle: "#handle" }).removeClass("ui-draggable");
		console.log(id);
		document.getElementById(id).addEventListener('click', divClick, true);
	}
};
saveDivs = function () {
	'use strict';
	$(".draggg").each(function () {
		var id = this.id;
		if ($("#" + id + " > .tekst").length) {
			$("#" + id).html($("#" + id + " > .tekst").html());
		}
		$("#" + id).removeAttr("onclick");
		$("#" + id).removeClass("ui-resizable");
	});
};
repairDivs = function () {
	'use strict';
	$(".draggg").each(function () {
		var id = this.id, newid = id.match(/\d/g), val = $("#" + id).html(), style = $("#" + id).attr("style");
		newid = newid.join("");
		$("#" + id).remove();
		createDiv(val, style, newid);
	});
};
createDiv = function (text, styl, id) {
	'use strict';
	var und;
	if (typeof text === 'undefined' || text === 'undefined') {
		text = tekst;
	}
	if (typeof id === 'undefined' || id === 'undefined') {
		id = divNo;
		und = '1';
	} else {
		if (divNo < id) {
			divNo = id + 1;
			id += 1;
		}
	}
	if (typeof styl === 'undefined' || styl === 'undefined') {
		styl = '';
	}
	$("#textBox").append("<div class=\"draggg\" id=\"" + id + "p\" style=\"" + styl + "\"><div tabindex=\"0\" id=\"" + id + "\" onclick=\"divClick();\" onblur=\"divBlur();\" class=\"tekst\">" + text + "</div><div id=\"handle\" class=\"ui-icon ui-icon-arrow-4 ui-drag\"></div><div id=\"close\" class=\"ui-close ui-icon ui-icon-close\" onclick=\"closeDiv(this)\"></div></div>");
	$("#" + id).attr('contentEditable', true);
	//$("#close").attr('onclick', "closeDiv(this)").addClass("ui-close ui-icon ui-icon-close");;
	$("#" + id + "p").resizable().draggable({ handle: "#handle" }).removeClass("ui-draggable");
	document.getElementById(id).addEventListener('click', divClick, true);
	//document.getElementById(divNo).addEventListener('blur', divBlur ,true);
	if (typeof und !== 'undefined' && und !== 'undefined') {
		divNo += 1;
	}
};
divClick = function (evt) {
	'use strict';
	if ($(this).html() === tekst) {
		$(this).html('');
		$(this).focus();
	}
};
divBlur = function (evt) {
	'use strict';
	$(".tekst").each(function () {
		if ($(this).text() === "") {
			$(this).text(tekst);
		}
	});
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
returnContent = function () {
	'use strict';
	var content, i, datax = -1000;
	slides[slideNo] = $('#textBox').html();
	saveDivs();
	slidesPrint[slideNo] = $('#textBox').html();
	repairDivs();
	content = '<!doctype html><html><head><meta http-equiv="Content-Type" content="text\/html;charset=UTF-8"><title>Print<\/title>\n<link href="http:\/\/misio.biz\/p\/impress-demo.css" rel="stylesheet" />\n<style type="text\/css">.draggg { position:relative; border-style:solid; border-width:2px; width:200px; height:100px; }<\/style><\/head><body><div id="impress">';
	for (i = 1; i < slides.length; i += 1) {
		content += '<section class="step slide" data-x="' + datax + '" data-y="-1500">' + slidesPrint[i] + '<\/section>';
		datax += 1000;
	}
	content += '<\/div><script type="text\/javascript" src="http:\/\/misio.biz\/p\/impress.js"></script><script>impress().init();<\/script><\/body><\/html>';
	return content;
};
saveToFile = function () {
	'use strict';
	var content = returnContent(), uriContent, newWindow;
	uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	newWindow = window.open(uriContent, 'filename.txt');
	//location.href = uriContent;
};
slides = [];
slideNo = 1;
slide = function (which) {
	'use strict';
	if (which === 'next') {
		slides[slideNo] = $('#textBox').html();
		saveDivs();
		slidesPrint[slideNo] = $('#textBox').html();
		repairDivs();
		$('#textBox').html('');
		slideNo += 1;
		$('#textBox').html(slides[slideNo]);
		saveDivs();
		repairDivs();
		$('#slideNumber').html(slideNo);
	}
	if (which === 'previous' && slideNo >= 2) {
		slides[slideNo] = $('#textBox').html();
		saveDivs();
		slidesPrint[slideNo] = $('#textBox').html();
		repairDivs();
		slideNo -= 1;
		$('#textBox').html(slides[slideNo]);
		saveDivs();
		repairDivs();
		$('#slideNumber').html(slideNo);
	}
	makeDivAct();
};
readfile = function (evt) {
	'use strict';
	var file = evt.target.files[0], reader = new FileReader(), text;
	reader.readAsText(file);
	reader.onload = function (evt) {
		text = evt.target.result;
		//$('#textBox').html(evt.target.result);
		parseText(text);
	};
};
parseText = function (text) {
	'use strict';
	var pattern = /<section class="step slide" data-x="(.*?)" data-y="-1500">(.*?)<\/section>/g, slicedText = text.match(pattern), i;
	slideNo = 1;
	$('#slideNumber').html(slideNo);
	for (i = 1; i <= slicedText.length; i = i + 1) {
		slicedText[i - 1] = slicedText[i - 1].replace(/<section class="step slide" data-x="(.*?)" data-y="-1500">/, '');
		slicedText[i - 1] = slicedText[i - 1].replace(/<\/section>/, '');
		slides[i] = slicedText[i - 1];
		slidesPrint[i] = slides[i];
		//console.log(slicedText[i - 1]);
	}
	$('#textBox').html(slicedText[0]);
	repairDivs();
};
$(document).ready(function () {
	'use strict';
	document.getElementById('plik').addEventListener('change', readfile, false);
	$('#upload').click(function (e) {
		$.generateFile({
			filename	: hex_md5(returnContent()) + '.html',
			content		: returnContent(),
			script		: '/upload'
		});
		e.preventDefault();
		$('#link').html('<a href="/uploads/' + hex_md5(returnContent()) + '.html">Link do pliku</a>');
	});
	if ($.getUrlVar('file') !== 'undefined' && typeof $.getUrlVar('file') !== 'undefined') {
		$.get('uploads/' + $.getUrlVar('file'), function (data) {
			parseText(data);
		});
	}
	$('#load').click(function (ev) {
		window.open('/files', 'Wybierz plik', 'width=600,height=400');
		ev.preventDefault();
	});
});