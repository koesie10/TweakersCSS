$('*[data-type="color"]').minicolors({
    'theme': 'bootstrap'
});

new ZeroClipboard(document.getElementById('copy-output'));
new ZeroClipboard(document.getElementById('copyExport'));

var parser = new (less.Parser)();

$("#customizeBtn").on('click', function (evt) {
    evt.preventDefault();
    var $button = $(this);
    $button.button('loading');
    var $output = $('#output');
    var $outputContainer = $('#outputContainer');
    var modifyVars = parseVariables();
    parser.parse('@import "less/index";', function (err, tree) {
            if (err != null) {
                addError(err);
            }
            var output = tree.toCSS({
                compress: false
            });
            $output.val(output);
            $outputContainer.removeClass('hidden');
            $button.button('reset');
            $('.panel-collapse').removeClass('in');
        }, {
            "modifyVars": modifyVars
        }
    );
});

$('#export').on('click', function (evt) {
    $('#exportTextArea').val(LZString.compressToBase64(JSON.stringify(parseVariables())));
});

$('#import').on('click', function (evt) {
    evt.preventDefault();
    var input = $('#importTextArea').val();
    importVariables(JSON.parse(LZString.decompressFromBase64(input)));
    $('#importModal').modal('hide');
});

$('#copy-close').on('click', function (evt) {
    evt.preventDefault();
    $('#outputContainer').addClass('hidden');
});

function colorNameToHex(color) {
    var colors = {
        "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff", "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead", "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4", "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5", "yellow": "#ffff00", "yellowgreen": "#9acd32"
    };

    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return false;
}

function checkHex(color) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
}

function parseVariables() {
    var modifyVars = {};
    var $variables = $('.customizable');
    $variables.each(function (i, val) {
        var $e = $(val);
        var variable = $e.attr('data-variable');
        var type = $e.attr('type');
        if (type == 'checkbox') {
            value = $e.prop('checked');
            modifyVars[variable] = value;
        } else if (type == 'text') {
            var value = $e.val();
            if (value == '') {
                modifyVars[variable] = 'default';
            } else {
                type = $e.attr('data-type');
                if (type == 'color') {
                    if (value.substr(0, 1) != '#' && !colorNameToHex(value)) {
                        value = '#' + value;
                    }
                    var isOk = checkHex(value) || colorNameToHex(value);
                    if (!isOk) {
                        addError('Invalid color for ' + variable, 'Ongeldige kleur voor ' + variable);
                    }
                }
                modifyVars[variable] = value;
            }
        }
    });
    return modifyVars;
}

function importVariables(modifyVars) {
    if (modifyVars == null) {
        addError('Invalid import string', 'Deze import is ongeldig', false);
        return;
    }
    var $variables = $('.customizable');
    $variables.each(function (i, val) {
        var $e = $(val);
        var variable = $e.attr('data-variable');
        if (typeof(modifyVars[variable]) == 'undefined') {
            return;
        }
        var type = $e.attr('type');
        if (type == 'checkbox') {
            $e.prop('checked', modifyVars[variable]);
        } else if (type == 'text') {
            var value = modifyVars[variable];
            if (value == 'default') {
                value = '';
            }
            $e.val(value);
            type = $e.attr('data-type');
            if (type == 'color') {
                $e.minicolors('value', value);
            }
        }
    });
}

function addError(err, message, throwError) {
    if (!message) message = err;
    if (typeof(throwError) != 'boolean') throwError = true;
    $('#extra').empty();
    $('<div class="alert alert-danger">' +
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
        '<p><span class="glyphicon glyphicon-warning-sign"></span> ' + message + '</p>' +
        '</div>').appendTo('#extra').alert();
    $('#outputContainer').removeClass('hidden');
    $('#customizeBtn').button('reset');
    if (throwError) {
        throw err;
    }
}