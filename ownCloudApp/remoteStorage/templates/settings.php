<form id="mediaform">
	<fieldset class="personalblock">
		<?php echo '<strong>'.$l->t('remoteStorage').'</strong> '.OC_User::getUser().'@'.$_SERVER['SERVER_NAME'].'<br>'; ?>
		<?php echo '<em>Use this address wherever you see the remoteStorage logo</em>'; ?>
		<br />Apps that currently have access to your ownCloud:<ul>
		<?php
			foreach(OC_remoteStorage::getAllTokens() as $token => $details) {
				echo '<li>'.$details['appUrl'].': '.$details['categories'].' <input type="submit" value="revoke" onclick="'
					.'$.post(\'/apps/remoteStorage/ajax/revokeToken.php\', \''.$token.'\');"></li>'."\n";
			}
		?></ul>
	</fieldset>
</form>
