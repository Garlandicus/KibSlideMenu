//Adapter methods for the slideshow program

function showAndroidToast(toast) {
	if (navigator.userAgent.indexOf('Chrome') != -1 && parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Chrome') + 7).split(' ')[0]) >= 15){//Chrome
	       //do nothing
	}
	else{
	    Android.showToast(toast);
	}
}