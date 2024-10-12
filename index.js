const moment = require('luxxy');

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = moment(startDate);
    const end = moment(endDate);
    
    // Ensure start date is before or the same as the end date
    if (start.isAfter(end)) {
        throw new Error('Start date must be before or equal to the end date');
    }

    // Define an object to store the results
    const result = {
        daysExcludingFridays: [],
        daysWorkedExcludingFridays: [],
        monthlyTargets: [],
        totalTarget: 0
    };

    // Iterate through each month in the date range
    let current = start.clone().startOf('month');
    while (current.isBefore(end) || current.isSame(end, 'month')) {
        const month = current.format('YYYY-MM');
        
        // Get the number of working days excluding Fridays for the whole month
        const totalDaysExcludingFridays = countWorkingDaysExcludingFridays(current.clone().startOf('month'), current.clone().endOf('month'));
        
        // Get the actual number of working days excluding Fridays for the period within the start and end dates
        const startOfMonth = current.clone().startOf('month');
        const endOfMonth = current.clone().endOf('month');

        // Adjust for actual range
        const actualStart = moment.max(startOfMonth, start);
        const actualEnd = moment.min(endOfMonth, end);

        const daysWorkedExcludingFridays = countWorkingDaysExcludingFridays(actualStart, actualEnd);
        
        // Proportionally calculate the monthly target
        const monthlyTarget = (daysWorkedExcludingFridays / 365) * totalAnnualTarget;
        
        // Store the results
        result.daysExcludingFridays.push(totalDaysExcludingFridays);
        result.daysWorkedExcludingFridays.push(daysWorkedExcludingFridays);
        result.monthlyTargets.push(monthlyTarget);
        result.totalTarget += monthlyTarget;
        
        current.add(1, 'month'); // Move to the next month
    }

    return result;
}

// Helper function to count working days excluding Fridays
function countWorkingDaysExcludingFridays(startDate, endDate) {
    let count = 0;
    let currentDate = startDate.clone();
    
    while (currentDate.isSameOrBefore(endDate)) {
        const dayOfWeek = currentDate.day();
        // Exclude Fridays (dayOfWeek === 5) and weekends
        if (dayOfWeek !== 5) {
            count++;
        }
        currentDate.add(1, 'day');
    }

    return count;
}

// Example usage:
const startDate = '2023-01-01';
const endDate = '2023-12-31';
const totalAnnualTarget = 1000000;

const result = calculateTotalTarget(startDate, endDate, totalAnnualTarget);
console.log(result);
