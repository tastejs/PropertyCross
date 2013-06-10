
function Formatter() {

    this.currency = function(value) {
        return "£" + this.number(value);
    };
    this.title = function(title) {
        //chops off the second comma and everything after it.
        var parts = title.split(",");
        return parts[0] + "," + parts[1];
    };
    this.number = function(number) {
        number = number + "";
        var j = (j = number.length) > 3 ? j % 3 : 0; //part before first comma
        return (j ? number.substr(0, j) + ',' : "") + number.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',');
    };


}