//PATH WEB3
const web3 = 'http://localhost:22000';
const web3_2 = 'http://localhost:22001';
const web3_3 = 'http://localhost:22002';

exports.web3 = web3
exports.web3_2 = web3_2
exports.web3_3 = web3_3

/* -- SRINGHE INITIALIZE -- */
const node1_string = "Nodo 1: ";
const node2_string = "Nodo 2: ";
const node3_string = "Nodo 3: ";
const usedAccount_string = "ACCOUNT USATO: ";
const deployCompleted_string = 'DEPLOY COMPLETO';
const addressContract_string = 'INDIRIZZO DELLO SMART CONTRACT: ';

exports.node1_string = node1_string
exports.node2_string = node2_string
exports.node3_string = node3_string
exports.usedAccount_string = usedAccount_string
exports.deployCompleted_string = deployCompleted_string
exports.addressContract_string = addressContract_string

/* -- STRINGHE INTERFACCIA -- */
const selectWallet_string = 'SELEZIONA UN WALLET';

exports.selectWallet_string = selectWallet_string

/* -- STRINGHE COMANDI E MESSAGGI GENERALI -- */
const exit_string = 'EXIT';
const back_string = 'BACK';
const unavailableLot_string = 'NESSUN LOTTO DISPONIBILE';
const transactionPerformed_string = 'TRANSAZIONE ESEGUITA';
const transactionCanceled_string = 'TRANSAZIONE ANNULLATA';
const quantity_string = 'QUANTITA\'';
const errorQuantityInt_string = 'ERRORE - QUANTITA\' DEVE ESSERE UN NUMERO INTERO';
const errorQuantityPositive_string = 'ERRORE - QUANTITA\' DEVE ESSERE MAGGIORE DI 0';

exports.exit_string = exit_string
exports.back_string = back_string
exports.unavailableLot_string = unavailableLot_string
exports.transactionPerformed_string = transactionPerformed_string
exports.transactionCanceled_string = transactionCanceled_string
exports.quantity_string = quantity_string
exports.errorQuantityInt_string = errorQuantityInt_string
exports.errorQuantityPositive_string = errorQuantityPositive_string

/* -- STRINGHE FORNITORE -- */
const menuFornitore_string = 'MENU\' FORNITORE';
const insertRawMaterial_string = 'INSERIMENTO DI MATERIE PRIME';
const searchRawMaterial_string = 'RICERCA MATERIA PRIMA';
const searchLot_string = 'RICERCA LOTTO';
const rawMaterial_string = 'MATERIA PRIMA';
const footprint_string = 'FOOTPRINT';
const errorFootprintInt_string = 'ERRORE - FOOTPRINT DEVE ESSERE UN NUMERO INTERO';
const errorFootprintNegative_string = 'ERRORE - FOOTPRINT NON PUO\' AVERE UN VALORE NEGATIVO';
const confirmInsertLot_string = 'SEI SICURO DI VOLER INSERIRE QUESTO LOTTO?';
const insertNameRawMaterial_string = 'INSERISCI IL NOME DELLA MATERIA PRIMA: ';
const insertLotId_string = 'INSERISCI IL CODICE DI LOTTO: ';
const errorInvalidLotId_string = 'ERRORE - CODICE LOTTO NON VALIDO';

exports.menuFornitore_string = menuFornitore_string
exports.insertRawMaterial_string = insertRawMaterial_string
exports.searchRawMaterial_string = searchRawMaterial_string
exports.searchLot_string = searchLot_string
exports.rawMaterial_string = rawMaterial_string
exports.footprint_string = footprint_string
exports.errorFootprintInt_string = errorFootprintInt_string
exports.errorFootprintNegative_string = errorFootprintNegative_string
exports.confirmInsertLot_string = confirmInsertLot_string
exports.insertNameRawMaterial_string = insertNameRawMaterial_string
exports.insertLotId_string = insertLotId_string
exports.errorInvalidLotId_string = errorInvalidLotId_string

/* -- STRINGHE TRASFORMATORE -- */
const menuTrasformatore_string = 'MENU\' TRASFORMATORE';
const purchaseRawMaterial_string = 'ACQUISTO MATERIE PRIME';
const viewLotsPurchased_string = 'VISUALIZZA LOTTI DI TUA PROPRIETA\'';
const insertProduct_string = 'INSERIMENTO PRODOTTI';
const witchRawMaterial_string = 'QUALE MATERIA PRIMA VUOI ACQUISTARE? ';
const selectLotsToPuschase_string = 'SELEZIONA I LOTTI CHE VUOI ACQUISTARE';
const noneLotPurchase_string = 'NESSUN LOTTO DI TUA PROPRIETA\'';
const nameProduct_string = 'NOME PRODOTTO';
const selectLotTakeRawMaterial_string = 'SELEZIONA IL LOTTO DA CUI PRELEVARE MATERIE PRIME';
const end_string = 'FINE';
const cancel_string = 'ANNULLA';
const lotsOwnProperty_string = 'LOTTI DI TUA PROPRIETA\'';
const insertQuantityToTake_string = 'INSERISCI LA QUANTITA\' DA PRELEVARE';
const errorResidualQuantity_string = 'ERRORE - LA QUANTITA\' NON PUO\' SUPERARE IL RESIDUO (';
const errorResidualQuantityFinal_string = ')';
const confirm_string = 'SEI SICURO?';
const mustSelectrawMaterial_string = 'DEVI SELEZIONARE ALMENO UNA MATERIA PRIMA';
const transformation_string = 'TRASFORMAZIONE';
const selectLotToTransform_string = 'SELEZIONA IL LOTTO CHE VUOI TRANSFORMARE';
const insertFootprintTransform_string = 'INSERISCI IL FOOTPRINT ASSOCIATO ALLA TRASFORMAZIONE';

exports.menuTrasformatore_string = menuTrasformatore_string
exports.purchaseRawMaterial_string = purchaseRawMaterial_string
exports.viewLotsPurchased_string = viewLotsPurchased_string
exports.insertProduct_string = insertProduct_string
exports.witchRawMaterial_string = witchRawMaterial_string
exports.selectLotsToPuschase_string = selectLotsToPuschase_string
exports.noneLotPurchase_string = noneLotPurchase_string
exports.nameProduct_string = nameProduct_string
exports.selectLotTakeRawMaterial_string = selectLotTakeRawMaterial_string
exports.end_string = end_string
exports.cancel_string = cancel_string
exports.lotsOwnProperty_string = lotsOwnProperty_string
exports.insertQuantityToTake_string = insertQuantityToTake_string
exports.errorResidualQuantity_string = errorResidualQuantity_string
exports.errorResidualQuantityFinal_string = errorResidualQuantityFinal_string
exports.confirm_string = confirm_string
exports.mustSelectrawMaterial_string = mustSelectrawMaterial_string
exports.transformation_string = transformation_string
exports.selectLotToTransform_string = selectLotToTransform_string
exports.insertFootprintTransform_string = insertFootprintTransform_string

/* -- STRINGHE CLIENTE -- */
const menuCliente_string = 'MENU\' CLIENTE';
const purchaseMaterial =  'ACQUISTA UN PRODOTTO';

exports.menuCliente_string = menuCliente_string
exports.purchaseMaterial = purchaseMaterial
