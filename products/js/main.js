$(document).ready(function(){

	var uid;

	// ------ CHECK LOGIN ON LOAD AJAX ----- //
	$.ajax({
		url: 'xhr/check_login.php',
		type: 'get',
		dataType: 'json',
	})
	.done(function(r) {
		if(!r.error){
			$('#logged_username').html(r.user.user_n);
			$('#user_name').html('Welcome, ' + r.user.user_n);
			var uid = r.user.id;
		}

	})
	.fail(function(r) {
		console.log("error");
		console.log(r);
	});

	// ------ GET USER INFO FOR USER.HTML ------ //
	
	$.ajax({
		url: 'xhr/get_user.php',
		type: 'get',
		data:{
			userID: uid
		},
		dataType: 'json',
		success: function(r){
			if(!r.error){
				$('#firstname').val(r.user.first_name);
				$('#lastname').val(r.user.last_name);
				$('#orig_email').val(r.user.email);
			}
		},
		error: function(r){
			console.log('nope');
		}
	});

	// ----- BUTTON EVENTS ----- //

	$('#login_btn').click(function(e) {
		e.preventDefault();
		login();
	});


	$('#regis_btn').click(function(e) {
		e.preventDefault();
		register();
	});

	$('#logout_btn').click(function(e) {
		e.preventDefault();
		logout();
	});

	$('#logged_username').click(function(e){
		e.preventDefault();
		user();
	});

	$('#info_update').click(function(e){
		e.preventDefault();
		update_info();
	});


	// ----- SERVER FUNCTIONS ----- //

	var check_info = function(){
		var new_first = $('#firstname').val();
		var new_last = $('#lastname').val();

		$.ajax({
			url: 'xhr/get_user.php',
			type: 'get',
			data:{
				userID: uid
			},
			dataType: 'json',
			success: function(r){
				$('#firstname').val(r.user.first_name);
				$('#lastname').val(r.user.first_name);
				// $('#orig_email').val(r.user.email);
				console.log(r.user.email);
			},
			fail: function(){
				console.log('nope');
			}
		})

	}

	var update_info = function(){

		var new_first = $('#firstname').val();
		var new_last = $('#lastname').val();
		var new_email = $('#updated_email').val();

		if(new_first !== '' || new_last !== '' || new_email !== ''){
			$.ajax({
				url: 'xhr/update_user.php',
				type: 'post',
				dataType: 'json',
				data: {first_name:new_first, last_name:new_last, email:new_email},
				success: function(){
					noty({
						modal: true,
						layout: 'center',
						text: 'User info updated!',
						type: 'success',
						buttons: [
							{addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {
								$noty.close();
								window.location.href = "../user.html";
							}}
						]
					});//end noty
				}
			});
		}
	}

	var user = function(){
		$.ajax({
			url: 'xhr/get_user.php',
			type: 'get',
			data:{
				userID: uid
			},
			dataType: 'json',
			success: function(r){
				user_settings();
			}
		})
	};

	var user_settings = function(){
		$.ajax({
			url: 'xhr/check_login.php',
			type: 'get',
			dataType: 'json',
			success: function(r){
				if(!r.error){
					window.location.href = "../user.html";
					// check_info();
				}
			}
		})
	};

	var login = function(){

		var user = $('#username').val();
		var pass = $('#password').val();

		$.ajax({
			url: 'xhr/login.php',
			data:{
				username: user,
				password: pass
			},
			type: 'post',
			dataType: 'json',
			success: function(r){
				if(r.error){
					console.log(r.error);
					$('#special_container').noty({text: 'Either the fields are empty, or you have entered a wrong username or password. Please try again (click this error to close).', type: 'error'});
				}else{
					check_login();
					window.location.href = "../logged_in.html";
				}
			}
		});
	};

	var register = function(){
		var email = $('#regis_email').val();
		var user = $('#regis_user').val();
		var pass = $('#regis_pass').val();

		$.ajax({
			url: 'xhr/register.php',
			data:{
				email: email,
				username: user,
				password: pass
			},
			type: 'post',
			dataType: 'json',
			success: function(r){				
				if(r.error){
					console.log(r.error);
					$('#special_container').noty({text: r.error+" Please try again (click this error to close).", type: 'error'});
				}else{
					noty({
						modal: true,
						layout: 'center',
						text: 'Registration Successful!',
						type: 'success',
						buttons: [
							{addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {
								$noty.close();
								window.location.href = "../logged_in.html";
							}}
						]
					});//end noty
				}//end else
			}//end success
		});//end ajax
	};//end register();

	var check_login = function(){
		$.ajax({
			url: 'xhr/check_login.php',
			type: 'get',
			dataType: 'json',
			success: function(r){
				if(r.error){
					console.log("error");
					console.log(r.error);
				}else{
					console.log("you're good");
					console.log(r);
				}
			}
		});

	};

	var logout = function(){
		$.get('xhr/logout.php', function() {
			window.location.href = "../index.html";
		});
	};

});
