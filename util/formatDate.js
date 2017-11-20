import eachDay from 'date-fns/each_day'
import startOfMonth from 'date-fns/start_of_month'
import differenceInDays from 'date-fns/difference_in_days'
import addDays from 'date-fns/add_days'
import endOfToday from 'date-fns/end_of_today'
import format from 'date-fns/format'
import formatRelative from 'date-fns/format'
import isThisWeek from 'date-fns/is_this_week'
import isThisYear from 'date-fns/is_this_year'


export default function(date) {
	const diff = differenceInDays(new Date(), date);
	if (diff === 0) {
		return 'Today';
	} else if (diff === 1) {
		return 'Yesterday';
	} else if (isThisWeek(date) || diff < 3) {
		return format(date, 'dddd');
	} else if (isThisYear(date)) {
		return format(date, 'dddd MMM Do')
	} else {
		return format(date, 'ddd MMM Do YYYY')//`${diff} days ago`
	}
}