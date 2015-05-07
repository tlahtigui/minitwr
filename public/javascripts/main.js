
$(document).ready(function () {
	/*orderList = new OrderList('#orders-table', '#orders-tr-template', {
		refreshDelay: 1000
	});*/
	console.log("document is ready !");
	var login_id = $("#login_id").val();
	$.get('/getmessage', {login_id:login_id}, function(result) {
		
		for ( var i = 0; i < result.length; ++i) {
			$("#message_node").val(result[i].message + "\n" + $("#message_node").val());
		}

	});
});

function sendMessage() {
	var login_id = $("#login_id").val();
	var message = $("#message").val();
	$.post('/postmessage', {login_id:login_id, message:message});
	
	$("#message_node").val(message + "\n" + $("#message_node").val());
}