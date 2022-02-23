// SPDX-License-Identifier: GPL-3.0 

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootprint {

    // LOTTI DI MATERIE PRIME E DI PRODOTTI
    struct Lot {
        uint id;
        string name;
        uint carbonfootprint;
        uint amount;
        uint residual_amount;
        bool sold;
        address owner;
    }

    // MEMORIZZAZIONE LOTTI PER ID E PER MATERIA PRIMA
    mapping(uint => Lot) private getLotByID;
    mapping(string => uint[]) private getLotByRawMaterialName;

    mapping(uint => bool) private ExistLot;
    mapping(string => bool) private ExistRawMaterial;

    // MEMORIZZAZIONE LOTTI PER PROPRIETARIO (TRASFORMATORE)
    mapping(address => uint[]) private getLotByAddress;

    // COSTRUTTORE
    address supplier;
    address transformer;
    address customer;

    uint id_lot;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
        id_lot = 1;
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
            sold: false,
            owner: msg.sender
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(_id);

        ExistLot[new_lot.id] = true;
        ExistRawMaterial[_name] = true;
        getLotByAddress[msg.sender].push(_id);
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
            getLotByAddress[msg.sender].push(_id[i]);

            //ID LOTTO 0: UTENTE NON HA PIU' IN POSSESSO QUEL LOTTO
            delete getLotByAddress[getLotByID[_id[i]].owner];
        }      
    }

    function CheckMyLots(address _add) public view returns (Lot[] memory lot) {
        require (_add == transformer || _add == supplier , "ERRORE - SOLO I TRASFORMATORI/FORNITORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        uint size = getLotByAddress[_add].length;
        Lot[] memory temp = new Lot[](size);
        for (uint i = 0; i < size ; i++) {
            temp[i] = getLotByID[getLotByAddress[_add][i]];
        }
        return temp;
    }

    //INSERIMENTO NUOVO PRODOTTO (TRASFORMATORE)
    function AddProduct(uint _id, string memory _name, uint[][] memory _lot_amount, uint  _amount) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");

        uint256 _total_carbonfootprint = 0;

        /* 
        MATRICE _lot_amount
        Ogni colonna corrisponde ad un lotto
        Nella prima riga sono memorizzati gli ID
        Nella seconda riga sono memorizzate le quantità usate dei lotti
        */

        for(uint i = 0; i < _lot_amount[0].length; i++){ 
            Lot memory lot = getLotByID[_lot_amount[0][i]];
            uint lot_carbonfootprint = lot.carbonfootprint;
            uint lot_amount = lot.amount;
            uint amount_used = _lot_amount[1][i];
            _total_carbonfootprint += (lot_carbonfootprint / lot_amount * amount_used);
            getLotByID[_lot_amount[0][i]].residual_amount -= _lot_amount[1][i];
        }

        AddLot(_id, _name, _total_carbonfootprint, _amount);
    }

    //FUNZIONE DI TRASFORMAZIONE LOTTO (TRASFORMATORE)
    function TrasformationLot(uint _id, uint _footprint) public {
        require (msg.sender == transformer, "ERRORE - SOLO I TRASFORMATORI POSSONO ESEGUIRE QUESTA FUNZIONE");
        getLotByID[_id].carbonfootprint += _footprint;
    }

    //FUNZIONE CHE RITORNA TUTTI I LOTTI ACQUISTABILI (CLIENTE)
    function CheckLotBuyable() public view returns (Lot[] memory lot){      
        Lot[] memory temp = new Lot[](id_lot);
        if (id_lot == 0) return temp;
        for (uint i = 0; i < id_lot - 1 ; i++) {
            temp[i] = getLotByID[i+1];
        }
        return temp;
    }

}

