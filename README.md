# table-copy-vanilla

Allows users to select a portion of html tables and copy the content. The contents can be pasted in excel or excel compatible softwares.

## Demo Link: https://table-copy-vanilla.netlify.app/

## Installation

> npm
```bash
npm i table-copy-vanilla
```

> yarn
```bash
yarn add table-copy-vanilla
```

### User Usage
1. Ctrl+Click on a table cell to begin
2. Move with Arrow keys to select cells
3. CTRL+C to copy data
4. `Esc` to remove selection
5. Mouse click without `CTRL` key inside the table also removes selection

### Tips
1. Press `CTRL` + `ArrowKeys` to select 100 row/columns at a time
2. Press `Shift` + `ArrowKeys` to select 10 rows/columns at a time
3. Press `CTRL` + `Shift` + `ArrowKeys` to select 1000 row/columns at a time

### Focused Element Behavior
If a input element was focused before starting the table selection, the focus will be removed from the element. The focus is restored with the user cancels the selection. Either via `ESC` or by mouse press without `CTRL` pressed