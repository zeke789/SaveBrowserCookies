<?php
header('Access-Control-Allow-Credentials: true');
if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}
header("Access-Control-Allow-Headers: x-requested-with ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Origin: *");
/*

DB NEED ONLY "dspositives" table

CREATE TABLE `dispositives` (
  `id` int(4) NOT NULL,
  `pass` char(12) NOT NULL,
  `arch` char(12) DEFAULT NULL,
  `model` char(60) DEFAULT NULL,
  `cores` int(2) DEFAULT NULL,
  `disk1` char(40) DEFAULT NULL,
  `disk2` char(40) DEFAULT NULL,
  `display` char(150) DEFAULT NULL,
  `ram` int(7) DEFAULT NULL
)
*/

function decode($str)
{
  $decoded = "";
  for( $i = 0; $i < strlen($str); $i++ ) {
    $b = ord($str[$i]);
    $c =true;
    while ($c == true) {
      if($i < 3 ){ $a = $b ^ 103; $c=false; }
      if($i < 6){ $a = $b ^ 121; $c=false; }
      if($i < 9){$a = $b ^ 112; $c=false; }
      if($i < 12){ $a = $b ^ 99; $c=false; }
      if($i < 15){$a = $b ^ 80; $c=false;}
      if($i < 18){ $a = $b ^ 117; $c=false;}
      if($i < 23){ $a = $b ^ 118; $c=false;}
      if($i < 28){ $a = $b ^ 59; $c=false;}
      if($i < 34){ $a = $b ^ 62; $c=false;}
      if($i < 40){ $a = $b ^ 73; $c=false;}
      if($i < 47){ $a = $b ^ 85; $c=false;}
      if($i < 52){ $a = $b ^ 77; $c=false;}
      if($i < 58){ $a = $b ^ 107; $c=false;}
      if($i < 65){ $a = $b ^ 87; $c=false;}
      if($i < 75){ $a = $b ^ 115; $c=false;}
      if($i >= 75){ $a = $b ^ 69; $c=false;}
    }
    $decoded .= chr($a);
  }
  return $decoded;
}

function getpdo()
{
    $host = 'localhost';
    $dbName = 'facecookies';
    $username = 'root';
    $password = '';
    $dsn = "mysql:host=$host;dbname=$dbName;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'"
    ];
    try {
        return new PDO($dsn, $username, $password, $options);
    }catch (PDOException $e){
        # echo  $e->getMessage();
        return false; 
    }
}




 
if( $_SERVER['REQUEST_METHOD'] == 'POST' ){
    $pass = !empty( $_POST['pass'] ) ? $_POST['pass'] : '';

    $arch = !empty( $_POST['a'] ) ? base64_decode($_POST['a']) : '';
    $model = !empty( $_POST['m'] ) ? base64_decode($_POST['m']) : '';
    $cores = !empty( $_POST['c'] ) ? base64_decode($_POST['c']) : '';

    $ram = !empty( $_POST['r'] ) ? base64_decode($_POST['r'])  : '';
    $disk1 = !empty( $_POST['d1'] ) ? base64_decode($_POST['d1']) : '';
    $disk2 = !empty( $_POST['d2'] ) ? base64_decode($_POST['d2']) : '';
    $display = !empty( $_POST['d'] ) ? base64_decode($_POST['d']) : '';

    if( $arch == '' || $model == '' || $cores == '' || $ram == '')
        die('err1');

    $pdo = getpdo();
    $q = "SELECT * FROM dispositives WHERE pass = ?";
    $stmt = $pdo->prepare($q);
    $stmt->execute([$pass]);
    $resp = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if( count($resp)  > 0) {
        $dipositiveDB = $resp[0];

        $arch = decode($arch);
        $model = decode($model);
        $cores = decode($cores);

        $ram = decode($ram);
        $disk1 = decode($disk1);
        $disk2 = decode($disk2);
        $display = decode($display);
        
        if( $dipositiveDB['arch'] != null  && $dipositiveDB['model'] != null && $dipositiveDB['cores'] != null && $dipositiveDB['ram'] != null ){
            if( $arch != $dipositiveDB['arch'] ) die('nodisp');
            if( $model != $dipositiveDB['model'] ) die('nodisp');
            if( $cores != $dipositiveDB['cores'] ) die('nodisp');
    
            if( $ram != $dipositiveDB['ram'] ) die('nodisp');
            if( $disk1 != $dipositiveDB['disk1'] ) die('nodisp');
            if( $disk2 != $dipositiveDB['disk2'] ) die('nodisp');
            if( $display != $dipositiveDB['display'] ) die('nodisp');
            die( (string)$dipositiveDB['appcode'] );
        }else{
            //register new device
            $q = "UPDATE dispositives SET 
                arch = ?,
                model = ?,
                cores = ?,
                ram = ?,
                disk1 = ?,
                disk2 = ?,
                display = ?
                WHERE pass = ?";
            $stmt = $pdo->prepare($q);
            if( $stmt->execute([$arch, $model, $cores, $ram, $disk1, $disk2, $display, $pass]) )
                 die( (string)$dipositiveDB['appcode'] );
            die('err2');
        } 
    }else{
        die('nopass');
    }

}
