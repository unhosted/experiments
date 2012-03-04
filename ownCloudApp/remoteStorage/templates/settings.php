	<fieldset class="personalblock">
		<?php
			echo '<img src="/apps/remoteStorage/remoteStorage.png" style="width:16px"> '
				.'<strong>'.$l->t('remoteStorage').'</strong> user address: '
				.OC_User::getUser().'@'.$_SERVER['SERVER_NAME']
				.' (<a href="http://unhosted.org/" target="_blank">more info</a>)';
		?>
		<script>
			function revokeToken(token) {
				var xhr = new XMLHttpRequest();
				xhr.open('POST', '/apps/remoteStorage/ajax/revokeToken.php', true);
				xhr.send(token);
			}
		</script>
		<?php
		  $tokens = OC_remoteStorage::getAllTokens();
      if(count($tokens)) {
        echo '<p><em>Apps that currently have access to your ownCloud:</em></p><ul>';
        foreach(OC_remoteStorage::getAllTokens() as $token => $details) {
          echo '<li onmouseover="'
            .'document.getElementById(\'revoke_'.$token.'\').style.display=\'inline\';"'
            .'onmouseout="document.getElementById(\'revoke_'.$token.'\').style.display=\'none\';"'
            .'> <strong>'.$details['appUrl'].'</strong>: '.$details['categories']
            .' <a href="#" title="Revoke" class="action" style="display:none" id="revoke_'.$token.'" onclick="'
            .'revokeToken(\''.$token.'\');this.parentNode.style.display=\'none\';"'
            .'><img src="/core/img/actions/delete.svg"></a></li>'."\n";
        }
        echo '</ul>';
      } else {
        echo 'Apps that have access to your ownCloud will be listed here.';
      }
		?>
	</fieldset>
