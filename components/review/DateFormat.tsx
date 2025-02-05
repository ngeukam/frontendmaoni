import { format, formatDistanceToNow } from 'date-fns';

interface DateProps {
    createdDate: Date; // The date you want to format
}

const DateComponent: React.FC<DateProps> = ({ createdDate }) => {
    // Get the current date and the created date's month and year
    const currentDate = new Date();
    const isSameMonth =
        createdDate.getMonth() === currentDate.getMonth() &&
        createdDate.getFullYear() === currentDate.getFullYear();

    // Relative time (e.g., "2 days ago") only if it's in the current month
    let relativeTime = formatDistanceToNow(createdDate, { addSuffix: true });
    // Remove the word "about" from the relative time if present
    relativeTime = relativeTime.replace(/^about /, '');
    // Full date (e.g., "December 2, 2024")
    const formattedDate = format(createdDate, 'MMM dd, yyyy');

    return (
        <p className="text-sm text-gray-500">
            {isSameMonth ? relativeTime : formattedDate}
        </p>
    );
};

export default DateComponent;
