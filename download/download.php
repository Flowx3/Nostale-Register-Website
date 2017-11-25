<?php
function makeDownload($file, $dir, $type) {

    header("Content-Type: $type");

    header("Content-Disposition: attachment; filename=\"$file\"");

    readfile($dir.$file);

}

$dir = './';

$type = 'application/zip';

if(!empty($_GET['file']) && !preg_match('=/=', $_GET['file'])) {
    if(file_exists ($dir.$_GET['file']))     {
        makeDownload($_GET['file'], $dir, $type);
    }

}
?>