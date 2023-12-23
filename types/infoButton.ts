/**
 * Options for the InfoButton component
 * @content {string | JSX.Element} - The content of the info button
 * @infoButtonSize {"xs" | "sm" | "md" | "lg", optional} - The size of the info icon used as button
 * @infoButtonColorClass {string, optional} - The color of the info icon used as button
 * @access {"hover" | "click", optional} - How to access the info content
 * @display {"absoluteDiv" | "modal"} - The display of the info button --> modal DISABLED for now / no effect
 * @divPosition {"top" | "bottom" | "left" | "right", optional} - The position of the info div - only used if display is absoluteDiv
 * @divZIndexClass {string, optional} - The z-index of the info div - only used if display is absoluteDiv
*/

export type InfoButtonProps = {
    content: string | JSX.Element;
    infoButtonSize?: "xs" | "sm" | "md" | "lg";
    infoButtonColorClass?: string;
    access?: "hover" | "click";
    display?: "absoluteDiv" | "modal"
    divPosition?: "top" | "bottom" | "left" | "right";
    divZIndexClass?: string;
}

/**
 * Return type of the InfoButton helper function
 * @size {number} - The size of the info icon used as button
 * @cursorClass {string} - The cursor of the info icon used as button
 * @positionClass {string} - The position of the info div - only used if display is absoluteDiv
 * @hideInfo {function} - The function that will be called when the info div should be hidden
 * @showInfo {function} - The function that will be called when the info div should be shown
 */

export type InfoButtonConfig = {
    size: number;
    cursorClass: string;
    positionClass: string;
    hideInfo: () => void;
    showInfo: () => void;
}


export const INFO_BUTTON_DEFAULT_VALUES = {
    size: "sm",
    access: "hover",
    display: "absoluteDiv",
    divPosition: "top",
    divZIndexClass: "z-10"
}