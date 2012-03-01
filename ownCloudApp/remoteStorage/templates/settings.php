	<fieldset class="personalblock">
		<?php echo '<strong>'.$l->t('remoteStorage').'</strong> '.OC_User::getUser().'@'.$_SERVER['SERVER_NAME'].'<br>'; ?>
		<?php echo '<em>Use this address wherever you see the remoteStorage logo</em>'; ?>
		<br />Apps that currently have access to your ownCloud:
    <script>
      function revokeToken(token) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/apps/remoteStorage/ajax/revokeToken.php', true);
        xhr.send(token);
      }
    </script>
    <ul>
		<?php
			foreach(OC_remoteStorage::getAllTokens() as $token => $details) {
				echo '<li>'.$details['appUrl'].': '.$details['categories'].' <input type="submit" value="revoke" onclick="'
					.'revokeToken(\''.$token.'\');this.parentNode.style.display=\'none\';"></li>'."\n";
			}
		?></ul>
	</fieldset>
