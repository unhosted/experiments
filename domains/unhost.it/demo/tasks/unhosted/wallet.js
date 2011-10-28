function getWallet() {
	try {
		var ret = JSON.parse(remoteStorage.getItem("unhosted"));
		if(ret == null) {
			return {};
		}
		return ret;
	} catch(e) {
		return {};
	}
}
function setWallet(wallet) {
	var walletStr = JSON.stringify(wallet);
	remoteStorage.setItem("unhosted", walletStr);
	walletStr = remoteStorage.getItem("unhosted");
	var wallet2 = JSON.parse(walletStr);
}
