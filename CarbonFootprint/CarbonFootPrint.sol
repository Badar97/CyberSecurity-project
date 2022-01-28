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

    address supplier;
    address transformer;
    address customer;
    
    constructor (address _supplier, address _transformer, address _customer) {
        supplier = _supplier;
        transformer = _transformer;
        customer = _customer;
    }

    function AddRawMaterial(string memory _name, string memory _lot, uint256  _carbonfootprint, uint256  _amount) public {
        require (msg.sender == supplier , "Errore! Questa funzione deve essere chiamata solo dai fornitori");
        require (_amount > 0 , "Errore! Hai inserito un ammontare di materia prima minore o uguale di 0");
        require (!ExistLot_RawMaterial[_lot], "Errore! Lotto gia' esistente");
        require (_carbonfootprint >=0 , "Errore! CarbonFootPrint deve essere maggiore o uguale a 0");

        RawMaterial memory material = RawMaterial({
            name_RawMaterial: _name ,
            lot_RawMaterial: _lot , 
            carbonfootprint_RawMaterial: _carbonfootprint , 
            amount_RawMaterial: _amount ,
            residual_amount_RawMaterial: _amount });

        getRawMaterialByLot[_lot] = material;
        getRawMaterialByName[_name] = material;
        ExistLot_RawMaterial[_lot] = true;
    }

    function prova () public view returns (address indirizzo, address indirizzo2, address indirizzo3) {
        return (supplier, transformer, customer);
    }
}