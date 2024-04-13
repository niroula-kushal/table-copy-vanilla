import './table-copy-style.css';
const selectedClass = "__x-selected";
const firstSelectedClass = "__xfirst-selected";
const selectedTableClass = "__x_table-selected";

function getTargetCol(target: HTMLElement): HTMLTableCellElement {
    let targetTd: any = target;
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
    let target: HTMLElement | null = e.target as HTMLElement;
    if (!target.classList.contains((selectedTableClass))) {
        target = target.closest('.' + selectedTableClass);
    }
    if (!target) return;
    unselectTable(target as HTMLTableElement);
}

function getSelectedCells(table: HTMLTableElement) {
    return Array.from(table.querySelectorAll("." + selectedClass));
}

function getLastSelectedCellInfo(table: HTMLTableElement) {
    const selectedCells = Array.from(table.querySelectorAll("." + selectedClass)) as HTMLTableCellElement[];
    const lastCell = selectedCells[selectedCells.length - 1];
    const columnIdx = lastCell.cellIndex;
    const rowIdx = (lastCell.parentElement as HTMLTableRowElement).rowIndex;

    return {
        columnIdx,
        rowIdx
    };
}

function autoScroll(elm: HTMLElement) {
    elm.scrollIntoView({block: "end", inline: "nearest", behavior: 'smooth'});
}

function addColumnSelection(table: HTMLTableElement, columnCount: number) {
    const { rowIdx, columnIdx } = getLastSelectedCellInfo(table);
    const cells = table.rows[rowIdx].cells;

    if(cells.length > columnIdx + columnCount && columnIdx + columnCount >= 0) {
        const finalLastElement = cells[columnIdx + columnCount];
        selectItems(finalLastElement);
    }
}

function addRowSelection(table: HTMLTableElement, rowCount: number) {
    const { rowIdx, columnIdx } = getLastSelectedCellInfo(table);
    const rows = table.rows;

    const finalRowIdx = rowIdx + rowCount;

    if(finalRowIdx < 0) return;
    if(finalRowIdx >= rows.length) return;

    const finalLastElement = rows[finalRowIdx].cells[columnIdx];
    selectItems(finalLastElement);
}

function selectItems(td: HTMLTableCellElement) {
    const table = td.closest('table')!;
    const prevSelected = table.querySelectorAll("." + selectedClass);
    prevSelected.forEach(x => x.classList.remove(selectedClass));

    const firstItem = table.querySelector("." + firstSelectedClass)! as HTMLTableCellElement;

    // Re-calculate again
    firstItem.classList.remove(firstSelectedClass);

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
    autoScroll(table.rows[rect.rows.end].cells[rect.cols.end])
    table.classList.add(selectedTableClass);
    table.rows[rect.rows.start].cells[rect.cols.start].classList.add(firstSelectedClass); 
}


export type InitializationProps = {
    onCopy?: (data: string) => void,
    retrieveText?: (elem: HTMLTableCellElement) => string
};

export default ({ onCopy, retrieveText }: InitializationProps = {}) => {
    document.addEventListener('keydown', e => {
        if (e.key === "Escape") {
            const tables = getSelectedTables();
            for (const table of tables) {
                unselectTable(table as HTMLTableElement);
            }
        }
        else if (!e.key.includes("Arrow")) return;
        e.preventDefault();
        const tables = getSelectedTables();
        switch (e.key) {
            case "ArrowLeft":
                for(const table of tables) {
                    addColumnSelection(table, -1);
                }
                break;
            case "ArrowRight":
                for(const table of tables) {
                    addColumnSelection(table, 1);
                }
                break;
            case "ArrowDown":
                for(const table of tables) {
                    addRowSelection(table, 1);
                }
                break;
            case "ArrowUp":
                for(const table of tables) {
                    addRowSelection(table, -1);
                }
                break;
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
            if (!target) return;
        }

        console.log(target)

        const cells = getSelectedCells(target as HTMLTableElement);
        if (cells.length === 0) return;
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

function getSelectedTables() : HTMLTableElement[] {
    return Array.from(document.querySelectorAll('.' + selectedTableClass));
}
