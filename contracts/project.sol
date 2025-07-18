// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdeaRegistry {
  struct Startup{
    string  ideaTitle;
    string  ideaDescription;
   }
//    struct IP {
//         string ipType;
//         string ipDetails;
 
   Startup[] public ipList;
    address payable public owner1;
    address payable public owner2;

   constructor(address payable _owner2) {
        owner1 = payable(msg.sender);
        owner2 = _owner2;
    }

    function registerIdea(string memory ideaTitle, string memory  ideaDescription) public payable{
        require(msg.value>0 ,"Payment required to register idea");
        owner1.transfer(msg.value);
        ipList.push(Startup(ideaTitle, ideaDescription));
    }
    // function addIP(string memory _type, string memory _details) public {
    //     ipList.push(IP(_type, _details));
    // }
}