


window.addEventListener('load', function () {

    fetch(_folder_json + '/' + 'text' + _FileId+'.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (jsondata) {
            var countriesArray = $.map(jsondata, function (data, idx) {
                return { value: data.content, data: idx, pagenumber: data.pageindex }
            }).filter(function (f) { return f.value ? true : false });

            // Setup jQuery ajax mock:
            //$.mockjax({
            //    url: "*",
            //    responseTime: 2000,
            //    response: function (settings) {
            //        var query = settings.data.query,
            //            queryLowerCase = query,
            //            re = new RegExp(
            //                "\\b" + $.Autocomplete.utils.escapeRegExChars(queryLowerCase),
            //                "gi"
            //            ),
            //            suggestions = $.grep(countriesArray, function (country) {
            //                // return country.value.toLowerCase().indexOf(queryLowerCase) === 0;
            //                return re.test(country.value);
            //            }),
            //            response = {
            //                query: query,
            //                suggestions: suggestions,
            //            };

            //        this.responseText = JSON.stringify(response);
            //    },
            //});
            // Hàm để xử lý kết quả Autocomplete
            function formatAutocompleteResult(result) {
                // Sử dụng regex để tách từ tiếng Việt từ kết quả
                const vietnameseRegex = /[\u00C0-\u1EF9\u1EFA-\u1EFFa-zA-Z]+/g;
                const matches = result.match(vietnameseRegex);

                // Kết hợp các từ thành một chuỗi kết quả
                const formattedResult = matches ? matches.join(" ") : "";

                return formattedResult;
            }
            // Initialize ajax autocomplete:
            $("#autocomplete-ajax").autocomplete({
                // serviceUrl: '/autosuggest/service/url',
                lookup: countriesArray,
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    var re = new RegExp(
                        "\\b" + $.Autocomplete.utils.escapeRegExChars(queryLowerCase),
                        "gi"
                    );
                    //if (suggestion.value != null) {
                    //    var daco = formatAutocompleteResult(
                    //        suggestion.value.toLowerCase()
                    //    ).slice(
                    //        0,
                    //        formatAutocompleteResult(queryLowerCase.toLowerCase()).length
                    //    );
                    //    var nhapvao = formatAutocompleteResult(queryLowerCase.toLowerCase());
                    //    if (daco == nhapvao) {
                    //        //$('#findResultsText').html(suggestion.value + '<br>');
                    //    }
                    //}
                    return re.test(formatAutocompleteResult(
                        suggestion.value.toLowerCase()
                    ));
                },
                //onSelect: function (suggestion) {;
                //    if (suggestion != undefined) {
                //        $(".card_body_search").html(`<div class="data_result autocomplete-selected" data-p="` + suggestion.pagenumber + `" data-index="0" title="` + suggestion.value + `">` + suggestion.value + `<span class="number_page_search">` + suggestion.pagenumber +`
                //            </span></div>`);
                //    }
                //    else {
                //        $(".card_body_search").html(`<div class="data_result autocomplete-selected" data-p="` + this.pagenumber + `" data-index="0" title="` + this.value + `">` + this.value + `<span class="number_page_search">` + this.pagenumber + `
                //            </span></div>`);
                //    }
                    
                //},
                formatResult: function (suggestion, currentValue) {

                    return suggestion.value;
                },
                onHint: function (hint) {
                    $("#autocomplete-ajax-x").val(hint);
                },
                onInvalidateSelection: function () {
                    $('.total_page_search').text("0");
                },
            });

        });
});
