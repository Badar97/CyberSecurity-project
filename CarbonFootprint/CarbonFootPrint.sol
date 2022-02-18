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

    struct Lot{
        uint256 id;
        uint256 carbonfootprint_Lot;
        uint256 amount_Lot;
        string name_RawMaterial;
        bool sold;
    }

    mapping(string => Product) private getProductsByName;
    mapping(string => Product) private getProductsByLot;
    mapping(uint256 => Lot) private getRawMaterialByLot;
    mapping(string => Lot) private getRawMaterialByName;
    mapping(string => Lot[]) private getLotByRawMaterialName;

    mapping(uint256 => bool) private ExistLot_RawMaterial;
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

    uint256 id_lot = 0;
 

    function AddRawMaterial(string memory _name, uint256  _carbonfootprint, uint256  _amount) public returns (Lot memory new_lot) {
        require (msg.sender == supplier, "ERRORE - Questa funzione deve essere chiamata solo dai fornitori");
        require (_amount > 0, "ERRORE - Hai inserito un ammontare di materia prima minore o uguale di 0");
        require (_carbonfootprint >= 0, "ERRORE - Il FOOTPRINT deve essere maggiore o uguale a 0");

         Lot memory lotto = Lot({
            id: id_lot++  ,
            carbonfootprint_Lot: _carbonfootprint , 
            amount_Lot: _amount ,
            name_RawMaterial: _name ,
            sold: false });

        getRawMaterialByLot[lotto.id] = lotto;

        getLotByRawMaterialName[_name].push(lotto);
        ExistLot_RawMaterial[lotto.id] = true;
        Exist_RawMaterial[_name] = true;
        return lotto;
       
    }

    function SearchInfoLot(uint256 _lot) public view returns (Lot memory material){
         require (ExistLot_RawMaterial[_lot], "ERRORE - Lotto non esistente");
         return getRawMaterialByLot[_lot] ;
    }

    function SearchLotsByRawMaterialName(string memory _name) public view returns (Lot[] memory lot){
        require (Exist_RawMaterial[_name], "ERRORE - Nessun lotto contenente questa materia prima");
        return getLotByRawMaterialName[_name];
    }
}