<?php

include $_SERVER['DOCUMENT_ROOT'].'/config/Database.php';
/**
 * index short summary.
 *
 * index description.
 *
 * @version 1.0
 * @author Flow
 */

$user = ($_GET['a']);

Database('0',$user);

?>