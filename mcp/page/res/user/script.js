var username = getCookie()['username']
var user;

var submitModifyUser = function() {
	modifyUser(username, document.getElementById('user_modify_password').value, document.getElementById('user_modify_key').value, function() {
		document.getElementById('user_modify_password').value = '';
		document.getElementById('user_modify_key').value = '';

		alert('User successfully modified');
	});
};

var refresh = function(force) {
	if (typeof force !== 'boolean')
		force = false;

	getUser(username, function(response) {
		user = response;

		if (force) {
			document.getElementById('user_modify_username').value = user.username;
			document.getElementById('user_modify_password').value = '';
			document.getElementById('user_modify_key').value = '';
		}

		document.getElementById('user_modify_admin').checked = user.admin;
		document.getElementById('user_modify_active').checked = user.active;

		var user_servers = user.servers;
		var select = document.createElement('select');
		for (var idx = 0; idx < user_servers.length; idx++) {
			var option = document.createElement('option');
			option.value = user_servers[idx];
			option.innerHTML = user_servers[idx];
			option.setAttribute('selected', 'selected');
			select.appendChild(option);
		}
		document.getElementById('user_modify_servers').innerHTML = select.innerHTML;
	});

	setTimeout(refresh, 500);
};

var load = function() {
	document.getElementById('logout_button').addEventListener('click', function(evt) {
		unsetCookie();
		goto('/');

		evt.preventDefault();
	}, false);

	document.getElementById('user_modify_generate').addEventListener('click', function(evt) {
		document.getElementById('user_modify_form').elements['key'].value = generateKey();

		evt.preventDefault();
	}, false);

	document.getElementById('user_modify_form').addEventListener('submit', function(evt) {
		submitModifyUser();

		evt.preventDefault();
	}, false);

	check(function(admin) {
		if (admin)
			document.getElementById('admin_button').className = '';
	});

	refresh(true);
};

window.addEventListener('load', load, false);
