import './table-copy-style.css';
const selectedClass = "__x-selected";
const firstSelectedClass = "__xfirst-selected";
const selectedTableClass = "__x_table-selected";

function getTargetCol(target: HTMLElement) : HTMLTableCellElement {
    let targetTd:any = target;
    if (target.tagName !== "td" && target.tagName !== "th") {
        targetTd = target.closest("td, th");
    }
    return targetTd as HTMLTableCellElement;
}

function unselectTable(target: HTMLTableElement) {
    target.classList.remove(selectedTableClass);
    const selectedTds = getSelectedCells(target);
    for (const cell of Array.from(selectedTds)) {
        cell.classList.remove(selectedClass);
        cell.classList.remove(firstSelectedClass);
    }
}

function handleTableUnselect(e: MouseEvent) {
    if (e.ctrlKey) return;
    let target: HTMLElement|null = e.target as HTMLElement;
    if (!target.classList.contains((selectedTableClass))) {
        target = target.closest('.' + selectedTableClass);
    }
    if (!target) return;
    unselectTable(target as HTMLTableElement);
}

function getSelectedCells(table: HTMLTableElement) {
    return Array.from(table.querySelectorAll("." + selectedClass));
}

function selectItems(td : HTMLTableCellElement) {
    const table = td.closest('table')!;
    const prevSelected = table.querySelectorAll("." + selectedClass);
    prevSelected.forEach(x => x.classList.remove(selectedClass));

    const firstItem = table.querySelector("." + firstSelectedClass)! as HTMLTableCellElement;

    const rowStart = firstItem.closest('tr')!.rowIndex;
    const rowEnd = td.closest('tr')!.rowIndex;

    const colStart = firstItem.cellIndex;
    const colEnd = td.cellIndex;

    const rect = {
        rows: {
            start: Math.min(rowStart, rowEnd),
            end: Math.max(rowStart, rowEnd)
        },
        cols: {
            start: Math.min(colStart, colEnd),
            end: Math.max(colStart, colEnd)
        }
    };

    for (let row = rect.rows.start; row <= rect.rows.end; row++) {
        for (let col = rect.cols.start; col <= rect.cols.end; col++) {
            const column = table.rows[row].cells[col];
            column.classList.add(selectedClass);
        }
    }
    table.classList.add(selectedTableClass);
}


export type InitializationProps = {
    onCopy?: (data:string) => void,
    retrieveText?: (elem: HTMLTableCellElement) => string
};

export default ({ onCopy, retrieveText } : InitializationProps = {}) => {
    document.addEventListener('keyup', e => {
        if (e.key === "Escape") {
            const tables = document.querySelectorAll('.' + selectedTableClass);
            for (const table of Array.from(tables)) {
                unselectTable(table as HTMLTableElement);
            }
        }
    });

    document.body.addEventListener("mouseover", e => {
        if (!e.ctrlKey) return;
        if (!e.buttons) return;
        e.preventDefault();
        let target = getTargetCol(e.target as HTMLElement);
        if (!target) return;
        selectItems(target)
    });

    document.body.addEventListener("mousedown", e => {
        if (!e.ctrlKey) {
            handleTableUnselect(e);
            return;
        }
        let target = getTargetCol(e.target as HTMLElement);
        if (!target) return;
        e.preventDefault();
        target.closest('table')!.querySelector('.' + firstSelectedClass)?.classList?.remove(firstSelectedClass);
        target.classList.add(firstSelectedClass);
        selectItems(target);
    });


    document.body.addEventListener("copy", e => {

        let target: any = e.target as HTMLElement;

        if (target.tagName !== "table") {
            target = target.closest('table');
        }

        // Try finding a table with selected cells
        if (!target) {
            target = document.querySelector('.' + selectedTableClass);
            if(!target) return;
        }

        console.log(target)
    
        const cells = getSelectedCells(target as HTMLTableElement);
        if(cells.length === 0) return;
        let toCopy = "";
        let lastRowIdx = null;
        for (const cell of cells) {
            const rowIndex = cell.closest('tr')!.rowIndex;
            let seperator = "\t";
            if (lastRowIdx === null) {
                seperator = "";
            } else if (rowIndex !== lastRowIdx) {
                seperator = "\n";
            }
            lastRowIdx = rowIndex;
            const text = retrieveText ? retrieveText(cell as HTMLTableCellElement) : cell.textContent;
            toCopy += seperator + text!.trim();
        }

        e.clipboardData!.setData('text/plain', toCopy);
        onCopy && onCopy(toCopy);
        e.preventDefault();
    })
};