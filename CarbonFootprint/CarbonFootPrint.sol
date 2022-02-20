// SPDX-License-Identifier: GPL-3.0 

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {

    // LOTTI INSERITI DAL FORNITORE E ACQUISTATI DL TRASFORMATORE
    struct Lot {
        uint id;
        string name;
        uint carbonfootprint;
        uint amount;
        uint residual_amount;
        bool sold;
    }

    // PRODOTTI INSERITI DAL TRASFORMATORE E ACQUISTATI DAL CLIENTE
    struct Product {
        string name;
        uint[] carbonfootprints;
        uint[] lots;
        uint total_carbonfootprint;
        uint amount;
        uint residual_amount;
    }

    // MEMORIZZAZIONE LOTTI PER ID E PER MATERIA PRIMA
    mapping(uint => Lot) private getLotByID;
    mapping(string => Lot[]) private getLotByRawMaterialName;

    mapping(uint => bool) private ExistLot;
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
    function AddRawMaterial(uint id, string memory _name, uint  _carbonfootprint, uint  _amount) public {
        require (msg.sender == supplier, "ERRORE - SOLO I FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");

        id_lot++;

        Lot memory new_lot = Lot({
            id: id,
            name: _name,
            carbonfootprint: _carbonfootprint, 
            amount: _amount,
            residual_amount: _amount,
            sold: false
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(new_lot);
        
        ExistLot[new_lot.id] = true;
        ExistRawMaterial[_name] = true;
    }

    function SearchInfoLot(uint _lot) public view returns (Lot memory material) {
         require (ExistLot[_lot], "LOTTO NON ESISTENTE");
         return getLotByID[_lot] ;
    }

    function SearchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory lot) {
        require (ExistRawMaterial[_name], "NESSUN LOTTO CONTIENE QUESTA MATERIA PRIMA");
        return getLotByRawMaterialName[_name];
    }

    // ACQUISTO LOTTO (TRASFORMATORE)
    function PurchaseLot(uint[] memory _id) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        for (uint i = 0; i < _id.length; i++) {
            getLotByID[_id[i]].sold = true;
            for (uint j = 0; j < getLotByRawMaterialName[getLotByID[_id[i]].name].length; j++) {
                if (getLotByRawMaterialName[getLotByID[_id[i]].name][j].id == _id[i])
                    getLotByRawMaterialName[getLotByID[_id[i]].name][j].sold = true;
            }
            getLotByTransfromerAddress[msg.sender].push(getLotByID[_id[i]]);
        }
    }

    function CheckMyLots(address _add) public view returns (Lot[] memory lot) {
        require (_add == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        return getLotByTransfromerAddress[_add];
    }
}