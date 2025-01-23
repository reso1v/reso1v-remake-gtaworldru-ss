$(document).ready(function() {
    // Initialize font settings from storage or set defaults
    var storedFontSize = $.jStorage.get("lastFontSize") || "12";
    var storedLineHeight = $.jStorage.get("lastLineHeight") || "1.2";
    var storedFontFamily = $.jStorage.get("lastFontFamily") || "Arial";

    // Set initial values
    $(".output").css({
        "font-size": storedFontSize + "px",
        "line-height": storedLineHeight,
        "font-family": storedFontFamily
    });

    // Update font size
    $("#font-label").on("input", function() {
        var newSize = parseInt($(this).val());
        if (newSize >= 10 && newSize <= 64) {
            $(".output").css("font-size", newSize + "px");
            $.jStorage.set("lastFontSize", newSize);
        }
    });

    // Update line height
    $("#line-height").on("input", function() {
        var newLineHeight = parseFloat($(this).val());
        if (newLineHeight >= 1 && newLineHeight <= 3) {
            $(".output").css("line-height", newLineHeight);
            $.jStorage.set("lastLineHeight", newLineHeight);
        }
    });

    // Update font family
    $("#font-family").on("change", function() {
        var newFont = $(this).val();
        $(".output").css("font-family", newFont);
        $.jStorage.set("lastFontFamily", newFont);
    });

    // Set initial values in controls
    $("#font-label").val(storedFontSize);
    $("#line-height").val(storedLineHeight);
    $("#font-family").val(storedFontFamily);
});
