<!DOCTYPE html>
<html>
<head>
	<title>Time line</title>
		<meta content="noindex, nofollow" name="robots">
		<link href='css/stylesheet.css' rel='stylesheet' type='text/css'> 
</head>

<body>

	<div class="main">
		<div class="first">
			<h2>Update timeline</h2>
				<form action="slider.php" id="#form" method="post" name="#form">
				<label>Title :</label>
				<input id="title" name="title" placeholder='Title' type='text'><br><br>
				<label>Body :</label>
				<input id="body" name="body" placeholder='Body' type='text'><br><br>
				<label>Date(Day.Month.year) :</label>
				<input id="date" name="date" placeholder='Date' type='text'><br><br>
				<label>Image Link :</label>
				<input id="thumb" name="thumb" placeholder='Thumb' type='text'><br><br>
				<label>Route to page :</label>
				<input id="link" name="link" placeholder='Link' type='text'><br><br>
				<input id='btn' name="submit" type='submit' value='Submit'>
				<?php
				include "include/redirect.php";
				?>
				</form>
		</div>
	</div>

</body>

</html>