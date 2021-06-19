(function () {
    function hackForOldIe(elements) {
        for (var i = 0; i < elements.length; ++i) {
            document.createElement(elements[i]);
        }
    }

    hackForOldIe(arguments);
}('article', 'section', 'header', 'nav', 'footer', 'figure'));

function toSelectBox(selectBox, items, properties, reset, appendEmptyOption) {
    var fetcher = UTIL.getFetcher(properties);
    if (reset) {
        selectBox.html('');
    }
    var fragment = $(document.createDocumentFragment());
    if (appendEmptyOption) {
        fragment.append(('<option/>'));
    }
    $.each(items, function (i, item) {
        fragment.append($('<option>').val(fetcher.value(item)).html(fetcher.text(item)));
    });
    selectBox.append(fragment);
}

function typeOf(obj) {
    return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

function clone(array) {
    return array.slice(0);
}

function DD_MM_YYYYtoYYYYMMDD(dateStr) {
    var d = DD_MM_YYYYtoDate(dateStr);
    return formatDateYYYYMMDD(d);
}

function DD_MM_YYYYtoDate(dateStr) {
    [d, m, y] = dateStr.split('.');
    return new Date(y, m - 1, d);
}

function YYYYMMDDdate(long) {
    return formatDateYYYYMMDD(new Date(long));
}

function formatDateYYYYMMDD(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatDateYYYYMMDDHHMM(date, showSeconds) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        h = '' + d.getHours(),
        m = '' + d.getMinutes(),
        s = !!showSeconds ? ':' + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds() : '';

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (h.length < 2) h = '0' + h;
    if (m.length < 2) m = '0' + m;

    return [year, month, day].join('-') + ' ' + h + ":" + m + s;
}

function checkIsDate(dateValue) {
    if (!dateValue) return false;
    if (!moment) return (!!_ && _.isDate(dateValue)) || Date.parse(dateValue);
    var mDate = moment(dateValue, ['DD.MM.YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'], true);
    return (mDate && mDate.isValid());
}

function getValuesFromMap(jsonmap) {
    var tabledata = [];
    for (entry in jsonmap) {
        tabledata.push({key: entry, value: jsonmap[entry]})
    }
    return tabledata;
}

function putValuesToMap(tabledata) {
    var jsonmap = {};
    for (var i = 0; i < tabledata.length; i++) {
        var key = tabledata[i].key;
        var value = tabledata[i].value;
        jsonmap[key] = (typeOf(value) == "string") ? value.replace(",", ".") : value;
    }
    return jsonmap;
}

function defaultComparator(first, second) {
    return first == second;
}

function removeArrayItemsFromArray(arrayFrom, arrayItems, comparator) {
    var arrFrom = clone(arrayFrom);
    for (var i = arrayItems.length - 1; i >= 0; i--) {
        removeItemFromArray(arrFrom, arrayItems[i], comparator)
    }
    return arrFrom;
}

function removeItemFromArray(array, item, comparator) {
    if (comparator === undefined || comparator == null)
        comparator = defaultComparator;

    for (var i = array.length - 1; i >= 0; i--) {
        if (comparator(array[i], item)) {
            array.splice(i, 1);
        }
    }
}

function contains(array, item, comparator) {
    if (comparator === undefined || comparator == null)
        comparator = defaultComparator;

    for (var i = array.length - 1; i >= 0; i--) {
        if (comparator(array[i], item)) {
            return true;
        }
    }
}

function removeItemFromArrayWithClone(array, item, comparator) {
    var result = clone(array);
    removeItemFromArray(result, item, comparator);
    return result;
}


function emptyGlobalPortfolio(item) {
    return {
        globalPortfolioCode: item.globalPortfolioCode,
        comboPortfolioCodes: [],
        bookCodes: []
    };
}

function gpIsEmpty(item) {
    return (item.bookCodes == undefined ? true : item.bookCodes.length == 0) && (item.comboPortfolioCodes == undefined ? true : item.comboPortfolioCodes.length == 0);
}

CONTROLLERS = {
    toGetParams: function (obj) {
        var params = '';
        for (var key in obj) {
            params += '&' + key + '=' + encodeURIComponent(obj[key]);
        }
        return params;
    }
};

UTIL = {
    getFetcher: function (properties) {
        if (properties) {
            var fetcher = {
                value: function (item) {
                    return item[properties.val];
                },
                text: function (item) {
                    return item[properties.text];
                }
            };
        } else {
            fetcher = {
                value: function (item) {
                    return item;
                },
                text: function (item) {
                    return item;
                }
            };
        }
        return fetcher;
    },
    addSecurityInterceptor: function (moduleName) {
        var httpInterceptor = function ($provide, $httpProvider) {
            $provide.factory('httpInterceptor', function ($q) {
                return {
                    response: function (response) {
                        return response || $q.when(response);
                    },
                    responseError: function (rejection) {
                        if (rejection.status === 401) {
                            window.top.location.href = 'login';
                            return;
                        }
                        return $q.reject(rejection);
                    }
                };
            });
            $httpProvider.interceptors.push('httpInterceptor');
        };
        angular.module(moduleName).config(httpInterceptor);
    },
    notAuthorizedAlert: function () {
        alert('Access denied');
    }
};

LOADING_ICON = {
    init: function () {
        $(document).on({
            ajaxStart: function () {
                LOADING_ICON.show();
            },
            ajaxStop: function () {
                LOADING_ICON.hide();
            }
        });
    },
    hide: function () {
        $("#loading_icon").hide();
    },
    show: function () {
        $("#loading_icon").show();
    }
};

ERROR_HANDLER = {
    init: function () {
        $(window).error(function () {
            alert('Client side error has occurred.');
            LOADING_ICON.hide();
        });

        $(document).ajaxError(function (e, response) {
            ERROR_HANDLER.handleResponse(response);
        })
    },
    handleResponse: function (response) {
        switch (response.status) {
            case 0:
                return;
            case 400:
                alert('Incorrect request parameter.');
                return;
            case 403:
                alert('Access denied.');
                return;
            case 401:
                document.location = 'login';
                return;
            default :
                alert('Server error:' + response.responseText);
        }
    }
};

Formatter = {
    formatTimestamp: function (date) {
        if (!date) return "";
        date = Formatter.wrapDate(date);
        return Formatter.formatDate(date) + ' ' + Formatter.formatTime(date);
    },
    formatDate: function (date) {
        if (!date) return "";
        date = Formatter.wrapDate(date);
        return Formatter.formatNumber(date.getDate()) + '.' + Formatter.formatNumber(date.getMonth() + 1) + '.' + date.getFullYear();
    },
    formatTime: function (date) {
        if (!date) return "";
        date = Formatter.wrapDate(date);
        return date.getHours() + ':' + Formatter.formatNumber(date.getMinutes());
    },
    wrapDate: function (date) {
        return date instanceof Date ? new Date(date.getTime()) : new Date(date);
    },
    formatNumber: function (number) {
        return number >= 10 ? number : "0" + (number).toString();
    },
    formatFloatEx: function (number, precision, defaultText) {
        if (number === undefined) return defaultText;
        return parseFloat(number).toFixed(precision);
    },
    formatFloat: function (number) {
        return Formatter.formatFloatEx(number, 2, "-");
    },
    formatMultilineToHtml: function (text) {
        var regexpN = /\n/igm,
            regexpR = /\r/igm,
            regexpT = /\t/igm;
        return ("" + text).replace(regexpR, "").replace(regexpN, "<br/>").replace(regexpT, "&nbsp;&nbsp;");
    }
};

function executeByCondition(conditionCallback, work, timeInterval, maxTry, errorCallback) {
    if (timeInterval < 1) timeInterval = 100;
    if (maxTry < 0) {
        if (errorCallback !== undefined) {
            errorCallback();
        }
    }
    if (maxTry === undefined) maxTry = 10;

    if (!conditionCallback()) {
        setTimeout(function () {
            executeByCondition(conditionCallback, work, timeInterval, maxTry - 1)
        }, timeInterval);
    } else {
        work();
    }
}

function setByName($scope, name, value) {
    /*var injector = angular.element(document).injector();
     var $parse = injector.get("$parse");
     var model = $parse(name);
     model.assign($scope, value);
     $scope.$apply();*/
    $scope[name] = value;
}

function escapeVarName(name) {
    return (typeOf(name) == "string") ? name.replace('-', '_') : name;
}

function mapToArray(map, titleAggregate, funcInit, funcAggregate, funcFinal) {
    var output = [], item;

    var sum = null;
    if (funcInit != undefined) {
        sum = funcInit();
    }
    for (var key in map) {
        item = {};
        item.key = key;
        item.value = map[key];
        if (funcAggregate != undefined) {
            sum = funcAggregate(sum, item.key, item.value);
        }
        output.push(item);
    }
    if (sum != undefined && sum != null) {
        if (funcFinal != undefined) {
            sum = funcFinal(sum);
        }
        output.push({key: titleAggregate, value: sum});
    }
    return output;
}

function mapArray(array, mapFunc) {
    var ret = [];
    if (isArray(array)) {
        for (var ind = 0; ind < array.length; ind++) {
            ret.push(mapFunc(array[ind]));
        }
    }else{
        for (var ind in array) {
            ret.push(mapFunc(array[ind]));
        }
    }
    return ret;
}

function aggregation(array, agrFunc, initFunc) {
    var item = initFunc !== undefined ? initFunc() : {};

    if (isArray(array)) {
        for (var ind = 0; ind < array.length; ind++) {
            item = agrFunc(item, array[ind]);
        }
    }else {
        for (var ind in array) {
            item = agrFunc(item, array[ind]);
        }
    }
    return item;
}

function forEach(array, func) {
    if (isArray(array)) {
        for (var ind = 0; ind < array.length; ind++) {
            func(array[ind]);
        }
    }else{
        for (var ind in array) {
            func(array[ind]);
        }
    }
}

function cmpArrays(arrA, arrB) {
    //check if lengths are different
    if (arrA.length !== arrB.length) return false;

    //slice so we do not effect the original
    //sort makes sure they are in order
    //join makes it a string so we can do a string compare
    var cA = arrA.slice().sort().join(",");
    var cB = arrB.slice().sort().join(",");

    return cA === cB;
}

function isArray(obj) {
    return obj !== undefined && obj != null && Object.prototype.toString.call(obj) == '[object Array]';
}
function pushOrMake(obj, value) {
    if (!isArray(obj)) {
        obj = [];
    }
    obj.push(value);
    return obj;
}

function getFridayBefore(date) {
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    var dw = date.getDay();
    var lastDate = new Date(y, m + 1, 0).getDate();
    if (lastDate == d) return date;
    if ((lastDate - d) < 3 && dw == 5) return date;

    lastDate = new Date(y, m, 0);
    dw = lastDate.getDay();
    if (dw == 6) return new Date(y, m, -1);
    if (dw == 0) return new Date(y, m, -2);
    return lastDate;
}

function toBusinessDate(date, daysOffset) {
    daysOffset = daysOffset || 0;
    minusDays(date, -daysOffset);
    while (!isBusinessDay(date)) minusDays(date, 1);
    return date;
}

function minusDays(date, daysToSubtract) {
    if (daysToSubtract !== 0) date.setDate(date.getDate() - daysToSubtract);
    return date;
}

function isBusinessDay(date) {
    var day = date.getDay();
    return day !== 0 && day !== 6;
}

function changedOrZero(number, initvalue) {
    if (number == initvalue) number = 0;
    return number;
}

$.sendJson = function (url, param, callback) {
    return $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(param),
        success: callback
    });
};

function prepareResponse(response, handler, snackbar, defaultFailMsg) {
    if (response.success == true) {
        handler(response.data);
    } else {
        snackbar.create(response.message || defaultFailMsg || "Error", 720000);
    }
}

function prepareSaveResponse(response, snackbar, okMessage, defaultFailMsg) {
    prepareResponse(response, function () {
        snackbar.create(okMessage || "Saved", 72000);
    }, snackbar, defaultFailMsg);
}

/**
 * Handsontable row cell renderer
 */
function rowNumberRenderer(instance, td, row, col, proper, value, cellProperties) {
    // Argument #5 - cell value
    arguments[5] = row + 1;
    Handsontable.NumericCell.renderer.apply(this, arguments);
}

/**
 * Handsontable cell renderer for Date from long
 */
function YYYYMMDDdateRenderer(instance, td, row, col, prop, value, cellProperties) {
    // Argument #5 - cell value
    arguments[5] = YYYYMMDDdate(value);
    Handsontable.TextCell.renderer.apply(this, arguments);
}

function saveDataToFile(data, fileName, type) {
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    var link = document.createElement('a');
    link.style = 'display: none';
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
}

function getFileNameFromContentDisposition(contentDisposition) {
    var fileName = (contentDisposition || '').split(';')[2].trim().split('=')[1];
    return fileName
        .replace(/"/g, '')
        .replace('UTF-8', '')
        .replace(/'/gi, '');
}