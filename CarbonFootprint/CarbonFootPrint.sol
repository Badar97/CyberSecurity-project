// SPDX-License-Identifier: GPL-3.0 

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {

    // LOTTI DI MATERIE PRIME E DI PRODOTTI
    struct Lot {
        uint id;
        string name;
        uint carbonfootprint;
        uint amount;
        uint residual_amount;
        bool sold;
    }

    // MEMORIZZAZIONE LOTTI PER ID E PER MATERIA PRIMA
    mapping(uint => Lot) private getLotByID;
    mapping(string => uint[]) private getLotByRawMaterialName;

    mapping(uint => bool) private ExistLot;
    mapping(string => bool) private ExistRawMaterial;

    // MEMORIZZAZIONE LOTTI PER PROPRIETARIO (TRASFORMATORE)
    mapping(address => uint[]) private getLotByTransfromerAddress;

    // COSTRUTTORE
    address supplier;
    address transformer;
    address customer;

    uint id_lot;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
        id_lot = 0;
    }

    // INSERIMENTO NUOVA MATERIA PRIMA (FORNITORE)
    function AddRawMaterial (uint _id, string memory _name, uint  _carbonfootprint, uint  _amount) public {
        require (msg.sender == supplier, "ERRORE - SOLO I FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        AddLot(_id, _name, _carbonfootprint, _amount);
    }

    // INSERIMENTO NUOVO LOTTO (FORNITORE-TRASFORMATORE)
    function getLastID() public view returns (uint256 id) {
        return id_lot;
    }  
    function AddLot(uint _id, string memory _name, uint  _carbonfootprint, uint  _amount) public {

        id_lot = _id + 1;

        Lot memory new_lot = Lot({
            id: _id,
            name: _name,
            carbonfootprint: _carbonfootprint, 
            amount: _amount,
            residual_amount: _amount,
            sold: false
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(_id);

        ExistLot[new_lot.id] = true;
        ExistRawMaterial[_name] = true;
    }

    function SearchInfoLot(uint _lot) public view returns (Lot memory material) {
         require (ExistLot[_lot], "LOTTO NON ESISTENTE");
         return getLotByID[_lot] ;
    }

    function SearchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory lot) {
        require (ExistRawMaterial[_name], "NESSUN LOTTO CONTIENE QUESTA MATERIA PRIMA");
        uint size = getLotByRawMaterialName[_name].length;
        Lot[] memory temp = new Lot[](size);
        for (uint i = 0; i < size; i++) {
            temp[i] = getLotByID[getLotByRawMaterialName[_name][i]];
        }
        return temp;
    }

    // ACQUISTO UNO O PIU' LOTTI (TRASFORMATORE)
    function PurchaseLot(uint[] memory _id) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        for (uint i = 0; i < _id.length; i++) {
            getLotByID[_id[i]].sold = true;
            getLotByTransfromerAddress[msg.sender].push(_id[i]);
        }
    }

    function CheckMyLots(address _add) public view returns (Lot[] memory lot) {
        require (_add == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        uint size = getLotByTransfromerAddress[_add].length;
        Lot[] memory temp = new Lot[](size);
        for (uint i = 0; i < size ; i++) {
            temp[i] = getLotByID[i];
        }
        return temp;
    }

    //INSERIMENTO NUOVO PRODOTTO (TRASFORMATORE)
    function AddProduct(uint _id, string memory _name, uint[][] memory _lot_amount_usedXelement, uint  _amount) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");

        uint256 _total_carbonfootprint = 0;

        /*MATRICE _lot_amountXelement
        Ogni colonna corrisponde ad un lotto
        Nella prima riga sono memorizzati gli ID
        Nella seconda riga sono memorizzate le quantità usate dei lotti*/

        for(uint256 i = 0; i < _lot_amount_usedXelement[0].length; i++){ 
            Lot memory elem = getLotByID[_lot_amount_usedXelement[0][i]];
            uint256 elem_carbonfootprint_lot = elem.carbonfootprint;
            uint256 elem_amount_tot = elem.amount;
            uint256 elem_amount_used = _lot_amount_usedXelement[1][i];
            _total_carbonfootprint += (elem_carbonfootprint_lot/elem_amount_tot*elem_amount_used);
        }

        AddLot(_id, _name, _total_carbonfootprint, _amount);
    }
}

