# Adds bindings for formatting data to ko and returns it.
define ["lib/zepto", "lib/knockout"], ($, ko) ->
    formatNumber = (value) ->
        value = if typeof value is "function" then new String value() else new String value
        i = value.length
        i = if i > 3 then i % 3 else 0 #part before first comma
        number = if i then "#{value.substr 0, i}," else ""
        number + value.substr(i).replace(/(\d{3})(?=\d)/g, "$1,")

    $.extend ko.bindingHandlers, {
        currency: {
            update: (element, valueAccessor) ->
                $(element).text "£#{formatNumber valueAccessor()}"
        }
        title: {
            update: (element, valueAccessor) ->
                value = valueAccessor()
                if typeof value is "function" then value = value()
                parts = value.split ","
                $(element).text "#{parts[0]},#{parts[1]}"   
        }
        number: {
            update: (element, valueAccessor) ->
                $(element).text(formatNumber valueAccessor())
        }
    }
    ko
