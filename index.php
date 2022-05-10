<?php
 header("Access-Control-Allow-Origin: *");
 header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

$allowed_domains = [
    'https://mc.s10.exacttarget.com/',
    'https://mc.s11.exacttarget.com/',
    'https://mc.s12.exacttarget.com/',
    'https://mc.exacttarget.com/',
    'https://mc.s4.exacttarget.com/',
    'https://mc.s6.exacttarget.com/',
    'https://mc.s7.exacttarget.com/',
    'https://mc.s8.exacttarget.com/'
];

if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_domains)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
    
 ?>
<?php include_once("index.html"); ?>
