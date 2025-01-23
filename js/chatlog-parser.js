function useRegex(input) {
    let regex = /([01]\d|2[0-3]):[0-5]\d:[0-5]\d/;
    return regex.test(input);
}

$(document).ready(function() {
    // Обработчик для кнопки вставки переноса строки
    $('#insert-newline').click(function() {
        var textarea = $('.textarea-input');
        var pos = textarea[0].selectionStart;
        var text = textarea.val();
        var before = text.substring(0, pos);
        var after = text.substring(pos);
        
        textarea.val(before + '<П>' + after);
        
        // Устанавливаем курсор после вставленного тега
        var newPos = pos + 3;
        textarea[0].setSelectionRange(newPos, newPos);
        textarea.focus();

        // Вызываем обработку и обновление вывода
        parseAndDisplayChatlog();
    });

    function parseAndDisplayChatlog() {
        $(".generated").remove();
        $(".clear").remove();
        
        var lines = $("textarea").val().replace("<script>", "").replace("</script>", "").split("\n");
        
        for (var i = 0; i < lines.length; i++) {
            $(".output").append(
                '<div class="generated" id="chatlogOutput">' +
                (useRegex(lines[i]) ? lines[i].slice(10) : lines[i].slice(0)) +
                '</div><div class="clear"></div>'
            );
        }

        $(".generated").each(function() {
            var lines = $(this).text().split('\n');
            var formattedLines = [];

            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];

                function replaceColorCodes(str) {
                    let result = str;
                    
                    // Обработка переноса строки
                    if (result.includes("<П>")) {
                        result = result.replace(/<П>/g, '<br>');
                    }
                    
                    // Обработка [!]
                    if (result.includes("[!]")) {
                        result = result.replace(/\[!\]/g, '<span style="color: #F200BA;">[!]</span>');
                    }
                    
                    // Обработка строки с отметкой на карте
                    if (result.includes("Мы разместили отметку на вашей карте чтобы помочь вам определить местонахождение вашего автомобиля")) {
                        result = result.replace(/отметку/, '<span style="color: #F9F900;">отметку</span>');
                    }
                    
                    // Обработка строки с отсутствием доступа
                    if (result.includes("Вы не имеете доступа к этой команде")) {
                        return '<span style="color: #FF0000;">' + result + '</span>';
                    }

                    // Обработка принятого репорта
                    if (result.toLowerCase().includes("репорт был принят командой администрации сервера")) {
                        return '<span style="color: #FF0000;">' + result + '</span>';
                    }

                    // Если строка начинается с *, вся строка фиолетовая
                    if (result.trim().startsWith('*')) {
                        return '<span style="color: #8966A5;">' + result + '</span>';
                    }

                    // Обработка слов между **
                    result = result.replace(/\*(.*?)\*/g, '<span style="color: #8966A5;">*$1*</span>');
                    
                    // Обработка слеша с последующим текстом
                    result = result.replace(/\/\S+/g, function(match) {
                        if (match.includes('span>')) return match;
                        return '<span style="color: #1F92FE;">' + match + '</span>';
                    });
                    
                    // Обработка одиночного слеша
                    result = result.replace(/\/(?=\s|$)/g, '<span style="color: #1F92FE;">/</span>');
                    
                    // Обработка цветовых кодов
                    result = result.replace(/\{([A-Fa-f0-9]{6})\}/g, '<span style="color: #$1;">');
                    result = result.replace(/\{([A-Fa-f0-9]{6})\}/g, '</span>');
                    
                    return result;
                }

                line = replaceColorCodes(line);
                formattedLines.push(line);
            }

            var formattedText = formattedLines.join('<br>');

            if (navigator.userAgent.indexOf("Chrome") != -1) {
                $(this).append(" ");
            }

            if (formattedText.toLowerCase().indexOf("репорт находится в процессе рассмотрения") >= 0) {
                $(this).css("color", "#FF0000");
            }
            if (formattedText.trim().startsWith("((") && formattedText.trim().endsWith("))")) {
                $(this).css("color", "#616161");
            }
            if (formattedText.toLowerCase().indexOf("говорит (к") >= 0) {
                $(this).css("color", "#ACACAE");
            }
            if (formattedText.toLowerCase().indexOf("(транспорт)") >= 0) {
                $(this).css("color", "#F9F900");
            }
            if (formattedText.toLowerCase().indexOf("шепчет:") >= 0) {
                $(this).css("color", "#E7A820");
            }

            if (formattedText.toLowerCase().indexOf(" says:") >= 0) $(this).addClass("white");
            if (formattedText.toLowerCase().indexOf(" [low]:") >= 0) $(this).addClass("grey");
            if (formattedText.toLowerCase().indexOf(", $") >= 0) $(this).addClass("grey");
            if (formattedText.toLowerCase().indexOf("you have received $") >= 0) $(this).addClass("grey");
            if (formattedText.toLowerCase().indexOf(" whispers:") >= 0) $(this).addClass("whisper");
            if (formattedText.toLowerCase().indexOf(" whispers:") >= 0 && formattedText.toLowerCase().indexOf("(car)") >= 0) $(this).addClass("carwhisper");
            if (formattedText.toLowerCase().indexOf(" (phone)") >= 0) $(this).addClass("whisper");
            if (formattedText.toLowerCase().indexOf(":o<") >= 0) $(this).addClass("whisper");
            if (formattedText.toLowerCase().indexOf(" [san interview]") == 0) $(this).addClass("news");
            if (formattedText.toLowerCase().indexOf("[san interview]") == 0) $(this).addClass("news");
            if (formattedText.toLowerCase().indexOf(" **[ch:") == 0) $(this).addClass("radio");
            if (formattedText.toLowerCase().indexOf("**[ch:") == 0) $(this).addClass("radio");
            if (formattedText.toLowerCase().startsWith(" ** [") && formattedText.toLowerCase().includes("]") && /\[.*?\]/.test(formattedText)) $(this).addClass("dep");
            if (formattedText.toLowerCase().startsWith("** [") && formattedText.toLowerCase().includes("]") && /\[.*?\]/.test(formattedText)) $(this).addClass("dep");
            if (formattedText.startsWith("`")) {
                $(this).addClass("quote-line");
                formattedText = formattedText.substring(1);
            }

            $(this).html(formattedText);

            $(this).textContent += "‎  ";
            if (!formattedText) $(this).remove();
        });

        $(".generated:first").css({
            "margin-top": "30px",
            "padding-top": "10px"
        });
        
        $(".generated:last").css({
            "padding-bottom": "10px",
            "margin-bottom": "30px"
        });

        $(".generated").css("background-color", "transparent");
    }

    var charName = $("#name").val().toLowerCase();
    var lastCharName = $.jStorage.get("lastCharName");
    
    if (!lastCharName) {
        $.jStorage.set("lastCharName", "");
    }
    
    $("#name").val($.jStorage.get("lastCharName"));
    
    $("#name").on("input propertychange", function() {
        charName = $("#name").val().toLowerCase();
        $.jStorage.set("lastCharName", charName);
        parseAndDisplayChatlog();
    });

    $("textarea").on("input propertychange", parseAndDisplayChatlog);

    $("#color-picker").spectrum({
        color: "#000",
        showInput: true,
        preferredFormat: "hex",
        change: function() {
            $.jStorage.set("lastColor", $("#color-picker").spectrum("get").toHex());
            $(".generated").css("background-color", "transparent");
        },
    });

    $("#color-picker").spectrum("set", $.jStorage.get("lastColor"));

    var lastFontSize = $.jStorage.get("lastFontSize");
    var lastLineHeight = $.jStorage.get("lastLineHeight");

    if (!lastFontSize || !lastLineHeight) {
        $.jStorage.set("lastFontSize", "12");
        $.jStorage.set("lastLineHeight", "2");
    }

    $(".output").css({
        "font-size": lastFontSize + "px",
        "line-height": lastLineHeight + "px",
    });

    $("#font-label").text("font size (" + lastFontSize + "px):");

    $("input[name='font-label']").on("input propertychange", function() {
        var newSize = parseInt($(this).val());
        if (newSize >= 10 && newSize <= 64) {
            $(".output").css({
                "font-size": newSize + "px",
                "line-height": (newSize - 10) + "px",
            });
            $("#font-label").text("font size (" + newSize + "px):");
            $.jStorage.set("lastFontSize", newSize);
            $.jStorage.set("lastLineHeight", newSize - 10);
        }
    });

    const lineHeightSlider = document.getElementById('line-height');
    const lineHeightValue = document.querySelector('.line-height-value');

    lineHeightSlider.addEventListener('input', function() {
        const value = parseFloat(this.value).toFixed(1);
        lineHeightValue.textContent = value;
        $('#output').css('line-height', value);
        $.jStorage.set("lastLineHeight", value);
    });

    const savedLineHeight = $.jStorage.get("lastLineHeight");
    if (savedLineHeight) {
        lineHeightSlider.value = savedLineHeight;
        lineHeightValue.textContent = savedLineHeight;
        $('#output').css('line-height', savedLineHeight);
    }
});