// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {

    struct Lot{
        uint256 id;
        uint256 carbonfootprint;
        uint256 amount;
        string name;
        bool sold;
    }

     struct Product{
        string name_Product;
        uint32[] carbonfootprint_Product;
        string lot_Product;
        uint256 carbonfootprintTot_Product;
        uint256 amount_Product;
        uint256 residual_amount_Product;
    }

    mapping(uint256 => Lot) private getLotByID;
    mapping(string => Lot[]) private getLotByRawMaterialName;

    mapping(uint256 => bool) private ExistLot;
    mapping(string => bool) private ExistRawMaterial;

    mapping(string => Product) private getProductsByName;
    mapping(string => Product) private getProductsByLot;

    mapping(string => bool) private ExistLot_Product;

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

    function getLastID() public view returns (uint256 id) {
        return id_lot;
    }

    function AddRawMaterial(uint256 id, string memory _name, uint256  _carbonfootprint, uint256  _amount) public {
        require (msg.sender == supplier, "ERRORE - Questa funzione deve essere chiamata solo dai fornitori");
        require (_amount > 0, "ERRORE - Hai inserito un ammontare di materia prima minore o uguale di 0");
        require (_carbonfootprint >= 0, "ERRORE - Il FOOTPRINT deve essere maggiore o uguale a 0");

        id_lot++;

        Lot memory new_lot = Lot({
            id: id,
            carbonfootprint: _carbonfootprint, 
            amount: _amount,
            name: _name,
            sold: false 
        });

        getLotByID[new_lot.id] = new_lot;
        getLotByRawMaterialName[_name].push(new_lot);
        
        ExistLot[new_lot.id] = true;
        ExistRawMaterial[_name] = true;
    }

    function SearchInfoLot(uint256 _lot) public view returns (Lot memory material){
         require (ExistLot[_lot], "ERRORE - Lotto non esistente");
         return getLotByID[_lot] ;
    }

    function SearchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory lot){
        require (ExistRawMaterial[_name], "ERRORE - Nessun lotto contenente questa materia prima");
        return getLotByRawMaterialName[_name];
    }
}