// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {

    // LOTTI INSERITI DAL FORNITORE E ACQUISTATI DL TRASFORMATORE
    struct Lot {
        uint256 id;
        string name;
        uint256 carbonfootprint;
        uint256 amount;
        uint256 residual_amount;
    }

    // PRODOTTI INSERITI DAL TRASFORMATORE E ACQUISTATI DAL CLIENTE
    struct Product {
        string name;
        uint256[] carbonfootprints;
        uint256[] lots;
        int256 carbonfootprintTot_Product;
        int256 amount_Product;
        int256 residual_amount_Product;
    }

    // MEMORIZZAZIONE LOTTI PER ID E PER MATERIA PRIMA
    mapping(uint256 => Lot) private getLotByID;
    mapping(string => Lot[]) private getLotByRawMaterialName;

    mapping(uint256 => bool) private ExistLot;
    mapping(string => bool) private ExistRawMaterial;

    // MEMORIZZAZIONE LOTTI PER PROPRIETARIO (TRASFORMATORE)
    mapping(address => Lot[]) private getLotByTransfromerAddress;

    mapping(string => Product) private getProductsByName;
    mapping(string => Product) private getProductsByLot;
    mapping(string => bool) private ExistLot_Product;


    // COSTRUTTORE
    address supplier;
    address transformer;
    address customer;

    uint256 id_lot;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
        id_lot = 0;
    }

    // INSERIMENTO NUOVO LOTTO (FORNITORE)
    function getLastID() public view returns (uint256 id) {
        return id_lot;
    }
    function AddRawMaterial(address _add, uint256 id, string memory _name, uint256  _carbonfootprint, uint256  _amount) public {
        require (_add == supplier, "ERRORE - SOLO I FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");

        id_lot++;

        Lot memory new_lot = Lot({
            id: id,
            name: _name,
            carbonfootprint: _carbonfootprint, 
            amount: _amount,
            residual_amount: _amount
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(new_lot);
        
        ExistLot[new_lot.id] = true;
        ExistRawMaterial[_name] = true;
    }

    function SearchInfoLot(uint256 _lot) public view returns (Lot memory material) {
         require (ExistLot[_lot], "ERRORE - LOTTO NON ESISTENTE");
         return getLotByID[_lot] ;
    }

    function SearchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory lot) {
        require (ExistRawMaterial[_name], "ERRORE - NESSUN LOTTO CONTIENE QUESTA MATERIA PRIMA");
        return getLotByRawMaterialName[_name];
    }

    // ACQUISTO LOTTO (TRASFORMATORE)
    function PurchaseLot(address _add, uint256[] memory _id) public {
        require (_add == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        for(uint i = 0; i < _id.length; i++) {
            getLotByTransfromerAddress[_add].push(SearchInfoLot(_id[i]));
        }
    }

    function CheckMyLots(address _add) public view returns (Lot[] memory lot) {
        require (_add == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        return getLotByTransfromerAddress[_add];
    }
}