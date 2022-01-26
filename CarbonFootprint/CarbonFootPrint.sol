// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract CarbonFootPrint {
    struct User{
        address user_add;
        uint16 tipo; // 0 - Admin , 1 - Trasformatore, 2 - Fornitore, 3 - Cliente
    }

   
    mapping(address => User) public users;

    /* constructor() {
        address trasf_add= 0xed9d02e382b34818e88B88a309c7fe71E65f419d;
        users[trasf_add] = User(trasf_add, 1);
    } */


    function addUser (address _user, uint16 _tipo) public {
        users[_user] = User(_user, _tipo);
    }

    function getUsersTipo(address _add) public view returns(uint tipo) {
        return users[_add].tipo;
    }

    function seeder(address[] memory _initadd) public {
        users[_initadd[4]] = User(_initadd[4], 1);
        users[_initadd[5]] = User(_initadd[5], 2);
        users[_initadd[6]] = User(_initadd[6], 3);
        users[_initadd[7]] = User(_initadd[7], 1);
        users[_initadd[8]] = User(_initadd[8], 2);
        users[_initadd[9]] = User(_initadd[9], 3);
    }

}
