enyo.kind({
	name: "Storage",
	kind: "Component",

	statics: {
                /* Set the value of item[key] to the stringified version of obj. */
		set: function(name, obj){
                    localStorage.setItem(name, JSON.stringify(obj));
                },

		/* Get the item with the key 'name'. */
		get: function(name){
			var result;
			if(typeof name === "string") {
				result = localStorage.getItem(name);
			}

			if(typeof result === "string"){
				return JSON.parse(result);
			} else if(typeof result === "object" && result !== null) {
				enyo.log("OBJECT:", result);
				throw "ERROR [Storage.get]: getItem returned an object. Should be a string.";
			} else if(typeof result === "undefined" || result === null){
				throw "ERROR: [Storage.get]: getItem returned a falsey value. Should be a string.";
			}
			throw "ERROR: Unspecified";

		},

		/* Remove the item with the key 'name'. */
		remove: function(name){
			if(typeof name === "string") {
				localStorage.remove(name);
			} else {
				throw "ERROR [Storage.remove]: 'name' was not a String.";
			}
		},

		/* Returns length of all localStorage objects. */
		__getSize: function(){
			var i, count = 0;
			for(i = 0; i < localStorage.length; i++){
				count += localStorage.getItem(localStorage.key()).length;
			}
			return count;
		}
	}

});
