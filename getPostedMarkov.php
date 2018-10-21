<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
function rrmdir($dir) { 
	if (is_dir($dir)) { 
	  $objects = scandir($dir); 
	  foreach ($objects as $object) { 
		if ($object != "." && $object != "..") { 
		  if (is_dir($dir."/".$object))
			rrmdir($dir."/".$object);
		  else
			unlink($dir."/".$object); 
		} 
	  }
	  rmdir($dir); 
	} 
  }
  rrmdir("/temp");
	$enlace = json_decode(file_get_contents('php://input'), TRUE)['enlace'];
	$path = '/temp/' . md5($enlace);
	$pathfile = $path . '/temp.zip';
	mkdir($path, 0777, true);
	// file handler
	$file = fopen($pathfile, 'a+');
	// cURL
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $enlace);
	// set cURL options
	curl_setopt($ch, CURLOPT_FAILONERROR, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	// set file handler option
	curl_setopt($ch, CURLOPT_FILE, $file);
	// execute cURL
	curl_exec($ch);
	// close cURL
	curl_close($ch);
	// close file
	fclose($file);
	echo shell_exec(escapeshellcmd('promptMaker_zip.py ' . $pathfile));
	echo json_encode('promptMaker_zip.py ' . $pathfile);
?>