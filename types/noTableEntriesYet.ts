
/**
 * Options for the No table entries yet component
 * @tableColumns {number} - The number of columns in the table (so the text can be across the whole table)
 * @text {string, optional} - The text to be displayed
 * @heightClass {string, optional} - The height of the component
 * @backgroundColorClass {string, optional} - The background color of the component
 * @textColorClass {string, optional} - The text color of the component
 * @marginBottomClass {string, optional} - The margin bottom of the component
*/

export type NoTableEntriesYetProps = {
    tableColumns: number;
    text?: string;
    heightClass?: string;
    backgroundColorClass?: string;
    textColorClass?: string;
    marginBottomClass?: string; // can be used to offset common table paddings, usually negative
}


export const NO_TABLE_ENTRIES_YET_DEFAULTS = {
    text: 'No data yet',
    heightClass: 'h-16',
    backgroundColorClass: 'bg-gray-50',
    textColorClass: 'text-gray-700',
    marginBottomClass: "",
}
