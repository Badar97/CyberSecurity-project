const table_printer = require('console-table-printer');

function print_lots(array, check) {
    console.log();
    var table = [];
    array.forEach(element => {
        if ((!element.sold && element.residual_amount > 0) || !check) {
            var new_row = { LOTTO: element.id, MATERIA: element.name, FOOTPRINT: element.carbonfootprint, QUANTITA: element.amount, RESIDUO: element.residual_amount };
            table.push(new_row);
        }
    });
    if (table.length == 0) return false;
    table_printer.printTable(table);
    return true;
}

exports.print_lots = print_lots;