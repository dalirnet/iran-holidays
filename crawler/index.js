var fs = require('fs');
var casper = require('casper').create();
var holidays;

function getHolidays() {
    var temp = {
        year: Number(document.querySelector('div.input-group input.form-control').getAttribute('value')),
        month: 0,
        day: 0,
        index: 0
    };
    var out = [];
    Array.prototype.map.call(document.querySelectorAll('div.panel.panel-body div.row'), function (monthElement) {
        temp.month++;
        Array.prototype.map.call(monthElement.querySelectorAll('ul.list-unstyled li'), function (dayElement) {
            var dayParse = dayElement.childNodes[1].innerText.split(' ');
            dayParse = Number(dayParse[0].replace(/۰/g, '0').replace(/۱/g, '1').replace(/۲/g, '2').replace(/۳/g, '3').replace(/۴/g, '4').replace(/۵/g, '5').replace(/۶/g, '6').replace(/۷/g, '7').replace(/۸/g, '8').replace(/۹/g, '9'));
            var object = {
                year: temp.year,
                month: temp.month,
                day: dayParse,
                comment: [dayElement.childNodes[2].textContent.trim()],
                isHoliday: false
            };
            if (dayElement.getAttribute('class') == 'eventHoliday') {
                object.isHoliday = true;
            }
            if (temp.day != dayParse) {
                out.push(object);
                temp.index++;
            }
            else {
                out[temp.index - 1].comment.push(dayElement.childNodes[2].textContent.trim());
            }
            temp.day = object.day;
        });
    });

    return out;
}

casper.start('https://www.time.ir/fa/eventyear-%d8%aa%d9%82%d9%88%db%8c%d9%85-%d8%b3%d8%a7%d9%84%db%8c%d8%a7%d9%86%d9%87');
casper.then(function () {
    holidays = this.evaluate(getHolidays);
    fs.write(fs.workingDirectory.replace('/crawler', '/') + 'holidays.json', JSON.stringify(holidays), 'w');
});

casper.run(function () {
    console.log('done!');
    casper.exit();
});