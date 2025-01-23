$(document).ready(function() {
    // Define available styles
    const styles = [
        { id: 'transparent', name: 'Без фона', color: 'transparent' },
        { id: 'green', name: 'Зеленый фон', color: '#004d00' },
        { id: 'red', name: 'Красный фон', color: '#800000' }
    ];
    
    // Get stored background style or set default
    var currentStyleIndex = Math.max(0, styles.findIndex(style => style.id === ($.jStorage.get("lastBgStyle") || "transparent")));
    
    // Function to update background style
    function updateBackgroundStyle(styleIndex) {
        currentStyleIndex = styleIndex;
        const style = styles[styleIndex];
        $.jStorage.set("lastBgStyle", style.id);
        
        // Update preview style - show border instead of background
        $("#output").removeClass("preview-border-green preview-border-red");
        if (style.id === "green") {
            $("#output").addClass("preview-border-green");
        } else if (style.id === "red") {
            $("#output").addClass("preview-border-red");
        }
        
        // Update button text to show current selection
        $("#bgStyleBtn").text("Стилистика: " + style.name);
    }

    // Handle previous style button
    $("#prevStyle").click(function() {
        currentStyleIndex = (currentStyleIndex - 1 + styles.length) % styles.length;
        updateBackgroundStyle(currentStyleIndex);
    });

    // Handle next style button
    $("#nextStyle").click(function() {
        currentStyleIndex = (currentStyleIndex + 1) % styles.length;
        updateBackgroundStyle(currentStyleIndex);
    });

    // Set initial background style
    updateBackgroundStyle(currentStyleIndex);

    // Modify the download functionality
    $("#downloadOutputTransparent").off("click").click(function() {
        var element = document.getElementById("output");
        var style = styles[currentStyleIndex];
        
        // Store current classes
        var originalClasses = $(element).attr('class');
        
        // Remove preview borders for screenshot
        $(element).removeClass("preview-border-green preview-border-red");
        
        // Add background color for screenshot
        if (style.id !== "transparent") {
            $(element).css("background-color", style.color);
        }

        // Configure options for dom-to-image
        var options = {
            style: {
                'background-color': style.id === "transparent" ? "transparent" : style.color
            },
            bgcolor: style.id === "transparent" ? null : undefined
        };

        // Generate and download image
        domtoimage.toBlob(element, options)
            .then(function(blob) {
                window.saveAs(
                    blob,
                    new Date()
                        .toLocaleString()
                        .replaceAll(",", "_")
                        .replaceAll(" ", "_")
                        .replaceAll("/", "-")
                        .replace("__", "_")
                        .replaceAll(":", "-") +
                        "_chatlog" +
                        (style.id === "transparent" ? "_transparent" : "") +
                        ".png"
                );
                
                // Restore original state
                $(element).attr('class', originalClasses);
                $(element).css("background-color", "");
            })
            .catch(function(error) {
                console.error('Error generating image:', error);
                // Restore original state on error
                $(element).attr('class', originalClasses);
                $(element).css("background-color", "");
            });
    });
});
