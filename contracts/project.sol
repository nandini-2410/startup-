// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdeaRegistry {
    struct Startup {
        address creator;
        string ideaTitle;
        string ideaDescription;
        string experience;
        uint256 minFunding;
    }

    Startup[] public ipList;
    address payable public owner1;
    address payable public owner2;

    constructor(address payable _owner2) {
        owner1 = payable(msg.sender);
        owner2 = _owner2;
    }

    function registerIdea(
        string memory ideaTitle,
        string memory ideaDescription,
        string memory experience,
        uint256 minFunding
    ) public payable {
        require(msg.value == 0.01 ether, "Exactly 0.01 ETH required");
        owner1.transfer(msg.value);
        ipList.push(Startup(msg.sender, ideaTitle, ideaDescription, experience, minFunding));
    }

    function getIdeasByUser(address user) public view returns (Startup[] memory) {
        uint count = 0;
        for (uint i = 0; i < ipList.length; i++) {
            if (ipList[i].creator == user) {
                count++;
            }
        }

        Startup[] memory result = new Startup[](count);
        uint j = 0;
        for (uint i = 0; i < ipList.length; i++) {
            if (ipList[i].creator == user) {
                result[j] = ipList[i];
                j++;
            }
        }
        return result;
    }
}
