<form id="mediaform">
	<fieldset class="personalblock">
		<strong><?php echo $l->t('remoteStorage'); ?></strong><br />
		<?php echo $l->t('User address: ').'<em>'.OC_User::getUser().'@'.$_SERVER['SERVER_NAME'].'</em>'; ?>
    <br />
	</fieldset>
</form>
