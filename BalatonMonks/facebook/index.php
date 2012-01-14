<?php
if (isset($_REQUEST['mockfbmltext'])) {
  echo $_REQUEST['mockfbmltext'];
  exit;
}

require_once 'appinclude.php';

$fbml = <<<EndHereDoc
<div id="container">
<div id="spurlockTT" style="width: 100px; background-color: #CCCCCC; position: absolute; display: none">
This guy has french fries coming out of his mouth.
</div>
<img id="spurlock" style="margin-top: 200px;" src="http://ec.snagfilms.com/images/supersizeme/supersizeme_72x103.jpg" />
</div>
<script>
function myMouseover(evt) {
	//console.log("hello");
	var img = document.getElementById('spurlock');
	var tt = document.getElementById('spurlockTT');
	var container = document.getElementById('container');
	var top = img.getAbsoluteTop();
	var left = img.getAbsoluteLeft();
	var tttop = tt.getClientHeight();
	var ctop = container.getAbsoluteTop();
	var cleft = container.getAbsoluteLeft();
	var scrollWidth = img.getScrollWidth();
	var scrollHeight = img.getScrollHeight();
	tt.setTextValue('top = '+top+' left = '+left+' ctop = '+ctop+' cleft = '+cleft+' scrollWidth = '+scrollWidth+' scrollHeight = '+scrollHeight+' tttop = '+tttop+' evt.pageY = '+evt.pageY);
	tt.setStyle('top', (top-(ctop+98))+"px");
	tt.setStyle('left', scrollWidth+"px");
	tt.setStyle('visibility', 'visible');
	tt.setStyle('display', 'block');
}
function myMouseout(evt) {
//	document.getElementById('spurlockTT').setStyle('display', 'none');
}
document.getElementById('spurlock').addEventListener('mouseover', myMouseover);
document.getElementById('spurlock').addEventListener('mouseout', myMouseout);
</script>
EndHereDoc;

$facebook->api_client->profile_setFBML($fbml, $user);


echo $fbml;
?>