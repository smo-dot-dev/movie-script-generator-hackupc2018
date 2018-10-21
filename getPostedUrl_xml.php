<?php
	$post = file_get_contents('php://input');
	$enlace = json_decode($post, TRUE)['enlace'];
	echo json_encode(simplexml_load_string(file_get_contents($enlace)));
?>