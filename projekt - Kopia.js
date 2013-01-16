var oDoc, init, format, showSource, saveToFile, slides, slideNo, readfile, slide, createDiv, closeDiv, divNo = 0, tekst = 'Tu wpisz swój tekst', divClick, divBlur, makeDivAct, returnContent, saveDivs, repairDivs, slidesPrint = [];
init = function() {
  oDoc = document.getElementById("textBox");
  if (document.formularz.switchMode.checked) { showSource(true); }
};

format = function(sCmd, sValue) {
	document.execCommand(sCmd, false, sValue);
	oDoc.focus();
};
closeDiv = function(obj) {
	$("#" + obj.id).parent().remove();
};
makeDivAct = function(no) {
	var i;
		if(typeof no !=='undefined') {
		var id = no.id;
		//$("#" + no).attr('contentEditable',true);
		$("#" + id + " > #handle").removeClass("ui-icon ui-icon-arrow-4 ui-drag").addClass("ui-icon ui-icon-arrow-4 ui-drag");
		$("#" + id + " > #close").attr('onclick', "closeDiv(this)").addClass("ui-close ui-icon ui-icon-close");
		$("#" + id).resizable("destroy").draggable("destroy");
		$("#" + id).resizable().draggable({ handle: "#handle" }).removeClass("ui-draggable");
		console.log(id);
		document.getElementById(id).addEventListener('click', divClick, true);
		}
};
saveDivs = function() {
	$(".draggg").each( function() {
		var id = this.id;
		
		if($("#" + id + " > .tekst").length) {
			$("#" + id).html($("#" + id + " > .tekst").html());
		}
		$("#" + id).removeAttr("onclick");
		$("#" + id).removeClass("ui-resizable");
	});
};
repairDivs = function() {
	$(".draggg").each( function() {
		var id = this.id, newid = id.match(/\d/g), val = $("#" + id).html(), style = $("#" + id).attr("style");
		newid = newid.join("");
		$("#" + id).remove();
		createDiv(val, style, newid);
	});
};
createDiv = function(tekst, styl, id) {
	if(typeof tekst === 'undefined' || tekst === 'undefined') {
		tekst = this.tekst;
	}
	if(typeof id === 'undefined' || id === 'undefined') {
		id = divNo;
		var und = '1';
	}
	else {
		divNo = (divNo > id)? divNo : (++id);
	}
	if(typeof styl === 'undefined' || styl === 'undefined') {
		styl = '';
	}
	$("#textBox").append("<div class=\"draggg\" id=\"" + id + "p\" style=\"" + styl + "\"><div tabindex=\"0\" id=\"" + id + "\" onclick=\"divClick();\" onblur=\"divBlur();\" class=\"tekst\">" + tekst +"</div><div id=\"handle\" class=\"ui-icon ui-icon-arrow-4 ui-drag\"></div><div id=\"close\" class=\"ui-close ui-icon ui-icon-close\" onclick=\"closeDiv(this)\"></div></div>");
	$("#" + id).attr('contentEditable',true);
	//$("#close").attr('onclick', "closeDiv(this)").addClass("ui-close ui-icon ui-icon-close");;
	$("#" + id + "p").resizable().draggable({ handle: "#handle" }).removeClass("ui-draggable");
	document.getElementById(id).addEventListener('click', divClick, true);
	//document.getElementById(divNo).addEventListener('blur', divBlur ,true);
	if(typeof und !== 'undefined' && und !== 'undefined') {
		divNo++;
	}
};
divClick = function(evt) {
	if($(this).html() === tekst)
	{
		$(this).html('');
		$(this).focus();
	}
	
};

divBlur = function(evt) {
	$(".tekst").each(function () {
		if($(this).text() === "") {
			$(this).text(tekst);
		}
	});
};

showSource = function(bol) {
  var oContent;
  if (bol) {
    oContent = document.createTextNode(oDoc.innerHTML);
    oDoc.innerHTML = "";
    var oPre = document.createElement("pre");
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
	var content, i;
	slides[slideNo] = $('#textBox').html();
	saveDivs();
	slidesPrint[slideNo] = $('#textBox').html();
	repairDivs();
content = '<!doctype html><html><head><title>Print<\/title><script type="text\/javascript" src="http:\/\/code.jquery.com\/jquery-1.7.1.min.js"><\/script><script type="text\/javascript" src="http:\/\/github.com\/markdalgleish\/fathom\/raw\/master\/fathom.min.js"><\/script><script type="text\/javascript">$(document).ready(function(){ $(\'#presentation\').fathom({ slideTagName: \'section\' }); });<\/script><style type="text\/css">.draggg { position:relative; border-style:solid; border-width:2px; width:200px; height:100px; } .slide{ -webkit-box-shadow: 0 0 50px #c0c0c0;-moz-box-shadow: 0 0 50px #c0c0c0;box-shadow: 0 0 50px #c0c0c0;-moz-border-radius: 20px;-webkit-border-radius: 20px;border-radius: 20px;-moz-background-clip: padding;-webkit-background-clip: padding-box;background-clip: padding-box;display: inline-block;height: 500px;padding: 20px;position: relative;vertical-align: top;width: 700px;text-align:left;max-height:500px;overflow:hidden;}<\/style><link rel="stylesheet" type="text\/css" href="jquery-ui-1.8.18.custom.css" \/><\/head><body><div id="presentation">';
	for(i = 1; i < slides.length; i++) {
		content += '<section class="slide">' + slidesPrint[i] +'<\/section>';
	}
	content += '<\/div><\/body><\/html>';
	return content;
};
saveToFile = function () {
	var content = returnContent(), uriContent;
	uriContent = "data:application/octet-stream," + encodeURIComponent(content);
	newWindow=window.open(uriContent, 'filename.txt');
	//location.href = uriContent;
};
slides = [];
slideNo = 1;
slide = function (which) {
	if(which=='next') {
		slides[slideNo] = $('#textBox').html();
		saveDivs();
		slidesPrint[slideNo] = $('#textBox').html();
		repairDivs();
		$('#textBox').html('');
		$('#textBox').html(slides[++slideNo]);
		saveDivs();
		repairDivs();
		$('#slideNumber').html(slideNo);
	}
	if(which=='previous' && slideNo>=2) {
		slides[slideNo] = $('#textBox').html();
		saveDivs();
		slidesPrint[slideNo] = $('#textBox').html();
		repairDivs();
		$('#textBox').html(slides[--slideNo]);
		saveDivs();
		repairDivs();
		$('#slideNumber').html(slideNo);
		
	}
	makeDivAct();
};
readfile = function (evt) {
	var file = evt.target.files[0];
	var reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function (evt) {
		var i;
		var text = evt.target.result;
		//$('#textBox').html(evt.target.result);
		var pattern = /<section class="slide">(.*?)<\/section>/g;
		var slicedText = text.match(pattern);
		//console.log(slicedText[1]);
		slideNo = 1;
		$('#slideNumber').html(slideNo);
		for(i = 1; i <= slicedText.length; i = i + 1)
		{
			slicedText[i - 1] = slicedText[i - 1].replace(/<section class="slide">/, '');
			slicedText[i - 1] = slicedText[i - 1].replace(/<\/section>/, '');
			slides[i] = slicedText[i - 1];
			slidesPrint[i] = slides[i];
			console.log(slicedText[i - 1]);
		}
		$('#textBox').html(slicedText[0]);
		repairDivs();
	}
};
$(document).ready(function() {
	document.getElementById('plik').addEventListener('change', readfile, false);
	$('#upload').click(function(e){
		$.generateFile({
			filename	: hex_md5(returnContent()) + '.html',
			content		: returnContent(),
			script		: '/upload'
		});
		e.preventDefault();
		$('#link').html('<a href="/uploads/' + hex_md5(returnContent()) + '.html">Link do pliku</a>');
	});
	//createDiv();
});