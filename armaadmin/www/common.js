function change(element, child) {
	var root = document.getElementById(element);
	for(var node in root.childNodes) {
		if(root.childNodes[node].nodeType == 1 && root.childNodes[node].tagName.toLowerCase() == 'div')
			root.childNodes[node].style.display = 'none';
	}
	document.getElementById(child).style.display = 'block';
}

function isVisible(element) {
	if(element == document)
		return true;

	if(element.style.display == 'none')
		return false;
	else
		return isVisible(element.parentNode);
}

function XHR(address, method, data, handler) {
	var request = new XMLHttpRequest();
	request.onload = function() {
		if(request.readyState == 4)
			handler(request);
	};
	request.open(method, address, true);
	if(data != null) {
		request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		request.send(encode(data));
	}
	else {
		request.send();
	}
}

function encode(data) {
	var request = [];
	for(var key in data)
		request.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	return request.join('&');
}

function get(address, handler) {
	XHR(address, 'GET', null, handler);
}

function post(address, data, handler) {
	XHR(address, 'POST', data, handler);
}
