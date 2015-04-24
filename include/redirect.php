<?php
if(isset($_POST['submit'])){
// Fetching variables of the form which travels in URL
$title = $_POST['title'];
$body = $_POST['body'];
$date = $_POST['date'];
$thumb = $_POST['thumb'];
$link = $_POST['link'];
if($title !=''&& $body !=''&& $date !=''&& $thumb !=''&& $link !='')
{
// To redirect form on a particular page
header("Location:slider/slider.php");
}
else{
?><span><?php echo "Please fill all fields.....!!!!!!!!!!!!";?></span> <?php
}
}
?>