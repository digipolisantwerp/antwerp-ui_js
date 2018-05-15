# ACPaaS UI JS Date Utils

The `@acpaas-ui/js-date-utils` package provides some basic support for handling JS Date objects. Besides the `DateHelper` class, a `DateGenerator` class is included to generate weeks, months and date ranges from a Date Object.

## Installation
---

**NPM**
```
npm i -S @acpaas-ui/js-date-utils
```

**Yarn**
```
yarn add @acpaas-ui/js-date-utils
```


## Import
---

```
// CommonJS
const DateHelper = require('@acpaas-ui/js-date-utils').DateHelper;
const DateGenerator = require('@acpaas-ui/js-date-utils').DateGenerator;

// ES2015
import { DateHelper, DateGenerator } from '@acpaas-ui/js-date-utils';
```

All methods included in both the `Datehelper` and `DateGenerator` can also be imported individually:
```
import { parseDate } from '@acpaas-ui/js-date-utils';
```

## A note about JS and dates
The JavaScript Date object can get quite clunky and confusing to work with, especially across timezones. To keep this package lean and fast, there are no dependencies on helper libraries like **moment.js** and the included functionality is limited to what is necessary to support the generator.

To ensure date formates are respected, it is advised to create and use dates in the `YYYY-MM-DD` format:
```
const today = new Date('2017-10-03'); // this will always be the 3th October, 2017
```

## DateHelper
### Available methods and properties
* `parseDate(...args)`: parse the input to a date object, returns `null` for an invalid date
* `getWeekday(date, startOfWeek)`: return the weekday for the provided date, offset by the (optionally) provided startOfWeek param, returns `-1` for an invalid date
* `getMonthLength(date)`: return the length of the month for the provided date, returns `-1` for an invalid date
* `getFirstWeekdayOfMonth(date, startOfWeek)`: return the weekday for the first day of the month for the provided date, offset by the (optionally) provided startOfWeek param, returns `-1` for invalid dates
* `getLastWeekdayOfMonth(date, startOfWeek)`: return the weekday for the last day of the month for the provided date, offset by the (optionally) provided startOfWeek param, returns `-1` for invalid dates
* `datesAreEqual(dates, specifier)`: compare the provided dates array with an optional specifier
    * `dates (Date[])`: an array of dates to compare
    * `specifier (string | string[])`: a specifier to compare against, can be one or a multitude of:
        * `Y`: year
        * `M`: month
        * `D`: date
        * `h`: hours
        * `m`: minutes
        * `s`: seconds
        * `ms`: milliseconds
        * `value`: integer value (`valueOf`)
* `dateValuesAreEqual(dates, comparator)`: helper method for the `datesAreEqual` method, compares date values by the selected comparator
    * `dates (Date[])`: an array of dates to compare
    * `comparator (string)`: a date getter method to determine the value to compare (e.g.: `getMonths`)
* `updateDate(date, day)`: update the date value of a date, within the limits of the month (negative values will result in 1, values exceeding the month length will result in the month length), returns `the provided value` for an invalid date
* `updateMonth(date, month)`: update the month value of a date, adjusting the year value if necessary, returns `the provided value` for an invalid date
* `formatDate(date, format, options)`: format a date to a (limited set of) date format(s), returns `null` for an invalid date
    * `date (Date)`: the date to format
    * `format (string)`: the target format, can consist of:
        * `YY`: shorthand year notation, e.g.: `89` for 2017
        * `YYYY`: the full year notation, e.g.: `2017`
        * `MM`: the numerical month notation, e.g.: `05` for may
        * `MMMM`: the written month notation, e.g.: `may`
        * `DD`: the numerical month notation, e.g.: `01`
        * `DDDD`: the written day notation, e.g.: `monday`
        * `hh`: the hours notation, e.g.: `03`
        * `mm`: the minutes notation, e.g.: `39`
        * `ss`: the seconds notation, e.g.: `44`
        * `ms`: the milliseconds notation, e.g.: `393`
    * `options ({})`: the formatting options
        * `leadingZero (Boolean)`: add leading zeros
        * `startOfWeek (number)`: the first day of the week
        * `weekdayLabels (string[])`: a custom set of weekday labels
        * `monthLabels (string[])`: a custom set of month labels
* `addLeadingZero(value, addLeadingZero)` return the stringvalue of the provided value with a leading zero if addLeadingZero is true, returns the original string value if it is longer than 2
* `dateOutOfRange(date, range)`: verify wether the provided date is outside of the provided range (an array of integers representing days in a month)
* `closestDateForRange(date, range)`: return the closest date before or after the provided date that is not in the provided range (an array of integers representing days in a month)

### Usage
#### Formatting examples
```
const date = new Date('2017-05-01 03:39:44.393');

DateHelper.format(date, 'hh:mm:ss (ms), DDDD DD MMMM YYYY', {
    addLeadingZero: true,
    startOfWeek: 1,
    weekdayLabels: [
        'Maandag',
        'Dinsdag',
        'Woensdag',
        'Donderdag',
        'Vrijdag',
        'Zaterdag',
        'Zondag'
    ],
    monthLabels: [
        'Januari',
        'Februari',
        'Maart',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Augustus',
        'September',
        'Oktober',
        'November',
        'December'
    ]
});
```
will result in
```
03:39:44 (393), Maandag 01 Mei 2017
```

#### Ranges
A date range consist of an array of dates or weekdays:
```
const dateRange = [
    new Date('2017-05-03'),
    new Date('2017-05-20'),
    5, 6
];
```
which translates to all 5th and 6th weekdays (friday and saturday by default) and the 3rd and 20th of may.
The `dateOutOfRange` and `closestDateForRange` methods expect a parsed date range, an array of integer values representing the days in the month that make up the range. For the above range in the month may, this would be:
```
[ 3, 5, 6, 12, 13, 19, 20, 26, 27 ]
```

The `dateOutOfRange` method will return `true` for the following dates:
```
[
    new Date('2017-05-02'), // a tuesday
    new Date('2017-18-03'), // a thursday
    new Date('2017-31-03'), // a wednesday
]
```
and `false` for these dates:
```
[
    new Date('2017-05-03'), // specific date in the range
    new Date('2017-05-05'), // a friday
    new Date('2017-05-27') // a saturday
]
```

The `closestDateForRange` method will return the closest date outside of the provided range, wether it is before or after the provided date:
```
const range = [ 3, 5, 6, 12, 13, 19, 20, 26, 27 ];

closestDateForRange(new Date('2017-05-13'), range);
=> 2017-05-14

closestDateForRange(new Date('2017-05-12'), range);
=> 2017-05-11
```

## DateGenerator
### Available methods
* `generateMonth(date, options)`: generate an array of day values representing the month for the provided date, returns `[]` for an invalid date
    * `date (Date)`: the target date
    * `options (Object)`: the generator options
        * `startOfWeek (number)`: the first day of the week
        * `padding (boolean)`: add padding for the first & last week (empty values)
        * `generatePadding (boolean)`: use actual day values for the padding
* `generateWeek(start, options, padding)`: generate a week of day values
    * `start (number)`: the day to start from
    * `options (Object)`: the generator options
        * `offset (number)`: offset the start
        * `dayOffset (number)`: offset the day values
        * `padding (boolean)`: add padding at the start/end
        * `fromStart (boolean)`: add padding at the start
    * `padding number[]`: values to be used for padding
* `generatePadding(date, count, fromStart)`: generate a value of integer values to be used as padding, returns `[]` for an invalid date
    * `date (Date)`: the target date
    * `count (number)`: the amount of padding to generate
    * `fromStart (boolean)`: generate padding from the start of the month
* `generateRange(date, ranges, options)`: parse a `DateRange` to a flat array of integers representing the day values, returns `[]` for an invalid date
    * `date (Date)`: the target date
    * `range (Array<number|Date>)`: a range of dates to parse, can be either a Date object or a number representing a weekday
    * `options (Object)`: the range options
        * `startOfWeek (number)`: the first day of the week
