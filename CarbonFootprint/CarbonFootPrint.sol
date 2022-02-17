// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {

     struct Product{
        string name_Product;
        uint32[] carbonfootprint_Product;
        string lot_Product;
        uint256 carbonfootprintTot_Product;
        uint256 amount_Product;
        uint256 residual_amount_Product;
    }

    struct RawMaterial{
        string name_RawMaterial;
        string lot_RawMaterial;
        uint256 carbonfootprint_RawMaterial;
        uint256 amount_RawMaterial;
        uint256 residual_amount_RawMaterial;
    }

    mapping(string => Product) private getProductsByName;
    mapping(string => Product) private getProductsByLot;
    mapping(string => RawMaterial) private getRawMaterialByLot;
    mapping(string => RawMaterial) private getRawMaterialByName;

    mapping(string => bool) private ExistLot_RawMaterial;
    mapping(string => bool) private ExistLot_Product;
   mapping(string => bool) private Exist_RawMaterial;

    address supplier;
    address transformer;
    address customer;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
    }

   

    function AddRawMaterial(string memory _name, string memory _lot, uint256  _carbonfootprint, uint256  _amount) public {
        require (msg.sender == supplier, "ERRORE - Questa funzione deve essere chiamata solo dai fornitori");
        require (_amount > 0, "ERRORE - Hai inserito un ammontare di materia prima minore o uguale di 0");
        require (!ExistLot_RawMaterial[_lot], "ERRORE - Lotto gia' esistente");
        require (_carbonfootprint >= 0, "ERRORE - Il FOOTPRINT deve essere maggiore o uguale a 0");

        RawMaterial memory material = RawMaterial({
            name_RawMaterial: _name ,
            lot_RawMaterial: _lot , 
            carbonfootprint_RawMaterial: _carbonfootprint , 
            amount_RawMaterial: _amount ,
            residual_amount_RawMaterial: _amount });

        getRawMaterialByLot[_lot] = material;

        if(Exist_RawMaterial[_name]){
            getRawMaterialByName[_name].name_RawMaterial = _name;
            getRawMaterialByName[_name].lot_RawMaterial = string(bytes.concat(bytes(getRawMaterialByName[_name].lot_RawMaterial), ", ", bytes(_lot)));
            getRawMaterialByName[_name].amount_RawMaterial += _amount;
        }else{
            getRawMaterialByName[_name] = material;
        }

        ExistLot_RawMaterial[_lot] = true;
        Exist_RawMaterial[_name] = true;
       
    }

    function SearchByLot(string memory _lot) public view returns (RawMaterial memory material){
         require (ExistLot_RawMaterial[_lot], "ERRORE - Lotto non esistente");
         return getRawMaterialByLot[_lot] ;
    }

    function SearchByName(string memory _name) public view returns (RawMaterial memory material){
        require (Exist_RawMaterial[_name], "ERRORE - Nessun lotto contenente questa materia prima");
        return getRawMaterialByName[_name];
    }
}