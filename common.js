/**
 * 
 * @param {*} str 
 */
function baseName(str) {
	var base = new String(str).substring(str.lastIndexOf('/') + 1); 
	return base;
}

/**
 * 
 * @param {*} x 
 */
function rand(x) {
	return Math.random() * x >> 0;
}

/**
 * 
 * @param {*} path 
 * @param {*} success 
 * @param {*} error 
 */
function loadJSON(path, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success) {
					success(JSON.parse(xhr.responseText));
                }
			} else {
				if (error) {
					error(xhr);
                }
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}